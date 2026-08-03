package com.ats.api.profile.service.impl;

import com.ats.api.profile.entity.CandidateResume;
import com.ats.api.profile.exception.FileUploadException;
import com.ats.api.profile.service.FileStorageService;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Slf4j
@Service
public class LocalFileStorageServiceImpl implements FileStorageService {

    private static final long MAX_AVATAR_SIZE = 2 * 1024 * 1024; // 2MB
    private static final long MAX_RESUME_SIZE = 5 * 1024 * 1024; // 5MB

    private final Path avatarUploadPath;
    private final Path resumeUploadPath;

    public LocalFileStorageServiceImpl(
            @Value("${app.upload.dir:uploads}") String uploadDir
    ) {
        this.avatarUploadPath = Paths.get(uploadDir, "avatars").toAbsolutePath().normalize();
        this.resumeUploadPath = Paths.get(uploadDir, "resumes").toAbsolutePath().normalize();
    }

    @PostConstruct
    public void init() {
        try {
            Files.createDirectories(avatarUploadPath);
            Files.createDirectories(resumeUploadPath);
        } catch (IOException e) {
            log.error("Không thể khởi tạo thư mục lưu trữ file: {}", e.getMessage());
            throw new RuntimeException("Không thể khởi tạo thư mục lưu trữ file", e);
        }
    }

    @Override
    public String storeAvatar(UUID userId, MultipartFile file) {
        validateAvatarFile(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "avatar.jpg");
        String extension = getFileExtension(originalFilename);
        String fileName = userId.toString() + "_" + System.currentTimeMillis() + (extension.isEmpty() ? ".jpg" : "." + extension);

        try {
            Path targetLocation = this.avatarUploadPath.resolve(fileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }
            return "/api/v1/profiles/avatars/" + fileName;
        } catch (IOException ex) {
            log.error("Lỗi khi lưu trữ file avatar: {}", ex.getMessage());
            throw new FileUploadException("Không thể lưu trữ tệp ảnh đại diện", "STORAGE_ERROR");
        }
    }

    @Override
    public void deleteAvatar(String avatarUrl) {
        if (!StringUtils.hasText(avatarUrl)) {
            return;
        }
        try {
            String fileName = avatarUrl.substring(avatarUrl.lastIndexOf('/') + 1);
            Path filePath = this.avatarUploadPath.resolve(fileName).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Không thể xóa file avatar vật lý: {}", ex.getMessage());
        }
    }

    @Override
    public Resource loadAvatarResource(String fileName) {
        try {
            Path filePath = this.avatarUploadPath.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new FileUploadException("Không tìm thấy tệp ảnh đại diện", "FILE_NOT_FOUND");
        } catch (MalformedURLException ex) {
            throw new FileUploadException("Đường dẫn tệp không hợp lệ", "INVALID_FILE_PATH");
        }
    }

    @Override
    public CandidateResume storeResume(UUID userId, MultipartFile file) {
        validatePdfResumeFile(file);

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");
        String storedFileName = userId.toString() + "_" + System.currentTimeMillis() + ".pdf";

        try {
            Path targetLocation = this.resumeUploadPath.resolve(storedFileName);
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, targetLocation, StandardCopyOption.REPLACE_EXISTING);
            }

