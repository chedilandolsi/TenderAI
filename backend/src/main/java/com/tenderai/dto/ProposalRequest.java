package com.tenderai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalRequest {
    @NotBlank(message = "Tender title is required")
    private String tenderTitle;

    @NotBlank(message = "Client name / contracting authority is required")
    private String clientName;

    private String country;
    private String submissionDeadline;

    @NotBlank(message = "Tender description or extracted text is required")
    private String rawTenderText;

    @Builder.Default
    private List<String> selectedCaseStudyIds = new ArrayList<>();

    private String customInstructions;
}
