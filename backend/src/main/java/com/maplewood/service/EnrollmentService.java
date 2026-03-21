package com.maplewood.service;

import com.maplewood.model.Enrollment;
import com.maplewood.model.Enrollment.Status;
import com.maplewood.model.Student;
import com.maplewood.model.StudentCourseHistory;
import com.maplewood.model.Course;
import com.maplewood.model.CourseSection;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentCourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.repository.CourseSectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final StudentCourseHistoryRepository historyRepository;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseSectionRepository courseSectionRepository,
                             StudentCourseHistoryRepository historyRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseSectionRepository = courseSectionRepository;
        this.historyRepository = historyRepository;
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

        List<Enrollment> currentEnrollments = enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED);
        if (currentEnrollments.size() >= 5) {
            throw new RuntimeException("Cannot enroll in more than 5 sections");
        }

        List<StudentCourseHistory> history = historyRepository.findByStudentIdWithCourse(studentId);
        boolean prerequisitesMet = hasMetPrerequisites(section.getCourse(), history);
        if (!prerequisitesMet) {
            throw new RuntimeException("Prerequisites not met");
        }
        
        boolean hasConflict = hasSectionTimeConflict(student, section, currentEnrollments.stream()
                .map(Enrollment::getSection)
                .toList());

        if (hasConflict) {
            throw new RuntimeException("Section time conflict");
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

    private boolean hasSectionTimeConflict(Student student, CourseSection newSection, List<CourseSection> enrolledSections) {
        String newDay = newSection.getDayOfWeek();
        LocalTime newStart = LocalTime.parse(newSection.getStartTime());
        LocalTime newEnd = LocalTime.parse(newSection.getEndTime());

        return enrolledSections.stream()
                .filter(enrolled -> enrolled.getDayOfWeek().equalsIgnoreCase(newDay))
                .anyMatch(enrolled -> {
                    LocalTime enrolledStart = LocalTime.parse(enrolled.getStartTime());
                    LocalTime enrolledEnd = LocalTime.parse(enrolled.getEndTime());
                    return newStart.isBefore(enrolledEnd) && newEnd.isAfter(enrolledStart);
                });
    }

    private boolean hasMetPrerequisites(Course targetCourse, List<StudentCourseHistory> courseHistory) {
        Long prereqId = targetCourse.getPrerequisiteId();
        if (prereqId == null) {
            return true;
        }
        return courseHistory.stream()
                .filter(history -> history.getCourse().getId().equals(prereqId))
                .anyMatch(history -> "PASSED".equalsIgnoreCase(history.getStatus()));
    }
}