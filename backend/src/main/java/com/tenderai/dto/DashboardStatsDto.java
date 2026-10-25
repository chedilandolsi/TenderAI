package com.tenderai.dto;

import com.tenderai.domain.SubscriptionTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private long totalProposals;
    private long completedProposals;
    private long draftProposals;
    private SubscriptionTier currentTier;
    private String agencyName;
    private int caseStudiesCount;
}
