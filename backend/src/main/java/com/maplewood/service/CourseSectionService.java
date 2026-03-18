package com.maplewood.service;

import com.maplewood.dto.CourseSectionDto;
import com.maplewood.mapper.CourseSectionMapper;
import com.maplewood.model.*;
import com.maplewood.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class CourseSectionService {
    
    @Autowired
    private CourseSectionRepository courseSectionRepository;
    
    @Autowired
    private SemesterRepository semesterRepository;
    
    @Autowired
    private CourseSectionMapper mapper;
    
    /**
     * Get sections for a specific course
     * Automatically uses active semester (course only exists in one semester)
     */
    public List<CourseSectionDto> getSectionsByCourseId(Long courseId) {
        Semester activeSemester = getActiveSemester();

        return courseSectionRepository
            .findByCourseIdAndSemesterIdWithDetails(courseId, activeSemester.getId()).stream()
            .map(this::mapResultToDTO)
            .toList();
    }
    

    public CourseSectionDto getSectionById(Long sectionId) {
        List<Object[]> results = courseSectionRepository
            .findByIdWithDetails(sectionId);
        
        if (results.isEmpty()) {
            return null;
        }
        
        return mapResultToDTO(results.get(0));
    }
    

    private Semester getActiveSemester() {
        return semesterRepository.findByIsActiveTrue()
            .orElseThrow(() -> new RuntimeException("No active semester found"));
    }

    private CourseSectionDto mapResultToDTO(Object[] result) {
        CourseSection section = (CourseSection) result[0];
        CourseEntity course = (CourseEntity) result[1];
        Semester semester = (Semester) result[2];
        Teacher teacher = (Teacher) result[3];
        Classroom classroom = (Classroom) result[4];
        
        return mapper.toDTO(section, course, semester, teacher, classroom);
    }
}