package com.tenderai.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tenderai.domain.CompanyProfile;
import com.tenderai.domain.User;
import com.tenderai.dto.CaseStudyDto;
import com.tenderai.dto.CompanyProfileDto;
import com.tenderai.repository.CompanyProfileRepository;
import com.tenderai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CompanyProfileService {

    private static final Logger log = LoggerFactory.getLogger(CompanyProfileService.class);

    private final CompanyProfileRepository companyProfileRepository;
    private final UserRepository userRepository;
    private final ObjectMapper objectMapper;

    @Transactional(readOnly = true)
    public CompanyProfileDto getProfile(Long userId) {
        CompanyProfile profile = getOrCreateProfileEntity(userId);
        return mapToDto(profile);
    }

    @Transactional
    public CompanyProfileDto updateProfile(Long userId, CompanyProfileDto dto) {
        CompanyProfile profile = getOrCreateProfileEntity(userId);

        profile.setAgencyName(dto.getAgencyName());
        profile.setTagline(dto.getTagline());
        profile.setWebsite(dto.getWebsite());
        profile.setCoreCompetencies(dto.getCoreCompetencies());
        profile.setTeamBios(dto.getTeamBios());

        if (dto.getCaseStudies() != null) {
            try {
                profile.setCaseStudies(objectMapper.writeValueAsString(dto.getCaseStudies()));
            } catch (Exception e) {
                log.error("Failed to serialize case studies: {}", e.getMessage());
            }
        }

        CompanyProfile saved = companyProfileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public CompanyProfileDto addCaseStudy(Long userId, CaseStudyDto caseStudy) {
        CompanyProfile profile = getOrCreateProfileEntity(userId);
        List<CaseStudyDto> caseStudies = deserializeCaseStudies(profile.getCaseStudies());

        if (caseStudy.getId() == null || caseStudy.getId().isBlank()) {
            caseStudy.setId("cs-" + UUID.randomUUID().toString().substring(0, 8));
        }

        caseStudies.add(caseStudy);
        try {
            profile.setCaseStudies(objectMapper.writeValueAsString(caseStudies));
        } catch (Exception e) {
            log.error("Failed to serialize case study: {}", e.getMessage());
        }

        CompanyProfile saved = companyProfileRepository.save(profile);
        return mapToDto(saved);
    }

    @Transactional
    public CompanyProfileDto deleteCaseStudy(Long userId, String caseStudyId) {
        CompanyProfile profile = getOrCreateProfileEntity(userId);
        List<CaseStudyDto> caseStudies = deserializeCaseStudies(profile.getCaseStudies());

        caseStudies.removeIf(cs -> caseStudyId.equals(cs.getId()));
        try {
            profile.setCaseStudies(objectMapper.writeValueAsString(caseStudies));
        } catch (Exception e) {
            log.error("Failed to serialize case studies: {}", e.getMessage());
        }

        CompanyProfile saved = companyProfileRepository.save(profile);
        return mapToDto(saved);
    }

    public CompanyProfile getOrCreateProfileEntity(Long userId) {
        return companyProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
                    CompanyProfile newProfile = CompanyProfile.builder()
                            .user(user)
                            .agencyName(user.getFullName() != null ? user.getFullName() + " Agency" : "European Agency")
                            .tagline("Pan-European Digital & Commercial Services")
                            .coreCompetencies("Procurement Readiness, Cloud Modernization, EU Directive Alignment")
                            .caseStudies("[]")
                            .build();
                    return companyProfileRepository.save(newProfile);
                });
    }

    public List<CaseStudyDto> deserializeCaseStudies(String json) {
        if (json == null || json.isBlank()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(json, new TypeReference<List<CaseStudyDto>>() {});
        } catch (Exception e) {
            log.error("Failed to parse case studies JSON: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    private CompanyProfileDto mapToDto(CompanyProfile entity) {
        return CompanyProfileDto.builder()
                .id(entity.getId())
                .agencyName(entity.getAgencyName())
                .tagline(entity.getTagline())
                .website(entity.getWebsite())
                .coreCompetencies(entity.getCoreCompetencies())
                .teamBios(entity.getTeamBios())
                .caseStudies(deserializeCaseStudies(entity.getCaseStudies()))
                .build();
    }
}
