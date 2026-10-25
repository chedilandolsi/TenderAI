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
public class AuthResponse {
    private String token;
    @Builder.Default
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;
    private SubscriptionTier subscriptionTier;
    private String agencyName;
    @Builder.Default
    private boolean emailVerified = true;
    private String message;
}
