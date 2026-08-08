package com.ats.api.application.service;

import com.ats.api.application.dto.request.CreateApplicationRequest;
import com.ats.api.application.dto.response.ApplicationCheckResponse;
import com.ats.api.application.dto.response.ApplicationResponse;
import com.ats.api.application.entity.JobApplication;
import com.ats.api.application.entity.enums.ApplicationStatus;
import com.ats.api.application.repository.JobApplicationRepository;
import com.ats.api.application.service.impl.CandidateApplicationServiceImpl;
import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.ProfileException;
import com.ats.api.profile.repository.CandidateResumeRepository;
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
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CandidateApplicationServiceTest {

    @Mock
    private JobApplicationRepository applicationRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private CandidateResumeRepository resumeRepository;

    @InjectMocks
    private CandidateApplicationServiceImpl applicationService;

    private UUID candidateId;
    private UUID jobId;
    private UUID resumeId;
    private User candidate;
    private Job job;
    private CandidateResume resume;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();
        jobId = UUID.randomUUID();
        resumeId = UUID.randomUUID();

        candidate = User.builder()
                .id(candidateId)
                .email("candidate@ats.com")
                .role(UserRole.CANDIDATE)
                .build();

        job = Job.builder()
                .id(jobId)
                .title("Senior Java Developer")
                .status(JobStatus.PUBLISHED)
                .build();

        resume = CandidateResume.builder()
                .id(resumeId)
                .userId(candidateId)
                .title("CV_Java_Senior.pdf")
                .fileName("CV_Java_Senior.pdf")
                .filePath("http://localhost:8080/files/cv.pdf")
                .fileSizeBytes(1024L)
                .build();
    }

    @Test
    @DisplayName("Nộp hồ sơ ứng tuyển thành công")
    void applyForJob_Success() {
        CreateApplicationRequest request = CreateApplicationRequest.builder()
                .jobId(jobId)
                .resumeId(resumeId)
                .build();

        when(userRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)).thenReturn(false);
        when(resumeRepository.findById(resumeId)).thenReturn(Optional.of(resume));
        when(applicationRepository.save(any(JobApplication.class))).thenAnswer(invocation -> {
            JobApplication app = invocation.getArgument(0);
            app.setId(UUID.randomUUID());
            return app;
        });

        ApplicationResponse response = applicationService.applyForJob(candidateId, request);

        assertThat(response).isNotNull();
        assertThat(response.getJobId()).isEqualTo(jobId);
        assertThat(response.getResumeId()).isEqualTo(resumeId);
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
        verify(applicationRepository).save(any(JobApplication.class));
    }

    @Test
    @DisplayName("Nộp hồ sơ thất bại khi đã ứng tuyển công việc này trước đó")
    void applyForJob_AlreadyApplied_ThrowsException() {
        CreateApplicationRequest request = CreateApplicationRequest.builder()
                .jobId(jobId)
                .resumeId(resumeId)
                .build();

        when(userRepository.findById(candidateId)).thenReturn(Optional.of(candidate));
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)).thenReturn(true);

        assertThatThrownBy(() -> applicationService.applyForJob(candidateId, request))
                .isInstanceOf(ProfileException.class)
                .hasMessageContaining("Bạn đã nộp hồ sơ ứng tuyển vào công việc này trước đó");

        verify(applicationRepository, never()).save(any());
    }

    @Test
    @DisplayName("Kiểm tra trạng thái đã ứng tuyển chưa (trả về true)")
    void checkApplicationStatus_AlreadyApplied() {
        when(applicationRepository.existsByCandidateIdAndJobId(candidateId, jobId)).thenReturn(true);
        JobApplication mockApp = JobApplication.builder()
                .id(UUID.randomUUID())
                .candidate(candidate)
                .job(job)
                .resume(resume)
                .status(ApplicationStatus.APPLIED)
                .build();
        when(applicationRepository.findByCandidateIdAndJobId(candidateId, jobId)).thenReturn(Optional.of(mockApp));

        ApplicationCheckResponse response = applicationService.checkApplicationStatus(candidateId, jobId);

        assertThat(response.isApplied()).isTrue();
        assertThat(response.getStatus()).isEqualTo(ApplicationStatus.APPLIED);
    }
}
