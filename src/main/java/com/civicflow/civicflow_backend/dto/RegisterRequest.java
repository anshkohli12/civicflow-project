package com.civicflow.civicflow_backend.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String firstName;
    private String lastName;
    private String username;
    private String email;
    private String password;
    private String areaCode;  // optional
    
    // Additional fields for NGO registration
    private String role; // "USER", "NGO", etc.
    private String organizationName; // for NGOs
    private String bio;
    private String phoneNumber;
    
    // Address fields
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String postalCode;
    private String country;
    
    // Location coordinates
    private Double latitude;
    private Double longitude;
}
