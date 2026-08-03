package com.ats.api.profile.controller;

import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.security.JwtAuthenticationFilter;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.auth.security.SecurityUserPrincipal;
import com.ats.api.profile.dto.request.UpdateProfileRequest;
import com.ats.api.profile.dto.response.ResumeResponse;
import com.ats.api.profile.dto.response.UserProfileResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.entity.ExperienceLevel;
import com.ats.api.profile.entity.Gender;
import com.ats.api.profile.service.FileStorageService;
import com.ats.api.profile.service.UserProfileService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = UserProfileController.class)
@AutoConfigureMockMvc(addFilters = false)
class UserProfileControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private UserProfileService userProfileService;

    @MockitoBean
    private FileStorageService fileStorageService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    private UUID candidateId;
    private SecurityUserPrincipal principal;

    @BeforeEach
    void setUp() {
        candidateId = UUID.randomUUID();
        principal = new SecurityUserPrincipal(candidateId, "candidate@ats.com", UserRole.CANDIDATE, AccountStatus.ACTIVE);

        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }

    @Test
    @DisplayName("givenAuthenticatedCandidate_whenGetProfileMe_thenReturn200OK")
    void givenAuthenticatedCandidate_whenGetProfileMe_thenReturn200OK() throws Exception {
        UserProfileResponse response = UserProfileResponse.builder()
                .userId(candidateId)
                .email("candidate@ats.com")
                .role("CANDIDATE")
                .fullName("Nguyễn Văn A")
                .phoneNumber("0987654321")
                .city("HCM")
                .dateOfBirth(LocalDate.of(1998, 5, 15))
                .gender(Gender.MALE)
                .jobTitle("frontend")
                .experienceLevel(ExperienceLevel.TWO_TO_THREE)
                .build();

        when(userProfileService.getProfile(eq(candidateId), eq(UserRole.CANDIDATE), eq("candidate@ats.com")))
                .thenReturn(response);

        mockMvc.perform(get("/api/v1/profiles/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Nguyễn Văn A"))
                .andExpect(jsonPath("$.jobTitle").value("frontend"))
                .andExpect(jsonPath("$.experienceLevel").value("TWO_TO_THREE"));
    }

    @Test
    @DisplayName("givenValidUpdateRequest_whenPutProfileMe_thenReturn200OK")
    void givenValidUpdateRequest_whenPutProfileMe_thenReturn200OK() throws Exception {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("Nguyễn Văn Updated")
                .phoneNumber("0912345678")
                .city("HN")
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .gender(Gender.MALE)
                .jobTitle("backend")
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .build();

        UserProfileResponse response = UserProfileResponse.builder()
                .userId(candidateId)
                .email("candidate@ats.com")
                .role("CANDIDATE")
                .fullName("Nguyễn Văn Updated")
                .phoneNumber("0912345678")
                .city("HN")
                .jobTitle("backend")
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .build();

        when(userProfileService.updateProfile(eq(candidateId), eq(UserRole.CANDIDATE), eq("candidate@ats.com"), any()))
                .thenReturn(response);

        mockMvc.perform(put("/api/v1/profiles/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Nguyễn Văn Updated"))
                .andExpect(jsonPath("$.phoneNumber").value("0912345678"));
    }

    @Test
    @DisplayName("givenInvalidPhoneNumber_whenPutProfileMe_thenReturn400BadRequest")
    void givenInvalidPhoneNumber_whenPutProfileMe_thenReturn400BadRequest() throws Exception {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("Nguyễn Văn A")
                .phoneNumber("123456") // invalid phone
                .build();

        mockMvc.perform(put("/api/v1/profiles/me")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.code").value("INVALID_REQUEST_BODY"));
    }

    @Test
    @DisplayName("givenResumeFile_whenPostCv_thenReturn200OKAndResumeResponse")
    void givenResumeFile_whenPostCv_thenReturn200OKAndResumeResponse() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "%PDF-1.4".getBytes());
        ResumeResponse response = ResumeResponse.builder()
                .id(UUID.randomUUID())
                .fileName("cv.pdf")
                .fileSizeBytes(1024)
                .fileSizeFormatted("1 KB")
                .updatedAt(Instant.now())
                .build();

        when(userProfileService.uploadResume(eq(candidateId), eq(UserRole.CANDIDATE), any()))
                .thenReturn(response);

        mockMvc.perform(multipart("/api/v1/profiles/me/resume").file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fileName").value("cv.pdf"))
                .andExpect(jsonPath("$.fileSizeFormatted").value("1 KB"));
    }

    @Test
    @DisplayName("whenDeleteCv_thenReturn200OK")
    void whenDeleteCv_thenReturn200OK() throws Exception {
        mockMvc.perform(delete("/api/v1/profiles/me/resume"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đã xóa file CV thành công"));
    }

    @Test
    @DisplayName("whenDownloadCv_thenReturn200OKWithPdfAttachment")
    void whenDownloadCv_thenReturn200OKWithPdfAttachment() throws Exception {
        CandidateResume resume = CandidateResume.builder()
                .id(UUID.randomUUID())
                .fileName("cv.pdf")
                .filePath("/tmp/cv.pdf")
                .fileSizeBytes(100)
                .mimeType("application/pdf")
                .build();

        ByteArrayResource resource = new ByteArrayResource("%PDF-1.4 content".getBytes());

        when(userProfileService.getResumeForDownload(eq(candidateId), eq(UserRole.CANDIDATE)))
                .thenReturn(resume);
        when(fileStorageService.loadResumeResource(resume))
                .thenReturn(resource);

        mockMvc.perform(get("/api/v1/profiles/me/resume/file"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Disposition", "attachment; filename=\"cv.pdf\""))
                .andExpect(header().string("Content-Type", "application/pdf"));
    }
}
