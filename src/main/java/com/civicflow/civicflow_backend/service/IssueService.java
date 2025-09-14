package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.model.Issue;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.model.IssueStatus;
import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.repository.IssueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Comparator;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@Service
public class IssueService {

    @Autowired
    private IssueRepository issueRepository;

    public Issue createIssue(Issue issue) {
        return issueRepository.save(issue);
    }

    public List<Issue> getAllIssues() {
        return issueRepository.findAll();
    }

    public Optional<Issue> getIssueById(Long id) {
        return issueRepository.findById(id);
    }
    // Update issue with ownership validation
    public Issue updateIssue(Long id, Issue issueDetails, User currentUser) {
        return issueRepository.findById(id).map(issue -> {
            // Check if current user is the creator
            if (!issue.getCreatedBy().getId().equals(currentUser.getId())) {
                throw new RuntimeException("You can only update issues you created");
            }
            
            issue.setTitle(issueDetails.getTitle());
            issue.setDescription(issueDetails.getDescription());
            issue.setImageUrl(issueDetails.getImageUrl());
            issue.setCategory(issueDetails.getCategory());
            issue.setLatitude(issueDetails.getLatitude());
            issue.setLongitude(issueDetails.getLongitude());
            issue.setVoteCount(issueDetails.getVoteCount());
            issue.setCritical(issueDetails.isCritical());
            issue.setStatus(issueDetails.getStatus());
            return issueRepository.save(issue);
        }).orElseThrow(() -> new RuntimeException("Issue not found with id " + id));
    }

    // Keep the old method for admin use (without ownership validation)
    public Issue updateIssue(Long id, Issue issueDetails) {
        return issueRepository.findById(id).map(issue -> {
            issue.setTitle(issueDetails.getTitle());
            issue.setDescription(issueDetails.getDescription());
            issue.setImageUrl(issueDetails.getImageUrl());
            issue.setCategory(issueDetails.getCategory());
            issue.setLatitude(issueDetails.getLatitude());
            issue.setLongitude(issueDetails.getLongitude());
            issue.setVoteCount(issueDetails.getVoteCount());
            issue.setCritical(issueDetails.isCritical());
            issue.setStatus(issueDetails.getStatus());
            return issueRepository.save(issue);
        }).orElseThrow(() -> new RuntimeException("Issue not found with id " + id));
    }

    // Update issue status with ownership validation
    public Issue updateIssueStatus(Long id, String status, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // Check if current user is the creator OR is an admin
        if (!issue.getCreatedBy().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only update issues you created");
        }

        try {
            issue.setStatus(IssueStatus.valueOf(status.toUpperCase())); // Convert string to enum
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Allowed: OPEN, ASSIGNED, IN_PROGRESS, RESOLVED, REJECTED");
        }

        return issueRepository.save(issue);
    }

    // Update issue critical status (only admin can update)
    public Issue updateIssueCritical(Long id, Boolean critical, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        // Check if current user is an admin (only admins can toggle critical status)
        if (!currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("Only administrators can modify critical status");
        }

        issue.setCritical(critical);
        return issueRepository.save(issue);
    }

