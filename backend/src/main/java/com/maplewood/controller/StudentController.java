package com.maplewood.controller;

import com.maplewood.dto.StudentDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping
    public ResponseEntity<List<StudentDTO>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable Long id) {
        return ResponseEntity.ok(studentService.getStudentProfile(id));
    }
}