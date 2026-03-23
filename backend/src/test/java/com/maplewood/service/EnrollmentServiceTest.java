package com.maplewood.service;

import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.exception.EnrollmentException;
import com.maplewood.model.*;
import com.maplewood.model.Enrollment.Status;
import com.maplewood.repository.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

// TODO: refactor test to use @Mock and @InjectMocks annotations for cleaner setup
class EnrollmentServiceTest {

    private EnrollmentRepository enrollmentRepository;
    private StudentRepository studentRepository;
    private CourseSectionRepository courseSectionRepository;
    private CourseRepository courseRepository;
    private StudentCourseHistoryRepository historyRepository;
    private EnrollmentService enrollmentService;

    @BeforeEach
    void setUp() {
        enrollmentRepository = mock(EnrollmentRepository.class);
        studentRepository = mock(StudentRepository.class);
        courseSectionRepository = mock(CourseSectionRepository.class);
        courseRepository = mock(CourseRepository.class);
        historyRepository = mock(StudentCourseHistoryRepository.class);

        enrollmentService = new EnrollmentService(
                enrollmentRepository,
                studentRepository,
                courseSectionRepository,
                courseRepository,
                historyRepository
        );
    }

    @Test
    void enroll_successful() {
        long studentId = 1L, sectionId = 10L;
        Student student = new Student(); student.setId(studentId);
        Semester semester = new Semester(); semester.setId(100L);
        CourseSection section = new CourseSection(); 
        section.setId(sectionId);
        section.setSemester(semester);
        section.setMaxCapacity(30); 
        section.setCurrentEnrollment(10);
        section.setDayOfWeek("MWF");
        section.setStartTime("09:00");
        section.setEndTime("10:00");
        Course course = new Course(); course.setId(50L); section.setCourse(course);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(10L);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of());
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of());
        when(courseRepository.findById(anyLong())).thenReturn(Optional.empty());
        when(enrollmentRepository.insertAndReturnId(any(Enrollment.class))).thenReturn(123L);
        when(courseSectionRepository.save(any(CourseSection.class))).thenReturn(section);

        EnrollmentDTO dto = enrollmentService.enroll(studentId, sectionId);

        assertNotNull(dto);
        verify(enrollmentRepository).insertAndReturnId(any(Enrollment.class));
        verify(courseSectionRepository).save(any(CourseSection.class));
    }

    @Test
    void enroll_studentNotFound_throws() {
        when(studentRepository.findById(anyLong())).thenReturn(Optional.empty());
        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(12L, 10L)
        );
        assertEquals(EnrollmentException.ErrorType.STUDENT_NOT_FOUND, ex.getErrorType());
    }

    @Test
    void enroll_sectionNotFound_throws() {
        when(studentRepository.findById(anyLong())).thenReturn(Optional.of(new Student()));
        when(courseSectionRepository.findById(anyLong())).thenReturn(Optional.empty());
        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(1L, 99L)
        );
        assertEquals(EnrollmentException.ErrorType.SECTION_NOT_FOUND, ex.getErrorType());
    }

    @Test
    void enroll_alreadyEnrolled_throws() {
        long studentId = 1L, sectionId = 2L;
        Enrollment enrollment = new Enrollment();
        enrollment.setStatus(Status.ENROLLED);
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(new CourseSection()));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.of(enrollment));

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.ALREADY_ENROLLED, ex.getErrorType());
    }

    @Test
    void enroll_maxEnrollmentsReached_throws() {
        long studentId = 1L, sectionId = 2L;
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        CourseSection section = new CourseSection(); section.setId(sectionId); section.setMaxCapacity(30);
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(anyLong(), any())).thenReturn(1L);
        List<Enrollment> cur = List.of(new Enrollment(), new Enrollment(), new Enrollment(), new Enrollment(), new Enrollment());
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(cur);
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of());

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.MAX_ENROLLMENT_REACHED, ex.getErrorType());
    }

    @Test
    void enroll_sectionFull_throws() {
        long studentId = 1L, sectionId = 2L;
        CourseSection section = new CourseSection(); section.setId(sectionId); section.setMaxCapacity(2);
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(2L);

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.SECTION_FULL, ex.getErrorType());
    }

    @Test
    void enroll_prerequisitesNotMet_throws() {
        long studentId = 1L, sectionId = 2L;
        CourseSection section = new CourseSection(); section.setId(sectionId); section.setMaxCapacity(30);
        Course course = new Course(); course.setId(5L); course.setPrerequisiteId(99L); section.setCourse(course);

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(new Student()));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(0L);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of());
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of()); // has no courses
        when(courseRepository.findById(99L)).thenReturn(Optional.of(new Course()));

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.PREREQUISITES_NOT_MET, ex.getErrorType());
    }

    @Test
    void enroll_timeConflict_throws() {
        long studentId = 111, sectionId = 222;
        Student student = new Student(); student.setId(studentId);
        Course course = new Course(); course.setId(50L);
        CourseSection section = new CourseSection(); section.setId(sectionId); section.setDayOfWeek("MWF"); section.setStartTime("09:00"); section.setEndTime("10:00"); section.setMaxCapacity(10); section.setCourse(course);
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(0L);

        CourseSection enrolled = new CourseSection(); enrolled.setDayOfWeek("MWF"); enrolled.setStartTime("09:30"); enrolled.setEndTime("10:30");
        Enrollment enr = new Enrollment(); enr.setSection(enrolled);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of(enr));
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of());

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.TIME_CONFLICT, ex.getErrorType());
    }
}