    // Keep the old method for admin use (without ownership validation)
    public Issue updateIssueStatus(Long id, String status) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));

        try {
            issue.setStatus(IssueStatus.valueOf(status.toUpperCase())); // Convert string to enum
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid status. Allowed: OPEN, IN_PROGRESS, RESOLVED, REJECTED");
        }

        return issueRepository.save(issue);
    }

    // Get issues created by specific user
    public List<Issue> getIssuesByUser(User user) {
        return issueRepository.findByCreatedBy(user);
    }

    // Delete issue (only creator can delete)
    public void deleteIssue(Long id, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        // Check if current user is the creator OR is an admin
        if (!issue.getCreatedBy().getId().equals(currentUser.getId()) && 
            !currentUser.getRole().equals(Role.ADMIN)) {
            throw new RuntimeException("You can only delete issues you created");
        }
        
        issueRepository.deleteById(id);
    }

    // Update issue image with ownership validation
    public Issue updateIssueImage(Long id, String imageUrl, User currentUser) {
        Issue issue = issueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Issue not found"));
        
        // Check if current user is the creator
        if (!issue.getCreatedBy().getId().equals(currentUser.getId())) {
            throw new RuntimeException("You can only update images for issues you created");
        }
        
        issue.setImageUrl(imageUrl);
        return issueRepository.save(issue);
    }

    // Keep the old delete method for admin use
    public void deleteIssue(Long id) {
        issueRepository.deleteById(id);
    }

    // 🌍 LOCATION-BASED SEARCH METHODS

    /**
     * Find all issues within a specific radius from given coordinates
     * @param latitude User's latitude
     * @param longitude User's longitude 
     * @param radiusKm Search radius in kilometers
     * @return List of nearby issues sorted by distance
     */
    public List<Issue> getNearbyIssues(Double latitude, Double longitude, Double radiusKm) {
        // Default radius of 10km if not specified
        if (radiusKm == null || radiusKm <= 0) {
            radiusKm = 10.0;
        }
        return issueRepository.findIssuesWithinRadius(latitude, longitude, radiusKm);
    }

    /**
     * Find nearby issues with additional filters
     * @param latitude User's latitude
     * @param longitude User's longitude
     * @param radiusKm Search radius in kilometers
     * @param category Filter by category (optional)
     * @param critical Filter by critical status (optional)
     * @return Filtered list of nearby issues
     */
    public List<Issue> getNearbyIssuesWithFilters(Double latitude, Double longitude, 
                                                 Double radiusKm, String category, Boolean critical) {
        // Default radius of 10km if not specified
        if (radiusKm == null || radiusKm <= 0) {
            radiusKm = 10.0;
        }
        return issueRepository.findNearbyIssuesWithFilters(latitude, longitude, radiusKm, category, critical);
    }

    /**
     * Calculate distance between two points using Haversine formula
     * @param lat1 First point latitude
     * @param lon1 First point longitude
     * @param lat2 Second point latitude
     * @param lon2 Second point longitude
     * @return Distance in kilometers
     */
    public double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        final int EARTH_RADIUS = 6371; // Earth's radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    /**
     * Smart filtering and sorting like real-world platforms
     * Priority order: Location → Critical → Vote count → Recency
     */
    public List<Issue> getSmartFilteredIssues(
            Double userLat, Double userLng, Integer maxRadius,
            String category, Boolean critical, IssueStatus status,
            Integer minVotes, LocalDateTime dateFrom, LocalDateTime dateTo,
            String sortBy, Integer page, Integer size) {
        
        try {
            List<Issue> issues = getAllIssues();
            if (issues == null) {
                return List.of(); // Return empty list if null
            }
        
        // 1. LOCATION FILTERING (if coordinates provided)
        if (userLat != null && userLng != null && maxRadius != null) {
            issues = issues.stream()
                    .filter(issue -> {
                        if (issue.getLatitude() == null || issue.getLongitude() == null) return false;
                        double distance = calculateDistance(userLat, userLng, 
                                issue.getLatitude(), issue.getLongitude());
                        return distance <= maxRadius;
                    })
                    .collect(Collectors.toList());
        }
        
        // 2. CATEGORY FILTERING
        if (category != null && !category.trim().isEmpty()) {
            issues = issues.stream()
                    .filter(issue -> category.equalsIgnoreCase(issue.getCategory()))
                    .collect(Collectors.toList());
        }
        
        // 3. CRITICAL STATUS FILTERING
        if (critical != null) {
            issues = issues.stream()
                    .filter(issue -> issue.isCritical() == critical)
                    .collect(Collectors.toList());
        }
        
        // 4. STATUS FILTERING
        if (status != null) {
            issues = issues.stream()
                    .filter(issue -> issue.getStatus() == status)
                    .collect(Collectors.toList());
        }
        
        // 5. MINIMUM VOTES FILTERING
        if (minVotes != null) {
            issues = issues.stream()
                    .filter(issue -> issue.getVoteCount() >= minVotes)
                    .collect(Collectors.toList());
        }
        
        // 6. DATE RANGE FILTERING
        if (dateFrom != null) {
            issues = issues.stream()
                    .filter(issue -> issue.getCreatedAt().isAfter(dateFrom))
                    .collect(Collectors.toList());
        }
        if (dateTo != null) {
            issues = issues.stream()
                    .filter(issue -> issue.getCreatedAt().isBefore(dateTo))
                    .collect(Collectors.toList());
        }
        
        // 7. SMART SORTING (Real-world platform logic)
        Comparator<Issue> comparator = getSmartComparator(sortBy, userLat, userLng);
        issues = issues.stream()
                .sorted(comparator)
                .collect(Collectors.toList());
        
        // 8. PAGINATION
        if (page != null && size != null) {
            int start = page * size;
            int end = Math.min(start + size, issues.size());
            if (start < issues.size()) {
                issues = issues.subList(start, end);
            } else {
                issues = List.of(); // Empty list if page out of bounds
            }
        }
        
        return issues;
        
        } catch (Exception e) {
            // Log the error and return empty list
            System.err.println("Error in getSmartFilteredIssues: " + e.getMessage());
            e.printStackTrace();
            return List.of();
        }
    }
    
    /**
     * Smart comparator logic like real-world platforms
     */
    private Comparator<Issue> getSmartComparator(String sortBy, Double userLat, Double userLng) {
        switch (sortBy != null ? sortBy.toLowerCase() : "smart") {
            case "location":
                // Sort by distance (closest first)
                if (userLat != null && userLng != null) {
                    return Comparator.comparing(issue -> {
                        if (issue.getLatitude() == null || issue.getLongitude() == null) return Double.MAX_VALUE;
                        return calculateDistance(userLat, userLng, issue.getLatitude(), issue.getLongitude());
                    });
                }
                return Comparator.comparing(Issue::getCreatedAt).reversed();
                
            case "popular":
            case "votes":
                // Sort by votes (most voted first), then by recency
                return Comparator.comparing(Issue::getVoteCount).reversed()
                        .thenComparing(Issue::getCreatedAt).reversed();
                
            case "critical":
                // Critical first, then by votes, then by recency
                return Comparator.comparing(Issue::isCritical).reversed()
                        .thenComparing(Issue::getVoteCount).reversed()
                        .thenComparing(Issue::getCreatedAt).reversed();
                
            case "newest":
                // Newest first
                return Comparator.comparing(Issue::getCreatedAt).reversed();
                
            case "oldest":
                // Oldest first
                return Comparator.comparing(Issue::getCreatedAt);
                
            case "smart":
            default:
                // 1. VOTE COUNT is primary factor (popularity/engagement)
                // 2. Location proximity matters (local relevance)
                // 3. Critical issues get slight boost
                // 4. Recency as final tiebreaker
                return (issue1, issue2) -> {
                    
                    // PRIMARY: Vote count matters most (engagement/popularity)
                    int voteCompare = Integer.compare(issue2.getVoteCount(), issue1.getVoteCount());
                    if (voteCompare != 0) return voteCompare;
                    
                    // SECONDARY: Location proximity (if user location provided)
                    if (userLat != null && userLng != null) {
                        Double dist1 = issue1.getLatitude() != null && issue1.getLongitude() != null 
                                ? calculateDistance(userLat, userLng, issue1.getLatitude(), issue1.getLongitude())
                                : Double.MAX_VALUE;
                        Double dist2 = issue2.getLatitude() != null && issue2.getLongitude() != null
                                ? calculateDistance(userLat, userLng, issue2.getLatitude(), issue2.getLongitude())
                                : Double.MAX_VALUE;
                        
                        // Closer issues get priority (within 20km radius)
                        if (dist1 <= 20 && dist2 <= 20) {
                            int distCompare = Double.compare(dist1, dist2);
                            if (distCompare != 0) return distCompare;
                        }
                    }
                    
                    // TERTIARY: Critical issues get slight boost (but not overwhelming)
                    int criticalCompare = Boolean.compare(issue2.isCritical(), issue1.isCritical());
                    if (criticalCompare != 0) return criticalCompare;
                    
                    // FINAL: Newer issues
                    return issue2.getCreatedAt().compareTo(issue1.getCreatedAt());
                };
        }
    }

    // Dashboard methods for user statistics
    public Map<String, Object> getUserDashboardStats(User user) {
        Map<String, Object> stats = new HashMap<>();
        
        // Get user's issues count
        List<Issue> userIssues = issueRepository.findByCreatedBy(user);
        stats.put("myIssues", userIssues.size());
        
        // Count resolved issues
        long resolvedCount = userIssues.stream()
                .filter(issue -> issue.getStatus() == IssueStatus.RESOLVED)
                .count();
        stats.put("issuesResolved", resolvedCount);
        
        // Count pending issues
        long pendingCount = userIssues.stream()
                .filter(issue -> issue.getStatus() == IssueStatus.OPEN)
                .count();
        stats.put("pendingIssues", pendingCount);
        
        // Total votes received on user's issues
        int totalVotes = userIssues.stream()
                .mapToInt(Issue::getVoteCount)
                .sum();
        stats.put("votesReceived", totalVotes);
        
        // Recent activity (issues created this week)
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        long issuesThisWeek = userIssues.stream()
                .filter(issue -> issue.getCreatedAt().isAfter(oneWeekAgo))
                .count();
        stats.put("issuesThisWeek", issuesThisWeek);
        
        return stats;
    }
    
    public List<Issue> getUserRecentIssues(User user, int limit) {
        List<Issue> userIssues = issueRepository.findByCreatedBy(user);
        return userIssues.stream()
                .sorted((i1, i2) -> i2.getCreatedAt().compareTo(i1.getCreatedAt()))
                .limit(limit)
                .collect(Collectors.toList());
    }
}
