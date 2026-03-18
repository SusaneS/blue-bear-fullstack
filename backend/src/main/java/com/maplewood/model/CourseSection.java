package com.maplewood.model;

import jakarta.persistence.*;
import java.time.LocalTime;

import com.maplewood.converter.LocalTimeConverter;

import java.time.LocalDateTime;

@Entity
@Table(name = "course_sections")
public class CourseSection {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "course_id", nullable = false)
    private Long courseId;
    
    @Column(name = "semester_id", nullable = false)
    private Long semesterId;
    
    @Column(name = "teacher_id", nullable = false)
    private Long teacherId;
    
    @Column(name = "classroom_id", nullable = false)
    private Long classroomId;
    
    @Column(name = "section_letter", length = 1, nullable = false)
    private String sectionLetter;
    
    @Column(name = "day_of_week", length = 10, nullable = false)
    private String dayOfWeek;
    
    @Column(name = "start_time", nullable = false)
    @Convert(converter = LocalTimeConverter.class)
    private LocalTime startTime;
    
    @Column(name = "end_time", nullable = false)
    @Convert(converter = LocalTimeConverter.class)
    private LocalTime endTime;
    
    @Column(name = "max_capacity")
    private Integer maxCapacity = 10;
    
    @Column(name = "current_enrollment")
    private Integer currentEnrollment = 0;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Constructors
    public CourseSection() {}
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public Long getSemesterId() {
        return semesterId;
    }
    
    public void setSemesterId(Long semesterId) {
        this.semesterId = semesterId;
    }
    
    public Long getTeacherId() {
        return teacherId;
    }
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
    
    public Long getClassroomId() {
        return classroomId;
    }
    
    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }
    
    public String getSectionLetter() {
        return sectionLetter;
    }
    
    public void setSectionLetter(String sectionLetter) {
        this.sectionLetter = sectionLetter;
    }
    
    public String getDayOfWeek() {
        return dayOfWeek;
    }
    
    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }
    
    public LocalTime getStartTime() {
        return startTime;
    }
    
    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }
    
    public LocalTime getEndTime() {
        return endTime;
    }
    
    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }
    
    public Integer getMaxCapacity() {
        return maxCapacity;
    }
    
    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }
    
    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }
    
    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}