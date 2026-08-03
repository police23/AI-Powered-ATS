package com.ats.api.profile.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class ProfileException extends RuntimeException {

    private final String code;
    private final HttpStatus httpStatus;

    public ProfileException(String message, String code, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }
}
