package com.civicflow.civicflow_backend.dto;

import lombok.Data;
import lombok.Builder;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AdminDashboardResponse {
    
    // User Statistics
    private Long totalUsers;
    private Long totalActiveUsers;
    private Long totalNGOs;
    private Long totalAdmins;
    private Long newUsersToday;
    private Long newUsersThisWeek;
    
    // Issue Statistics  
    private Long totalIssues;
    private Long totalOpenIssues;
    private Long totalResolvedIssues;
    private Long totalInProgressIssues;
    private Long newIssuesToday;
    
    // Vote Statistics
    private Long totalVotes;
    private Long votesToday;
    
    // NGO Applications
    private Long pendingNGOApplications;
    
    // Recent Activities
    private List<AdminActivityResponse> recentActivities;
    
    // System Health
    private String systemStatus; // "Healthy", "Warning", "Critical"
    private LocalDateTime lastUpdated;
    
    // Top Statistics
    private List<TopUserResponse> topReporters;
    private List<TopAreaResponse> topAreas;
}
