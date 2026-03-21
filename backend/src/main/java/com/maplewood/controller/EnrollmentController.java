package com.maplewood.controller;

import com.maplewood.model.Enrollment;
import com.maplewood.service.EnrollmentService;
import com.maplewood.dto.EnrollmentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/enroll")
    public ResponseEntity<Enrollment> enroll(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.enroll(request.getStudentId(), request.getSectionId()));
    }

    @PutMapping("/complete")
    public ResponseEntity<Enrollment> complete(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.complete(request.getStudentId(), request.getSectionId()));
    }

    @PutMapping("/drop")
    public ResponseEntity<Enrollment> drop(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.drop(request.getStudentId(), request.getSectionId()));
    }

    // @PostMapping("/enroll/batch")
    // public ResponseEntity<List<Enrollment>> enrollBatch(@RequestBody EnrollmentBatchRequest request) {
    //     return ResponseEntity.ok(enrollmentService.enrollBatch(request.getStudentId(), request.getSectionIds()));
    // }
}