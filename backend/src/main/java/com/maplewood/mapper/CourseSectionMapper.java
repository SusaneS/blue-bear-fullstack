package com.maplewood.mapper;

import com.maplewood.dto.CourseSectionDTO;
import com.maplewood.model.CourseSection;
import org.springframework.stereotype.Component;

@Component
public class CourseSectionMapper {

    public CourseSectionDTO toDTO(CourseSection section) {
        if (section == null) {
            return null;
        }

        return new CourseSectionDTO(
                section.getId(),
                section.getCourse().getId(),
                section.getCourse().getCode(),
                section.getCourse().getName(),
                section.getCourse().getCourseType(),
                section.getCourse().getCredits().doubleValue(),
                section.getSectionLetter(),
                section.getDayOfWeek(),
                section.getStartTime(),
                section.getEndTime(),
                section.getTeacher().getFirstName() + " " + section.getTeacher().getLastName(),
                section.getClassroom().getName(),
                section.getMaxCapacity(),
                section.getCurrentEnrollment()
        );
    }
}