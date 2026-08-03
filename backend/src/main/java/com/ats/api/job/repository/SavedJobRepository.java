package com.ats.api.job.repository;

import com.ats.api.job.entity.SavedJob;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface SavedJobRepository extends JpaRepository<SavedJob, UUID> {

    boolean existsByUserIdAndJobId(UUID userId, UUID jobId);

    Optional<SavedJob> findByUserIdAndJobId(UUID userId, UUID jobId);

    List<SavedJob> findAllByUserIdOrderByCreatedAtDesc(UUID userId);

    void deleteByUserIdAndJobId(UUID userId, UUID jobId);

    @Query("SELECT sj.job.id FROM SavedJob sj WHERE sj.userId = :userId")
    Set<UUID> findSavedJobIdsByUserId(@Param("userId") UUID userId);
}
