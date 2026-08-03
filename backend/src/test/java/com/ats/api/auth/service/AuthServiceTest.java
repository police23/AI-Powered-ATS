package com.ats.api.auth.service;

import com.ats.api.auth.config.JwtProperties;
import com.ats.api.auth.dto.request.LoginRequest;
import com.ats.api.auth.dto.request.RegisterRequest;
import com.ats.api.auth.dto.response.LoginResponse;
import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.TokenRefreshResponse;
import com.ats.api.auth.entity.RefreshToken;
import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.RefreshTokenStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.exception.AccountLockedException;
import com.ats.api.auth.exception.AdminRegistrationForbiddenException;
import com.ats.api.auth.exception.EmailConflictException;
import com.ats.api.auth.exception.InvalidCredentialsException;
import com.ats.api.auth.exception.TokenReusedException;
import com.ats.api.auth.mapper.AuthMapper;
import com.ats.api.auth.repository.RefreshTokenRepository;
import com.ats.api.auth.repository.UserRepository;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.auth.security.TokenHashService;
import com.ats.api.auth.service.impl.AuthServiceImpl;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider jwtTokenProvider;

    @Mock
    private TokenHashService tokenHashService;

    @Mock
    private HttpServletResponse servletResponse;

    private AuthMapper authMapper;
    private JwtProperties jwtProperties;
    private AuthService authService;

    @BeforeEach
    void setUp() {
        authMapper = new AuthMapper();
        jwtProperties = new JwtProperties(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                900,
                604800,
                10
        );
        authService = new AuthServiceImpl(
                userRepository,
                refreshTokenRepository,
                passwordEncoder,
                jwtTokenProvider,
                tokenHashService,
                authMapper,
                jwtProperties
        );
    }

    @Test
    @DisplayName("givenCandidateRequest_whenRegister_thenReturnRegisterResponse")
    void givenCandidateRequest_whenRegister_thenReturnRegisterResponse() {
        RegisterRequest request = new RegisterRequest("Candidate@Example.Com", "Password123!", UserRole.CANDIDATE, null);

        when(userRepository.existsByEmail("candidate@example.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123!")).thenReturn("encodedHash");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(UUID.randomUUID());
            u.setCreatedAt(Instant.now());
            return u;
        });

        RegisterResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("candidate@example.com", response.email());
        assertEquals(UserRole.CANDIDATE, response.role());
        assertEquals(AccountStatus.ACTIVE, response.status());
    }

    @Test
    @DisplayName("givenAdminRole_whenRegister_thenThrowAdminRegistrationForbiddenException")
    void givenAdminRole_whenRegister_thenThrowAdminRegistrationForbiddenException() {
        RegisterRequest request = new RegisterRequest("admin@example.com", "Password123!", UserRole.ADMIN, null);
        assertThrows(AdminRegistrationForbiddenException.class, () -> authService.register(request));
    }

    @Test
    @DisplayName("givenExistingEmail_whenRegister_thenThrowEmailConflictException")
    void givenExistingEmail_whenRegister_thenThrowEmailConflictException() {
        RegisterRequest request = new RegisterRequest("existing@example.com", "Password123!", UserRole.CANDIDATE, null);
        when(userRepository.existsByEmail("existing@example.com")).thenReturn(true);

        assertThrows(EmailConflictException.class, () -> authService.register(request));
    }

    @Test
    @DisplayName("givenValidCredentials_whenLogin_thenReturnLoginResponseAndSetCookie")
    void givenValidCredentials_whenLogin_thenReturnLoginResponseAndSetCookie() {
        LoginRequest request = new LoginRequest("user@example.com", "Password123!");
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .passwordHash("encodedHash")
                .role(UserRole.HR_MANAGER)
                .status(AccountStatus.ACTIVE)
                .failedLoginAttempts(0)
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123!", "encodedHash")).thenReturn(true);
        when(jwtTokenProvider.generateAccessToken(user)).thenReturn("mockJwtToken");
        when(tokenHashService.hash(any())).thenReturn("mockHash");

        LoginResponse loginResponse = authService.login(request, servletResponse);

        assertNotNull(loginResponse);
        assertEquals("mockJwtToken", loginResponse.accessToken());
        assertEquals("Bearer", loginResponse.tokenType());
        assertEquals(UserRole.HR_MANAGER, loginResponse.user().role());
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    @DisplayName("given5ConsecutiveFailedLogins_whenLogin_thenLockAccountAndThrowAccountLockedException")
    void given5ConsecutiveFailedLogins_whenLogin_thenLockAccountAndThrowAccountLockedException() {
        LoginRequest request = new LoginRequest("user@example.com", "WrongPassword");
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .passwordHash("encodedHash")
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .failedLoginAttempts(4)
                .build();

        when(userRepository.findByEmail("user@example.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword", "encodedHash")).thenReturn(false);

        assertThrows(AccountLockedException.class, () -> authService.login(request, servletResponse));
        assertEquals(AccountStatus.LOCKED, user.getStatus());
        assertEquals(5, user.getFailedLoginAttempts());
        assertNotNull(user.getLockedUntil());
    }

    @Test
    @DisplayName("givenReusedRefreshTokenOutsideGracePeriod_whenRefreshToken_thenRevokeFamilyAndThrowTokenReusedException")
    void givenReusedRefreshTokenOutsideGracePeriod_whenRefreshToken_thenRevokeFamilyAndThrowTokenReusedException() {
        String rawToken = "old-used-token";
        String tokenHash = "hash-old-used-token";
        UUID familyId = UUID.randomUUID();

        User user = User.builder()
                .id(UUID.randomUUID())
                .email("user@example.com")
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .build();

        RefreshToken usedTokenEntity = RefreshToken.builder()
                .id(UUID.randomUUID())
                .user(user)
                .tokenHash(tokenHash)
                .familyId(familyId)
                .status(RefreshTokenStatus.USED)
                .expiresAt(Instant.now().plusSeconds(3600))
                .createdAt(Instant.now().minusSeconds(60)) // Created 60 seconds ago (> grace period of 10s)
                .build();

        when(tokenHashService.hash(rawToken)).thenReturn(tokenHash);
        when(refreshTokenRepository.findByTokenHash(tokenHash)).thenReturn(Optional.of(usedTokenEntity));

        assertThrows(TokenReusedException.class, () -> authService.refreshToken(rawToken, servletResponse));
        verify(refreshTokenRepository).updateStatusByFamilyId(eq(familyId), eq(RefreshTokenStatus.REVOKED));
    }

    @Test
    @DisplayName("givenValidChangePasswordRequest_whenChangePassword_thenUpdatePasswordAndRevokeTokens")
    void givenValidChangePasswordRequest_whenChangePassword_thenUpdatePasswordAndRevokeTokens() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("user@example.com")
                .passwordHash("oldEncodedHash")
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .build();

        com.ats.api.auth.dto.request.ChangePasswordRequest request = new com.ats.api.auth.dto.request.ChangePasswordRequest(
                "OldPassword123@",
                "NewPassword456#",
                "NewPassword456#"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPassword123@", "oldEncodedHash")).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456#", "oldEncodedHash")).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456#")).thenReturn("newEncodedHash");

        com.ats.api.auth.dto.response.MessageResponse response = authService.changePassword(userId, request);

        assertNotNull(response);
        assertEquals("newEncodedHash", user.getPasswordHash());
        verify(userRepository).save(user);
        verify(refreshTokenRepository).updateStatusByUserId(eq(userId), eq(RefreshTokenStatus.REVOKED));
    }

    @Test
    @DisplayName("givenWrongCurrentPassword_whenChangePassword_thenThrowAuthException")
    void givenWrongCurrentPassword_whenChangePassword_thenThrowAuthException() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .passwordHash("oldEncodedHash")
                .build();

        com.ats.api.auth.dto.request.ChangePasswordRequest request = new com.ats.api.auth.dto.request.ChangePasswordRequest(
                "WrongPassword123@",
                "NewPassword456#",
                "NewPassword456#"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword123@", "oldEncodedHash")).thenReturn(false);

        com.ats.api.auth.exception.AuthException ex = assertThrows(
                com.ats.api.auth.exception.AuthException.class,
                () -> authService.changePassword(userId, request)
        );
        assertEquals("INVALID_CURRENT_PASSWORD", ex.getCode());
    }

    @Test
    @DisplayName("givenSamePasswordAsOld_whenChangePassword_thenThrowAuthException")
    void givenSamePasswordAsOld_whenChangePassword_thenThrowAuthException() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .passwordHash("oldEncodedHash")
                .build();

        com.ats.api.auth.dto.request.ChangePasswordRequest request = new com.ats.api.auth.dto.request.ChangePasswordRequest(
                "OldPassword123@",
                "OldPassword123@",
                "OldPassword123@"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPassword123@", "oldEncodedHash")).thenReturn(true);

        com.ats.api.auth.exception.AuthException ex = assertThrows(
                com.ats.api.auth.exception.AuthException.class,
                () -> authService.changePassword(userId, request)
        );
        assertEquals("PASSWORD_SAME_AS_OLD", ex.getCode());
    }

    @Test
    @DisplayName("givenConfirmPasswordMismatch_whenChangePassword_thenThrowAuthException")
    void givenConfirmPasswordMismatch_whenChangePassword_thenThrowAuthException() {
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .passwordHash("oldEncodedHash")
                .build();

        com.ats.api.auth.dto.request.ChangePasswordRequest request = new com.ats.api.auth.dto.request.ChangePasswordRequest(
                "OldPassword123@",
                "NewPassword456#",
                "DifferentConfirmPassword789$"
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("OldPassword123@", "oldEncodedHash")).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456#", "oldEncodedHash")).thenReturn(false);

        com.ats.api.auth.exception.AuthException ex = assertThrows(
                com.ats.api.auth.exception.AuthException.class,
                () -> authService.changePassword(userId, request)
        );
        assertEquals("PASSWORD_MISMATCH", ex.getCode());
    }
}
