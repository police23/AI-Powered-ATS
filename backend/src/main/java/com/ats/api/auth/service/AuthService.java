package com.ats.api.auth.service;

import com.ats.api.auth.dto.request.ChangePasswordRequest;
import com.ats.api.auth.dto.request.LoginRequest;
import com.ats.api.auth.dto.request.RegisterRequest;
import com.ats.api.auth.dto.response.LoginResponse;
import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.TokenRefreshResponse;
import jakarta.servlet.http.HttpServletResponse;

import java.util.UUID;

public interface AuthService {

    RegisterResponse register(RegisterRequest request);

    LoginResponse login(LoginRequest request, HttpServletResponse response);

    TokenRefreshResponse refreshToken(String rawRefreshToken, HttpServletResponse response);

    MessageResponse logout(String rawRefreshToken, HttpServletResponse response);

    MessageResponse changePassword(UUID userId, ChangePasswordRequest request);
}
