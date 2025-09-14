package com.civicflow.civicflow_backend.repository;

import com.civicflow.civicflow_backend.model.Vote;
import com.civicflow.civicflow_backend.model.VoteType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface VoteRepository extends JpaRepository<Vote, Long> {
    
    // Find vote by user and issue
    Optional<Vote> findByUserIdAndIssueId(Long userId, Long issueId);
    
    // Count votes for an issue by type
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.issue.id = :issueId AND v.type = :type")
    Long countByIssueIdAndType(@Param("issueId") Long issueId, @Param("type") VoteType type);
    
    // Get total vote score for an issue (upvotes - downvotes)
    @Query("SELECT COALESCE(SUM(CASE WHEN v.type = 'UPVOTE' THEN 1 ELSE -1 END), 0) FROM Vote v WHERE v.issue.id = :issueId")
    Long getVoteScoreByIssueId(@Param("issueId") Long issueId);
    
    // Get all votes for an issue
    List<Vote> findByIssueIdOrderByCreatedAtDesc(Long issueId);
    
    // Get user's votes
    List<Vote> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    // Check if user has voted on issue
    boolean existsByUserIdAndIssueId(Long userId, Long issueId);
    
    // Delete vote by user and issue
    void deleteByUserIdAndIssueId(Long userId, Long issueId);
    
    // Admin statistics queries
    Long countByCreatedAtAfter(LocalDateTime dateTime);
    
    // User statistics queries
    Long countByUserId(Long userId);
    Long countByUserIdAndCreatedAtAfter(Long userId, LocalDateTime dateTime);
    
    // Count helpful votes received by a user's issues
    @Query("SELECT COUNT(v) FROM Vote v WHERE v.issue.createdBy.id = :userId AND v.type = 'UPVOTE'")
    Long countHelpfulVotesReceivedByUserId(@Param("userId") Long userId);
}
