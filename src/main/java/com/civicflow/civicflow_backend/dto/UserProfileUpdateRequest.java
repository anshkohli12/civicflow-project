package com.civicflow.civicflow_backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserProfileUpdateRequest {

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Email(message = "Email must be valid")
    @Size(max = 120, message = "Email must not exceed 120 characters")
    private String email;

    @Pattern(regexp = "^(\\+91[\\s\\-]?)?[6-9]\\d{9}$|^[+]?[0-9\\s\\-\\(\\)]{7,20}$", message = "Phone number must be valid (Indian format: +91XXXXXXXXXX or international)")
    private String phoneNumber;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    // Address fields
    @Size(max = 200, message = "Address line 1 must not exceed 200 characters")
    private String addressLine1;

    @Size(max = 200, message = "Address line 2 must not exceed 200 characters")
    private String addressLine2;

    @Size(max = 100, message = "City must not exceed 100 characters")
    private String city;

    @Size(max = 100, message = "State must not exceed 100 characters")
    private String state;

    @Size(max = 20, message = "Postal code must not exceed 20 characters")
    private String postalCode;

    @Size(max = 100, message = "Country must not exceed 100 characters")
    private String country;

    // Location coordinates
    private Double latitude;
    private Double longitude;

    @Size(max = 64, message = "Area code must not exceed 64 characters")
    private String areaCode;

    // Preferences
    private Boolean emailNotifications;
    private Boolean pushNotifications;
    private Boolean nearbyIssuesNotifications;
}
