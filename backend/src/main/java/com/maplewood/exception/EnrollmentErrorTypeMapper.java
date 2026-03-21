package com.maplewood.exception;

import org.springframework.http.HttpStatus;

import java.util.EnumMap;
import java.util.Map;

public class EnrollmentErrorTypeMapper {

    // Static map of ErrorType to HttpStatus
    private static final Map<EnrollmentException.ErrorType, HttpStatus> STATUS_MAP = new EnumMap<>(EnrollmentException.ErrorType.class);

    static {
        STATUS_MAP.put(EnrollmentException.ErrorType.STUDENT_NOT_FOUND, HttpStatus.NOT_FOUND);
        STATUS_MAP.put(EnrollmentException.ErrorType.SECTION_NOT_FOUND, HttpStatus.NOT_FOUND);
        STATUS_MAP.put(EnrollmentException.ErrorType.ALREADY_ENROLLED, HttpStatus.CONFLICT);
        STATUS_MAP.put(EnrollmentException.ErrorType.SECTION_FULL, HttpStatus.CONFLICT);
        STATUS_MAP.put(EnrollmentException.ErrorType.MAX_ENROLLMENT_REACHED, HttpStatus.BAD_REQUEST);
        STATUS_MAP.put(EnrollmentException.ErrorType.PREREQUISITES_NOT_MET, HttpStatus.FORBIDDEN);
        STATUS_MAP.put(EnrollmentException.ErrorType.TIME_CONFLICT, HttpStatus.CONFLICT);
        STATUS_MAP.put(EnrollmentException.ErrorType.ENROLLMENT_NOT_FOUND, HttpStatus.NOT_FOUND);
    }

    public static HttpStatus toHttpStatus(EnrollmentException.ErrorType errorType) {
        return STATUS_MAP.getOrDefault(errorType, HttpStatus.BAD_REQUEST);
    }
}