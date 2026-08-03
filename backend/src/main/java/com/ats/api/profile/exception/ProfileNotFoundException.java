package com.ats.api.profile.exception;

import org.springframework.http.HttpStatus;

public class ProfileNotFoundException extends ProfileException {

    public ProfileNotFoundException(String message) {
        super(message, "USER_PROFILE_NOT_FOUND", HttpStatus.NOT_FOUND);
    }
}
