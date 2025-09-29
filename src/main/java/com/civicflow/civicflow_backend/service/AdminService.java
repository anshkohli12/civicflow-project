package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.dto.*;
import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.repository.IssueRepository;
import com.civicflow.civicflow_backend.repository.UserRepository;
import com.civicflow.civicflow_backend.repository.VoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private IssueRepository issueRepository;
    
    @Autowired
    private VoteRepository voteRepository;

    public AdminDashboardResponse getAdminDashboard() {
        validateAdminAccess();
        
        LocalDateTime today = LocalDate.now().atStartOfDay();
        LocalDateTime weekAgo = today.minusDays(7);
        
        // User Statistics
        Long totalUsers = userRepository.count();
        Long totalActiveUsers = userRepository.countByIsActive(true);
        Long totalNGOs = userRepository.countByRole(Role.NGO);
        Long totalAdmins = userRepository.countByRole(Role.ADMIN);
        Long newUsersToday = userRepository.countByCreatedAtAfter(today);
        Long newUsersThisWeek = userRepository.countByCreatedAtAfter(weekAgo);
        
        // Issue Statistics
        Long totalIssues = issueRepository.count();
        Long totalOpenIssues = issueRepository.countByStatus(com.civicflow.civicflow_backend.model.IssueStatus.OPEN);
        Long totalResolvedIssues = issueRepository.countByStatus(com.civicflow.civicflow_backend.model.IssueStatus.RESOLVED);
        Long totalInProgressIssues = issueRepository.countByStatus(com.civicflow.civicflow_backend.model.IssueStatus.IN_PROGRESS);
        Long newIssuesToday = issueRepository.countByCreatedAtAfter(today);
        
        // Vote Statistics
        Long totalVotes = voteRepository.count();
        Long votesToday = voteRepository.countByCreatedAtAfter(today);
        
        // Recent Activities (simplified for now)
        List<AdminActivityResponse> recentActivities = getRecentActivities();
        
        // Top Users
        List<TopUserResponse> topReporters = getTopReporters();
        
        // Top Areas
        List<TopAreaResponse> topAreas = getTopAreas();
        
        return AdminDashboardResponse.builder()
                .totalUsers(totalUsers)
                .totalActiveUsers(totalActiveUsers)
                .totalNGOs(totalNGOs)
                .totalAdmins(totalAdmins)
                .newUsersToday(newUsersToday)
                .newUsersThisWeek(newUsersThisWeek)
                .totalIssues(totalIssues)
                .totalOpenIssues(totalOpenIssues)
                .totalResolvedIssues(totalResolvedIssues)
                .totalInProgressIssues(totalInProgressIssues)
                .newIssuesToday(newIssuesToday)
                .totalVotes(totalVotes)
                .votesToday(votesToday)
                .pendingNGOApplications(0L) 
                .recentActivities(recentActivities)
                .topReporters(topReporters)
                .topAreas(topAreas)
                .systemStatus("Healthy")
                .lastUpdated(LocalDateTime.now())
                .build();
    }

    public Page<AdminUserResponse> getAllUsers(int page, int size, String sortBy, String sortDir, String search, Role roleFilter) {
        validateAdminAccess();
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
            Sort.by(sortBy).descending() : Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> users;
        
        if (search != null && !search.trim().isEmpty()) {
            if (roleFilter != null) {
                users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(
                    search, search, roleFilter, pageable);
            } else {
                users = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
                    search, search, pageable);
            }
        } else if (roleFilter != null) {
            users = userRepository.findByRole(roleFilter, pageable);
        } else {
            users = userRepository.findAll(pageable);
        }
        
        return users.map(this::convertToAdminUserResponse);
    }

    public AdminUserResponse getUserById(Long userId) {
        validateAdminAccess();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return convertToAdminUserResponse(user);
    }

    public AdminUserResponse changeUserRole(RoleChangeRequest request) {
        validateAdminAccess();
        
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Prevent changing super admin
        if (user.getRole() == Role.ADMIN && request.getNewRole() != Role.ADMIN) {
            // Check if this is the last admin
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot remove the last admin");
            }
        }
        
        user.setRole(request.getNewRole());
        
        // Set area code for NGOs
        if (request.getNewRole() == Role.NGO && request.getAreaCode() != null) {
            user.setAreaCode(request.getAreaCode());
        }
        
        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        
        return convertToAdminUserResponse(updatedUser);
    }

    public void toggleUserStatus(Long userId) {
        validateAdminAccess();
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setIsActive(!user.getIsActive());
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public void deleteUser(Long userId) {
        validateAdminAccess();
        
        User currentUser = getCurrentUser();
        if (currentUser.getId().equals(userId)) {
            throw new RuntimeException("Cannot delete your own account");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if this is the last admin
        if (user.getRole() == Role.ADMIN) {
            long adminCount = userRepository.countByRole(Role.ADMIN);
            if (adminCount <= 1) {
                throw new RuntimeException("Cannot delete the last admin");
            }
        }
        
        userRepository.delete(user);
    }

    // Helper methods
    private AdminUserResponse convertToAdminUserResponse(User user) {
        String accountStatus = "Active";
        if (user.getIsActive() == null || !user.getIsActive()) {
            accountStatus = "Inactive";
        }
        
        return AdminUserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .city(user.getCity())
                .state(user.getState())
                .country(user.getCountry())
                .role(user.getRole())
                .areaCode(user.getAreaCode())
                .isActive(user.getIsActive())
                .lastLogin(user.getLastLogin())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .hasLocation(user.hasLocation())
                .accountStatus(accountStatus)
                .profileCompletionPercentage(calculateProfileCompletion(user))
                .build();
    }

    private List<AdminActivityResponse> getRecentActivities() {
        // For now, return recent users as activities
        List<User> recentUsers = userRepository.findTop10ByOrderByCreatedAtDesc();
        
        return recentUsers.stream()
                .map(user -> AdminActivityResponse.builder()
                        .id(user.getId())
                        .activityType("USER_REGISTERED")
                        .description("New user registered")
                        .username(user.getUsername())
                        .timestamp(user.getCreatedAt())
                        .details("Role: " + user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    private List<TopUserResponse> getTopReporters() {
        // Get users ordered by creation date (recent users first)
        List<User> users = userRepository.findTop5ByOrderByCreatedAtDesc();
        
        return users.stream()
                .map(user -> {
                    // Calculate actual issues reported by this user
                    Long issuesReported = issueRepository.countByCreatedBy(user);
                    
                    // Calculate actual votes cast by this user
                    Long votesCast = voteRepository.countByUserId(user.getId());
                    
                    // Calculate helpful votes received (upvotes on user's issues)
                    Long helpfulVotesReceived = voteRepository.countHelpfulVotesReceivedByUserId(user.getId());
                    
                    return TopUserResponse.builder()
                            .userId(user.getId())
                            .username(user.getUsername())
                            .fullName(user.getFullName())
                            .issuesReported(issuesReported.intValue())
                            .votesCast(votesCast.intValue())
                            .helpfulVotesReceived(helpfulVotesReceived.intValue())
                            .city(user.getCity())
                            .role(user.getRole().toString())
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<TopAreaResponse> getTopAreas() {
        // For now, return empty list since Issue model doesn't have city field
        // This can be implemented when location data is available
        return List.of();
    }

    private Integer calculateProfileCompletion(User user) {
        int totalFields = 12;
        int completedFields = 0;

        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) completedFields++;
        if (user.getBio() != null && !user.getBio().trim().isEmpty()) completedFields++;
        if (user.getProfilePictureUrl() != null) completedFields++;
        if (user.getAddressLine1() != null && !user.getAddressLine1().trim().isEmpty()) completedFields++;
        if (user.getCity() != null && !user.getCity().trim().isEmpty()) completedFields++;
        if (user.getState() != null && !user.getState().trim().isEmpty()) completedFields++;
        if (user.getPostalCode() != null && !user.getPostalCode().trim().isEmpty()) completedFields++;
        if (user.getCountry() != null && !user.getCountry().trim().isEmpty()) completedFields++;
        if (user.hasLocation()) completedFields++;

        return Math.round((float) completedFields / totalFields * 100);
    }

    private void validateAdminAccess() {
        User currentUser = getCurrentUser();
        if (currentUser.getRole() != Role.ADMIN) {
            throw new RuntimeException("Access denied. Admin privileges required.");
        }
    }

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // NGO Management Methods

    public Page<AdminUserResponse> getAllNgos(int page, int size, String sortBy, String sortDir, String search) {
        validateAdminAccess();
        
        Sort sort = sortDir.equalsIgnoreCase("desc") ? 
                   Sort.by(sortBy).descending() : 
                   Sort.by(sortBy).ascending();
        
        Pageable pageable = PageRequest.of(page, size, sort);
        
        Page<User> ngos;
        if (search != null && !search.trim().isEmpty()) {
            ngos = userRepository.findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(
                search, search, Role.NGO, pageable);
        } else {
            ngos = userRepository.findByRole(Role.NGO, pageable);
        }
        
        return ngos.map(this::convertToAdminUserResponse);
    }

    public AdminUserResponse getNgoDetails(Long ngoId) {
        validateAdminAccess();
        
        User ngo = userRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        
        if (ngo.getRole() != Role.NGO) {
            throw new RuntimeException("User is not an NGO");
        }
        
        return convertToAdminUserResponse(ngo);
    }

    public void assignIssueToNgo(Long issueId, Long ngoId) {
        validateAdminAccess();
        
        var issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        User ngo = userRepository.findById(ngoId)
                .orElseThrow(() -> new RuntimeException("NGO not found"));
        
        if (ngo.getRole() != Role.NGO) {
            throw new RuntimeException("User is not an NGO");
        }
        
        issue.setAssignedNgo(ngo);
        issueRepository.save(issue);
    }

    public void unassignIssueFromNgo(Long issueId) {
        validateAdminAccess();
        
        var issue = issueRepository.findById(issueId)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        issue.setAssignedNgo(null);
        issueRepository.save(issue);
    }
}
