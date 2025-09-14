package com.civicflow.civicflow_backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserStatisticsResponse {
    
    private Long totalUsers;
    private Long totalActiveUsers;
    private Long totalNGOs;
    private Long totalAdmins;
    private Long newUsersToday;
    private Long newUsersThisWeek;
}
