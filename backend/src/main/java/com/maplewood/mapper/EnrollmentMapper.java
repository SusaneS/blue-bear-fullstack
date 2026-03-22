package com.maplewood.mapper;

import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.model.CourseSection;
import com.maplewood.model.Enrollment;
import com.maplewood.model.Student;
import com.maplewood.repository.CourseSectionRepository;
import com.maplewood.repository.StudentRepository;

public class EnrollmentMapper {
    private final StudentRepository studentRepository;
    private final CourseSectionRepository sectionRepository;

    public EnrollmentMapper(StudentRepository studentRepository, CourseSectionRepository sectionRepository) {
        this.studentRepository = studentRepository;
        this.sectionRepository = sectionRepository;
    }

    public static EnrollmentDTO toDTO(Enrollment enrollment) {
        if (enrollment == null) return null;
        EnrollmentDTO dto = new EnrollmentDTO();
        dto.setId(enrollment.getId());
        dto.setStudentId(enrollment.getStudent().getId());
        dto.setCourseSectionId(enrollment.getSection().getId());
        dto.setSemesterId(enrollment.getSection().getSemester().getId());
        dto.setStatus(enrollment.getStatus().name().toLowerCase());
        return dto;
    }

    public Enrollment toEntity(EnrollmentDTO dto) {
        if (dto == null) return null;
        Enrollment enrollment = new Enrollment();
        Student student = studentRepository.findById(dto.getStudentId()).orElseThrow(() -> new RuntimeException("Student not found"));
        CourseSection section = sectionRepository.findById(dto.getCourseSectionId()).orElseThrow(() -> new RuntimeException("Section not found"));
        enrollment.setStudent(student);
        enrollment.setSection(section);
        enrollment.setStatus(Enrollment.Status.valueOf(dto.getStatus().toUpperCase()));
        return enrollment;
    }
}