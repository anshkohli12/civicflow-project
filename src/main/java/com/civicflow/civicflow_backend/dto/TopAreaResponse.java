package com.civicflow.civicflow_backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TopAreaResponse {
    
    private String areaCode;
    private String areaName; // city/state
    private Integer totalIssues;
    private Integer openIssues;
    private Integer resolvedIssues;
    private Integer totalUsers;
    private Double resolutionRate;
}
