package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.Role;
import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class UserProfileResponse {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String fullName;
    private String phoneNumber;
    private String bio;
    private String profilePictureUrl;
    
    // Address Information
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    private String fullAddress;
    
    // Location
    private Double latitude;
    private Double longitude;
    private boolean hasLocation;
    
    private String areaCode;
    private Role role;
    
    // Preferences (only shown for own profile)
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean nearbyIssuesNotifications;
    
    // Account status
    private Boolean isActive;
    private LocalDateTime lastLogin;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Profile completion percentage
    private Integer profileCompletionPercentage;
}
