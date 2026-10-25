package com.tenderai.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.OffsetDateTime;

@Entity
@Table(name = "proposals")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Proposal {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "tender_title", nullable = false, length = 500)
    private String tenderTitle;

    @Column(name = "client_name", nullable = false)
    private String clientName;

    @Column(name = "country")
    private String country;

    @Column(name = "submission_deadline")
    private String submissionDeadline;

    @Column(name = "raw_tender_text", columnDefinition = "TEXT")
    private String rawTenderText;

    @Column(name = "generated_content", columnDefinition = "TEXT")
    private String generatedContent;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @Builder.Default
    private ProposalStatus status = ProposalStatus.DRAFT;

    @Column(name = "selected_case_studies", columnDefinition = "TEXT")
    private String selectedCaseStudies;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;
}
