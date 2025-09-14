package com.civicflow.civicflow_backend.dto;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;

@Data
@Builder
public class AdminActivityResponse {
    
    private Long id;
    private String activityType; // "USER_REGISTERED", "ISSUE_CREATED", "NGO_APPLIED", "ROLE_CHANGED"
    private String description;
    private String username;
    private LocalDateTime timestamp;
    private String details;
}
