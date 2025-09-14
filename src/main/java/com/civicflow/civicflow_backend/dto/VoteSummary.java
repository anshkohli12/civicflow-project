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
public class VoteSummary {
    private Long issueId;
    private Long upvotes;
    private Long downvotes;
    private Long totalScore; // upvotes - downvotes
    private VoteType userVote; // Current user's vote (null if not voted)
    private boolean hasUserVoted;
}
