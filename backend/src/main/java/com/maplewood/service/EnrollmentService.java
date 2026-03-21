package com.maplewood.service;

import com.maplewood.model.Enrollment;
import com.maplewood.model.Enrollment.Status;
import com.maplewood.model.Student;
import com.maplewood.model.CourseSection;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseSectionRepository courseSectionRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseSectionRepository courseSectionRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseSectionRepository = courseSectionRepository;
    }

    public List<Enrollment> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED);
    }

    @Transactional
    public Enrollment enroll(Long studentId, Long sectionId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        CourseSection section = courseSectionRepository.findById(sectionId)
                .orElseThrow(() -> new RuntimeException("Section not found"));

        enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .ifPresent(e -> {
                    throw new RuntimeException("Already enrolled in this section");
                });

        long enrolled = enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED);
        if (enrolled >= section.getMaxCapacity()) {
            throw new RuntimeException("Section is full");
        }

        Enrollment enrollment = new Enrollment(student, section, Status.ENROLLED);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment drop(Long studentId, Long sectionId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setStatus(Status.DROPPED);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment complete(Long studentId, Long sectionId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .orElseThrow(() -> new RuntimeException("Enrollment not found"));

        enrollment.setStatus(Status.COMPLETED);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public List<Enrollment> enrollBatch(Long studentId, List<Long> sectionIds) {
        return sectionIds.stream()
                .map(sectionId -> enroll(studentId, sectionId))
                .toList();
    }
}