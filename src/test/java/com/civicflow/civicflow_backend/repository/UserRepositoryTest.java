package com.civicflow.civicflow_backend.repository;

import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.model.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@ActiveProfiles("test")
class UserRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private UserRepository userRepository;

    private User testUser;
    private User testNgo;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setPassword("hashedpassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(Role.USER);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());

        // Create test NGO
        testNgo = new User();
        testNgo.setUsername("testngo");
        testNgo.setEmail("ngo@example.com");
        testNgo.setPassword("hashedpassword");
        testNgo.setFirstName("Test");
        testNgo.setLastName("NGO");
        testNgo.setRole(Role.NGO);
        testNgo.setIsActive(true);
        testNgo.setCreatedAt(LocalDateTime.now());

        // Persist test data
        entityManager.persistAndFlush(testUser);
        entityManager.persistAndFlush(testNgo);
    }

    @Test
    void testFindByUsername() {
        // When
        Optional<User> found = userRepository.findByUsername("testuser");

        // Then
        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
        assertEquals("test@example.com", found.get().getEmail());
    }

    @Test
    void testFindByUsernameNotFound() {
        // When
        Optional<User> found = userRepository.findByUsername("nonexistent");

        // Then
        assertFalse(found.isPresent());
    }

    @Test
    void testExistsByUsername() {
        // When & Then
        assertTrue(userRepository.existsByUsername("testuser"));
        assertFalse(userRepository.existsByUsername("nonexistent"));
    }

    @Test
    void testExistsByEmail() {
        // When & Then
        assertTrue(userRepository.existsByEmail("test@example.com"));
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
    }

    @Test
    void testFindByRole() {
        // When
        Page<User> users = userRepository.findByRole(Role.USER, PageRequest.of(0, 10));
        Page<User> ngos = userRepository.findByRole(Role.NGO, PageRequest.of(0, 10));

        // Then
        assertEquals(1, users.getContent().size());
        assertEquals("testuser", users.getContent().get(0).getUsername());
        
        assertEquals(1, ngos.getContent().size());
        assertEquals("testngo", ngos.getContent().get(0).getUsername());
    }

    @Test
    void testCountByRole() {
        // When & Then
        assertEquals(1L, userRepository.countByRole(Role.USER));
        assertEquals(1L, userRepository.countByRole(Role.NGO));
        assertEquals(0L, userRepository.countByRole(Role.ADMIN));
    }

    @Test
    void testCountByIsActive() {
        // When
        long activeCount = userRepository.countByIsActive(true);

        // Then
        assertEquals(2L, activeCount); // Both test users are active
    }

    @Test
    void testFindByEmail() {
        // When
        Optional<User> found = userRepository.findByEmail("test@example.com");

        // Then
        assertTrue(found.isPresent());
        assertEquals("testuser", found.get().getUsername());
    }

    @Test
    void testSaveAndUpdate() {
        // Given - update existing user
        testUser.setFirstName("Updated");
        testUser.setLastName("Name");

        // When
        User saved = userRepository.save(testUser);

        // Then
        assertEquals("Updated", saved.getFirstName());
        assertEquals("Name", saved.getLastName());
        
        // Verify in database
        Optional<User> found = userRepository.findById(saved.getId());
        assertTrue(found.isPresent());
        assertEquals("Updated", found.get().getFirstName());
    }

    @Test
    void testDeleteUser() {
        // Given
        Long userId = testUser.getId();

        // When
        userRepository.delete(testUser);
        entityManager.flush();

        // Then
        Optional<User> found = userRepository.findById(userId);
        assertFalse(found.isPresent());
    }
}