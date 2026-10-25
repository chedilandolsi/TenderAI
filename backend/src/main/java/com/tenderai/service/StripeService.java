package com.tenderai.service;

import com.stripe.Stripe;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Event;
import com.stripe.model.checkout.Session;
import com.stripe.net.Webhook;
import com.stripe.param.checkout.SessionCreateParams;
import com.tenderai.domain.SubscriptionTier;
import com.tenderai.domain.User;
import com.tenderai.dto.CheckoutRequest;
import com.tenderai.dto.CheckoutResponse;
import com.tenderai.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StripeService {

    private static final Logger log = LoggerFactory.getLogger(StripeService.class);

    private final UserRepository userRepository;

    @Value("${app.stripe.api-key:${STRIPE_SECRET_KEY:}}")
    private String stripeApiKey;

    @Value("${app.stripe.webhook-secret:${STRIPE_WEBHOOK_SECRET:}}")
    private String webhookSecret;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    public static final long PRO_PRICE_CENTS = 4900L;     // €49.00 EUR
    public static final long AGENCY_PRICE_CENTS = 14900L;  // €149.00 EUR

    @PostConstruct
    public void init() {
        if (StringUtils.hasText(stripeApiKey)) {
            Stripe.apiKey = stripeApiKey;
        }
    }

    public CheckoutResponse createCheckoutSession(User user, CheckoutRequest request) throws StripeException {
        String tierStr = request.getPlanTier().toUpperCase();
        SubscriptionTier tier;
        long amountCents;
        String planName;

        if ("AGENCY".equals(tierStr)) {
            tier = SubscriptionTier.AGENCY;
            amountCents = AGENCY_PRICE_CENTS;
            planName = "TenderAI Agency Plan (€149/month)";
        } else {
            tier = SubscriptionTier.PRO;
            amountCents = PRO_PRICE_CENTS;
            planName = "TenderAI Pro Plan (€49/month)";
        }

        String successUrl = StringUtils.hasText(request.getSuccessUrl())
                ? request.getSuccessUrl()
                : frontendUrl + "/billing?status=success&session_id={CHECKOUT_SESSION_ID}";

        String cancelUrl = StringUtils.hasText(request.getCancelUrl())
                ? request.getCancelUrl()
                : frontendUrl + "/billing?status=cancelled";

        if (StringUtils.hasText(stripeApiKey) && stripeApiKey.startsWith("sk_")) {
            SessionCreateParams params = SessionCreateParams.builder()
                    .setMode(SessionCreateParams.Mode.SUBSCRIPTION)
                    .setCustomerEmail(user.getEmail())
                    .setSuccessUrl(successUrl)
                    .setCancelUrl(cancelUrl)
                    .putMetadata("userId", user.getId().toString())
                    .putMetadata("planTier", tier.name())
                    .addLineItem(
                            SessionCreateParams.LineItem.builder()
                                    .setQuantity(1L)
                                    .setPriceData(
                                            SessionCreateParams.LineItem.PriceData.builder()
                                                    .setCurrency("eur")
                                                    .setUnitAmount(amountCents)
                                                    .setRecurring(
                                                            SessionCreateParams.LineItem.PriceData.Recurring.builder()
                                                                    .setInterval(SessionCreateParams.LineItem.PriceData.Recurring.Interval.MONTH)
                                                                    .build()
                                                    )
                                                    .setProductData(
                                                            SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                                                    .setName(planName)
                                                                    .setDescription("Unlimited European Tender proposals, PDF/DOCX exports & team collaboration.")
                                                                    .build()
                                                    )
                                                    .build()
                                    )
                                    .build()
                    )
                    .build();

            Session session = Session.create(params);
            return CheckoutResponse.builder()
                    .checkoutUrl(session.getUrl())
                    .sessionId(session.getId())
                    .planTier(tier.name())
                    .amountCents(amountCents)
                    .currency("EUR")
                    .build();
        }

        // Demo / Fallback mode when live Stripe credentials are not yet entered
        String mockSessionId = "cs_demo_" + UUID.randomUUID().toString().substring(0, 12);
        String mockCheckoutUrl = successUrl.replace("{CHECKOUT_SESSION_ID}", mockSessionId) + "&tier=" + tier.name();

        return CheckoutResponse.builder()
                .checkoutUrl(mockCheckoutUrl)
                .sessionId(mockSessionId)
                .planTier(tier.name())
                .amountCents(amountCents)
                .currency("EUR")
                .build();
    }

    @Transactional
    public void handleSuccessfulCheckout(String sessionId, Long userId, String tierStr) {
        log.info("Processing successful subscription upgrade: user={}, tier={}, session={}", userId, tierStr, sessionId);
        userRepository.findById(userId).ifPresent(user -> {
            try {
                SubscriptionTier tier = SubscriptionTier.valueOf(tierStr.toUpperCase());
                user.setSubscriptionTier(tier);
                user.setStripeSubscriptionId(sessionId);
                userRepository.save(user);
                log.info("User {} successfully upgraded to tier {}", user.getEmail(), tier);
            } catch (Exception e) {
                log.error("Failed to parse tier: {}", tierStr);
            }
        });
    }

    @Transactional
    public void processWebhookEvent(String payload, String sigHeader) {
        Event event;
        if (StringUtils.hasText(webhookSecret)) {
            try {
                event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
            } catch (SignatureVerificationException e) {
                log.error("Invalid Stripe signature: {}", e.getMessage());
                throw new IllegalArgumentException("Invalid signature");
            }
        } else {
            try {
                event = com.stripe.model.Event.GSON.fromJson(payload, Event.class);
            } catch (Exception e) {
                log.error("Error deserializing Stripe event: {}", e.getMessage());
                return;
            }
        }

        log.info("Received Stripe webhook event: {}", event.getType());

        if ("checkout.session.completed".equals(event.getType())) {
            event.getDataObjectDeserializer().getObject().ifPresent(obj -> {
                if (obj instanceof Session session) {
                    String userIdStr = session.getMetadata() != null ? session.getMetadata().get("userId") : null;
                    String tierStr = session.getMetadata() != null ? session.getMetadata().get("planTier") : null;
                    if (userIdStr != null && tierStr != null) {
                        handleSuccessfulCheckout(session.getId(), Long.valueOf(userIdStr), tierStr);
                    }
                }
            });
        }
    }
}
