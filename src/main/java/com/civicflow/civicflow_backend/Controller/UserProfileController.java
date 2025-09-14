package com.civicflow.civicflow_backend.Controller;

import com.civicflow.civicflow_backend.dto.UserProfileResponse;
import com.civicflow.civicflow_backend.dto.UserProfileUpdateRequest;
import com.civicflow.civicflow_backend.service.UserProfileService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    // Get current user's profile
    @GetMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> getCurrentUserProfile() {
        try {
            UserProfileResponse profile = userProfileService.getCurrentUserProfile();
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Get public profile by username
    @GetMapping("/profile/{username}")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable String username) {
        try {
            UserProfileResponse profile = userProfileService.getUserProfileByUsername(username);
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Update current user's profile
    @PutMapping("/profile")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> updateProfile(@Valid @RequestBody UserProfileUpdateRequest request) {
        try {
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(UserProfileResponse.builder().build()); // Return error in a better way
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Upload profile picture
    @PostMapping("/profile/picture")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> uploadProfilePicture(@RequestParam("file") MultipartFile file) {
        try {
            UserProfileResponse updatedProfile = userProfileService.uploadProfilePicture(file);
            return ResponseEntity.ok(updatedProfile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete profile picture
    @DeleteMapping("/profile/picture")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteProfilePicture() {
        try {
            userProfileService.deleteProfilePicture();
            return ResponseEntity.ok(Map.of("message", "Profile picture deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete profile picture"));
        }
    }

    // Update location
    @PutMapping("/location")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> updateLocation(@RequestBody Map<String, Object> locationData) {
        try {
            UserProfileUpdateRequest request = new UserProfileUpdateRequest();
            
            if (locationData.containsKey("latitude") && locationData.containsKey("longitude")) {
                request.setLatitude((Double) locationData.get("latitude"));
                request.setLongitude((Double) locationData.get("longitude"));
            }
            
            if (locationData.containsKey("city")) {
                request.setCity((String) locationData.get("city"));
            }
            if (locationData.containsKey("state")) {
                request.setState((String) locationData.get("state"));
            }
            if (locationData.containsKey("country")) {
                request.setCountry((String) locationData.get("country"));
            }
            if (locationData.containsKey("postalCode")) {
                request.setPostalCode((String) locationData.get("postalCode"));
            }
            
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Clear location
    @DeleteMapping("/location")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> clearLocation() {
        try {
            UserProfileUpdateRequest request = new UserProfileUpdateRequest();
            request.setLatitude(null);
            request.setLongitude(null);
            
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Deactivate account (soft delete)
    @DeleteMapping("/account")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deactivateAccount() {
        try {
            userProfileService.deleteProfile();
            return ResponseEntity.ok(Map.of("message", "Account deactivated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to deactivate account"));
        }
    }

    // Reactivate account
    @PostMapping("/account/reactivate")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> reactivateAccount() {
        try {
            UserProfileResponse profile = userProfileService.reactivateProfile();
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete specific address fields
    @DeleteMapping("/address")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> clearAddress() {
        try {
            UserProfileUpdateRequest request = new UserProfileUpdateRequest();
            request.setAddressLine1("");
            request.setAddressLine2("");
            request.setCity("");
            request.setState("");
            request.setPostalCode("");
            request.setCountry("");
            
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // Delete specific profile fields
    @DeleteMapping("/profile/bio")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> clearBio() {
        try {
            UserProfileUpdateRequest request = new UserProfileUpdateRequest();
            request.setBio("");
            
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/profile/phone")
    @PreAuthorize("hasRole('USER') or hasRole('NGO') or hasRole('ADMIN')")
    public ResponseEntity<UserProfileResponse> clearPhone() {
        try {
            UserProfileUpdateRequest request = new UserProfileUpdateRequest();
            request.setPhoneNumber("");
            
            UserProfileResponse updatedProfile = userProfileService.updateProfile(request);
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
