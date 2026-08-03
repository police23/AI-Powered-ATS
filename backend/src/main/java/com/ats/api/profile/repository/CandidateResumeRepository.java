package com.ats.api.profile.repository;

import com.ats.api.profile.entity.CandidateResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateResumeRepository extends JpaRepository<CandidateResume, UUID> {
    Optional<CandidateResume> findByUserId(UUID userId);
    void deleteByUserId(UUID userId);
}
