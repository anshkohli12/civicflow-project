package com.civicflow.civicflow_backend.Controller;

import com.civicflow.civicflow_backend.service.NgoService;
import com.civicflow.civicflow_backend.dto.IssueResponse;
import com.civicflow.civicflow_backend.dto.UpdateIssueStatusRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ngo")
@PreAuthorize("hasRole('NGO')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class NgoController {

    @Autowired
    private NgoService ngoService;

    /**
     * Get issues assigned to the current NGO
     */
    @GetMapping("/my-issues")
    public ResponseEntity<Page<IssueResponse>> getMyAssignedIssues(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String status
    ) {
        Page<IssueResponse> issues = ngoService.getMyAssignedIssues(page, size, sortBy, sortDir, status);
        return ResponseEntity.ok(issues);
    }

    /**
     * Update status of an assigned issue
     */
    @PatchMapping("/issues/{issueId}/status")
    public ResponseEntity<String> updateIssueStatus(
            @PathVariable Long issueId,
            @RequestBody UpdateIssueStatusRequest request
    ) {
        ngoService.updateIssueStatus(issueId, request.getStatus());
        return ResponseEntity.ok("Issue status updated successfully");
    }

    /**
     * Get issue details (only if assigned to current NGO)
     */
    @GetMapping("/issues/{issueId}")
    public ResponseEntity<IssueResponse> getIssueDetails(@PathVariable Long issueId) {
        IssueResponse issue = ngoService.getIssueDetails(issueId);
        return ResponseEntity.ok(issue);
    }
}
