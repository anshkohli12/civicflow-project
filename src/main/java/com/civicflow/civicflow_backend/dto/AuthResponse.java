package com.civicflow.civicflow_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String role;
    
    // Constructor for token only (backward compatibility)
    public AuthResponse(String token) {
        this.token = token;
    }
}
