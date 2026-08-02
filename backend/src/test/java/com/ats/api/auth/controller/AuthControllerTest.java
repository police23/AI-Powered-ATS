package com.ats.api.auth.controller;

import com.ats.api.auth.dto.request.LoginRequest;
import com.ats.api.auth.dto.request.RegisterRequest;
import com.ats.api.auth.dto.response.LoginResponse;
import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.TokenRefreshResponse;
import com.ats.api.auth.dto.response.UserSummaryResponse;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.exception.AdminRegistrationForbiddenException;
import com.ats.api.auth.exception.InvalidCredentialsException;
import com.ats.api.auth.security.JwtAuthenticationFilter;
import com.ats.api.auth.security.JwtTokenProvider;
import com.ats.api.auth.service.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.Instant;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private AuthService authService;

    @MockitoBean
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    private JwtTokenProvider jwtTokenProvider;

    @Test
    @DisplayName("givenCandidateRegisterRequest_whenPostRegister_thenReturn201Created")
    void givenCandidateRegisterRequest_whenPostRegister_thenReturn201Created() throws Exception {
        // TC-I01: Đăng ký Candidate thành công
        RegisterRequest request = new RegisterRequest("candidate@example.com", "Password123!", UserRole.CANDIDATE, null);
        RegisterResponse response = new RegisterResponse(UUID.randomUUID(), "candidate@example.com", UserRole.CANDIDATE, AccountStatus.ACTIVE, Instant.now());

        when(authService.register(any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("candidate@example.com"))
                .andExpect(jsonPath("$.role").value("CANDIDATE"));
    }

    @Test
    @DisplayName("givenAdminRegisterRequest_whenPostRegister_thenReturn403Forbidden")
    void givenAdminRegisterRequest_whenPostRegister_thenReturn403Forbidden() throws Exception {
        // TC-I01: Ngăn chặn Đăng ký Role ADMIN
        RegisterRequest request = new RegisterRequest("admin@example.com", "Password123!", UserRole.ADMIN, null);

        when(authService.register(any())).thenThrow(new AdminRegistrationForbiddenException());

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.code").value("AUTH_ADMIN_REGISTRATION_FORBIDDEN"));
    }

    @Test
    @DisplayName("givenValidLoginRequest_whenPostLogin_thenReturn200OKAndTokenResponse")
    void givenValidLoginRequest_whenPostLogin_thenReturn200OKAndTokenResponse() throws Exception {
        // TC-I02: Đăng nhập Thành công & Cấp phát Cặp Token
        LoginRequest request = new LoginRequest("hr@company.com", "Password123!");
        UserSummaryResponse userSummary = new UserSummaryResponse(UUID.randomUUID(), "hr@company.com", UserRole.HR_MANAGER, AccountStatus.ACTIVE);
        LoginResponse response = new LoginResponse("mockAccessToken", "Bearer", 900, userSummary);

        when(authService.login(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("mockAccessToken"))
                .andExpect(jsonPath("$.tokenType").value("Bearer"))
                .andExpect(jsonPath("$.user.email").value("hr@company.com"));
    }

    @Test
    @DisplayName("givenInvalidLoginCredentials_whenPostLogin_thenReturn401Unauthorized")
    void givenInvalidLoginCredentials_whenPostLogin_thenReturn401Unauthorized() throws Exception {
        LoginRequest request = new LoginRequest("user@example.com", "WrongPassword");

        when(authService.login(any(), any())).thenThrow(new InvalidCredentialsException());

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.code").value("AUTH_INVALID_CREDENTIALS"));
    }

    @Test
    @DisplayName("givenValidRefreshTokenCookie_whenPostRefresh_thenReturn200OKAndNewToken")
    void givenValidRefreshTokenCookie_whenPostRefresh_thenReturn200OKAndNewToken() throws Exception {
        // TC-I03: Xoay vòng Token Thành công
        TokenRefreshResponse response = new TokenRefreshResponse("newAccessToken", "Bearer", 900);

        when(authService.refreshToken(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/refresh")
                        .cookie(new Cookie("refreshToken", "valid-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken").value("newAccessToken"));
    }

    @Test
    @DisplayName("givenLogoutRequest_whenPostLogout_thenReturn200OK")
    void givenLogoutRequest_whenPostLogout_thenReturn200OK() throws Exception {
        // TC-I06: Xử lý Đăng xuất
        MessageResponse response = new MessageResponse("Đăng xuất thành công");

        when(authService.logout(any(), any())).thenReturn(response);

        mockMvc.perform(post("/api/v1/auth/logout")
                        .cookie(new Cookie("refreshToken", "some-refresh-token")))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Đăng xuất thành công"));
    }
}
