package com.maplewood.service;

import com.maplewood.dto.CourseHistoryDTO;
import com.maplewood.dto.StudentDTO;
import com.maplewood.dto.StudentProfileDTO;
import com.maplewood.mapper.CourseHistoryMapper;
import com.maplewood.mapper.StudentMapper;
import com.maplewood.model.Student;
import com.maplewood.model.StudentCourseHistory;
import com.maplewood.repository.StudentCourseHistoryRepository;
import com.maplewood.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class StudentService {

    private final StudentRepository studentRepository;
    private final StudentCourseHistoryRepository historyRepository;
    private final StudentMapper studentMapper;
    private final CourseHistoryMapper courseHistoryMapper;

    public StudentService(StudentRepository studentRepository,
                         StudentCourseHistoryRepository historyRepository,
                         StudentMapper studentMapper,
                         CourseHistoryMapper courseHistoryMapper) {
        this.studentRepository = studentRepository;
        this.historyRepository = historyRepository;
        this.studentMapper = studentMapper;
        this.courseHistoryMapper = courseHistoryMapper;
    }

    public List<StudentDTO> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(studentMapper::toDTO)
                .collect(Collectors.toList());
    }

    public StudentProfileDTO getStudentProfile(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + studentId));

        List<StudentCourseHistory> history = historyRepository.findByStudentIdWithCourse(studentId);

        List<CourseHistoryDTO> courseHistory = history.stream()
                .map(courseHistoryMapper::toDTO)
                .collect(Collectors.toList());

        double creditsEarned = history.stream()
                .filter(h -> "passed".equals(h.getStatus()))
                .mapToDouble(h -> h.getCourse().getCredits().doubleValue())
                .sum();

        double gpa = calculateGPA(history);

        return new StudentProfileDTO(
                student.getId(),
                student.getFirstName(),
                student.getLastName(),
                student.getGradeLevel(),
                student.getEmail(),
                gpa,
                creditsEarned,
                courseHistory
        );
    }

    private double calculateGPA(List<StudentCourseHistory> history) {
        if (history.isEmpty()) {
            return 0.0;
        }

        double totalPoints = 0.0;
        double totalCredits = 0.0;

        for (StudentCourseHistory h : history) {
            double credits = h.getCourse().getCredits().doubleValue();
            double points = "passed".equals(h.getStatus()) ? 4.0 : 0.0;
            totalPoints += points * credits;
            totalCredits += credits;
        }

        if (totalCredits == 0) {
            return 0.0;
        }

        return Math.round((totalPoints / totalCredits) * 100.0) / 100.0;
    }
}