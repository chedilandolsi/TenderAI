package com.tenderai.controller;

import com.tenderai.config.CustomUserPrincipal;
import com.tenderai.domain.User;
import com.tenderai.dto.AuthRequest;
import com.tenderai.dto.AuthResponse;
import com.tenderai.dto.RegisterRequest;
import com.tenderai.repository.UserRepository;
import com.tenderai.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Value("${app.stripe.publishable-key:}")
    private String stripePublishableKey;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/verify-email")
    public ResponseEntity<AuthResponse> verifyEmail(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/resend-verification")
    public ResponseEntity<Map<String, String>> resendVerification(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        if (email == null || email.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Email is required"));
        }
        authService.resendVerification(email);
        return ResponseEntity.ok(Map.of("message", "Verification email dispatched successfully"));
    }

    @GetMapping("/config")
    public ResponseEntity<Map<String, Object>> getAuthConfig() {
        return ResponseEntity.ok(Map.of(
                "googleOAuthUrl", "/oauth2/authorization/google",
                "stripePublishableKey", stripePublishableKey,
                "supportedLocales", List.of("en", "fr", "de", "es", "it")
        ));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal CustomUserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "subscriptionTier", user.getSubscriptionTier(),
                "emailVerified", user.isEmailVerified(),
                "provider", user.getProvider()
        ));
    }
}
