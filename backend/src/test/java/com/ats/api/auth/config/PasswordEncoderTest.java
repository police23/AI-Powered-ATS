package com.ats.api.auth.config;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class PasswordEncoderTest {

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    @DisplayName("givenRawPassword_whenEncodeAndMatches_thenReturnTrueForValidPasswordAndFalseForWrong")
    void givenRawPassword_whenEncodeAndMatches_thenReturnTrueForValidPasswordAndFalseForWrong() {
        // TC-U02: Mã hóa và Đối chiếu Mật khẩu an toàn với BCrypt
        String rawPassword = "Password123!";
        String encodedHash = passwordEncoder.encode(rawPassword);

        assertTrue(passwordEncoder.matches("Password123!", encodedHash));
        assertFalse(passwordEncoder.matches("WrongPass", encodedHash));
    }
}
