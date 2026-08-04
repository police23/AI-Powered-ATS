package com.ats.api.job.service;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobException;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.service.impl.JobSearchServiceImpl;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobDetailTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobSearchServiceImpl jobSearchService;

    private UUID jobId;
    private Job publishedJob;
    private Job draftJob;

    @BeforeEach
    void setUp() {
        jobId = UUID.randomUUID();

        publishedJob = Job.builder()
                .id(jobId)
                .companyName("Tech Corp")
                .title("Fullstack Developer")
                .description("Job description content")
                .requirements("Job requirements content")
                .benefits("Job benefits content")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ONE_TO_TWO)
                .status(JobStatus.PUBLISHED)
                .viewsCount(10)
                .build();

        draftJob = Job.builder()
                .id(UUID.randomUUID())
                .companyName("Tech Corp")
                .title("Draft Job")
                .status(JobStatus.DRAFT)
                .build();
    }

    @Test
    @DisplayName("getJobDetail - Should return job details and increment view count")
    void shouldReturnJobDetailAndIncrementViews() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(publishedJob));
        when(jobRepository.save(any(Job.class))).thenAnswer(i -> i.getArgument(0));

        var response = jobSearchService.getJobDetail(jobId);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Fullstack Developer");
        assertThat(response.getViewsCount()).isEqualTo(11);

        verify(jobRepository).save(publishedJob);
    }

    @Test
    @DisplayName("getJobDetail - Should throw JobNotFoundException when job does not exist")
    void shouldThrowJobNotFoundException() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobSearchService.getJobDetail(jobId))
                .isInstanceOf(JobNotFoundException.class);
    }

    @Test
    @DisplayName("getJobDetail - Should throw JobException when job status is DRAFT")
    void shouldThrowExceptionWhenJobIsDraft() {
        UUID draftId = draftJob.getId();
        when(jobRepository.findById(draftId)).thenReturn(Optional.of(draftJob));

        assertThatThrownBy(() -> jobSearchService.getJobDetail(draftId))
                .isInstanceOf(JobException.class);
    }
}
