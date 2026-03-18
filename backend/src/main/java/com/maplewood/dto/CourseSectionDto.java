package com.maplewood.dto;

import java.time.LocalTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import com.fasterxml.jackson.annotation.JsonFormat;

public class CourseSectionDto {
    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private Long semesterId;
    private String semesterName;
    private Integer semesterYear;
    private Long teacherId;
    private String teacherName;  // Combined first + last name
    private Long classroomId;
    private String classroomName;
    private String sectionLetter;
    private String dayOfWeek;
     @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;
     @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;
    private Integer maxCapacity;
    private Integer currentEnrollment;
    private Integer availableSeats;
    private Boolean isFull;
    
    // Constructors
    public CourseSectionDto() {}
    
    public CourseSectionDto(Long id, Long courseId, String courseCode, String courseName,
                           Long semesterId, String semesterName, Integer semesterYear,
                           Long teacherId, String teacherFirstName, String teacherLastName,
                           Long classroomId, String classroomName, String sectionLetter,
                           String dayOfWeek, LocalTime startTime, LocalTime endTime,
                           Integer maxCapacity, Integer currentEnrollment) {
        this.id = id;
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.semesterId = semesterId;
        this.semesterName = semesterName;
        this.semesterYear = semesterYear;
        this.teacherId = teacherId;
        this.teacherName = teacherFirstName + " " + teacherLastName;  // Combined here
        this.classroomId = classroomId;
        this.classroomName = classroomName;
        this.sectionLetter = sectionLetter;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.maxCapacity = maxCapacity;
        this.currentEnrollment = currentEnrollment;
        this.availableSeats = maxCapacity - currentEnrollment;
        this.isFull = currentEnrollment >= maxCapacity;
    }
    
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
    
    public String getCourseCode() {
        return courseCode;
    }
    
    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }
    
    public String getCourseName() {
        return courseName;
    }
    
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }
    
    public Long getSemesterId() {
        return semesterId;
    }
    
    public void setSemesterId(Long semesterId) {
        this.semesterId = semesterId;
    }
    
    public String getSemesterName() {
        return semesterName;
    }
    
    public void setSemesterName(String semesterName) {
        this.semesterName = semesterName;
    }
    
    public Integer getSemesterYear() {
        return semesterYear;
    }
    
    public void setSemesterYear(Integer semesterYear) {
        this.semesterYear = semesterYear;
    }
    
    public Long getTeacherId() {
        return teacherId;
    }
    
    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }
    
    public String getTeacherName() {
        return teacherName;
    }
    
    public void setTeacherName(String teacherName) {
        this.teacherName = teacherName;
    }
    
    public Long getClassroomId() {
        return classroomId;
    }
    
    public void setClassroomId(Long classroomId) {
        this.classroomId = classroomId;
    }
    
    public String getClassroomName() {
        return classroomName;
    }
    
    public void setClassroomName(String classroomName) {
        this.classroomName = classroomName;
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
        this.availableSeats = this.maxCapacity - currentEnrollment;
        this.isFull = currentEnrollment >= this.maxCapacity;
    }
    
    public Integer getAvailableSeats() {
        return availableSeats;
    }
    
    public void setAvailableSeats(Integer availableSeats) {
        this.availableSeats = availableSeats;
    }
    
    public Boolean getIsFull() {
        return isFull;
    }
    
    public void setIsFull(Boolean isFull) {
        this.isFull = isFull;
    }
}