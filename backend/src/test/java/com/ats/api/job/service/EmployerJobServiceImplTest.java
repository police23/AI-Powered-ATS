package com.ats.api.job.service;

import com.ats.api.application.repository.JobApplicationRepository;
import com.ats.api.common.dto.PageResponse;
import com.ats.api.job.dto.request.CreateJobRequest;
import com.ats.api.job.dto.request.JobStatusUpdateRequest;
import com.ats.api.job.dto.request.UpdateJobRequest;
import com.ats.api.job.dto.response.EmployerJobDetailResponse;
import com.ats.api.job.dto.response.EmployerJobSummaryResponse;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.exception.JobException;
import com.ats.api.job.exception.JobNotFoundException;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.service.impl.EmployerJobServiceImpl;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmployerJobServiceImplTest {

    @Mock
    private JobRepository jobRepository;

    @Mock
    private JobApplicationRepository applicationRepository;

    @InjectMocks
    private EmployerJobServiceImpl employerJobService;

    private UUID userId;
    private UUID jobId;
    private Job job;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        jobId = UUID.randomUUID();

        job = Job.builder()
                .id(jobId)
                .employerId(userId)
                .title("Software Engineer")
                .companyName("TechCorp")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ONE_TO_TWO)
                .salaryMin(new BigDecimal("15000000"))
                .salaryMax(new BigDecimal("25000000"))
                .isNegotiableSalary(false)
                .currency("VND")
                .description("Sample description")
                .status(JobStatus.PUBLISHED)
                .viewsCount(10)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("Tạo mới bài tuyển dụng thành công khi thông tin hợp lệ")
    void createJob_whenValidInput_shouldReturnDetailResponse() {
        CreateJobRequest request = CreateJobRequest.builder()
                .title("Software Engineer")
                .companyName("TechCorp")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ONE_TO_TWO)
                .salaryMin(new BigDecimal("15000000"))
                .salaryMax(new BigDecimal("25000000"))
                .isNegotiableSalary(false)
                .description("Sample description")
                .status(JobStatus.PUBLISHED)
                .build();

        when(jobRepository.save(any(Job.class))).thenReturn(job);

        EmployerJobDetailResponse response = employerJobService.createJob(userId, false, request);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("Software Engineer");
        assertThat(response.getCompanyName()).isEqualTo("TechCorp");
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    @DisplayName("Ném ngoại lệ khi mức lương tối thiểu lớn hơn mức lương tối đa")
    void createJob_whenMinSalaryGreaterThanMax_shouldThrowException() {
        CreateJobRequest request = CreateJobRequest.builder()
                .title("Software Engineer")
                .companyName("TechCorp")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ONE_TO_TWO)
                .salaryMin(new BigDecimal("30000000"))
                .salaryMax(new BigDecimal("20000000"))
                .isNegotiableSalary(false)
                .description("Sample description")
                .build();

        assertThatThrownBy(() -> employerJobService.createJob(userId, false, request))
                .isInstanceOf(JobException.class)
                .hasMessageContaining("Mức lương tối thiểu không thể lớn hơn mức lương tối đa");
    }

    @Test
    @DisplayName("Lấy danh sách tin tuyển dụng của Employer phân trang thành công")
    void getEmployerJobs_shouldReturnPageResponse() {
        when(jobRepository.findByEmployerId(any(UUID.class), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(job)));

        PageResponse<EmployerJobSummaryResponse> response = employerJobService.getEmployerJobs(userId, false, null, null, 0, 10);

        assertThat(response).isNotNull();
        assertThat(response.getContent()).hasSize(1);
        assertThat(response.getContent().get(0).getTitle()).isEqualTo("Software Engineer");
    }

    @Test
    @DisplayName("Chỉnh sửa bài tuyển dụng thành công khi là chính chủ sở hữu")
    void updateJob_whenOwner_shouldUpdateSuccessfully() {
        UpdateJobRequest request = UpdateJobRequest.builder()
                .title("Senior Software Engineer")
                .companyName("TechCorp")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .salaryMin(new BigDecimal("20000000"))
                .salaryMax(new BigDecimal("35000000"))
                .isNegotiableSalary(false)
                .description("Updated description")
                .status(JobStatus.PUBLISHED)
                .build();

        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        EmployerJobDetailResponse response = employerJobService.updateJob(userId, false, jobId, request);

        assertThat(response).isNotNull();
        verify(jobRepository).save(job);
    }

    @Test
    @DisplayName("Ném ngoại lệ 403 khi chỉnh sửa bài tuyển dụng của người khác")
    void updateJob_whenNotOwner_shouldThrowJobAccessDeniedException() {
        UUID otherUser = UUID.randomUUID();
        UpdateJobRequest request = UpdateJobRequest.builder()
                .title("Senior Software Engineer")
                .companyName("TechCorp")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .description("Updated description")
                .status(JobStatus.PUBLISHED)
                .build();

        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> employerJobService.updateJob(otherUser, false, jobId, request))
                .isInstanceOf(JobException.class)
                .hasMessageContaining("Bạn không có quyền thao tác");
    }

    @Test
    @DisplayName("Đổi trạng thái bài tuyển dụng thành công")
    void updateJobStatus_whenOwner_shouldUpdateStatus() {
        JobStatusUpdateRequest request = JobStatusUpdateRequest.builder()
                .status(JobStatus.CLOSED)
                .build();

        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));
        when(jobRepository.save(any(Job.class))).thenReturn(job);

        EmployerJobDetailResponse response = employerJobService.updateJobStatus(userId, false, jobId, request);

        assertThat(response).isNotNull();
        verify(jobRepository).save(job);
    }

    @Test
    @DisplayName("Xóa bài tuyển dụng thành công khi là chính chủ")
    void deleteJob_whenOwner_shouldDeleteSuccessfully() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.of(job));

        employerJobService.deleteJob(userId, false, jobId);

        verify(jobRepository).delete(job);
    }

    @Test
    @DisplayName("Ném ngoại lệ 404 khi bài tuyển dụng không tồn tại")
    void getJob_whenNotFound_shouldThrowJobNotFoundException() {
        when(jobRepository.findById(jobId)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> employerJobService.getEmployerJobDetail(userId, false, jobId))
                .isInstanceOf(JobNotFoundException.class);
    }
}
