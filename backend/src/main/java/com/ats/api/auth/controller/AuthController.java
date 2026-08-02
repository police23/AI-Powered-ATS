package com.ats.api.auth.controller;

import com.ats.api.auth.dto.request.LoginRequest;
import com.ats.api.auth.dto.request.RegisterRequest;
import com.ats.api.auth.dto.response.LoginResponse;
import com.ats.api.auth.dto.response.MessageResponse;
import com.ats.api.auth.dto.response.RegisterResponse;
import com.ats.api.auth.dto.response.TokenRefreshResponse;
import com.ats.api.auth.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        RegisterResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        LoginResponse loginResponse = authService.login(request, response);
        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/refresh")
    public ResponseEntity<TokenRefreshResponse> refresh(
            @CookieValue(name = "refreshToken", required = false) String rawRefreshToken,
            HttpServletResponse response
    ) {
        TokenRefreshResponse refreshResponse = authService.refreshToken(rawRefreshToken, response);
        return ResponseEntity.ok(refreshResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @CookieValue(name = "refreshToken", required = false) String rawRefreshToken,
            HttpServletResponse response
    ) {
        MessageResponse messageResponse = authService.logout(rawRefreshToken, response);
        return ResponseEntity.ok(messageResponse);
    }
}
