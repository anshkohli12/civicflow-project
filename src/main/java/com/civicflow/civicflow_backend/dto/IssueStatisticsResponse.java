package com.civicflow.civicflow_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class IssueStatisticsResponse {
    
    private Long totalIssues;
    private Long totalOpenIssues;
    private Long totalResolvedIssues;
    private Long totalInProgressIssues;
    private Long newIssuesToday;
}
