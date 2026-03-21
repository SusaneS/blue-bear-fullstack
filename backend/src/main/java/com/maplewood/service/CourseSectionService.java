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

    // TODO: Clean up this file and repository 
    // some of these queries might no longer be necessary with the new filtering logic
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

    public List<CourseSectionDTO> getSectionsFiltered(Long semesterId, Long courseId, Integer gradeLevel, boolean openOnly) {
        var sections = sectionRepository.findFiltered(semesterId, courseId, gradeLevel);

        return sections.stream()
                .filter(section -> !openOnly || !section.isFull())
                .map(sectionMapper::toDTO)
                .collect(Collectors.toList());
    }

    // Sections for a specific course
    public List<CourseSectionDTO> getSectionsForCourse(Long courseId, Long semesterId) {
        return sectionRepository.findByCourseIdAndSemesterId(courseId, semesterId).stream()
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