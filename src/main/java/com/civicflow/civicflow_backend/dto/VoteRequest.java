package com.civicflow.civicflow_backend.dto;

import com.civicflow.civicflow_backend.model.VoteType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VoteRequest {
    private VoteType type; // UPVOTE or DOWNVOTE
}
