package com.ats.api.job.service;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.SavedJob;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.repository.SavedJobRepository;
import com.ats.api.job.service.impl.SavedJobServiceImpl;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class SavedJobServiceImplTest {

    @Mock
    private SavedJobRepository savedJobRepository;

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private SavedJobServiceImpl savedJobService;

    private UUID userId;
    private UUID jobId;
    private Job sampleJob;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        jobId = UUID.randomUUID();

        sampleJob = Job.builder()
                .id(jobId)
                .companyName("ATS Tech")
                .title("Senior Developer")
                .description("Desc")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .status(JobStatus.PUBLISHED)
                .build();
    }

    @Test
    @DisplayName("saveJob - Should save job successfully for candidate")
    void shouldSaveJobSuccessfully() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(sampleJob));
        when(savedJobRepository.existsByUserIdAndJobId(userId, jobId)).thenReturn(false);

        savedJobService.saveJob(userId, jobId);

        verify(savedJobRepository).save(any(SavedJob.class));
    }

    @Test
    @DisplayName("saveJob - Should do nothing if job already saved")
    void shouldDoNothingIfAlreadySaved() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(sampleJob));
        when(savedJobRepository.existsByUserIdAndJobId(userId, jobId)).thenReturn(true);

        savedJobService.saveJob(userId, jobId);

        verify(savedJobRepository, never()).save(any());
    }

    @Test
    @DisplayName("saveJob - Should throw JobNotFoundException when job does not exist")
    void shouldThrowExceptionWhenJobNotFound() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> savedJobService.saveJob(userId, jobId))
                .isInstanceOf(JobNotFoundException.class);
    }

    @Test
    @DisplayName("unsaveJob - Should delete saved job successfully")
    void shouldUnsaveJobSuccessfully() {
        when(savedJobRepository.existsByUserIdAndJobId(userId, jobId)).thenReturn(true);

        savedJobService.unsaveJob(userId, jobId);

        verify(savedJobRepository).deleteByUserIdAndJobId(userId, jobId);
    }

    @Test
    @DisplayName("getSavedJobs - Should return list of saved job summaries")
    void shouldReturnSavedJobsList() {
        SavedJob savedJob = SavedJob.builder()
                .userId(userId)
                .job(sampleJob)
                .build();

        when(savedJobRepository.findAllByUserIdOrderByCreatedAtDesc(userId)).thenReturn(List.of(savedJob));

        var result = savedJobService.getSavedJobs(userId);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(jobId);
        assertThat(result.get(0).isSaved()).isTrue();
    }
}
