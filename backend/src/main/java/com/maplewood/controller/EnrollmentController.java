package com.maplewood.controller;

import com.maplewood.model.Enrollment;
import com.maplewood.service.EnrollmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    @PostMapping("/enroll")
    public ResponseEntity<Enrollment> enroll(@RequestParam Long studentId,
                                              @RequestParam Long sectionId) {
        return ResponseEntity.ok(enrollmentService.enroll(studentId, sectionId));
    }

    @PutMapping("/complete")
    public ResponseEntity<Enrollment> complete(@RequestParam Long studentId,
                                            @RequestParam Long sectionId) {
        return ResponseEntity.ok(enrollmentService.complete(studentId, sectionId));
    }

    @PutMapping("/drop")
    public ResponseEntity<Enrollment> drop(@RequestParam Long studentId,
                                            @RequestParam Long sectionId) {
        return ResponseEntity.ok(enrollmentService.drop(studentId, sectionId));
    }

    @PostMapping("/enroll/batch")
    public ResponseEntity<List<Enrollment>> enrollBatch(@RequestParam Long studentId,
                                                         @RequestBody List<Long> sectionIds) {
        return ResponseEntity.ok(enrollmentService.enrollBatch(studentId, sectionIds));
    }
}