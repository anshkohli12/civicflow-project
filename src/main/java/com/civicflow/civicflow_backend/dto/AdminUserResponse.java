package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.Role;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminUserResponse {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    
    // Address info (limited for admin view)
    private String city;
    private String state;
    private String country;
    
    private Role role;
    private String areaCode;
    
    // Account status
    private Boolean isActive;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Statistics
    private Integer totalIssuesReported;
    private Integer totalVotesCast;
    private Integer profileCompletionPercentage;
    
    // Admin-specific fields
    private Boolean hasLocation;
    private String accountStatus; // "Active", "Inactive", "Pending"
}
