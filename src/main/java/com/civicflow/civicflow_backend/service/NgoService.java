package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.dto.IssueResponse;
import com.civicflow.civicflow_backend.model.Issue;
import com.civicflow.civicflow_backend.model.IssueStatus;
import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.repository.IssueRepository;
import com.civicflow.civicflow_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class NgoService {

    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private UserRepository userRepository;

    public Page<IssueResponse> getMyAssignedIssues(int page, int size, String sortBy, String sortDir, String status) {
        User currentNgo = getCurrentNgo();
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<Issue> issues;
        if (status != null && !status.trim().isEmpty()) {
            IssueStatus issueStatus = IssueStatus.valueOf(status.toUpperCase());
            issues = issueRepository.findByAssignedNgoAndStatus(currentNgo, issueStatus, pageable);
        } else {
            issues = issueRepository.findByAssignedNgo(currentNgo, pageable);
        }
        
        return issues.map(this::convertToIssueResponse);
    }

    public void updateIssueStatus(Long issueId, String status) {
        User currentNgo = getCurrentNgo();
        
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        // Verify the issue is assigned to the current NGO
        if (issue.getAssignedNgo() == null || !issue.getAssignedNgo().getId().equals(currentNgo.getId())) {
            throw new RuntimeException("You can only update issues assigned to your NGO");
        }
        
        IssueStatus issueStatus = IssueStatus.valueOf(status.toUpperCase());
        issue.setStatus(issueStatus);
        issueRepository.save(issue);
    }

    public IssueResponse getIssueDetails(Long issueId) {
        User currentNgo = getCurrentNgo();
        
        Issue issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        // Verify the issue is assigned to the current NGO
        if (issue.getAssignedNgo() == null || !issue.getAssignedNgo().getId().equals(currentNgo.getId())) {
            throw new RuntimeException("You can only view issues assigned to your NGO");
        }
        
        return convertToIssueResponse(issue);
    }

    private IssueResponse convertToIssueResponse(Issue issue) {
        return IssueResponse.builder()
                .id(issue.getId())
                .title(issue.getTitle())
                .description(issue.getDescription())
                .category(issue.getCategory())
                .status(issue.getStatus())
                .latitude(issue.getLatitude())
                .longitude(issue.getLongitude())
                .imageUrl(issue.getImageUrl())
                .critical(issue.isCritical())
                .createdAt(issue.getCreatedAt())
                .updatedAt(issue.getUpdatedAt())
                .createdBy(issue.getCreatedBy() != null ? issue.getCreatedBy().getUsername() : null)
                .assignedNgo(issue.getAssignedNgo() != null ? issue.getAssignedNgo().getUsername() : null)
                .voteCount(issue.getVoteCount())
                .build();
    }

    private User getCurrentNgo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (user.getRole() != Role.NGO) {
            throw new RuntimeException("Access denied. NGO privileges required.");
        }
        
        return user;
    }
}
