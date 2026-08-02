package com.ats.api.auth.util;

public final class AuthUtils {

    private AuthUtils() {
        // Private constructor to prevent instantiation
    }

    public static String normalizeEmail(String email) {
        if (email == null) {
            return null;
        }
        return email.trim().toLowerCase();
    }
}
