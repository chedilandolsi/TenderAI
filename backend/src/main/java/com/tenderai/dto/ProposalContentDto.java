package com.tenderai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProposalContentDto {
    private String executiveSummary;
    private String proposedMethodology;
    private String teamQualifications;
    private String timeline;
    private String pricingStructure;
    private String complianceAndStandards;
}
