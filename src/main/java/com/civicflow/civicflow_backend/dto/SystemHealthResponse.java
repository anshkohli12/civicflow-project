package com.civicflow.civicflow_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SystemHealthResponse {
    
    private String status;
    private LocalDateTime lastUpdated;
    private Long totalVotes;
    private Long votesToday;
    private String uptime;
}
