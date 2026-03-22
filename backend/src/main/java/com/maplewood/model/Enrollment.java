package com.maplewood.model;

import jakarta.persistence.*;

import java.time.LocalDate;

import com.maplewood.converter.LocalDateConverter;

@Entity
@Table(name = "enrollments", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "section_id"})
})
public class Enrollment {

    public enum Status {
        ENROLLED, DROPPED, COMPLETED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "section_id", nullable = false)
    private CourseSection section;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @Convert(converter = LocalDateConverter.class)
    @Column(name = "enrollment_date", nullable = false)
    private LocalDate enrollmentDate;

    public Enrollment() {}

    public Enrollment(Student student, CourseSection section, Status status) {
        this.student = student;
        this.section = section;
        this.status = status;
        this.enrollmentDate = LocalDate.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Student getStudent() { return student; }
    public void setStudent(Student student) { this.student = student; }

    public CourseSection getSection() { return section; }
    public void setSection(CourseSection section) { this.section = section; }

    public Status getStatus() { return status; }
    public void setStatus(Status status) { this.status = status; }

    public LocalDate getEnrollmentDate() { return enrollmentDate; }
    public void setEnrollmentDate(LocalDate enrollmentDate) { this.enrollmentDate = enrollmentDate; }
}