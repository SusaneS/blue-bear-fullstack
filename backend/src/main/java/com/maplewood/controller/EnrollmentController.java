package com.maplewood.controller;

import com.maplewood.model.Enrollment;
import com.maplewood.service.EnrollmentFacade;
import com.maplewood.service.EnrollmentService;
import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.dto.EnrollmentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;
    private final EnrollmentFacade enrollmentFacade;

    public EnrollmentController(EnrollmentService enrollmentService, EnrollmentFacade enrollmentFacade) {
        this.enrollmentService = enrollmentService;
        this.enrollmentFacade = enrollmentFacade;
    }

    @PostMapping("/enroll")
    public ResponseEntity<EnrollmentDTO> enroll(@RequestBody EnrollmentRequest request) {
        EnrollmentDTO enrollment = enrollmentFacade.enroll(request.getStudentId(), request.getSectionId());
        return ResponseEntity.ok(enrollment);
    }

    @PutMapping("/complete")
    public ResponseEntity<Enrollment> complete(@RequestBody EnrollmentRequest request) {
        return ResponseEntity.ok(enrollmentService.complete(request.getStudentId(), request.getSectionId()));
    }

    @PutMapping("/drop")
    public ResponseEntity<Enrollment> drop(@RequestBody EnrollmentRequest request) {
        enrollmentService.drop(request.getStudentId(), request.getSectionId());
        return ResponseEntity.ok().build();
    }
}