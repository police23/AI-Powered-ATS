package com.ats.api.profile.repository;

import com.ats.api.profile.entity.CandidateResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface CandidateResumeRepository extends JpaRepository<CandidateResume, UUID> {
    Optional<CandidateResume> findByUserId(UUID userId);
    List<CandidateResume> findAllByUserIdOrderByCreatedAtDesc(UUID userId);
    Optional<CandidateResume> findByIdAndUserId(UUID id, UUID userId);
    Optional<CandidateResume> findByUserIdAndIsDefaultTrue(UUID userId);
    Optional<CandidateResume> findFirstByUserIdOrderByCreatedAtDesc(UUID userId);
    long countByUserId(UUID userId);

    @Modifying
    @Query("UPDATE CandidateResume c SET c.isDefault = false WHERE c.userId = :userId")
    void clearDefaultResumesByUserId(@Param("userId") UUID userId);

    void deleteByUserId(UUID userId);
}
