package com.maplewood.controller;

import com.maplewood.dto.StudentDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.model.Enrollment;
import com.maplewood.service.EnrollmentService;
import com.maplewood.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final EnrollmentService enrollmentService;

    public StudentController(StudentService studentService, EnrollmentService enrollmentService) {
        this.studentService = studentService;
        this.enrollmentService = enrollmentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }

    @GetMapping("/{id}/schedule")
    public ResponseEntity<List<Enrollment>> getSchedule(@PathVariable Long id) {
        return ResponseEntity.ok(enrollmentService.getEnrollmentsByStudent(id));
    }
}