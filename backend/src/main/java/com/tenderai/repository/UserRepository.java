package com.tenderai.repository;

import com.tenderai.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByStripeCustomerId(String stripeCustomerId);
    Optional<User> findByVerificationToken(String verificationToken);
    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
