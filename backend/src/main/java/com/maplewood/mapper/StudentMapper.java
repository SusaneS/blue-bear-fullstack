package com.maplewood.mapper;

import com.maplewood.dto.StudentDTO;
import com.maplewood.model.Student;
import org.springframework.stereotype.Component;

@Component
public class StudentMapper {

    public StudentDTO toDTO(Student student) {
        if (student == null) {
            return null;
        }

        return new StudentDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getGradeLevel(),
                student.getEmail()
        );
    }
}