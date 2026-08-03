package com.ats.api.job.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public class JobException extends RuntimeException {

    private final String code;
    private final HttpStatus httpStatus;

    public JobException(String message, String code, HttpStatus httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }

    public JobException(String message, String code) {
        this(message, code, HttpStatus.BAD_REQUEST);
    }
}
