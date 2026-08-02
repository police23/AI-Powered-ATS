package com.ats.api.auth.util;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class AuthUtilsTest {

    @Test
    @DisplayName("givenRawEmailWithSpacesAndUpperCase_whenNormalizeEmail_thenReturnTrimmedLowerCaseEmail")
    void givenRawEmailWithSpacesAndUpperCase_whenNormalizeEmail_thenReturnTrimmedLowerCaseEmail() {
        // TC-U01: Chuẩn hóa định dạng Email khi Đăng ký & Đăng nhập
        String rawInput = "   NguyenVanA@Domain.Com   ";
        String result = AuthUtils.normalizeEmail(rawInput);
        assertEquals("nguyenvana@domain.com", result);
    }

    @Test
    @DisplayName("givenNullEmail_whenNormalizeEmail_thenReturnNull")
    void givenNullEmail_whenNormalizeEmail_thenReturnNull() {
        assertNull(AuthUtils.normalizeEmail(null));
    }
}
