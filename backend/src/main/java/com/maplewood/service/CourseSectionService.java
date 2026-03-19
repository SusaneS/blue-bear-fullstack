package com.maplewood.service;

import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.mapper.CourseSectionMapper;
import com.maplewood.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class CourseSectionService {

    private final CourseSectionRepository sectionRepository;
    private final CourseSectionMapper sectionMapper;

    public CourseSectionService(CourseSectionRepository sectionRepository, CourseSectionMapper sectionMapper) {
        this.sectionRepository = sectionRepository;
        this.sectionMapper = sectionMapper;
    }

    // All sections for a semester
    public List<CourseSectionDTO> getSectionsBySemester(Long semesterId) {
        return sectionRepository.findBySemesterIdWithDetails(semesterId).stream()
                .map(sectionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Sections for a specific course
    public List<CourseSectionDTO> getSectionsForCourse(Long courseId, Long semesterId) {
        return sectionRepository.findByCourseIdAndSemesterId(courseId, semesterId).stream()
                .map(sectionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Open sections available for a student's grade
    public List<CourseSectionDTO> getOpenSectionsForGrade(Long semesterId, Integer gradeLevel) {
        return sectionRepository.findOpenSectionsForGrade(semesterId, gradeLevel).stream()
                .map(sectionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // All sections available for a grade (including full)
    public List<CourseSectionDTO> getSectionsForGrade(Long semesterId, Integer gradeLevel) {
        return sectionRepository.findAvailableForGrade(semesterId, gradeLevel).stream()
                .map(sectionMapper::toDTO)
                .collect(Collectors.toList());
    }
}