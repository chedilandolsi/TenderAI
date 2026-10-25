package com.tenderai.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenderai.domain.CompanyProfile;
import com.tenderai.domain.Proposal;
import com.tenderai.domain.ProposalStatus;
import com.tenderai.domain.User;
import com.tenderai.dto.*;
import com.tenderai.repository.ProposalRepository;
import com.tenderai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProposalService {

    private static final Logger log = LoggerFactory.getLogger(ProposalService.class);

    private final ProposalRepository proposalRepository;
    private final UserRepository userRepository;
    private final CompanyProfileService companyProfileService;
    private final AiProposalService aiProposalService;
    private final ObjectMapper objectMapper;

    @Transactional
    public ProposalResponse generateAndSaveProposal(Long userId, ProposalRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        CompanyProfile profile = companyProfileService.getOrCreateProfileEntity(userId);
        List<CaseStudyDto> allCaseStudies = companyProfileService.deserializeCaseStudies(profile.getCaseStudies());

        List<CaseStudyDto> selectedCaseStudies = new ArrayList<>();
        if (request.getSelectedCaseStudyIds() != null && !request.getSelectedCaseStudyIds().isEmpty()) {
            selectedCaseStudies = allCaseStudies.stream()
                    .filter(cs -> request.getSelectedCaseStudyIds().contains(cs.getId()))
                    .collect(Collectors.toList());
        }

        // Call AI Service
        ProposalContentDto content = aiProposalService.generateProposal(request, profile, selectedCaseStudies);

        String generatedContentJson;
        try {
            generatedContentJson = objectMapper.writeValueAsString(content);
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize generated proposal: {}", e.getMessage());
            generatedContentJson = "{}";
        }

        String selectedIdsJson = "[]";
        try {
            selectedIdsJson = objectMapper.writeValueAsString(request.getSelectedCaseStudyIds());
        } catch (Exception e) {
            log.error("Failed to serialize selected case studies: {}", e.getMessage());
        }

        Proposal proposal = Proposal.builder()
                .user(user)
                .tenderTitle(request.getTenderTitle())
                .clientName(request.getClientName())
                .country(request.getCountry())
                .submissionDeadline(request.getSubmissionDeadline())
                .rawTenderText(request.getRawTenderText())
                .generatedContent(generatedContentJson)
                .status(ProposalStatus.COMPLETED)
                .selectedCaseStudies(selectedIdsJson)
                .build();

        Proposal saved = proposalRepository.save(proposal);
        return mapToResponse(saved, content);
    }

    @Transactional(readOnly = true)
    public List<ProposalResponse> getUserProposals(Long userId) {
        return proposalRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public ProposalResponse getProposalById(Long id, Long userId) {
        Proposal proposal = proposalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found or access denied"));
        return mapToResponse(proposal);
    }

    @Transactional(readOnly = true)
    public Proposal getProposalEntity(Long id, Long userId) {
        return proposalRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new IllegalArgumentException("Proposal not found or access denied"));
    }

    @Transactional
    public ProposalResponse updateProposal(Long id, Long userId, ProposalContentDto updatedContent) {
        Proposal proposal = getProposalEntity(id, userId);

        try {
            proposal.setGeneratedContent(objectMapper.writeValueAsString(updatedContent));
        } catch (JsonProcessingException e) {
            log.error("Failed to serialize updated content: {}", e.getMessage());
        }

        Proposal saved = proposalRepository.save(proposal);
        return mapToResponse(saved, updatedContent);
    }

    @Transactional
    public void deleteProposal(Long id, Long userId) {
        Proposal proposal = getProposalEntity(id, userId);
        proposalRepository.delete(proposal);
    }

    @Transactional(readOnly = true)
    public DashboardStatsDto getDashboardStats(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        long total = proposalRepository.countByUserId(userId);
        long completed = proposalRepository.countByUserIdAndStatus(userId, ProposalStatus.COMPLETED);
        long draft = proposalRepository.countByUserIdAndStatus(userId, ProposalStatus.DRAFT);

        var profile = companyProfileService.getProfile(userId);

        return DashboardStatsDto.builder()
                .totalProposals(total)
                .completedProposals(completed)
                .draftProposals(draft)
                .currentTier(user.getSubscriptionTier())
                .agencyName(profile.getAgencyName())
                .caseStudiesCount(profile.getCaseStudies() != null ? profile.getCaseStudies().size() : 0)
                .build();
    }

    public ProposalContentDto deserializeContent(String json) {
        if (json == null || json.isBlank()) {
            return new ProposalContentDto();
        }
        try {
            return objectMapper.readValue(json, ProposalContentDto.class);
        } catch (Exception e) {
            log.error("Error deserializing proposal content: {}", e.getMessage());
            return new ProposalContentDto();
        }
    }

    private ProposalResponse mapToResponse(Proposal p) {
        ProposalContentDto content = deserializeContent(p.getGeneratedContent());
        return mapToResponse(p, content);
    }

    private ProposalResponse mapToResponse(Proposal p, ProposalContentDto content) {
        List<String> selectedCases = new ArrayList<>();
        if (p.getSelectedCaseStudies() != null && !p.getSelectedCaseStudies().isBlank()) {
            try {
                selectedCases = objectMapper.readValue(p.getSelectedCaseStudies(), new TypeReference<List<String>>() {});
            } catch (Exception ignored) {}
        }

        return ProposalResponse.builder()
                .id(p.getId())
                .tenderTitle(p.getTenderTitle())
                .clientName(p.getClientName())
                .country(p.getCountry())
                .submissionDeadline(p.getSubmissionDeadline())
                .rawTenderText(p.getRawTenderText())
                .generatedContent(content)
                .status(p.getStatus())
                .selectedCaseStudies(selectedCases)
                .createdAt(p.getCreatedAt())
                .updatedAt(p.getUpdatedAt())
                .build();
    }
}
