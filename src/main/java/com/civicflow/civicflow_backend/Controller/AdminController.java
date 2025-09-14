package com.civicflow.civicflow_backend.Controller;

import com.civicflow.civicflow_backend.dto.*;
import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AdminController {

    @Autowired
    private AdminService adminService;

    /**
     * Get admin dashboard with statistics and recent activities
     */
    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        return ResponseEntity.ok(dashboard);
    }

    /**
     * Get all users with pagination, sorting, filtering and search
     */
    @GetMapping("/users")
    public ResponseEntity<Page<AdminUserResponse>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Role roleFilter
    ) {
        Page<AdminUserResponse> users = adminService.getAllUsers(page, size, sortBy, sortDir, search, roleFilter);
        return ResponseEntity.ok(users);
    }

    /**
     * Get specific user details by ID
     */
    @GetMapping("/users/{userId}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable Long userId) {
        AdminUserResponse user = adminService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * Change user role (USER → NGO, NGO → USER, etc.)
     */
    @PutMapping("/users/{userId}/role")
    public ResponseEntity<AdminUserResponse> changeUserRole(
            @PathVariable Long userId,
            @Valid @RequestBody RoleChangeRequest request
    ) {
        request.setUserId(userId);
        AdminUserResponse updatedUser = adminService.changeUserRole(request);
        return ResponseEntity.ok(updatedUser);
    }

    /**
     * Toggle user active/inactive status
     */
    @PutMapping("/users/{userId}/toggle-status")
    public ResponseEntity<String> toggleUserStatus(@PathVariable Long userId) {
        adminService.toggleUserStatus(userId);
        return ResponseEntity.ok("User status toggled successfully");
    }

    /**
     * Delete user (soft delete or hard delete based on business rules)
     */
    @DeleteMapping("/users/{userId}")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        adminService.deleteUser(userId);
        return ResponseEntity.ok("User deleted successfully");
    }

    /**
     * Bulk operations - Change multiple users' status
     */
    @PutMapping("/users/bulk/toggle-status")
    public ResponseEntity<String> bulkToggleUserStatus(@RequestBody BulkUserActionRequest request) {
        for (Long userId : request.getUserIds()) {
            adminService.toggleUserStatus(userId);
        }
        return ResponseEntity.ok("Bulk status toggle completed");
    }

    /**
     * Bulk operations - Change multiple users' roles
     */
    @PutMapping("/users/bulk/change-role")
    public ResponseEntity<String> bulkChangeUserRole(@Valid @RequestBody BulkRoleChangeRequest request) {
        for (Long userId : request.getUserIds()) {
            RoleChangeRequest roleChange = new RoleChangeRequest();
            roleChange.setUserId(userId);
            roleChange.setNewRole(request.getNewRole());
            roleChange.setAreaCode(request.getAreaCode());
            roleChange.setReason(request.getReason());
            adminService.changeUserRole(roleChange);
        }
        return ResponseEntity.ok("Bulk role change completed");
    }

    /**
     * Get user statistics by role
     */
    @GetMapping("/statistics/users")
    public ResponseEntity<UserStatisticsResponse> getUserStatistics() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        
        UserStatisticsResponse stats = UserStatisticsResponse.builder()
                .totalUsers(dashboard.getTotalUsers())
                .totalActiveUsers(dashboard.getTotalActiveUsers())
                .totalNGOs(dashboard.getTotalNGOs())
                .totalAdmins(dashboard.getTotalAdmins())
                .newUsersToday(dashboard.getNewUsersToday())
                .newUsersThisWeek(dashboard.getNewUsersThisWeek())
                .build();
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Get issue statistics
     */
    @GetMapping("/statistics/issues")
    public ResponseEntity<IssueStatisticsResponse> getIssueStatistics() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        
        IssueStatisticsResponse stats = IssueStatisticsResponse.builder()
                .totalIssues(dashboard.getTotalIssues())
                .totalOpenIssues(dashboard.getTotalOpenIssues())
                .totalResolvedIssues(dashboard.getTotalResolvedIssues())
                .totalInProgressIssues(dashboard.getTotalInProgressIssues())
                .newIssuesToday(dashboard.getNewIssuesToday())
                .build();
        
        return ResponseEntity.ok(stats);
    }

    /**
     * Get system health status
     */
    @GetMapping("/system/health")
    public ResponseEntity<SystemHealthResponse> getSystemHealth() {
        AdminDashboardResponse dashboard = adminService.getAdminDashboard();
        
        SystemHealthResponse health = SystemHealthResponse.builder()
                .status(dashboard.getSystemStatus())
                .lastUpdated(dashboard.getLastUpdated())
                .totalVotes(dashboard.getTotalVotes())
                .votesToday(dashboard.getVotesToday())
                .uptime("System running normally")
                .build();
        
        return ResponseEntity.ok(health);
    }

    /**
     * Get recent activities
     */
    @GetMapping("/activities")
    public ResponseEntity<Page<AdminActivityResponse>> getRecentActivities(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        // For now, return empty page. In future, implement proper pagination in AdminService
        return ResponseEntity.ok(Page.empty());
    }

    // NGO Management Endpoints
    
    /**
     * Get all NGOs with pagination and filtering
     */
    @GetMapping("/ngos")
    public ResponseEntity<Page<AdminUserResponse>> getAllNgos(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String search
    ) {
        Page<AdminUserResponse> ngos = adminService.getAllNgos(page, size, sortBy, sortDir, search);
        return ResponseEntity.ok(ngos);
    }

    /**
     * Get specific NGO details by ID
     */
    @GetMapping("/ngos/{ngoId}")
    public ResponseEntity<AdminUserResponse> getNgoDetails(@PathVariable Long ngoId) {
        AdminUserResponse ngo = adminService.getNgoDetails(ngoId);
        return ResponseEntity.ok(ngo);
    }

    /**
     * Assign issue to NGO
     */
    @PatchMapping("/issues/{issueId}/assign")
    public ResponseEntity<String> assignIssueToNgo(
            @PathVariable Long issueId, 
            @RequestBody AssignIssueRequest request
    ) {
        adminService.assignIssueToNgo(issueId, request.getNgoId());
        return ResponseEntity.ok("Issue assigned to NGO successfully");
    }

    /**
     * Unassign issue from NGO
     */
    @PatchMapping("/issues/{issueId}/unassign")
    public ResponseEntity<String> unassignIssueFromNgo(@PathVariable Long issueId) {
        adminService.unassignIssueFromNgo(issueId);
        return ResponseEntity.ok("Issue unassigned from NGO successfully");
    }
}
