package com.tenderai.config;

import com.tenderai.domain.CompanyProfile;
import com.tenderai.domain.SubscriptionTier;
import com.tenderai.domain.User;
import com.tenderai.repository.CompanyProfileRepository;
import com.tenderai.repository.UserRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final UserRepository userRepository;
    private final CompanyProfileRepository companyProfileRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {
        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String sub = oAuth2User.getAttribute("sub");

        if (email == null) {
            log.error("OAuth2 user does not have an email attribute");
            response.sendRedirect(frontendUrl + "/auth/login?error=email_not_provided");
            return;
        }

        email = email.toLowerCase().trim();

        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null) {
            // Register new OAuth2 user
            user = User.builder()
                    .email(email)
                    .fullName(name != null ? name : "Google User")
                    .provider("GOOGLE")
                    .providerId(sub)
                    .emailVerified(true)
                    .subscriptionTier(SubscriptionTier.FREE)
                    .build();

            user = userRepository.save(user);

            CompanyProfile profile = CompanyProfile.builder()
                    .user(user)
                    .agencyName((name != null ? name : "European") + " Consultancy")
                    .tagline("European Public Procurement Consulting")
                    .coreCompetencies("Public Sector Digitization, Tender Bid Management, EU Directive Alignment")
                    .caseStudies("[]")
                    .build();

            companyProfileRepository.save(profile);
            log.info("New user registered via Google OAuth2: {}", email);
        } else {
            // Link provider and verify email if not already
            if (!user.isEmailVerified()) {
                user.setEmailVerified(true);
            }
            if (user.getProvider() == null || "LOCAL".equals(user.getProvider())) {
                user.setProvider("GOOGLE");
                user.setProviderId(sub);
            }
            if (name != null && (user.getFullName() == null || user.getFullName().isBlank())) {
                user.setFullName(name);
            }
            userRepository.save(user);
            log.info("Existing user logged in via Google OAuth2: {}", email);
        }

        String token = jwtTokenProvider.generateToken(user.getId(), user.getEmail(), "ROLE_USER");

        // Set secure HTTP-only cookie
        Cookie jwtCookie = new Cookie("tenderai_jwt", token);
        jwtCookie.setPath("/");
        jwtCookie.setHttpOnly(true);
        jwtCookie.setMaxAge(86400); // 24 hours
        response.addCookie(jwtCookie);

        String targetUrl = frontendUrl + "/auth/oauth2/callback?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8);
        getRedirectStrategy().sendRedirect(request, response, targetUrl);
    }
}
