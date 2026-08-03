package com.ats.api.job.controller;

import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.job.entity.Job;
import com.ats.api.job.entity.enums.EmploymentType;
import com.ats.api.job.entity.enums.JobStatus;
import com.ats.api.job.repository.JobRepository;
import com.ats.api.job.repository.SavedJobRepository;
import com.ats.api.profile.entity.ExperienceLevel;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SavedJobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SavedJobRepository savedJobRepository;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User candidateUser;
    private String candidateToken;
    private User hrUser;
    private String hrToken;
    private Job sampleJob;

    @BeforeEach
    void setUp() {
        savedJobRepository.deleteAll();
        jobRepository.deleteAll();
        userRepository.deleteAll();

        candidateUser = User.builder()
                .email("candidate_saved_job_test@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .build();
        candidateUser = userRepository.save(candidateUser);
        candidateToken = jwtTokenProvider.generateAccessToken(candidateUser);

        hrUser = User.builder()
                .email("hr_saved_job_test@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.HR)
                .status(AccountStatus.ACTIVE)
                .build();
        hrUser = userRepository.save(hrUser);
        hrToken = jwtTokenProvider.generateAccessToken(hrUser);

        sampleJob = Job.builder()
                .companyName("Saved Job Company")
                .title("Software Engineer")
                .description("Desc")
                .city("HCM")
                .employmentType(EmploymentType.FULL_TIME)
                .experienceLevel(ExperienceLevel.ONE_TO_TWO)
                .status(JobStatus.PUBLISHED)
                .build();
        sampleJob = jobRepository.save(sampleJob);
    }

    @Test
    @DisplayName("POST /api/v1/candidates/me/saved-jobs/{jobId} - Should save job for CANDIDATE")
    void shouldSaveJobForCandidate() throws Exception {
        mockMvc.perform(post("/api/v1/candidates/me/saved-jobs/{jobId}", sampleJob.getId())
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đã lưu tin tuyển dụng thành công"));
    }

    @Test
    @DisplayName("POST /api/v1/candidates/me/saved-jobs/{jobId} - Should return 403 for HR role")
    void shouldReturn403ForHR() throws Exception {
        mockMvc.perform(post("/api/v1/candidates/me/saved-jobs/{jobId}", sampleJob.getId())
                        .header("Authorization", "Bearer " + hrToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("GET /api/v1/candidates/me/saved-jobs - Should return list of saved jobs")
    void shouldReturnSavedJobsList() throws Exception {
        // Save first
        mockMvc.perform(post("/api/v1/candidates/me/saved-jobs/{jobId}", sampleJob.getId())
                .header("Authorization", "Bearer " + candidateToken));

        mockMvc.perform(get("/api/v1/candidates/me/saved-jobs")
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Software Engineer"))
                .andExpect(jsonPath("$[0].isSaved").value(true));
    }

    @Test
    @DisplayName("DELETE /api/v1/candidates/me/saved-jobs/{jobId} - Should unsave job")
    void shouldUnsaveJob() throws Exception {
        // Save first
        mockMvc.perform(post("/api/v1/candidates/me/saved-jobs/{jobId}", sampleJob.getId())
                .header("Authorization", "Bearer " + candidateToken));

        mockMvc.perform(delete("/api/v1/candidates/me/saved-jobs/{jobId}", sampleJob.getId())
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đã bỏ lưu tin tuyển dụng thành công"));
    }
}
