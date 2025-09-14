package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.VoteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteResponse {
    private Long id;
    private Long userId;
    private String username;
    private Long issueId;
    private VoteType type;
    private LocalDateTime createdAt;
}
