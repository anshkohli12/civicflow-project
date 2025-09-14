package com.civicflow.civicflow_backend.repository;

import com.civicflow.civicflow_backend.model.Issue;
import com.civicflow.civicflow_backend.model.IssueStatus;
import com.civicflow.civicflow_backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDateTime;
import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Long> {
    // Find issues created by a specific user
    List<Issue> findByCreatedBy(User createdBy);
    
    // Find issues assigned to a specific NGO
    List<Issue> findByAssignedNgo(User assignedNgo);
    Page<Issue> findByAssignedNgo(User assignedNgo, Pageable pageable);
    Page<Issue> findByAssignedNgoAndStatus(User assignedNgo, IssueStatus status, Pageable pageable);
    
    // Find issues by category
    List<Issue> findByCategory(String category);
    
    // Find critical issues
    List<Issue> findByCriticalTrue();
    
    // Admin statistics queries
    Long countByStatus(IssueStatus status);
    Long countByCreatedAtAfter(LocalDateTime dateTime);
    
    // User statistics queries
    Long countByCreatedBy(User createdBy);
    Long countByCreatedByAndCreatedAtAfter(User createdBy, LocalDateTime dateTime);
    
    // 🌍 LOCATION-BASED SEARCH: Find issues within radius using Haversine formula
    @Query("SELECT i FROM Issue i WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(i.latitude)) * " +
           "cos(radians(i.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(i.latitude)))) <= :radius " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(i.latitude)) * " +
           "cos(radians(i.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(i.latitude))))")
    List<Issue> findIssuesWithinRadius(@Param("latitude") Double latitude, 
                                      @Param("longitude") Double longitude, 
                                      @Param("radius") Double radiusKm);
    
    // 🌍 Find nearby issues with additional filters
    @Query("SELECT i FROM Issue i WHERE " +
           "(6371 * acos(cos(radians(:latitude)) * cos(radians(i.latitude)) * " +
           "cos(radians(i.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(i.latitude)))) <= :radius " +
           "AND (:category IS NULL OR i.category = :category) " +
           "AND (:critical IS NULL OR i.critical = :critical) " +
           "ORDER BY (6371 * acos(cos(radians(:latitude)) * cos(radians(i.latitude)) * " +
           "cos(radians(i.longitude) - radians(:longitude)) + " +
           "sin(radians(:latitude)) * sin(radians(i.latitude))))")
    List<Issue> findNearbyIssuesWithFilters(@Param("latitude") Double latitude,
                                           @Param("longitude") Double longitude, 
                                           @Param("radius") Double radiusKm,
                                           @Param("category") String category,
                                           @Param("critical") Boolean critical);
}
