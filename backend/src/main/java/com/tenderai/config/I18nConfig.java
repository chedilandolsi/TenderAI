package com.tenderai.config;

import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.AcceptHeaderLocaleResolver;

import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Locale;

@Configuration
public class I18nConfig {

    public static final Locale LOCALE_EN = Locale.ENGLISH;
    public static final Locale LOCALE_FR = Locale.FRENCH;
    public static final Locale LOCALE_DE = Locale.GERMAN;
    public static final Locale LOCALE_ES = new Locale("es");
    public static final Locale LOCALE_IT = Locale.ITALIAN;

    @Bean
    public LocaleResolver localeResolver() {
        AcceptHeaderLocaleResolver resolver = new AcceptHeaderLocaleResolver();
        resolver.setDefaultLocale(LOCALE_EN);
        resolver.setSupportedLocales(Arrays.asList(
                LOCALE_EN,
                LOCALE_FR,
                LOCALE_DE,
                LOCALE_ES,
                LOCALE_IT
        ));
        return resolver;
    }

    @Bean
    public MessageSource messageSource() {
        ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
        messageSource.setBasename("classpath:i18n/messages");
        messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
        messageSource.setDefaultLocale(LOCALE_EN);
        messageSource.setFallbackToSystemLocale(false);
        return messageSource;
    }
}
