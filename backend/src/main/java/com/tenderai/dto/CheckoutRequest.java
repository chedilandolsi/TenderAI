package com.tenderai.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutRequest {
    @NotBlank(message = "Plan tier is required (PRO or AGENCY)")
    private String planTier; // PRO or AGENCY

    private String successUrl;
    private String cancelUrl;
}
