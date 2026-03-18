package com.maplewood.mapper;

import com.maplewood.dto.CourseSectionDto;
import com.maplewood.model.*;
import org.springframework.stereotype.Component;

@Component
public class CourseSectionMapper {
    
    /**
     * Convert CourseSection entity to DTO
     * Requires related entities (Course, Semester, Teacher, Classroom)
     */
    public CourseSectionDto toDTO(CourseSection section, 
                                   CourseEntity course, 
                                   Semester semester, 
                                   Teacher teacher, 
                                   Classroom classroom) {
        
        CourseSectionDto dto = new CourseSectionDto();

        // Section fields
        dto.setId(section.getId());
        dto.setSectionLetter(section.getSectionLetter());
        dto.setDayOfWeek(section.getDayOfWeek());
        dto.setStartTime(section.getStartTime());
        dto.setEndTime(section.getEndTime());
        dto.setMaxCapacity(section.getMaxCapacity());
        dto.setCurrentEnrollment(section.getCurrentEnrollment());
        dto.setAvailableSeats(section.getMaxCapacity() - section.getCurrentEnrollment());
        dto.setIsFull(section.getCurrentEnrollment() >= section.getMaxCapacity());
        
        // Course fields
        dto.setCourseId(course.getId());
        dto.setCourseCode(course.getCode());
        dto.setCourseName(course.getName());
        
        // Semester fields
        dto.setSemesterId(semester.getId());
        dto.setSemesterName(semester.getName());
        dto.setSemesterYear(semester.getYear());
        
        // Teacher fields
        dto.setTeacherId(teacher.getId());
        dto.setTeacherName(teacher.getFirstName() + " " + teacher.getLastName());
        
        // Classroom fields
        dto.setClassroomId(classroom.getId());
        dto.setClassroomName(classroom.getName());
        
        return dto;
    }
}