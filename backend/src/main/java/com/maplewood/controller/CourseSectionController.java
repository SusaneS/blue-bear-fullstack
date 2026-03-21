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

    @GetMapping
    public ResponseEntity<List<CourseSectionDTO>> getSections(
            @RequestParam Long semesterId,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Integer gradeLevel,
            @RequestParam(required = false, defaultValue = "false") boolean openOnly
    ) {
        return ResponseEntity.ok(
            sectionService.getSectionsFiltered(semesterId, courseId, gradeLevel, openOnly)
        );
    }
}