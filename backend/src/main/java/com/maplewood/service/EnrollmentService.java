package com.maplewood.service;

import com.maplewood.model.Enrollment;
import com.maplewood.model.Enrollment.Status;
import com.maplewood.model.Student;
import com.maplewood.model.StudentCourseHistory;
import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.exception.EnrollmentException;
import com.maplewood.mapper.EnrollmentMapper;
import com.maplewood.model.Course;
import com.maplewood.model.CourseSection;
import com.maplewood.repository.EnrollmentRepository;
import com.maplewood.repository.StudentCourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import com.maplewood.repository.CourseRepository;
import com.maplewood.repository.CourseSectionRepository;

import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final StudentRepository studentRepository;
    private final CourseSectionRepository courseSectionRepository;
    private final CourseRepository courseRepository;
    private final StudentCourseHistoryRepository historyRepository;
    private final int MAX_STUDENT_ENROLLMENTS = 5;

    public EnrollmentService(EnrollmentRepository enrollmentRepository,
                             StudentRepository studentRepository,
                             CourseSectionRepository courseSectionRepository,
                             CourseRepository courseRepository,
                             StudentCourseHistoryRepository historyRepository) {
        this.enrollmentRepository = enrollmentRepository;
        this.studentRepository = studentRepository;
        this.courseSectionRepository = courseSectionRepository;
        this.courseRepository = courseRepository;
        this.historyRepository = historyRepository;
    }

    public List<EnrollmentDTO> getEnrollmentsByStudent(Long studentId) {
        return enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)
        .stream()
        .map(EnrollmentMapper::toDTO)
        .toList();
    }

    @Transactional
    public void enroll(Long studentId, Long sectionId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new EnrollmentException(EnrollmentException.ErrorType.STUDENT_NOT_FOUND, "Student not found"));

        CourseSection section = courseSectionRepository.findById(sectionId)
                .orElseThrow(() -> new EnrollmentException(EnrollmentException.ErrorType.SECTION_NOT_FOUND, "Section not found"));

        enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .ifPresent(e -> {
                    throw new EnrollmentException(EnrollmentException.ErrorType.ALREADY_ENROLLED, "Already enrolled in this section");
                });

        long enrolled = enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED);
        if (enrolled >= section.getMaxCapacity()) {
            throw new EnrollmentException(EnrollmentException.ErrorType.SECTION_FULL, "Section is full");
        }

        List<Enrollment> currentEnrollments = enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED);
        if (currentEnrollments.size() >= MAX_STUDENT_ENROLLMENTS) {
            throw new EnrollmentException(EnrollmentException.ErrorType.MAX_ENROLLMENT_REACHED, "Cannot enroll in more than " + MAX_STUDENT_ENROLLMENTS + " sections");
        }

        List<StudentCourseHistory> history = historyRepository.findByStudentIdWithCourse(studentId);
        boolean prerequisitesMet = hasMetPrerequisites(section.getCourse(), history);
        if (!prerequisitesMet) {
            String prerequisiteCourseName = courseRepository.findById(section.getCourse().getPrerequisiteId())
                    .map(cs -> cs.getName())
                    .orElse("Unknown prerequisite");
            throw new EnrollmentException(
                EnrollmentException.ErrorType.PREREQUISITES_NOT_MET,
                "Prerequisites not met: must complete course " + prerequisiteCourseName
            );
        }

        boolean hasConflict = hasSectionTimeConflict(student, section, currentEnrollments.stream()
                .map(Enrollment::getSection)
                .toList());

        if (hasConflict) {
            throw new EnrollmentException(EnrollmentException.ErrorType.TIME_CONFLICT, "Section time conflict");
        }
        
        Enrollment enrollment = new Enrollment(student, section, Status.ENROLLED);
        Long generatedId = enrollmentRepository.insertAndReturnId(enrollment);
        enrollment.setId(generatedId);
        section.setCurrentEnrollment(section.getCurrentEnrollment() + 1);
    try {
        courseSectionRepository.save(section);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new EnrollmentException(EnrollmentException.ErrorType.SECTION_FULL,
                "Section just filled up. Please refresh and try another section.");
        }
    }

    @Transactional
    public Enrollment drop(Long studentId, Long sectionId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .orElseThrow(() -> new EnrollmentException(EnrollmentException.ErrorType.ENROLLMENT_NOT_FOUND, "Enrollment not found"));

        enrollment.setStatus(Status.DROPPED);
        return enrollmentRepository.save(enrollment);
    }

    @Transactional
    public Enrollment complete(Long studentId, Long sectionId) {
        Enrollment enrollment = enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)
                .orElseThrow(() -> new EnrollmentException(EnrollmentException.ErrorType.ENROLLMENT_NOT_FOUND, "Enrollment not found"));

        enrollment.setStatus(Status.COMPLETED);
        return enrollmentRepository.save(enrollment);
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