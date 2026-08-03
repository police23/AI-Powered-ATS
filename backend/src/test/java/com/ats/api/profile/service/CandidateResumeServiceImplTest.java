package com.ats.api.profile.service;

import com.ats.api.profile.dto.request.UpdateResumeTitleRequest;
import com.ats.api.profile.dto.response.CandidateResumeResponse;
import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.FileUploadException;
import com.ats.api.profile.repository.CandidateResumeRepository;
import com.ats.api.profile.service.impl.CandidateResumeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CandidateResumeServiceImplTest {

    @Mock
    private CandidateResumeRepository candidateResumeRepository;

    @Mock
    private FileStorageService fileStorageService;

    @InjectMocks
    private CandidateResumeServiceImpl candidateResumeService;

    private UUID userId;
    private UUID resumeId;
    private CandidateResume sampleResume;

    @BeforeEach
    void setUp() {
        userId = UUID.randomUUID();
        resumeId = UUID.randomUUID();
        sampleResume = CandidateResume.builder()
                .id(resumeId)
                .userId(userId)
                .title("CV Frontend Engineer")
                .fileName("frontend.pdf")
                .filePath("/uploads/resumes/frontend.pdf")
                .fileSizeBytes(1024 * 1024)
                .mimeType("application/pdf")
                .isDefault(true)
                .build();
    }

    @Nested
    @DisplayName("getAllResumes tests")
    class GetAllResumesTests {
        @Test
        @DisplayName("Should return list of resumes ordered by created_at desc")
        void shouldReturnListOfResumes() {
            when(candidateResumeRepository.findAllByUserIdOrderByCreatedAtDesc(userId))
                    .thenReturn(List.of(sampleResume));

            List<CandidateResumeResponse> responses = candidateResumeService.getAllResumes(userId);

            assertThat(responses).hasSize(1);
            assertThat(responses.get(0).getTitle()).isEqualTo("CV Frontend Engineer");
            assertThat(responses.get(0).isDefault()).isTrue();
        }
    }

    @Nested
    @DisplayName("uploadResume tests")
    class UploadResumeTests {
        @Test
        @DisplayName("Should throw exception when file is empty")
        void shouldThrowExceptionWhenFileIsEmpty() {
            MockMultipartFile emptyFile = new MockMultipartFile("file", "test.pdf", "application/pdf", new byte[0]);

            assertThatThrownBy(() -> candidateResumeService.uploadResume(userId, emptyFile, "Title", false))
                    .isInstanceOf(FileUploadException.class)
                    .hasMessageContaining("Vui lòng chọn tệp CV");
        }

        @Test
        @DisplayName("Should upload resume and set default if first resume")
        void shouldUploadFirstResumeAsDefault() {
            byte[] pdfBytes = "%PDF-1.4 test content".getBytes();
            MockMultipartFile validPdf = new MockMultipartFile("file", "my_cv.pdf", "application/pdf", pdfBytes);

            when(candidateResumeRepository.countByUserId(userId)).thenReturn(0L);
            when(fileStorageService.storeResume(eq(userId), any())).thenReturn(sampleResume);
            when(candidateResumeRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

            CandidateResumeResponse response = candidateResumeService.uploadResume(userId, validPdf, "CV Senior React", false);

            assertThat(response).isNotNull();
            assertThat(response.getTitle()).isEqualTo("CV Senior React");
            assertThat(response.isDefault()).isTrue();
            verify(candidateResumeRepository).clearDefaultResumesByUserId(userId);
        }
    }

    @Nested
    @DisplayName("setDefaultResume tests")
    class SetDefaultResumeTests {
        @Test
        @DisplayName("Should clear defaults and set target resume as default")
        void shouldSetTargetResumeAsDefault() {
            sampleResume.setDefault(false);
            when(candidateResumeRepository.findByIdAndUserId(resumeId, userId)).thenReturn(Optional.of(sampleResume));
            when(candidateResumeRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            CandidateResumeResponse response = candidateResumeService.setDefaultResume(userId, resumeId);

            assertThat(response.isDefault()).isTrue();
            verify(candidateResumeRepository).clearDefaultResumesByUserId(userId);
        }
    }

    @Nested
    @DisplayName("updateResumeTitle tests")
    class UpdateResumeTitleTests {
        @Test
        @DisplayName("Should update resume title successfully")
        void shouldUpdateTitleSuccessfully() {
            when(candidateResumeRepository.findByIdAndUserId(resumeId, userId)).thenReturn(Optional.of(sampleResume));
            when(candidateResumeRepository.save(any())).thenAnswer(i -> i.getArgument(0));

            UpdateResumeTitleRequest req = UpdateResumeTitleRequest.builder().title("CV New Title").build();
            CandidateResumeResponse response = candidateResumeService.updateResumeTitle(userId, resumeId, req);

            assertThat(response.getTitle()).isEqualTo("CV New Title");
        }
    }

    @Nested
    @DisplayName("deleteResume tests")
    class DeleteResumeTests {
        @Test
        @DisplayName("Should delete resume and auto-assign default if was default")
        void shouldDeleteResumeAndReassignDefault() {
            CandidateResume secondResume = CandidateResume.builder()
                    .id(UUID.randomUUID())
                    .userId(userId)
                    .title("Second CV")
                    .filePath("/path2")
                    .isDefault(false)
                    .build();

            when(candidateResumeRepository.findByIdAndUserId(resumeId, userId)).thenReturn(Optional.of(sampleResume));
            when(candidateResumeRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)).thenReturn(Optional.of(secondResume));

            candidateResumeService.deleteResume(userId, resumeId);

            verify(fileStorageService).deleteResume(sampleResume);
            verify(candidateResumeRepository).delete(sampleResume);
            verify(candidateResumeRepository).save(secondResume);
            assertThat(secondResume.isDefault()).isTrue();
        }
    }
}
