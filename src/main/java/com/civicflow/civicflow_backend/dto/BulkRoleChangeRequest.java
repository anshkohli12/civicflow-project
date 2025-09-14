package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.Role;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BulkRoleChangeRequest {
    
    @NotEmpty(message = "User IDs list cannot be empty")
    private List<Long> userIds;
    
    @NotNull(message = "New role is required")
    private Role newRole;
    
    private String areaCode; // For NGO role assignments
    
    private String reason;
}
