package com.ats.api.profile.service;

import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.profile.dto.request.UpdateProfileRequest;
import com.ats.api.profile.dto.response.ResumeResponse;
import com.ats.api.profile.dto.response.UserProfileResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.entity.ExperienceLevel;
import com.ats.api.profile.entity.Gender;
import com.ats.api.profile.entity.UserProfile;
import com.ats.api.profile.repository.CandidateResumeRepository;
import com.ats.api.profile.repository.UserProfileRepository;
import com.ats.api.profile.service.impl.UserProfileServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserProfileServiceTest {

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private CandidateResumeRepository candidateResumeRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    private UUID userId;
    private UserProfile candidateProfile;
    private CandidateResume candidateResume;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        candidateProfile = UserProfile.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .fullName("Nguyễn Văn A")
                .phoneNumber("0987654321")
                .city("HCM")
                .dateOfBirth(LocalDate.of(1998, 5, 15))
                .gender(Gender.MALE)
                .jobTitle("frontend")
                .experienceLevel(ExperienceLevel.TWO_TO_THREE)
                .avatarUrl("http://localhost:8080/api/v1/profiles/avatars/test.jpg")
                .build();

        candidateResume = CandidateResume.builder()
                .id(UUID.randomUUID())
                .userId(userId)
                .fileName("CV_NguyenVanA.pdf")
                .filePath("/uploads/resumes/test.pdf")
                .fileSizeBytes(1024 * 1024)
                .mimeType("application/pdf")
                .build();
    }

    @Test
    @DisplayName("givenCandidateUser_whenGetProfile_thenReturnFullProfileWithResume")
    void givenCandidateUser_whenGetProfile_thenReturnFullProfileWithResume() {
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(candidateProfile));
        when(candidateResumeRepository.findByUserId(userId)).thenReturn(Optional.of(candidateResume));

        UserProfileResponse response = userProfileService.getProfile(userId, UserRole.CANDIDATE, "candidate@ats.com");

        assertThat(response).isNotNull();
        assertThat(response.getUserId()).isEqualTo(userId);
        assertThat(response.getFullName()).isEqualTo("Nguyễn Văn A");
        assertThat(response.getJobTitle()).isEqualTo("frontend");
        assertThat(response.getExperienceLevel()).isEqualTo(ExperienceLevel.TWO_TO_THREE);
        assertThat(response.getResume()).isNotNull();
        assertThat(response.getResume().getFileName()).isEqualTo("CV_NguyenVanA.pdf");
        assertThat(response.getCompany()).isNull();
    }

    @Test
    @DisplayName("givenHrUser_whenGetProfile_thenReturnProfileWithCompanyAndNoResume")
    void givenHrUser_whenGetProfile_thenReturnProfileWithCompanyAndNoResume() {
        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(candidateProfile));

        UserProfileResponse response = userProfileService.getProfile(userId, UserRole.HR, "hr@ats.com");

        assertThat(response).isNotNull();
        assertThat(response.getJobTitle()).isNull();
        assertThat(response.getExperienceLevel()).isNull();
        assertThat(response.getResume()).isNull();
        assertThat(response.getCompany()).isNotNull();
    }

    @Test
    @DisplayName("givenAdminUser_whenGetProfile_thenThrowAccessDeniedException")
    void givenAdminUser_whenGetProfile_thenThrowAccessDeniedException() {
        assertThatThrownBy(() -> userProfileService.getProfile(userId, UserRole.ADMIN, "admin@ats.com"))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("quản trị viên không sử dụng chức năng");
    }

    @Test
    @DisplayName("givenCandidateUser_whenUpdateProfile_thenSaveAndReturnUpdatedResponse")
    void givenCandidateUser_whenUpdateProfile_thenSaveAndReturnUpdatedResponse() {
        UpdateProfileRequest request = UpdateProfileRequest.builder()
                .fullName("Nguyễn Văn B")
                .phoneNumber("0912345678")
                .city("HN")
                .dateOfBirth(LocalDate.of(1995, 1, 1))
                .gender(Gender.MALE)
                .jobTitle("backend")
                .experienceLevel(ExperienceLevel.THREE_TO_FIVE)
                .build();

        when(userProfileRepository.findByUserId(userId)).thenReturn(Optional.of(candidateProfile));
        when(userProfileRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        UserProfileResponse response = userProfileService.updateProfile(userId, UserRole.CANDIDATE, "candidate@ats.com", request);

        assertThat(response.getFullName()).isEqualTo("Nguyễn Văn B");
        assertThat(response.getPhoneNumber()).isEqualTo("0912345678");
        assertThat(response.getCity()).isEqualTo("HN");
        assertThat(response.getJobTitle()).isEqualTo("backend");
        assertThat(response.getExperienceLevel()).isEqualTo(ExperienceLevel.THREE_TO_FIVE);
    }

    @Test
    @DisplayName("givenCandidateUser_whenUploadResume_thenStoreAndReturnResumeResponse")
    void givenCandidateUser_whenUploadResume_thenStoreAndReturnResumeResponse() {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "%PDF-1.4".getBytes());

        when(candidateResumeRepository.findByUserId(userId)).thenReturn(Optional.empty());
        when(fileStorageService.storeResume(userId, file)).thenReturn(candidateResume);
        when(candidateResumeRepository.save(any())).thenReturn(candidateResume);

        ResumeResponse response = userProfileService.uploadResume(userId, UserRole.CANDIDATE, file);

        assertThat(response).isNotNull();
        assertThat(response.getFileName()).isEqualTo("CV_NguyenVanA.pdf");
        verify(candidateResumeRepository).save(any());
    }

    @Test
    @DisplayName("givenHrUser_whenUploadResume_thenThrowAccessDeniedException")
    void givenHrUser_whenUploadResume_thenThrowAccessDeniedException() {
        MockMultipartFile file = new MockMultipartFile("file", "cv.pdf", "application/pdf", "%PDF-1.4".getBytes());

        assertThatThrownBy(() -> userProfileService.uploadResume(userId, UserRole.HR, file))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessageContaining("Chỉ Ứng viên mới có thể");
    }

    @Test
    @DisplayName("givenCandidateUser_whenDeleteResume_thenDeleteFileAndEntity")
    void givenCandidateUser_whenDeleteResume_thenDeleteFileAndEntity() {
        when(candidateResumeRepository.findByUserId(userId)).thenReturn(Optional.of(candidateResume));

        userProfileService.deleteResume(userId, UserRole.CANDIDATE);

        verify(fileStorageService).deleteResume(candidateResume);
        verify(candidateResumeRepository).delete(candidateResume);
    }
}
