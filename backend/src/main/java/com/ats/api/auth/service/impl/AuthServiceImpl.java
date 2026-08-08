package com.ats.api.auth.service.impl;

import com.ats.api.auth.config.JwtProperties;
import com.ats.api.auth.dto.request.LoginRequest;
import com.ats.api.auth.dto.request.RegisterRequest;
import com.ats.api.auth.dto.response.LoginResponse;
import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.TokenRefreshResponse;
import com.ats.api.auth.entity.RefreshToken;
import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.RefreshTokenStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.exception.AccountDisabledException;
import com.ats.api.auth.exception.AccountLockedException;
import com.ats.api.auth.exception.AdminRegistrationForbiddenException;
import com.ats.api.auth.exception.EmailConflictException;
import com.ats.api.auth.exception.InvalidCredentialsException;
import com.ats.api.auth.exception.TokenExpiredException;
import com.ats.api.auth.exception.TokenInvalidException;
import com.ats.api.auth.exception.TokenReusedException;
import com.ats.api.auth.mapper.AuthMapper;
import com.ats.api.auth.repository.RefreshTokenRepository;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.auth.security.TokenHashService;
import com.ats.api.auth.service.AuthService;
import com.ats.api.auth.util.AuthUtils;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private static final int MAX_FAILED_LOGIN_ATTEMPTS = 5;
    private static final long LOCK_DURATION_MINUTES = 15;
    private static final String COOKIE_PATH = "/api/v1/auth";
    private static final String REFRESH_TOKEN_COOKIE_NAME = "refreshToken";

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenHashService tokenHashService;
    private final AuthMapper authMapper;
    private final JwtProperties jwtProperties;

    @Override
    @Transactional
    public RegisterResponse register(RegisterRequest request) {
        String normalizedEmail = AuthUtils.normalizeEmail(request.email());

        if (request.role() == UserRole.ADMIN) {
            log.warn("Attempted ADMIN registration for email: {}", normalizedEmail);
            throw new AdminRegistrationForbiddenException();
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            log.warn("Registration conflict for email: {}", normalizedEmail);
            throw new EmailConflictException();
        }

        User user = User.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(request.role())
                .status(AccountStatus.ACTIVE)
                .failedLoginAttempts(0)
                .build();

        User savedUser = userRepository.save(user);
        log.info("Successfully registered user userId={} email={} role={}", savedUser.getId(), savedUser.getEmail(), savedUser.getRole());

        return authMapper.toRegisterResponse(savedUser);
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletResponse response) {
        String normalizedEmail = AuthUtils.normalizeEmail(request.email());
        log.info("Processing login request for email: {}", normalizedEmail);

        User user = userRepository.findByEmail(normalizedEmail)
                .orElseThrow(() -> {
                    log.warn("Login failed: User not found for email: {}", normalizedEmail);
                    return new InvalidCredentialsException();
                });

        if (user.getStatus() == AccountStatus.DISABLED) {
            log.warn("Login rejected: Account disabled for userId={}", user.getId());
            throw new AccountDisabledException();
        }

        if (user.getStatus() == AccountStatus.LOCKED) {
            if (user.getLockedUntil() != null && Instant.now().isBefore(user.getLockedUntil())) {
                long minutesLeft = Duration.between(Instant.now(), user.getLockedUntil()).toMinutes() + 1;
                log.warn("Login rejected: Account locked for userId={} minutesLeft={}", user.getId(), minutesLeft);
                throw new AccountLockedException("Tài khoản bị khóa tạm thời. Vui lòng thử lại sau " + minutesLeft + " phút");
            } else {
                log.info("Lock expired for userId={}, unlocking account", user.getId());
                user.setStatus(AccountStatus.ACTIVE);
                user.setFailedLoginAttempts(0);
                user.setLockedUntil(null);
            }
        }

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            int newAttempts = user.getFailedLoginAttempts() + 1;
            user.setFailedLoginAttempts(newAttempts);

            if (newAttempts >= MAX_FAILED_LOGIN_ATTEMPTS) {
                user.setStatus(AccountStatus.LOCKED);
                user.setLockedUntil(Instant.now().plus(Duration.ofMinutes(LOCK_DURATION_MINUTES)));
                userRepository.save(user);
                log.warn("Account locked due to {} consecutive failed attempts for userId={}", newAttempts, user.getId());
                throw new AccountLockedException("Tài khoản đã bị khóa 15 phút do nhập sai mật khẩu " + MAX_FAILED_LOGIN_ATTEMPTS + " lần liên tiếp");
            }

            userRepository.save(user);
            log.warn("Login failed: Invalid password for userId={} attemptCount={}", user.getId(), newAttempts);
            throw new InvalidCredentialsException();
        }

        // Reset failed login count on success
        user.setFailedLoginAttempts(0);
        user.setLockedUntil(null);
        userRepository.save(user);

        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String rawRefreshToken = generateRawRefreshToken();
        UUID familyId = UUID.randomUUID();
        String tokenHash = tokenHashService.hash(rawRefreshToken);
        Instant expiresAt = Instant.now().plusSeconds(jwtProperties.refreshTokenExpirationSeconds());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .familyId(familyId)
                .status(RefreshTokenStatus.ACTIVE)
                .expiresAt(expiresAt)
                .build();

        refreshTokenRepository.save(refreshToken);
        setRefreshTokenCookie(response, rawRefreshToken, jwtProperties.refreshTokenExpirationSeconds());

        log.info("Login successful for userId={} familyId={}", user.getId(), familyId);
        return new LoginResponse(
                accessToken,
                "Bearer",
                jwtProperties.accessTokenExpirationSeconds(),
                authMapper.toUserSummaryResponse(user)
        );
    }

    @Override
    @Transactional
    public TokenRefreshResponse refreshToken(String rawRefreshToken, HttpServletResponse response) {
        if (rawRefreshToken == null || rawRefreshToken.isBlank()) {
            throw new TokenInvalidException("Thiếu Refresh Token Cookie");
        }

        String tokenHash = tokenHashService.hash(rawRefreshToken);
        RefreshToken refreshTokenEntity = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> {
                    log.warn("Refresh token not found for hash");
                    return new TokenInvalidException("Refresh Token không hợp lệ");
                });

        User user = refreshTokenEntity.getUser();
        if (user.getStatus() != AccountStatus.ACTIVE) {
            log.warn("Refresh token rejected: Account status is {}", user.getStatus());
            throw new AccountDisabledException();
        }

        Instant now = Instant.now();
        if (now.isAfter(refreshTokenEntity.getExpiresAt()) || refreshTokenEntity.getStatus() == RefreshTokenStatus.EXPIRED) {
            if (refreshTokenEntity.getStatus() == RefreshTokenStatus.ACTIVE) {
                refreshTokenEntity.setStatus(RefreshTokenStatus.EXPIRED);
                refreshTokenRepository.save(refreshTokenEntity);
            }
            throw new TokenExpiredException("Refresh Token đã hết hạn. Vui lòng đăng nhập lại.");
        }

        // Grace period check for USED tokens
        if (refreshTokenEntity.getStatus() == RefreshTokenStatus.USED) {
            RefreshToken replacementToken = null;
            if (refreshTokenEntity.getReplacedByTokenId() != null) {
                replacementToken = refreshTokenRepository.findById(refreshTokenEntity.getReplacedByTokenId()).orElse(null);
            }

            // Security Check: If replacement token is missing, REVOKED, or EXPIRED, deny grace period access!
            if (replacementToken == null || replacementToken.getStatus() == RefreshTokenStatus.REVOKED || replacementToken.getStatus() == RefreshTokenStatus.EXPIRED) {
                log.warn("Grace period rejected: Replacement token is missing or revoked/expired (status={}) for familyId={}",
                        replacementToken != null ? replacementToken.getStatus() : "NULL", refreshTokenEntity.getFamilyId());
                refreshTokenRepository.updateStatusByFamilyId(refreshTokenEntity.getFamilyId(), RefreshTokenStatus.REVOKED);
                clearRefreshTokenCookie(response);
                throw new TokenReusedException();
            }

            Instant rotationTime = replacementToken.getCreatedAt();
            if (now.isBefore(rotationTime.plusSeconds(jwtProperties.gracePeriodSeconds()))) {
                log.info("Concurrent refresh detected within grace period for familyId={}", refreshTokenEntity.getFamilyId());
                String newAccessToken = jwtTokenProvider.generateAccessToken(user);
                return new TokenRefreshResponse(newAccessToken, "Bearer", jwtProperties.accessTokenExpirationSeconds());
            }

            // Reuse detection outside grace period -> Revoke entire token family
            log.error("REFRESH TOKEN REUSE DETECTED! Revoking familyId={} for userId={}", refreshTokenEntity.getFamilyId(), user.getId());
            refreshTokenRepository.updateStatusByFamilyId(refreshTokenEntity.getFamilyId(), RefreshTokenStatus.REVOKED);
            clearRefreshTokenCookie(response);
            throw new TokenReusedException();
        }

        if (refreshTokenEntity.getStatus() == RefreshTokenStatus.REVOKED) {
            log.error("Revoked refresh token presented. Revoking familyId={}", refreshTokenEntity.getFamilyId());
            refreshTokenRepository.updateStatusByFamilyId(refreshTokenEntity.getFamilyId(), RefreshTokenStatus.REVOKED);
            clearRefreshTokenCookie(response);
            throw new TokenReusedException();
        }

        // Rotation (Token status is ACTIVE)
        refreshTokenEntity.setStatus(RefreshTokenStatus.USED);

        String newRawRefreshToken = generateRawRefreshToken();
        String newTokenHash = tokenHashService.hash(newRawRefreshToken);

        RefreshToken newRefreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(newTokenHash)
                .familyId(refreshTokenEntity.getFamilyId())
                .status(RefreshTokenStatus.ACTIVE)
                .expiresAt(refreshTokenEntity.getExpiresAt()) // Inherit original 7-day expiration
                .build();

        RefreshToken savedNewToken = refreshTokenRepository.save(newRefreshToken);
        refreshTokenEntity.setReplacedByTokenId(savedNewToken.getId());
        refreshTokenRepository.save(refreshTokenEntity);

        String newAccessToken = jwtTokenProvider.generateAccessToken(user);
        setRefreshTokenCookie(response, newRawRefreshToken, jwtProperties.refreshTokenExpirationSeconds());

        log.info("Token rotated successfully for userId={} familyId={}", user.getId(), refreshTokenEntity.getFamilyId());
        return new TokenRefreshResponse(newAccessToken, "Bearer", jwtProperties.accessTokenExpirationSeconds());
    }

    @Override
    @Transactional
    public MessageResponse logout(String rawRefreshToken, HttpServletResponse response) {
        clearRefreshTokenCookie(response);

        if (rawRefreshToken != null && !rawRefreshToken.isBlank()) {
            try {
                String tokenHash = tokenHashService.hash(rawRefreshToken);
                refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
                    token.setStatus(RefreshTokenStatus.REVOKED);
                    refreshTokenRepository.save(token);
                    log.info("Refresh token revoked during logout for userId={}", token.getUser().getId());
                });
            } catch (Exception e) {
                log.warn("Error revoking token on logout: {}", e.getMessage());
            }
        }

        return new MessageResponse("Đăng xuất thành công");
    }

    @Override
    @Transactional
    public MessageResponse changePassword(UUID userId, com.ats.api.auth.dto.request.ChangePasswordRequest request) {
        log.info("Processing change password request for userId={}", userId);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new com.ats.api.auth.exception.AuthException("Người dùng không tồn tại", "USER_NOT_FOUND", org.springframework.http.HttpStatus.NOT_FOUND));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            log.warn("Change password failed: Invalid current password for userId={}", userId);
            throw new com.ats.api.auth.exception.AuthException("Mật khẩu hiện tại không chính xác", "INVALID_CURRENT_PASSWORD", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            log.warn("Change password failed: New password identical to old password for userId={}", userId);
            throw new com.ats.api.auth.exception.AuthException("Mật khẩu mới không được giống mật khẩu cũ", "PASSWORD_SAME_AS_OLD", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            log.warn("Change password failed: Confirm password mismatch for userId={}", userId);
            throw new com.ats.api.auth.exception.AuthException("Mật khẩu xác nhận không trùng khớp", "PASSWORD_MISMATCH", org.springframework.http.HttpStatus.BAD_REQUEST);
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        refreshTokenRepository.updateStatusByUserId(userId, RefreshTokenStatus.REVOKED);
        log.info("Password updated successfully and all active refresh tokens revoked for userId={}", userId);

        return new MessageResponse("Đổi mật khẩu thành công. Vui lòng đăng nhập lại với mật khẩu mới.");
    }

    private String generateRawRefreshToken() {
        return UUID.randomUUID() + "-" + UUID.randomUUID();
    }

    private void setRefreshTokenCookie(HttpServletResponse response, String refreshTokenValue, long maxAgeSeconds) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, refreshTokenValue)
                .httpOnly(true)
                .secure(false)
                .path(COOKIE_PATH)
                .sameSite("Lax")
                .maxAge(maxAgeSeconds)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    private void clearRefreshTokenCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(REFRESH_TOKEN_COOKIE_NAME, "")
                .httpOnly(true)
                .secure(false)
                .path(COOKIE_PATH)
                .sameSite("Lax")
                .maxAge(0)
                .build();
        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }
}
