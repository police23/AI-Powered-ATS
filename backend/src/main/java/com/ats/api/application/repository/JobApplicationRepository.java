package com.ats.api.application.repository;

import com.ats.api.application.entity.JobApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface JobApplicationRepository extends JpaRepository<JobApplication, UUID> {

    boolean existsByCandidateIdAndJobId(UUID candidateId, UUID jobId);

    Optional<JobApplication> findByCandidateIdAndJobId(UUID candidateId, UUID jobId);

    Page<JobApplication> findByCandidateId(UUID candidateId, Pageable pageable);
}
