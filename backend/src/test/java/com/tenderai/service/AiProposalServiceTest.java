package com.tenderai.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenderai.domain.CompanyProfile;
import com.tenderai.dto.CaseStudyDto;
import com.tenderai.dto.ProposalContentDto;
import com.tenderai.dto.ProposalRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class AiProposalServiceTest {

    private AiProposalService aiProposalService;
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        aiProposalService = new AiProposalService(objectMapper);
    }

    @Test
    void testContextualProposalGeneration_ContainsEuropeanStandardsAndProfile() {
        CompanyProfile profile = CompanyProfile.builder()
                .agencyName("Hexagon Public Consulting")
                .tagline("Pan-European Public Sector Specialists")
                .coreCompetencies("Gaia-X, Cloud Sovereignty, GDPR Article 32")
                .build();

        CaseStudyDto caseStudy = CaseStudyDto.builder()
                .id("cs-1")
                .title("Digital Identity Portal")
                .client("Ministry of Justice, Netherlands")
                .budget("€1,200,000")
                .summary("eIDAS-compliant citizen verification engine")
                .technologies(List.of("Spring Boot", "Angular"))
                .build();

        ProposalRequest request = ProposalRequest.builder()
                .tenderTitle("TED 2026/S 112: Cloud Modernization Framework")
                .clientName("European Environment Agency (EEA)")
                .country("Denmark")
                .submissionDeadline("2026-12-15")
                .rawTenderText("Modernization of maritime observation databases with sovereign cloud requirements.")
                .selectedCaseStudyIds(List.of("cs-1"))
                .build();

        ProposalContentDto result = aiProposalService.generateProposal(request, profile, List.of(caseStudy));

        assertNotNull(result);
        assertNotNull(result.getExecutiveSummary());
        assertTrue(result.getExecutiveSummary().contains("Hexagon Public Consulting"));
        assertTrue(result.getExecutiveSummary().contains("European Environment Agency (EEA)"));

        assertNotNull(result.getProposedMethodology());
        assertTrue(result.getProposedMethodology().contains("PM²"));

        assertNotNull(result.getComplianceAndStandards());
        assertTrue(result.getComplianceAndStandards().contains("Directive 2014/24/EU"));
        assertTrue(result.getComplianceAndStandards().contains("GDPR"));
        assertTrue(result.getComplianceAndStandards().contains("NIS2"));

        assertNotNull(result.getPricingStructure());
        assertTrue(result.getPricingStructure().contains("€"));
    }
}
