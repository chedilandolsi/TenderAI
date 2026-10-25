package com.tenderai.controller;

import com.tenderai.config.CustomUserPrincipal;
import com.tenderai.domain.Proposal;
import com.tenderai.dto.*;
import com.tenderai.service.DocumentParserService;
import com.tenderai.service.ExportService;
import com.tenderai.service.ProposalService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/proposals")
@RequiredArgsConstructor
public class ProposalController {

    private final ProposalService proposalService;
    private final DocumentParserService documentParserService;
    private final ExportService exportService;

    @PostMapping("/parse-pdf")
    public ResponseEntity<Map<String, String>> parsePdf(@RequestParam("file") MultipartFile file) {
        try {
            String extractedText = documentParserService.parseUploadedFile(file);
            return ResponseEntity.ok(Map.of(
                    "fileName", file.getOriginalFilename() != null ? file.getOriginalFilename() : "document.pdf",
                    "text", extractedText
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to parse document: " + e.getMessage()));
        }
    }

    @PostMapping("/generate")
    public ResponseEntity<ProposalResponse> generateProposal(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                             @Valid @RequestBody ProposalRequest request) {
        ProposalResponse response = proposalService.generateAndSaveProposal(principal.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<ProposalResponse>> getUserProposals(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(proposalService.getUserProposals(principal.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProposalResponse> getProposal(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                        @PathVariable Long id) {
        return ResponseEntity.ok(proposalService.getProposalById(id, principal.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProposalResponse> updateProposal(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                           @PathVariable Long id,
                                                           @RequestBody ProposalContentDto content) {
        return ResponseEntity.ok(proposalService.updateProposal(id, principal.getId(), content));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProposal(@AuthenticationPrincipal CustomUserPrincipal principal,
                                               @PathVariable Long id) {
        proposalService.deleteProposal(id, principal.getId());
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(@AuthenticationPrincipal CustomUserPrincipal principal) {
        return ResponseEntity.ok(proposalService.getDashboardStats(principal.getId()));
    }

    @GetMapping("/{id}/export/pdf")
    public ResponseEntity<byte[]> exportPdf(@AuthenticationPrincipal CustomUserPrincipal principal,
                                            @PathVariable Long id) throws Exception {
        Proposal proposal = proposalService.getProposalEntity(id, principal.getId());
        ProposalContentDto content = proposalService.deserializeContent(proposal.getGeneratedContent());
        byte[] pdfBytes = exportService.generatePdf(proposal, content);

        String filename = "Proposal_" + id + "_" + sanitizeFilename(proposal.getClientName()) + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .body(pdfBytes);
    }

    @GetMapping("/{id}/export/docx")
    public ResponseEntity<byte[]> exportDocx(@AuthenticationPrincipal CustomUserPrincipal principal,
                                             @PathVariable Long id) throws IOException {
        Proposal proposal = proposalService.getProposalEntity(id, principal.getId());
        ProposalContentDto content = proposalService.deserializeContent(proposal.getGeneratedContent());
        byte[] docxBytes = exportService.generateDocx(proposal, content);

        String filename = "Proposal_" + id + "_" + sanitizeFilename(proposal.getClientName()) + ".docx";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.wordprocessingml.document"))
                .body(docxBytes);
    }

    private String sanitizeFilename(String input) {
        if (input == null) return "tender";
        return input.replaceAll("[^a-zA-Z0-9_-]", "_");
    }
}
