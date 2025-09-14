package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.Role;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RoleChangeRequest {
    
    // Note: userId is set from path parameter, not validated here
    private Long userId;
    
    @NotNull(message = "New role is required")
    private Role newRole;
    
    private String reason; // Optional reason for role change
    private String areaCode; // For NGO assignments to specific areas
}
