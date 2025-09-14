package com.civicflow.civicflow_backend.dto;

import lombok.Data;

@Data
public class LoginRequest {
    private String username;  // or email, we’ll decide later
    private String password;
}
