package com.tenderai.controller;

import com.tenderai.config.CustomUserPrincipal;
import com.tenderai.dto.CaseStudyDto;
import com.tenderai.dto.CompanyProfileDto;
import com.tenderai.service.CompanyProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final CompanyProfileService companyProfileService;

    @GetMapping
    public ResponseEntity<CompanyProfileDto> getProfile(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(companyProfileService.getProfile(principal.getId()));
    }

    @PutMapping
    public ResponseEntity<CompanyProfileDto> updateProfile(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                          @Valid @RequestBody CompanyProfileDto dto) {
        return ResponseEntity.ok(companyProfileService.updateProfile(principal.getId(), dto));
    }

    @PostMapping("/case-studies")
    public ResponseEntity<CompanyProfileDto> addCaseStudy(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                          @RequestBody CaseStudyDto caseStudy) {
        return ResponseEntity.ok(companyProfileService.addCaseStudy(principal.getId(), caseStudy));
    }

    @DeleteMapping("/case-studies/{id}")
    public ResponseEntity<CompanyProfileDto> deleteCaseStudy(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                             @PathVariable String id) {
        return ResponseEntity.ok(companyProfileService.deleteCaseStudy(principal.getId(), id));
    }
}
