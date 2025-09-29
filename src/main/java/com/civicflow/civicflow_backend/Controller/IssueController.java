package com.civicflow.civicflow_backend.Controller;

import com.civicflow.civicflow_backend.model.Issue;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.repository.UserRepository;
import com.civicflow.civicflow_backend.service.IssueService;
import com.civicflow.civicflow_backend.service.FileStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

    @Autowired
    private IssueService issueService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileStorageService fileStorageService;

    // Create a new issue (🔒 AUTHENTICATED USERS ONLY)
    @PostMapping
    public Issue createIssue(@RequestBody Issue issue, Authentication authentication) {
        // Get the current logged-in user
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Set who created this issue
        issue.setCreatedBy(currentUser);
        
        return issueService.createIssue(issue);
    }

    // Get all issues (📖 PUBLIC - anyone can view)
    @GetMapping
    public List<Issue> getAllIssues() {
        return issueService.getAllIssues();
    }

    // Get issue by ID
    // Get issue by ID (📖 PUBLIC)
    @GetMapping("/{id}")
    public Optional<Issue> getIssueById(@PathVariable Long id) {
        return issueService.getIssueById(id);
    }

    // Get my created issues (🔒 AUTHENTICATED)
    @GetMapping("/my-issues")
    public List<Issue> getMyIssues(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueService.getIssuesByUser(currentUser);
    }

    // Delete issue (🔒 AUTHENTICATED - only creator can delete)
    @DeleteMapping("/{id}")
    public void deleteIssue(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        issueService.deleteIssue(id, currentUser);
    }

    // Update issue (🔒 AUTHENTICATED - only creator can update)
    @PutMapping("/{id}")
    public Issue updateIssue(@PathVariable Long id, @RequestBody Issue issueDetails, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueService.updateIssue(id, issueDetails, currentUser);
    }

    // Update only the status of an issue (🔒 AUTHENTICATED - only creator can update)
    @PatchMapping("/{id}/status")
    public Issue updateIssueStatus(@PathVariable Long id, @RequestParam("status") String status, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueService.updateIssueStatus(id, status, currentUser);
    }

    // Toggle critical status of an issue (🔒 AUTHENTICATED - only admin can toggle)
    @PatchMapping("/{id}/critical")
    public Issue updateIssueCritical(@PathVariable Long id, @RequestParam("critical") Boolean critical, Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return issueService.updateIssueCritical(id, critical, currentUser);
    }

    // Upload image for issue (🔒 AUTHENTICATED - only creator can upload)
    @PostMapping("/{id}/image")
    public ResponseEntity<Map<String, String>> uploadIssueImage(
            @PathVariable Long id, 
            @RequestParam("image") MultipartFile file,
            Authentication authentication) {
        
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Store the file and get filename
        String fileName = fileStorageService.storeFile(file);
        
        // Generate the full URL for the image
        String imageUrl = "/api/files/images/" + fileName;
        
        // Update the issue with the image URL
        issueService.updateIssueImage(id, imageUrl, currentUser);
        
        // Return response with image URL
        Map<String, String> response = new HashMap<>();
        response.put("message", "Image uploaded successfully");
        response.put("imageUrl", imageUrl);
        response.put("fileName", fileName);
        
        return ResponseEntity.ok(response);
    }

    // Get user dashboard statistics (🔒 AUTHENTICATED)
    @GetMapping("/dashboard/stats")
    public ResponseEntity<Map<String, Object>> getUserDashboardStats(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Map<String, Object> stats = issueService.getUserDashboardStats(currentUser);
        return ResponseEntity.ok(stats);
    }

    // Get user's recent issues for dashboard (🔒 AUTHENTICATED)
    @GetMapping("/dashboard/recent")
    public ResponseEntity<List<Issue>> getUserRecentIssues(Authentication authentication) {
        String username = authentication.getName();
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Issue> recentIssues = issueService.getUserRecentIssues(currentUser, 5); // Last 5 issues
        return ResponseEntity.ok(recentIssues);
    }

    // 🌍 LOCATION-BASED SEARCH ENDPOINTS

    /**
     * Find issues near a specific location
     * GET /api/issues/nearby?lat=12.9716&lng=77.5946&radius=5
     */
    @GetMapping("/nearby")
    public List<Issue> getNearbyIssues(
            @RequestParam("lat") Double latitude,
            @RequestParam("lng") Double longitude,
            @RequestParam(value = "radius", defaultValue = "10.0") Double radiusKm) {
        
        if (latitude == null || longitude == null) {
            throw new RuntimeException("Latitude and longitude are required");
        }
        
        return issueService.getNearbyIssues(latitude, longitude, radiusKm);
    }

  
    @GetMapping("/nearby/filtered")
    public List<Issue> getNearbyIssuesWithFilters(
            @RequestParam("lat") Double latitude,
            @RequestParam("lng") Double longitude,
            @RequestParam(value = "radius", defaultValue = "10.0") Double radiusKm,
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "critical", required = false) Boolean critical) {
        
        if (latitude == null || longitude == null) {
            throw new RuntimeException("Latitude and longitude are required");
        }
        
        return issueService.getNearbyIssuesWithFilters(latitude, longitude, radiusKm, category, critical);
    }
    @GetMapping("/{id}/distance")
    public ResponseEntity<Map<String, Object>> getDistanceToIssue(
            @PathVariable Long id,
            @RequestParam("lat") Double userLatitude,
            @RequestParam("lng") Double userLongitude) {
        
        Optional<Issue> issueOpt = issueService.getIssueById(id);
        if (!issueOpt.isPresent()) {
            throw new RuntimeException("Issue not found");
        }
        
        Issue issue = issueOpt.get();
        if (issue.getLatitude() == null || issue.getLongitude() == null) {
            throw new RuntimeException("Issue location not available");
        }
        
        double distance = issueService.calculateDistance(
            userLatitude, userLongitude, 
            issue.getLatitude(), issue.getLongitude()
        );
        
        Map<String, Object> response = new HashMap<>();
        response.put("issueId", id);
        response.put("distance", Math.round(distance * 100.0) / 100.0); // Round to 2 decimal places
        response.put("unit", "km");
        response.put("issueLocation", Map.of(
            "latitude", issue.getLatitude(),
            "longitude", issue.getLongitude()
        ));
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/filter")
    public ResponseEntity<Map<String, Object>> getSmartFilteredIssues(
            @RequestParam(value = "latitude", required = false) Double lat,
            @RequestParam(value = "longitude", required = false) Double lng, 
            @RequestParam(value = "radiusKm", required = false) Integer radius,
            @RequestParam(required = false) String category,
            @RequestParam(value = "isCritical", required = false) Boolean critical,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer minVotes,
            @RequestParam(required = false) String dateFrom,
            @RequestParam(required = false) String dateTo,
            @RequestParam(defaultValue = "smart") String sortBy,
            @RequestParam(defaultValue = "0") Integer page,
            @RequestParam(defaultValue = "20") Integer size) {
        
        try {
            // Parse date parameters if provided
            java.time.LocalDateTime dateFromParsed = null;
            java.time.LocalDateTime dateToParsed = null;
            
            if (dateFrom != null && !dateFrom.trim().isEmpty()) {
                dateFromParsed = java.time.LocalDateTime.parse(dateFrom);
            }
            if (dateTo != null && !dateTo.trim().isEmpty()) {
                dateToParsed = java.time.LocalDateTime.parse(dateTo);
            }
            
            // Parse status if provided
            com.civicflow.civicflow_backend.model.IssueStatus statusEnum = null;
            if (status != null && !status.trim().isEmpty()) {
                try {
                    statusEnum = com.civicflow.civicflow_backend.model.IssueStatus.valueOf(status.toUpperCase());
                } catch (IllegalArgumentException e) {
                    // Invalid status, ignore
                }
            }
            
            // Get filtered and sorted issues
            List<Issue> issues = issueService.getSmartFilteredIssues(
                lat, lng, radius, category, critical, statusEnum,
                minVotes, dateFromParsed, dateToParsed, sortBy, page, size
            );
            
            // Calculate total count for pagination info
            List<Issue> totalIssues = issueService.getSmartFilteredIssues(
                lat, lng, radius, category, critical, statusEnum,
                minVotes, dateFromParsed, dateToParsed, sortBy, null, null
            );
            
            Map<String, Object> response = new HashMap<>();
            response.put("issues", issues);
            
            Map<String, Object> pagination = new HashMap<>();
            pagination.put("currentPage", page);
            pagination.put("pageSize", size);
            pagination.put("totalItems", totalIssues.size());
            pagination.put("totalPages", (int) Math.ceil((double) totalIssues.size() / size));
            response.put("pagination", pagination);
            
            Map<String, Object> filters = new HashMap<>();
            if (lat != null && lng != null) {
                Map<String, Object> location = new HashMap<>();
                location.put("lat", lat);
                location.put("lng", lng);
                location.put("radius", radius);
                filters.put("location", location);
            } else {
                filters.put("location", null);
            }
            filters.put("category", category);
            filters.put("critical", critical);
            filters.put("status", status);
            filters.put("minVotes", minVotes);
            
            Map<String, Object> dateRange = new HashMap<>();
            dateRange.put("from", dateFrom);
            dateRange.put("to", dateTo);
            filters.put("dateRange", dateRange);
            filters.put("sortBy", sortBy);
            response.put("filters", filters);
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("error", "Invalid parameters: " + e.getMessage());
            errorResponse.put("details", e.getClass().getSimpleName());
            errorResponse.put("stackTrace", java.util.Arrays.toString(e.getStackTrace()));
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
}
