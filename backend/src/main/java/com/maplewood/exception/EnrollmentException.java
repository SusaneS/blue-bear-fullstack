package com.maplewood.exception;

public class EnrollmentException extends RuntimeException {
    private final ErrorType errorType;

    public enum ErrorType {
        STUDENT_NOT_FOUND,
        SECTION_NOT_FOUND,
        ALREADY_ENROLLED,
        SECTION_FULL,
        MAX_ENROLLMENT_REACHED,
        PREREQUISITES_NOT_MET,
        TIME_CONFLICT,
        ENROLLMENT_NOT_FOUND
    }

    public EnrollmentException(ErrorType errorType, String message) {
        super(message);
        this.errorType = errorType;
    }

    public ErrorType getErrorType() {
        return errorType;
    }
}