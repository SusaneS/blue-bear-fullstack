package com.maplewood.mapper;

import com.maplewood.dto.CourseHistoryDTO;
import com.maplewood.model.StudentCourseHistory;
import org.springframework.stereotype.Component;

@Component
public class CourseHistoryMapper {

    public CourseHistoryDTO toDTO(StudentCourseHistory history) {
        if (history == null) {
            return null;
        }

        return new CourseHistoryDTO(
                history.getId(),
                history.getCourse().getId(),
                history.getCourse().getName(),
                history.getSemester().getId(),
                history.getStatus()
        );
    }
}