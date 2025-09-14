package com.civicflow.civicflow_backend.repository;

import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    
    // Admin statistics queries
    Long countByIsActive(Boolean isActive);
    Long countByRole(Role role);
    Long countByCreatedAtAfter(LocalDateTime dateTime);
    
    // Admin user management queries
    Page<User> findByRole(Role role, Pageable pageable);
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCase(
        String username, String email, Pageable pageable);
    
    @Query("SELECT u FROM User u WHERE (LOWER(u.username) LIKE LOWER(CONCAT('%', :username, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :email, '%'))) AND u.role = :role")
    Page<User> findByUsernameContainingIgnoreCaseOrEmailContainingIgnoreCaseAndRole(
        @Param("username") String username, @Param("email") String email, 
        @Param("role") Role role, Pageable pageable);
    
    // Recent activity queries
    List<User> findTop10ByOrderByCreatedAtDesc();
    List<User> findTop5ByOrderByCreatedAtDesc();
}
