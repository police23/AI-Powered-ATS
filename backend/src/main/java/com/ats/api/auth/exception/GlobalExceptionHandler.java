package com.ats.api.auth.exception;

import com.ats.api.auth.dto.response.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthException.class)
    public ResponseEntity<ErrorResponse> handleAuthException(AuthException ex, HttpServletRequest request) {
        log.warn("AuthException occurred: code={} status={} message={}", ex.getCode(), ex.getHttpStatus(), ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getCode(),
                ex.getMessage(),
                ex.getHttpStatus().value(),
                Instant.now(),
                request.getRequestURI(),
                List.of()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }

    @ExceptionHandler(com.ats.api.profile.exception.ProfileException.class)
    public ResponseEntity<ErrorResponse> handleProfileException(com.ats.api.profile.exception.ProfileException ex, HttpServletRequest request) {
        log.warn("ProfileException occurred: code={} status={} message={}", ex.getCode(), ex.getHttpStatus(), ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                ex.getCode(),
                ex.getMessage(),
                ex.getHttpStatus().value(),
                Instant.now(),
                request.getRequestURI(),
                List.of()
        );
        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .toList();

        log.warn("Validation error on path {}: {}", request.getRequestURI(), errors);

        ErrorResponse response = new ErrorResponse(
                "INVALID_REQUEST_BODY",
                "Dữ liệu gửi lên không hợp lệ",
                HttpStatus.BAD_REQUEST.value(),
                Instant.now(),
                request.getRequestURI(),
                errors
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request) {
        log.warn("AccessDeniedException on path {}: {}", request.getRequestURI(), ex.getMessage());
        ErrorResponse response = new ErrorResponse(
                "ACCESS_DENIED",
                "Không có quyền truy cập tài nguyên này",
                HttpStatus.FORBIDDEN.value(),
                Instant.now(),
                request.getRequestURI(),
                List.of()
        );
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex, HttpServletRequest request) {
        log.error("Unhandled exception on path {}", request.getRequestURI(), ex);
        ErrorResponse response = new ErrorResponse(
                "INTERNAL_SERVER_ERROR",
                "Đã có lỗi hệ thống xảy ra, vui lòng thử lại sau",
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                Instant.now(),
                request.getRequestURI(),
                List.of()
        );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
