package com.maplewood.mapper;

import com.maplewood.dto.CourseDTO;
import com.maplewood.model.Course;
import org.springframework.stereotype.Component;

@Component
public class CourseMapper {

    public CourseDTO toDTO(Course course) {
        if (course == null) {
            return null;
        }

        return new CourseDTO(
                course.getId(),
                course.getCode(),
                course.getName(),
                course.getDescription(),
                course.getCredits().doubleValue(),
                course.getHoursPerWeek(),
                course.getCourseType(),
                course.getPrerequisiteId(),
                new CourseDTO.GradeLevelDto(course.getGradeLevelMin(), course.getGradeLevelMax())
        );
    }
}