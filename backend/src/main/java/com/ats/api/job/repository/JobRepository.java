package com.ats.api.job.repository;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface JobRepository extends JpaRepository<Job, UUID>, JpaSpecificationExecutor<Job> {

    Page<Job> findByEmployerId(UUID employerId, Pageable pageable);

    Page<Job> findByEmployerIdAndStatus(UUID employerId, JobStatus status, Pageable pageable);

    Page<Job> findByEmployerIdAndTitleContainingIgnoreCase(UUID employerId, String title, Pageable pageable);

    Page<Job> findByEmployerIdAndStatusAndTitleContainingIgnoreCase(UUID employerId, JobStatus status, String title, Pageable pageable);
}
