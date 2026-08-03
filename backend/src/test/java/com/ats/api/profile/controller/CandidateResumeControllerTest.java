package com.ats.api.profile.controller;

import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.profile.dto.request.UpdateResumeTitleRequest;
import com.ats.api.profile.dto.response.CandidateResumeResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.service.CandidateResumeService;
import com.ats.api.profile.service.FileStorageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@Transactional
class CandidateResumeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @MockBean
    private CandidateResumeService candidateResumeService;

    @MockBean
    private FileStorageService fileStorageService;

    private User candidateUser;
    private User hrUser;
    private String candidateToken;
    private String hrToken;
    private UUID resumeId;
    private CandidateResumeResponse sampleResponse;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        candidateUser = User.builder()
                .email("candidate_resumes_test@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .build();
        candidateUser = userRepository.save(candidateUser);
        candidateToken = jwtTokenProvider.generateAccessToken(candidateUser);

        hrUser = User.builder()
                .email("hr_resumes_test@example.com")
                .passwordHash(passwordEncoder.encode("Password123!"))
                .role(UserRole.HR)
                .status(AccountStatus.ACTIVE)
                .build();
        hrUser = userRepository.save(hrUser);
        hrToken = jwtTokenProvider.generateAccessToken(hrUser);

        resumeId = UUID.randomUUID();
        sampleResponse = CandidateResumeResponse.builder()
                .id(resumeId)
                .userId(candidateUser.getId())
                .title("CV Frontend Dev")
                .fileName("cv_frontend.pdf")
                .fileSizeFormatted("1.5 MB")
                .fileSizeBytes(1572864)
                .mimeType("application/pdf")
                .isDefault(true)
                .createdAt(Instant.now())
                .updatedAt(Instant.now())
                .build();
    }

    @Test
    @DisplayName("GET /api/v1/candidates/me/resumes - Should return 200 OK for CANDIDATE")
    void shouldReturnResumesListForCandidate() throws Exception {
        when(candidateResumeService.getAllResumes(candidateUser.getId())).thenReturn(List.of(sampleResponse));

        mockMvc.perform(get("/api/v1/candidates/me/resumes")
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("CV Frontend Dev"))
                .andExpect(jsonPath("$[0].isDefault").value(true));
    }

    @Test
    @DisplayName("GET /api/v1/candidates/me/resumes - Should return 403 Forbidden for HR")
    void shouldReturn403ForHRRole() throws Exception {
        mockMvc.perform(get("/api/v1/candidates/me/resumes")
                        .header("Authorization", "Bearer " + hrToken))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("POST /api/v1/candidates/me/resumes - Should upload resume successfully")
    void shouldUploadResumeSuccessfully() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "%PDF-1.4 test".getBytes());

        when(candidateResumeService.uploadResume(eq(candidateUser.getId()), any(), eq("CV React"), eq(true)))
                .thenReturn(sampleResponse);

        mockMvc.perform(multipart("/api/v1/candidates/me/resumes")
                        .file(file)
                        .param("title", "CV React")
                        .param("setAsDefault", "true")
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("CV Frontend Dev"));
    }

    @Test
    @DisplayName("PATCH /api/v1/candidates/me/resumes/{resumeId}/default - Should set default resume")
    void shouldSetDefaultResume() throws Exception {
        when(candidateResumeService.setDefaultResume(candidateUser.getId(), resumeId)).thenReturn(sampleResponse);

        mockMvc.perform(patch("/api/v1/candidates/me/resumes/{resumeId}/default", resumeId)
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("CV Frontend Dev"));
    }

    @Test
    @DisplayName("PATCH /api/v1/candidates/me/resumes/{resumeId}/title - Should update title")
    void shouldUpdateTitle() throws Exception {
        UpdateResumeTitleRequest req = UpdateResumeTitleRequest.builder().title("CV Updated").build();
        when(candidateResumeService.updateResumeTitle(eq(candidateUser.getId()), eq(resumeId), any()))
                .thenReturn(sampleResponse);

        mockMvc.perform(patch("/api/v1/candidates/me/resumes/{resumeId}/title", resumeId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req))
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("CV Frontend Dev"));
    }

    @Test
    @DisplayName("GET /api/v1/candidates/me/resumes/{resumeId}/file - Should download/stream PDF file")
    void shouldStreamPdfFile() throws Exception {
        CandidateResume resumeEntity = CandidateResume.builder()
                .id(resumeId)
                .userId(candidateUser.getId())
                .fileName("cv_frontend.pdf")
                .filePath("/tmp/cv.pdf")
                .fileSizeBytes(100)
                .mimeType("application/pdf")
                .build();

        ByteArrayResource resource = new ByteArrayResource("%PDF-1.4 sample".getBytes());

        when(candidateResumeService.getResumeFile(candidateUser.getId(), resumeId)).thenReturn(resumeEntity);
        when(fileStorageService.loadResumeResource(resumeEntity)).thenReturn(resource);

        mockMvc.perform(get("/api/v1/candidates/me/resumes/{resumeId}/file", resumeId)
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", "application/pdf"))
                .andExpect(header().string("Content-Disposition", org.hamcrest.Matchers.containsString("cv_frontend.pdf")));
    }

    @Test
    @DisplayName("DELETE /api/v1/candidates/me/resumes/{resumeId} - Should delete resume")
    void shouldDeleteResume() throws Exception {
        doNothing().when(candidateResumeService).deleteResume(candidateUser.getId(), resumeId);

        mockMvc.perform(delete("/api/v1/candidates/me/resumes/{resumeId}", resumeId)
                        .header("Authorization", "Bearer " + candidateToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đã xóa tệp CV khỏi hệ thống thành công"));
    }
}
