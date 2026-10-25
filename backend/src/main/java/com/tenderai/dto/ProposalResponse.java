package com.tenderai.dto;

import com.tenderai.domain.ProposalStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalResponse {
    private Long id;
    private String tenderTitle;
    private String clientName;
    private String country;
    private String submissionDeadline;
    private String rawTenderText;
    private ProposalContentDto generatedContent;
    private ProposalStatus status;
    @Builder.Default
    private List<String> selectedCaseStudies = new ArrayList<>();
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
