package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.dto.UserProfileResponse;
import com.civicflow.civicflow_backend.dto.UserProfileUpdateRequest;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Transactional
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir = "uploads/profile-pictures/";

    public UserProfileResponse getCurrentUserProfile() {
        User user = getCurrentUser();
        return buildProfileResponse(user, true);
    }

    public UserProfileResponse getUserProfileByUsername(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Check if requesting own profile
        User currentUser = getCurrentUser();
        boolean isOwnProfile = currentUser.getUsername().equals(username);
        
        return buildProfileResponse(user, isOwnProfile);
    }

    public UserProfileResponse updateProfile(UserProfileUpdateRequest request) {
        User user = getCurrentUser();

        // Update basic info
        if (request.getFirstName() != null) {
            user.setFirstName(request.getFirstName().trim());
        }
        if (request.getLastName() != null) {
            user.setLastName(request.getLastName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            // Check if email is already taken
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email is already taken");
            }
            user.setEmail(request.getEmail().trim());
        }
        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber().trim());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        // Update address
        if (request.getAddressLine1() != null) {
            user.setAddressLine1(request.getAddressLine1().trim());
        }
        if (request.getAddressLine2() != null) {
            user.setAddressLine2(request.getAddressLine2().trim());
        }
        if (request.getCity() != null) {
            user.setCity(request.getCity().trim());
        }
        if (request.getState() != null) {
            user.setState(request.getState().trim());
        }
        if (request.getPostalCode() != null) {
            user.setPostalCode(request.getPostalCode().trim());
        }
        if (request.getCountry() != null) {
            user.setCountry(request.getCountry().trim());
        }

        // Update location
        if (request.getLatitude() != null && request.getLongitude() != null) {
            user.setLatitude(request.getLatitude());
            user.setLongitude(request.getLongitude());
        }

        // Update area code
        if (request.getAreaCode() != null) {
            user.setAreaCode(request.getAreaCode().trim());
        }

        // Update preferences
        if (request.getEmailNotifications() != null) {
            user.setEmailNotifications(request.getEmailNotifications());
        }
        if (request.getPushNotifications() != null) {
            user.setPushNotifications(request.getPushNotifications());
        }
        if (request.getNearbyIssuesNotifications() != null) {
            user.setNearbyIssuesNotifications(request.getNearbyIssuesNotifications());
        }

        user.setUpdatedAt(LocalDateTime.now());
        User updatedUser = userRepository.save(user);
        
        return buildProfileResponse(updatedUser, true);
    }

    public UserProfileResponse uploadProfilePicture(MultipartFile file) {
        User user = getCurrentUser();

        if (file.isEmpty()) {
            throw new RuntimeException("File is empty");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.startsWith("image/"))) {
            throw new RuntimeException("File must be an image");
        }

        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                ? originalFilename.substring(originalFilename.lastIndexOf(".")) 
                : "";
            String filename = UUID.randomUUID().toString() + extension;
            
            // Save file
            Path filePath = uploadPath.resolve(filename);
            Files.copy(file.getInputStream(), filePath);

            // Update user profile picture URL
            String profilePictureUrl = "/uploads/profile-pictures/" + filename;
            user.setProfilePictureUrl(profilePictureUrl);
            user.setUpdatedAt(LocalDateTime.now());
            
            User updatedUser = userRepository.save(user);
            return buildProfileResponse(updatedUser, true);

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteProfilePicture() {
        User user = getCurrentUser();
        
        if (user.getProfilePictureUrl() != null) {
            // Delete file from filesystem
            try {
                Path filePath = Paths.get("." + user.getProfilePictureUrl());
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log error but don't fail the operation
                System.err.println("Failed to delete profile picture file: " + e.getMessage());
            }
            
            // Remove URL from database
            user.setProfilePictureUrl(null);
            user.setUpdatedAt(LocalDateTime.now());
            userRepository.save(user);
        }
    }

    public void deleteProfile() {
        User user = getCurrentUser();
        
        // Soft delete - deactivate account
        user.setIsActive(false);
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    public UserProfileResponse reactivateProfile() {
        User user = getCurrentUser();
        
        user.setIsActive(true);
        user.setUpdatedAt(LocalDateTime.now());
        User reactivatedUser = userRepository.save(user);
        
        return buildProfileResponse(reactivatedUser, true);
    }

    // Helper method to build profile response
    private UserProfileResponse buildProfileResponse(User user, boolean includePrivateInfo) {
        UserProfileResponse.UserProfileResponseBuilder builder = UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(includePrivateInfo ? user.getEmail() : null)
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .fullName(user.getFullName())
                .phoneNumber(includePrivateInfo ? user.getPhoneNumber() : null)
                .bio(user.getBio())
                .profilePictureUrl(user.getProfilePictureUrl())
                .addressLine1(includePrivateInfo ? user.getAddressLine1() : null)
                .addressLine2(includePrivateInfo ? user.getAddressLine2() : null)
                .city(user.getCity())
                .state(user.getState())
                .postalCode(includePrivateInfo ? user.getPostalCode() : null)
                .country(user.getCountry())
                .fullAddress(user.getFullAddress())
                .latitude(user.getLatitude())
                .longitude(user.getLongitude())
                .hasLocation(user.hasLocation())
                .areaCode(user.getAreaCode())
                .role(user.getRole())
                .isActive(user.getIsActive())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt());

        // Include private information only for own profile
        if (includePrivateInfo) {
            builder.emailNotifications(user.getEmailNotifications())
                   .pushNotifications(user.getPushNotifications())
                   .nearbyIssuesNotifications(user.getNearbyIssuesNotifications())
                   .lastLogin(user.getLastLogin());
        }

        // Calculate profile completion percentage
        builder.profileCompletionPercentage(calculateProfileCompletion(user));

        return builder.build();
    }

    // Calculate how complete the user's profile is
    private Integer calculateProfileCompletion(User user) {
        int totalFields = 12;
        int completedFields = 0;

        if (user.getFirstName() != null && !user.getFirstName().trim().isEmpty()) completedFields++;
        if (user.getLastName() != null && !user.getLastName().trim().isEmpty()) completedFields++;
        if (user.getEmail() != null && !user.getEmail().trim().isEmpty()) completedFields++;
        if (user.getPhoneNumber() != null && !user.getPhoneNumber().trim().isEmpty()) completedFields++;
        if (user.getBio() != null && !user.getBio().trim().isEmpty()) completedFields++;
        if (user.getProfilePictureUrl() != null) completedFields++;
        if (user.getAddressLine1() != null && !user.getAddressLine1().trim().isEmpty()) completedFields++;
        if (user.getCity() != null && !user.getCity().trim().isEmpty()) completedFields++;
        if (user.getState() != null && !user.getState().trim().isEmpty()) completedFields++;
        if (user.getPostalCode() != null && !user.getPostalCode().trim().isEmpty()) completedFields++;
        if (user.getCountry() != null && !user.getCountry().trim().isEmpty()) completedFields++;
        if (user.hasLocation()) completedFields++;

        return Math.round((float) completedFields / totalFields * 100);
    }

    // Helper method to get current authenticated user
    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
