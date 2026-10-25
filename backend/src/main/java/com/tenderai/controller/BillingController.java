package com.tenderai.controller;

import com.tenderai.config.CustomUserPrincipal;
import com.tenderai.domain.SubscriptionTier;
import com.tenderai.domain.User;
import com.tenderai.dto.CheckoutRequest;
import com.tenderai.dto.CheckoutResponse;
import com.tenderai.repository.UserRepository;
import com.tenderai.service.StripeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/billing")
@RequiredArgsConstructor
public class BillingController {

    private final StripeService stripeService;
    private final UserRepository userRepository;

    @PostMapping("/checkout")
    public ResponseEntity<CheckoutResponse> createCheckoutSession(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                                 @Valid @RequestBody CheckoutRequest request) throws Exception {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return ResponseEntity.ok(stripeService.createCheckoutSession(user, request));
    }

    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> handleWebhook(@RequestBody String payload,
                                                             @RequestHeader(value = "Stripe-Signature", required = false) String sigHeader) {
        stripeService.processWebhookEvent(payload, sigHeader);
        return ResponseEntity.ok(Map.of("status", "received"));
    }

    @GetMapping("/subscription")
    public ResponseEntity<Map<String, Object>> getSubscriptionStatus(@AuthenticationPrincipal CustomUserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(Map.of(
                "tier", user.getSubscriptionTier(),
                "stripeCustomerId", user.getStripeCustomerId() != null ? user.getStripeCustomerId() : "",
                "stripeSubscriptionId", user.getStripeSubscriptionId() != null ? user.getStripeSubscriptionId() : ""
        ));
    }

    @PostMapping("/simulate-upgrade")
    public ResponseEntity<Map<String, Object>> simulateUpgrade(@AuthenticationPrincipal CustomUserPrincipal principal,
                                                               @RequestBody Map<String, String> body) {
        String tierStr = body.getOrDefault("tier", "PRO");
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        SubscriptionTier tier = SubscriptionTier.valueOf(tierStr.toUpperCase());
        user.setSubscriptionTier(tier);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of(
                "success", true,
                "tier", user.getSubscriptionTier(),
                "message", "Subscription successfully upgraded to " + tier
        ));
    }
}
