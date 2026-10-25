package com.tenderai.service;

import com.tenderai.config.JwtTokenProvider;
import com.tenderai.domain.CompanyProfile;
import com.tenderai.domain.SubscriptionTier;
import com.tenderai.domain.User;
import com.tenderai.dto.AuthRequest;
import com.tenderai.dto.AuthResponse;
import com.tenderai.dto.RegisterRequest;
import com.tenderai.repository.CompanyProfileRepository;
import com.tenderai.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final EmailService emailService;
    private final I18nService i18nService;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        Locale currentLocale = LocaleContextHolder.getLocale();
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new IllegalArgumentException(i18nService.getMessage("auth.error.email_exists", null, currentLocale));
        }

        String verificationToken = UUID.randomUUID().toString();
        OffsetDateTime expiry = OffsetDateTime.now().plusHours(24);

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .subscriptionTier(SubscriptionTier.FREE)
                .emailVerified(false)
                .verificationToken(verificationToken)
                .verificationTokenExpiry(expiry)
                .provider("LOCAL")
                .build();

        user = userRepository.save(user);

        // Create default initial company profile
        String agencyName = (request.getAgencyName() != null && !request.getAgencyName().isBlank())
                ? request.getAgencyName()
                : request.getFullName() + " Consulting";

        CompanyProfile profile = CompanyProfile.builder()
                .user(user)
                .agencyName(agencyName)
                .tagline("Specialized European procurement and technology consulting")
                .coreCompetencies("Public Sector Digitization, Cloud Architecture, GDPR Compliance, Technical Proposals")
                .teamBios("Lead Consultant: " + request.getFullName())
                .caseStudies("[]")
                .build();

        companyProfileRepository.save(profile);

        // Send multi-language verification email
        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), verificationToken, currentLocale);

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_USER");

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .subscriptionTier(user.getSubscriptionTier())
                .agencyName(agencyName)
                .emailVerified(false)
                .message(i18nService.getMessage("auth.success.registered", null, currentLocale))
                .build();
    }

    public AuthResponse login(AuthRequest request) {
        Locale currentLocale = LocaleContextHolder.getLocale();
        String normalizedEmail = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new BadCredentialsException(i18nService.getMessage("auth.error.invalid_credentials", null, currentLocale)));

        if (user.getPasswordHash() == null || !passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new BadCredentialsException(i18nService.getMessage("auth.error.invalid_credentials", null, currentLocale));
        }

        String agencyName = "";
        var profileOpt = companyProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            agencyName = profileOpt.get().getAgencyName();
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_USER");

        return AuthResponse.builder()
                .token(token)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .subscriptionTier(user.getSubscriptionTier())
                .agencyName(agencyName)
                .emailVerified(user.isEmailVerified())
                .build();
    }

    @Transactional
    public AuthResponse verifyEmail(String token) {
        Locale currentLocale = LocaleContextHolder.getLocale();

        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new IllegalArgumentException(i18nService.getMessage("auth.error.token_invalid", null, currentLocale)));

        if (user.getVerificationTokenExpiry() != null && user.getVerificationTokenExpiry().isBefore(OffsetDateTime.now())) {
            throw new IllegalArgumentException(i18nService.getMessage("auth.error.token_invalid", null, currentLocale));
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiry(null);
        userRepository.save(user);

        String agencyName = "";
        var profileOpt = companyProfileRepository.findByUserId(user.getId());
        if (profileOpt.isPresent()) {
            agencyName = profileOpt.get().getAgencyName();
        }

        String jwt = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_USER");

        return AuthResponse.builder()
                .token(jwt)
                .id(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .subscriptionTier(user.getSubscriptionTier())
                .agencyName(agencyName)
                .emailVerified(true)
                .message(i18nService.getMessage("auth.success.verified", null, currentLocale))
                .build();
    }

    @Transactional
    public void resendVerification(String email) {
        Locale currentLocale = LocaleContextHolder.getLocale();
        String normalizedEmail = email.toLowerCase().trim();

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (user.isEmailVerified()) {
            return;
        }

        String newToken = UUID.randomUUID().toString();
        user.setVerificationToken(newToken);
        user.setVerificationTokenExpiry(OffsetDateTime.now().plusHours(24));
        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), newToken, currentLocale);
    }
}
