package com.ats.api.job.service.impl;

import com.ats.api.job.dto.response.JobSummaryResponse;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.SavedJob;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobException;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.repository.SavedJobRepository;
import com.ats.api.job.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SavedJobServiceImpl implements SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    @Override
    @Transactional
    public void saveJob(UUID userId, UUID jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException("Không tìm thấy bài tuyển dụng yêu cầu"));

        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new JobException("Bài tuyển dụng hiện không khả dụng để lưu", "JOB_UNAVAILABLE", HttpStatus.BAD_REQUEST);
        }

        if (savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            log.info("Ứng viên userId={} đã lưu bài tuyển dụng jobId={} trước đó", userId, jobId);
            return;
        }

        SavedJob savedJob = SavedJob.builder()
                .userId(userId)
                .job(job)
                .build();

        savedJobRepository.save(savedJob);
        log.info("Ứng viên userId={} đã lưu thành công bài tuyển dụng jobId={}", userId, jobId);
    }

    @Override
    @Transactional
    public void unsaveJob(UUID userId, UUID jobId) {
        if (!savedJobRepository.existsByUserIdAndJobId(userId, jobId)) {
            log.info("Ứng viên userId={} chưa từng lưu bài tuyển dụng jobId={}", userId, jobId);
            return;
        }

        savedJobRepository.deleteByUserIdAndJobId(userId, jobId);
        log.info("Ứng viên userId={} đã bỏ lưu bài tuyển dụng jobId={}", userId, jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<JobSummaryResponse> getSavedJobs(UUID userId) {
        List<SavedJob> savedJobs = savedJobRepository.findAllByUserIdOrderByCreatedAtDesc(userId);
        return savedJobs.stream()
                .map(sj -> JobSummaryResponse.fromEntity(sj.getJob(), true))
                .collect(Collectors.toList());
    }
}
