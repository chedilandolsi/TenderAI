package com.tenderai.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CheckoutResponse {
    private String checkoutUrl;
    private String sessionId;
    private String planTier;
    private Long amountCents;
    private String currency;
}
