package com.ats.api.auth.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class TokenHashServiceTest {

    private final TokenHashService tokenHashService = new TokenHashService();

    @Test
    @DisplayName("givenRawRefreshToken_whenHash_thenReturnDeterministic64CharHex")
    void givenRawRefreshToken_whenHash_thenReturnDeterministic64CharHex() {
        // TC-U05: Băm Mã Refresh Token với SHA-256 trước khi lưu Database
        String rawToken = "raw-refresh-token-value-123456789";
        String hash1 = tokenHashService.hash(rawToken);
        String hash2 = tokenHashService.hash(rawToken);

        assertNotNull(hash1);
        assertEquals(64, hash1.length());
        assertEquals(hash1, hash2);

        String differentHash = tokenHashService.hash("different-raw-refresh-token");
        assertNotEquals(hash1, differentHash);
    }
}
