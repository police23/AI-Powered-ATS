package com.ats.api.profile.service;

import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.FileUploadException;
import com.ats.api.profile.service.impl.LocalFileStorageServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;

import java.nio.file.Path;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private LocalFileStorageServiceImpl fileStorageService;
    private UUID userId;

    @BeforeEach
    void setUp() {
        fileStorageService = new LocalFileStorageServiceImpl(tempDir.toString());
        fileStorageService.init();
        userId = UUID.randomUUID();
    }

    @Test
    @DisplayName("givenValidPdfFile_whenStoreResume_thenReturnCandidateResumeEntity")
    void givenValidPdfFile_whenStoreResume_thenReturnCandidateResumeEntity() {
        byte[] validPdfContent = "%PDF-1.4 sample content".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "resume.pdf", "application/pdf", validPdfContent);

        CandidateResume resume = fileStorageService.storeResume(userId, file);

        assertThat(resume).isNotNull();
        assertThat(resume.getUserId()).isEqualTo(userId);
        assertThat(resume.getFileName()).isEqualTo("resume.pdf");
        assertThat(resume.getMimeType()).isEqualTo("application/pdf");
        assertThat(resume.getFileSizeBytes()).isEqualTo(validPdfContent.length);
    }

    @Test
    @DisplayName("givenNonPdfFile_whenStoreResume_thenThrowFileUploadException")
    void givenNonPdfFile_whenStoreResume_thenThrowFileUploadException() {
        byte[] docxContent = new byte[]{0x50, 0x4B, 0x03, 0x04, 0x14}; // ZIP magic bytes
        MockMultipartFile file = new MockMultipartFile("file", "resume.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", docxContent);

        assertThatThrownBy(() -> fileStorageService.storeResume(userId, file))
                .isInstanceOf(FileUploadException.class)
                .hasMessageContaining("Chỉ chấp nhận tệp định dạng PDF");
    }

    @Test
    @DisplayName("givenOverSizePdfFile_whenStoreResume_thenThrowFileUploadException")
    void givenOverSizePdfFile_whenStoreResume_thenThrowFileUploadException() {
        byte[] largeBytes = new byte[6 * 1024 * 1024]; // 6MB
        System.arraycopy("%PDF-".getBytes(), 0, largeBytes, 0, 5);
        MockMultipartFile file = new MockMultipartFile("file", "large.pdf", "application/pdf", largeBytes);

        assertThatThrownBy(() -> fileStorageService.storeResume(userId, file))
                .isInstanceOf(FileUploadException.class)
                .hasMessageContaining("không được vượt quá 5MB");
    }

    @Test
    @DisplayName("givenValidPngImage_whenStoreAvatar_thenReturnAvatarUrl")
    void givenValidPngImage_whenStoreAvatar_thenReturnAvatarUrl() {
        byte[] pngHeader = new byte[]{(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
        MockMultipartFile file = new MockMultipartFile("file", "avatar.png", "image/png", pngHeader);

        String avatarUrl = fileStorageService.storeAvatar(userId, file);

        assertThat(avatarUrl).startsWith("/api/v1/profiles/avatars/");
        assertThat(avatarUrl).endsWith(".png");
    }

    @Test
    @DisplayName("givenInvalidAvatarFormat_whenStoreAvatar_thenThrowFileUploadException")
    void givenInvalidAvatarFormat_whenStoreAvatar_thenThrowFileUploadException() {
        byte[] textContent = "this is not an image".getBytes();
        MockMultipartFile file = new MockMultipartFile("file", "fake.png", "image/png", textContent);

        assertThatThrownBy(() -> fileStorageService.storeAvatar(userId, file))
                .isInstanceOf(FileUploadException.class)
                .hasMessageContaining("định dạng JPG, PNG, GIF hoặc WEBP");
    }
}
