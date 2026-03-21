package com.maplewood.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(EnrollmentException.class)
    public ResponseEntity<Map<String, Object>> handleEnrollmentException(EnrollmentException ex) {
        HttpStatus status = EnrollmentErrorTypeMapper.toHttpStatus(ex.getErrorType());
        return buildResponse(status, ex.getMessage());
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message) {
        return ResponseEntity.status(status).body(Map.of(
            "status", status.value(),
            "error", status.getReasonPhrase(),
            "message", message,
            "timestamp", LocalDateTime.now().toString()
        ));
    }
}