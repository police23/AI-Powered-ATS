package com.ats.api.job.controller;

import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.UUID;

import static org.hamcrest.Matchers.greaterThanOrEqualTo;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class JobSearchControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JobRepository jobRepository;

    private Job sampleJob;

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();

        sampleJob = Job.builder()
                .companyName("TechNova Inc")
                .companyLogo("https://example.com/logo.png")
                .title("Fullstack Developer")
                .description("Build innovative SaaS products")
                .city("HCM")
                .addressDetail("District 1")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.TWO_TO_THREE)
                .salaryMin(new BigDecimal("25000000"))
                .salaryMax(new BigDecimal("35000000"))
                .status(JobStatus.PUBLISHED)
                .viewsCount(10)
                .build();

        sampleJob = jobRepository.save(sampleJob);
    }

    @Test
    @DisplayName("GET /api/v1/jobs/search - Public search should return 200 OK without authentication")
    void shouldReturn200OKForPublicJobSearch() throws Exception {
        mockMvc.perform(get("/api/v1/jobs/search")
                        .param("keyword", "Fullstack")
                        .param("city", "HCM"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content", hasSize(1)))
                .andExpect(jsonPath("$.content[0].title").value("Fullstack Developer"))
                .andExpect(jsonPath("$.content[0].companyName").value("TechNova Inc"));
    }

    @Test
    @DisplayName("GET /api/v1/jobs/{jobId} - Public get job detail should return 200 OK and increment views")
    void shouldReturnJobDetailAndIncrementViews() throws Exception {
        mockMvc.perform(get("/api/v1/jobs/{jobId}", sampleJob.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(sampleJob.getId().toString()))
                .andExpect(jsonPath("$.viewsCount", greaterThanOrEqualTo(11)));
    }
}
