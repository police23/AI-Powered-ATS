package com.ats.api.auth.security;

import com.ats.api.auth.config.JwtProperties;
import com.ats.api.auth.entity.User;
import com.ats.api.auth.entity.enums.AccountStatus;
import com.ats.api.auth.entity.enums.UserRole;
import com.ats.api.auth.exception.TokenInvalidException;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtTokenProviderTest {

    private JwtTokenProvider jwtTokenProvider;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties(
                "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970",
                900,
                604800,
                10
        );
        jwtTokenProvider = new JwtTokenProvider(properties);
    }

    @Test
    @DisplayName("givenUser_whenGenerateAccessToken_thenReturnValidJwtAndExtractClaims")
    void givenUser_whenGenerateAccessToken_thenReturnValidJwtAndExtractClaims() {
        // TC-U03: Đóng gói, Ký số và Xác thực Chữ ký JWT Token
        UUID userId = UUID.randomUUID();
        User user = User.builder()
                .id(userId)
                .email("test@example.com")
                .role(UserRole.HR_MANAGER)
                .status(AccountStatus.ACTIVE)
                .build();

        String token = jwtTokenProvider.generateAccessToken(user);

        assertTrue(jwtTokenProvider.validateToken(token));

        Claims claims = jwtTokenProvider.extractClaims(token);
        assertEquals(userId.toString(), claims.getSubject());
        assertEquals("test@example.com", claims.get("email"));
        assertEquals("HR_MANAGER", claims.get("role"));
        assertEquals("ACTIVE", claims.get("status"));
    }

    @Test
    @DisplayName("givenTamperedJwt_whenExtractClaims_thenThrowTokenInvalidException")
    void givenTamperedJwt_whenExtractClaims_thenThrowTokenInvalidException() {
        // TC-U04: Xử lý JWT Token sai Chữ ký hoặc bị Can thiệp Payload
        User user = User.builder()
                .id(UUID.randomUUID())
                .email("test@example.com")
                .role(UserRole.CANDIDATE)
                .status(AccountStatus.ACTIVE)
                .build();

        String token = jwtTokenProvider.generateAccessToken(user);
        String tamperedToken = token.substring(0, token.length() - 5) + "abcde";

        assertFalse(jwtTokenProvider.validateToken(tamperedToken));
        assertThrows(TokenInvalidException.class, () -> jwtTokenProvider.extractClaims(tamperedToken));
    }
}
