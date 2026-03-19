package com.maplewood.controller;

import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.service.CourseSectionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sections")
public class CourseSectionController {

    private final CourseSectionService sectionService;

    public CourseSectionController(CourseSectionService sectionService) {
        this.sectionService = sectionService;
    }

    // GET /api/sections?semesterId=10
    @GetMapping
    public ResponseEntity<List<CourseSectionDTO>> getSections(@RequestParam Long semesterId) {
        return ResponseEntity.ok(sectionService.getSectionsBySemester(semesterId));
    }

    // GET /api/sections/course/5?semesterId=10
    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<CourseSectionDTO>> getSectionsForCourse(
            @PathVariable Long courseId,
            @RequestParam Long semesterId) {
        return ResponseEntity.ok(sectionService.getSectionsForCourse(courseId, semesterId));
    }

    // GET /api/sections/grade/10?semesterId=10
    @GetMapping("/grade/{gradeLevel}")
    public ResponseEntity<List<CourseSectionDTO>> getSectionsForGrade(
            @PathVariable Integer gradeLevel,
            @RequestParam Long semesterId) {
        return ResponseEntity.ok(sectionService.getSectionsForGrade(semesterId, gradeLevel));
    }

    // GET /api/sections/open/10?semesterId=10
    @GetMapping("/open/{gradeLevel}")
    public ResponseEntity<List<CourseSectionDTO>> getOpenSections(
            @PathVariable Integer gradeLevel,
            @RequestParam Long semesterId) {
        return ResponseEntity.ok(sectionService.getOpenSectionsForGrade(semesterId, gradeLevel));
    }
}