package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.IssueStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class IssueResponse {
    private Long id;
    private String title;
    private String description;
    private String imageUrl;
    private String category;
    private Double latitude;
    private Double longitude;
    private int voteCount;
    private boolean critical;
    private IssueStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private String assignedNgo;
}