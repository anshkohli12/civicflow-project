package com.civicflow.civicflow_backend.service;

import com.civicflow.civicflow_backend.model.Role;
import com.civicflow.civicflow_backend.model.User;
import com.civicflow.civicflow_backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    private User testUser;
    private User testNgo;

    @BeforeEach
    void setUp() {
        // Setup test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(Role.USER);
        testUser.setIsActive(true);
        testUser.setCreatedAt(LocalDateTime.now());

        // Setup test NGO
        testNgo = new User();
        testNgo.setId(2L);
        testNgo.setUsername("testngo");
        testNgo.setEmail("ngo@example.com");
        testNgo.setFirstName("Test");
        testNgo.setLastName("NGO");
        testNgo.setRole(Role.NGO);
        testNgo.setIsActive(true);
        testNgo.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void testFindUserById() {
        // Given
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userRepository.findById(1L);

        // Then
        assertTrue(result.isPresent());
        assertEquals("testuser", result.get().getUsername());
        assertEquals("test@example.com", result.get().getEmail());
        verify(userRepository).findById(1L);
    }

    @Test
    void testFindUserByIdNotFound() {
        // Given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // When
        Optional<User> result = userRepository.findById(999L);

        // Then
        assertFalse(result.isPresent());
        verify(userRepository).findById(999L);
    }

    @Test
    void testFindAllUsers() {
        // Given
        List<User> users = Arrays.asList(testUser, testNgo);
        Page<User> userPage = new PageImpl<>(users);
        Pageable pageable = PageRequest.of(0, 10);
        
        when(userRepository.findAll(pageable)).thenReturn(userPage);

        // When
        Page<User> result = userRepository.findAll(pageable);

        // Then
        assertEquals(2, result.getContent().size());
        assertEquals("testuser", result.getContent().get(0).getUsername());
        assertEquals("testngo", result.getContent().get(1).getUsername());
        verify(userRepository).findAll(pageable);
    }

    @Test
    void testSaveUser() {
        // Given
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // When
        User result = userRepository.save(testUser);

        // Then
        assertNotNull(result);
        assertEquals("testuser", result.getUsername());
        assertEquals("test@example.com", result.getEmail());
        verify(userRepository).save(testUser);
    }

    @Test
    void testExistsByUsername() {
        // Given
        when(userRepository.existsByUsername("testuser")).thenReturn(true);
        when(userRepository.existsByUsername("nonexistent")).thenReturn(false);

        // When & Then
        assertTrue(userRepository.existsByUsername("testuser"));
        assertFalse(userRepository.existsByUsername("nonexistent"));
        
        verify(userRepository).existsByUsername("testuser");
        verify(userRepository).existsByUsername("nonexistent");
    }

    @Test
    void testExistsByEmail() {
        // Given
        when(userRepository.existsByEmail("test@example.com")).thenReturn(true);
        when(userRepository.existsByEmail("nonexistent@example.com")).thenReturn(false);

        // When & Then
        assertTrue(userRepository.existsByEmail("test@example.com"));
        assertFalse(userRepository.existsByEmail("nonexistent@example.com"));
        
        verify(userRepository).existsByEmail("test@example.com");
        verify(userRepository).existsByEmail("nonexistent@example.com");
    }

    @Test
    void testFindByRole() {
        // Given
        List<User> ngos = Arrays.asList(testNgo);
        Page<User> ngoPage = new PageImpl<>(ngos);
        Pageable pageable = PageRequest.of(0, 10);
        when(userRepository.findByRole(Role.NGO, pageable)).thenReturn(ngoPage);

        // When
        Page<User> result = userRepository.findByRole(Role.NGO, pageable);

        // Then
        assertEquals(1, result.getContent().size());
        assertEquals(Role.NGO, result.getContent().get(0).getRole());
        verify(userRepository).findByRole(Role.NGO, pageable);
    }

    @Test
    void testCountByRole() {
        // Given
        when(userRepository.countByRole(Role.USER)).thenReturn(5L);
        when(userRepository.countByRole(Role.NGO)).thenReturn(3L);
        when(userRepository.countByRole(Role.ADMIN)).thenReturn(1L);

        // When & Then
        assertEquals(5L, userRepository.countByRole(Role.USER));
        assertEquals(3L, userRepository.countByRole(Role.NGO));
        assertEquals(1L, userRepository.countByRole(Role.ADMIN));
        
        verify(userRepository).countByRole(Role.USER);
        verify(userRepository).countByRole(Role.NGO);
        verify(userRepository).countByRole(Role.ADMIN);
    }
}