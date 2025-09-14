package com.civicflow.civicflow_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@EntityListeners(AuditingEntityListener.class) // 👈 Needed for auditing
public class Issue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private String imageUrl;
    private String category;

    private Double latitude;
    private Double longitude;

    private int voteCount;
    private boolean critical;

    @Enumerated(EnumType.STRING)
    private IssueStatus status = IssueStatus.OPEN;

    // 🔗 Track who created this issue (REQUIRED)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "created_by_user_id", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User createdBy;

    // 🔗 Track which NGO is assigned (OPTIONAL)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "assigned_ngo_id")
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private User assignedNgo;

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(nullable = false) // updated each modification
    private LocalDateTime updatedAt;
}
