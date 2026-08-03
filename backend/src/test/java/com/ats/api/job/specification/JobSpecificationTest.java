package com.ats.api.job.specification;

import com.ats.api.job.dto.request.JobSearchFilterRequest;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class JobSpecificationTest {

    @Autowired
    private JobRepository jobRepository;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();

        Job job1 = Job.builder()
                .companyName("TechCorp")
                .title("React Developer")
                .description("React Dev Needed")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.TWO_TO_THREE)
                .salaryMin(new BigDecimal("20000000"))
                .salaryMax(new BigDecimal("30000000"))
                .status(JobStatus.PUBLISHED)
                .build();

        Job job2 = Job.builder()
                .companyName("DevCorp")
                .title("Java Spring Developer")
                .description("Java Dev Needed")
                .city("HN")
                .employmentType(EmploymentType.REMOTE)
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .salaryMin(new BigDecimal("35000000"))
                .salaryMax(new BigDecimal("50000000"))
                .status(JobStatus.PUBLISHED)
                .build();

        Job draftJob = Job.builder()
                .companyName("DraftCorp")
                .title("React Native Developer Draft")
                .description("Draft Job")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.FRESHER)
                .status(JobStatus.DRAFT)
                .build();

        jobRepository.saveAll(List.of(job1, job2, draftJob));
    }

    @Test
    @DisplayName("filterJobs - Should return only PUBLISHED jobs")
    void shouldReturnOnlyPublishedJobs() {
        JobSearchFilterRequest filter = new JobSearchFilterRequest();
        List<Job> results = jobRepository.findAll(JobSpecification.filterJobs(filter));

        assertThat(results).hasSize(2);
        assertThat(results).extracting(Job::getStatus).containsOnly(JobStatus.PUBLISHED);
    }

    @Test
    @DisplayName("filterJobs - Should filter by keyword")
    void shouldFilterByKeyword() {
        JobSearchFilterRequest filter = JobSearchFilterRequest.builder()
                .keyword("React")
                .build();

        List<Job> results = jobRepository.findAll(JobSpecification.filterJobs(filter));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getTitle()).contains("React");
    }

    @Test
    @DisplayName("filterJobs - Should filter by city and employment type")
    void shouldFilterByCityAndEmploymentType() {
        JobSearchFilterRequest filter = JobSearchFilterRequest.builder()
                .city("HN")
                .employmentType(EmploymentType.REMOTE)
                .build();

        List<Job> results = jobRepository.findAll(JobSpecification.filterJobs(filter));

        assertThat(results).hasSize(1);
        assertThat(results.get(0).getCity()).isEqualTo("HN");
        assertThat(results.get(0).getEmploymentType()).isEqualTo(EmploymentType.REMOTE);
    }
}
