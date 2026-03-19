package com.maplewood.dto;

public class CourseHistoryDTO {

    private Long id;
    private Long courseId;
    private String courseName;
    private Long semesterId;
    private String status; // "passed" or "failed"

    public CourseHistoryDTO() {}

    public CourseHistoryDTO(Long id, Long courseId, String courseName, Long semesterId, String status) {
        this.id = id;
        this.courseId = courseId;
        this.courseName = courseName;
        this.semesterId = semesterId;
        this.status = status;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}