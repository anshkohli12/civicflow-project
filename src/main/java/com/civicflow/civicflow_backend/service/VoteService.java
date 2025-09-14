package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.dto.VoteRequest;
import com.civicflow.civicflow_backend.dto.VoteResponse;
import com.civicflow.civicflow_backend.dto.VoteSummary;
import com.civicflow.civicflow_backend.model.Issue;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.model.Vote;
import com.civicflow.civicflow_backend.model.VoteType;
import com.civicflow.civicflow_backend.repository.IssueRepository;
import com.civicflow.civicflow_backend.repository.UserRepository;
import com.civicflow.civicflow_backend.repository.VoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VoteService {
    
    private final VoteRepository voteRepository;
    private final IssueRepository issueRepository;
    private final UserRepository userRepository;
    
    @Transactional
    public VoteResponse castVote(Long issueId, String username, VoteRequest voteRequest) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        // Check if user already voted
        Optional<Vote> existingVote = voteRepository.findByUserIdAndIssueId(user.getId(), issueId);
        
        Vote vote;
        if (existingVote.isPresent()) {
            // Update existing vote
            vote = existingVote.get();
            vote.setType(voteRequest.getType());
        } else {
            // Create new vote
            vote = Vote.builder()
                    .user(user)
                    .issue(issue)
                    .type(voteRequest.getType())
                    .build();
        }
        
        vote = voteRepository.save(vote);
        
        // Update issue vote count
        updateIssueVoteCount(issueId);
        
        return VoteResponse.builder()
                .id(vote.getId())
                .userId(user.getId())
                .username(user.getUsername())
                .issueId(issueId)
                .type(vote.getType())
                .createdAt(vote.getCreatedAt())
                .build();
    }
    
    @Transactional
    public void removeVote(Long issueId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!voteRepository.existsByUserIdAndIssueId(user.getId(), issueId)) {
            throw new RuntimeException("Vote not found");
        }
        
        voteRepository.deleteByUserIdAndIssueId(user.getId(), issueId);
        
        // Update issue vote count
        updateIssueVoteCount(issueId);
    }
    
    public VoteSummary getVoteSummary(Long issueId, String username) {
        Long upvotes = voteRepository.countByIssueIdAndType(issueId, VoteType.UPVOTE);
        Long downvotes = voteRepository.countByIssueIdAndType(issueId, VoteType.DOWNVOTE);
        Long totalScore = voteRepository.getVoteScoreByIssueId(issueId);
        
        VoteType userVote = null;
        boolean hasUserVoted = false;
        
        if (username != null) {
            User user = userRepository.findByUsername(username).orElse(null);
            if (user != null) {
                Optional<Vote> vote = voteRepository.findByUserIdAndIssueId(user.getId(), issueId);
                if (vote.isPresent()) {
                    userVote = vote.get().getType();
                    hasUserVoted = true;
                }
            }
        }
        
        return VoteSummary.builder()
                .issueId(issueId)
                .upvotes(upvotes)
                .downvotes(downvotes)
                .totalScore(totalScore)
                .userVote(userVote)
                .hasUserVoted(hasUserVoted)
                .build();
    }
    
    public List<VoteResponse> getIssueVotes(Long issueId) {
        List<Vote> votes = voteRepository.findByIssueIdOrderByCreatedAtDesc(issueId);
        
        return votes.stream()
                .map(vote -> VoteResponse.builder()
                        .id(vote.getId())
                        .userId(vote.getUser().getId())
                        .username(vote.getUser().getUsername())
                        .issueId(issueId)
                        .type(vote.getType())
                        .createdAt(vote.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    public List<VoteResponse> getUserVotes(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Vote> votes = voteRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
        
        return votes.stream()
                .map(vote -> VoteResponse.builder()
                        .id(vote.getId())
                        .userId(user.getId())
                        .username(user.getUsername())
                        .issueId(vote.getIssue().getId())
                        .type(vote.getType())
                        .createdAt(vote.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }
    
    @Transactional
    private void updateIssueVoteCount(Long issueId) {
        Long voteScore = voteRepository.getVoteScoreByIssueId(issueId);
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setVoteCount(voteScore.intValue());
        issueRepository.save(issue);
    }
}
