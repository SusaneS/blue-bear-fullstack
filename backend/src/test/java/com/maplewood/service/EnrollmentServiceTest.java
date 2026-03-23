package com.maplewood.service;

import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.exception.EnrollmentException;
import com.maplewood.model.*;
import com.maplewood.model.Enrollment.Status;
import com.maplewood.repository.*;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class EnrollmentServiceTest {

    @Mock
    private EnrollmentRepository enrollmentRepository;
    @Mock
    private StudentRepository studentRepository;
    @Mock
    private CourseSectionRepository courseSectionRepository;
    @Mock
    private CourseRepository courseRepository;
    @Mock
    private StudentCourseHistoryRepository historyRepository;

    @InjectMocks
    private EnrollmentService enrollmentService;

    private Student createStudent(long id) {
        Student s = new Student();
        s.setId(id);
        return s;
    }

    private Course createCourse(long id, Long prerequisiteId) {
        Course c = new Course();
        c.setId(id);
        c.setPrerequisiteId(prerequisiteId);
        return c;
    }

    private Semester createSemester(long id) {
        Semester s = new Semester();
        s.setId(id);
        return s;
    }

    private CourseSection createCourseSection(long id, Course course, Semester semester, int maxCap, int currEnrolled, String day, String start, String end) {
        CourseSection cs = new CourseSection();
        cs.setId(id);
        cs.setCourse(course);
        cs.setSemester(semester);
        cs.setMaxCapacity(maxCap);
        cs.setCurrentEnrollment(currEnrolled);
        cs.setDayOfWeek(day);
        cs.setStartTime(start);
        cs.setEndTime(end);
        cs.setSectionLetter("A");
        return cs;
    }

    @Test
    void enroll_successful() {
        long studentId = 1L, sectionId = 10L;
        Student student = createStudent(studentId);
        Course course = createCourse(50L, null);
        Semester sem = createSemester(100L);
        CourseSection section = createCourseSection(sectionId, course, sem, 30, 10, "MWF", "09:00", "10:00");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(10L);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of());
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of());
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
        when(studentRepository.findById(anyLong())).thenReturn(Optional.of(createStudent(1L)));
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
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(createStudent(studentId)));
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
        Student student = createStudent(studentId);
        Course course = createCourse(60L, null);
        Semester sem = createSemester(200L);
        CourseSection section = createCourseSection(sectionId, course, sem, 30, 10, "MWF", "09:00", "10:00");
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(anyLong(), any())).thenReturn(1L);
        List<Enrollment> cur = List.of(new Enrollment(), new Enrollment(), new Enrollment(), new Enrollment(), new Enrollment());
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(cur);

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.MAX_ENROLLMENT_REACHED, ex.getErrorType());
    }

    @Test
    void enroll_sectionFull_throws() {
        long studentId = 1L, sectionId = 2L;
        Course course = createCourse(60L, null);
        Semester sem = createSemester(101L);
        CourseSection section = createCourseSection(sectionId, course, sem, 2, 2, "MWF", "09:00", "10:00");
        when(studentRepository.findById(studentId)).thenReturn(Optional.of(createStudent(studentId)));
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
        Course course = createCourse(5L, 99L);
        Semester sem = createSemester(105L);
        CourseSection section = createCourseSection(sectionId, course, sem, 30, 0, "MWF", "09:00", "10:00");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(createStudent(studentId)));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(0L);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of());
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of()); // no history
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
        Student student = createStudent(studentId);
        Course course = createCourse(50L, null);
        Semester sem = createSemester(202L);
        CourseSection section = createCourseSection(sectionId, course, sem, 10, 0, "MWF", "09:00", "10:00");

        when(studentRepository.findById(studentId)).thenReturn(Optional.of(student));
        when(courseSectionRepository.findById(sectionId)).thenReturn(Optional.of(section));
        when(enrollmentRepository.findByStudentIdAndSectionId(studentId, sectionId)).thenReturn(Optional.empty());
        when(enrollmentRepository.countBySectionIdAndStatus(sectionId, Status.ENROLLED)).thenReturn(0L);

        CourseSection enrolledSection = createCourseSection(333L, createCourse(51L, null), sem, 10, 0, "MWF", "09:30", "10:30");
        Enrollment enrollment = new Enrollment(); enrollment.setSection(enrolledSection);
        when(enrollmentRepository.findByStudentIdAndStatus(studentId, Status.ENROLLED)).thenReturn(List.of(enrollment));
        when(historyRepository.findByStudentIdWithCourse(studentId)).thenReturn(List.of());

        EnrollmentException ex = assertThrows(
            EnrollmentException.class,
            () -> enrollmentService.enroll(studentId, sectionId)
        );
        assertEquals(EnrollmentException.ErrorType.TIME_CONFLICT, ex.getErrorType());
    }
}