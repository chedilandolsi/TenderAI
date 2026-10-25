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
public class CompanyProfileDto {
    private Long id;

    @NotBlank(message = "Agency name is required")
    private String agencyName;

    private String tagline;
    private String website;
    private String coreCompetencies;
    private String teamBios;

    @Builder.Default
    private List<CaseStudyDto> caseStudies = new ArrayList<>();
}
