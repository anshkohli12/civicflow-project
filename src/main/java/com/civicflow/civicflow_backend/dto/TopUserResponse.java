package com.civicflow.civicflow_backend.dto;

import lombok.Data;
import lombok.Builder;

@Data
@Builder
public class TopUserResponse {
    
    private Long userId;
    private String username;
    private String fullName;
    private Integer issuesReported;
    private Integer votesCast;
    private Integer helpfulVotesReceived;
    private String city;
    private String role;
}
