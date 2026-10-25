package com.tenderai.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final I18nService i18nService;
    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Value("${spring.mail.username:}")
    private String fromEmail;

    public EmailService(I18nService i18nService, @Autowired(required = false) JavaMailSender mailSender) {
        this.i18nService = i18nService;
        this.mailSender = mailSender;
    }

    public void sendVerificationEmail(String recipientEmail, String recipientName, String token, Locale locale) {
        String verificationUrl = frontendUrl + "/auth/verify-email?token=" + token;

        String subject = i18nService.getMessage("email.verification.subject", null, locale);
        String title = i18nService.getMessage("email.verification.title", null, locale);
        String greeting = i18nService.getMessage("email.verification.greeting", new Object[]{recipientName != null ? recipientName : ""}, locale);
        String body = i18nService.getMessage("email.verification.body", null, locale);
        String buttonText = i18nService.getMessage("email.verification.button", null, locale);
        String expiryText = i18nService.getMessage("email.verification.expiry", null, locale);
        String footerText = i18nService.getMessage("email.verification.footer", null, locale);

        String htmlContent = buildHtmlTemplate(title, greeting, body, verificationUrl, buttonText, expiryText, footerText);

        log.info("📧 Verification link for [{}]: {}", recipientEmail, verificationUrl);

        if (mailSender != null && fromEmail != null && !fromEmail.isBlank()) {
            try {
                MimeMessage message = mailSender.createMimeMessage();
                MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
                helper.setFrom(fromEmail);
                helper.setTo(recipientEmail);
                helper.setSubject(subject);
                helper.setText(htmlContent, true);
                mailSender.send(message);
                log.info("Verification email successfully dispatched to {}", recipientEmail);
            } catch (Exception e) {
                log.warn("Could not dispatch SMTP email (simulated delivery via log above): {}", e.getMessage());
            }
        }
    }

    private String buildHtmlTemplate(String title, String greeting, String body, String actionUrl,
                                     String buttonText, String expiryText, String footerText) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <style>
                body { margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc; }
                .container { max-width: 580px; margin: 40px auto; background-color: #0f172a; border: 1px solid #1e293b; border-radius: 16px; overflow: hidden; }
                .header { background: linear-gradient(135deg, #1e1b4b 0%%, #312e81 100%%); padding: 32px 40px; text-align: center; }
                .logo { font-size: 24px; font-weight: 700; color: #ffffff; letter-spacing: -0.5px; }
                .logo span { color: #818cf8; }
                .content { padding: 40px; }
                h1 { font-size: 20px; font-weight: 600; color: #ffffff; margin-top: 0; }
                p { font-size: 14px; line-height: 1.6; color: #94a3b8; margin: 16px 0; }
                .btn-container { text-align: center; margin: 32px 0; }
                .btn { display: inline-block; background-color: #4f46e5; color: #ffffff !important; text-decoration: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 10px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); }
                .link-fallback { font-size: 11px; color: #64748b; word-break: break-all; margin-top: 24px; }
                .footer { padding: 24px 40px; background-color: #090d16; border-top: 1px solid #1e293b; font-size: 11px; color: #64748b; text-align: center; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <div class="logo">Tender<span>AI</span></div>
                </div>
                <div class="content">
                  <h1>%s</h1>
                  <p><strong>%s</strong></p>
                  <p>%s</p>
                  <div class="btn-container">
                    <a href="%s" class="btn" target="_blank">%s</a>
                  </div>
                  <p style="font-size: 12px; color: #64748b;">%s</p>
                  <div class="link-fallback">
                    Direct link: <a href="%s" style="color: #818cf8;">%s</a>
                  </div>
                </div>
                <div class="footer">
                  %s
                </div>
              </div>
            </body>
            </html>
            """.formatted(title, greeting, body, actionUrl, buttonText, expiryText, actionUrl, actionUrl, footerText);
    }
}