            return CandidateResume.builder()
                    .userId(userId)
                    .title("CV Ứng tuyển")
                    .fileName(originalFilename)
                    .filePath(targetLocation.toString())
                    .fileSizeBytes(file.getSize())
                    .mimeType("application/pdf")
                    .isDefault(false)
                    .build();
        } catch (IOException ex) {
            log.error("Lỗi khi lưu trữ file CV: {}", ex.getMessage());
            throw new FileUploadException("Không thể lưu trữ tệp CV", "STORAGE_ERROR");
        }
    }

    @Override
    public void deleteResume(CandidateResume resume) {
        if (resume == null || !StringUtils.hasText(resume.getFilePath())) {
            return;
        }
        try {
            Path filePath = Paths.get(resume.getFilePath()).normalize();
            Files.deleteIfExists(filePath);
        } catch (IOException ex) {
            log.warn("Không thể xóa file CV vật lý: {}", ex.getMessage());
        }
    }

    @Override
    public Resource loadResumeResource(CandidateResume resume) {
        if (resume == null || !StringUtils.hasText(resume.getFilePath())) {
            throw new FileUploadException("Hồ sơ ứng viên chưa có tệp CV", "FILE_NOT_FOUND");
        }
        try {
            Path filePath = Paths.get(resume.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new FileUploadException("Không tìm thấy tệp CV trên hệ thống", "FILE_NOT_FOUND");
        } catch (MalformedURLException ex) {
            throw new FileUploadException("Đường dẫn tệp không hợp lệ", "INVALID_FILE_PATH");
        }
    }

    private void validateAvatarFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Vui lòng chọn tệp ảnh đại diện", "EMPTY_FILE");
        }
        if (file.getSize() > MAX_AVATAR_SIZE) {
            throw new FileUploadException("Dung lượng ảnh đại diện không được vượt quá 2MB", "FILE_SIZE_EXCEEDED");
        }

        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[12];
            int bytesRead = is.read(header);
            if (bytesRead < 4) {
                throw new FileUploadException("Định dạng ảnh không hợp lệ", "INVALID_FILE_TYPE");
            }

            boolean isJpeg = (header[0] & 0xFF) == 0xFF && (header[1] & 0xFF) == 0xD8 && (header[2] & 0xFF) == 0xFF;
            boolean isPng = (header[0] & 0xFF) == 0x89 && header[1] == 0x50 && header[2] == 0x4E && header[3] == 0x47;
            boolean isGif = header[0] == 0x47 && header[1] == 0x49 && header[2] == 0x46 && header[3] == 0x38;
            boolean isWebp = bytesRead >= 12 && header[0] == 'R' && header[1] == 'I' && header[2] == 'F' && header[3] == 'F'
                    && header[8] == 'W' && header[9] == 'E' && header[10] == 'B' && header[11] == 'P';

            if (!isJpeg && !isPng && !isGif && !isWebp) {
                throw new FileUploadException("Ảnh đại diện chỉ hỗ trợ định dạng JPG, PNG, GIF hoặc WEBP", "INVALID_FILE_TYPE");
            }
        } catch (IOException e) {
            throw new FileUploadException("Không thể đọc tệp tải lên", "INVALID_FILE");
        }
    }

    private void validatePdfResumeFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Vui lòng chọn tệp CV", "EMPTY_FILE");
        }
        if (file.getSize() > MAX_RESUME_SIZE) {
            throw new FileUploadException("Dung lượng CV không được vượt quá 5MB", "FILE_SIZE_EXCEEDED");
        }

        try (InputStream is = file.getInputStream()) {
            byte[] header = new byte[5];
            int bytesRead = is.read(header);
            if (bytesRead < 5) {
                throw new FileUploadException("Tệp tải lên không phải là định dạng PDF hợp lệ", "INVALID_FILE_TYPE");
            }

            // PDF magic bytes: %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
            boolean isPdf = header[0] == 0x25 && header[1] == 0x50 && header[2] == 0x44 && header[3] == 0x46 && header[4] == 0x2D;
            if (!isPdf) {
                throw new FileUploadException("Chỉ chấp nhận tệp định dạng PDF (.pdf)", "INVALID_FILE_TYPE");
            }
        } catch (IOException e) {
            throw new FileUploadException("Không thể đọc tệp tải lên", "INVALID_FILE");
        }
    }

    private String getFileExtension(String filename) {
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex > 0 && lastDotIndex < filename.length() - 1) {
            return filename.substring(lastDotIndex + 1).toLowerCase();
        }
        return "";
    }
}
