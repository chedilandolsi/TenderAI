package com.tenderai.repository;

import com.tenderai.domain.Proposal;
import com.tenderai.domain.ProposalStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProposalRepository extends JpaRepository<Proposal, Long> {
    List<Proposal> findAllByUserIdOrderByCreatedAtDesc(Long userId);
    Page<Proposal> findAllByUserId(Long userId, Pageable pageable);
    Optional<Proposal> findByIdAndUserId(Long id, Long userId);
    long countByUserId(Long userId);
    long countByUserIdAndStatus(Long userId, ProposalStatus status);
}
