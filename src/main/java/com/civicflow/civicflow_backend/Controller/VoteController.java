package com.civicflow.civicflow_backend.Controller;

import com.civicflow.civicflow_backend.dto.VoteRequest;
import com.civicflow.civicflow_backend.dto.VoteResponse;
import com.civicflow.civicflow_backend.dto.VoteSummary;
import com.civicflow.civicflow_backend.service.VoteService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/issues")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VoteController {
    
    private final VoteService voteService;
    
    // Cast or update a vote on an issue
    @PostMapping("/{issueId}/vote")
    public ResponseEntity<VoteResponse> castVote(
            @PathVariable Long issueId,
            @RequestBody VoteRequest voteRequest,
            Authentication authentication) {
        
        String username = authentication.getName();
        VoteResponse response = voteService.castVote(issueId, username, voteRequest);
        return ResponseEntity.ok(response);
    }
    
    // Remove user's vote from an issue
    @DeleteMapping("/{issueId}/vote")
    public ResponseEntity<String> removeVote(
            @PathVariable Long issueId,
            Authentication authentication) {
        
        String username = authentication.getName();
        voteService.removeVote(issueId, username);
        return ResponseEntity.ok("Vote removed successfully");
    }
    
    // Get vote summary for an issue (public endpoint)
    @GetMapping("/{issueId}/votes/summary")
    public ResponseEntity<VoteSummary> getVoteSummary(
            @PathVariable Long issueId,
            Authentication authentication) {
        
        String username = authentication != null ? authentication.getName() : null;
        VoteSummary summary = voteService.getVoteSummary(issueId, username);
        return ResponseEntity.ok(summary);
    }
    
    // Get all votes for an issue (public endpoint)
    @GetMapping("/{issueId}/votes")
    public ResponseEntity<List<VoteResponse>> getIssueVotes(@PathVariable Long issueId) {
        List<VoteResponse> votes = voteService.getIssueVotes(issueId);
        return ResponseEntity.ok(votes);
    }
    
    // Get current user's voting history
    @GetMapping("/votes/my-votes")
    public ResponseEntity<List<VoteResponse>> getUserVotes(Authentication authentication) {
        String username = authentication.getName();
        List<VoteResponse> votes = voteService.getUserVotes(username);
        return ResponseEntity.ok(votes);
    }
}
