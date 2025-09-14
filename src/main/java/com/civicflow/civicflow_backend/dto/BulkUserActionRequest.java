package com.civicflow.civicflow_backend.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BulkUserActionRequest {
    
    @NotEmpty(message = "User IDs list cannot be empty")
    private List<Long> userIds;
    
    private String reason;
}
