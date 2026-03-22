package com.maplewood.dto;

public class EnrollmentDTO {
    private Long id;
    private Long studentId;
    private Long courseSectionId;
    private Long semesterId;
    private String status;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseSectionId() { return courseSectionId; }
    public void setCourseSectionId(Long courseSectionId) { this.courseSectionId = courseSectionId; }

    public Long getSemesterId() { return semesterId; }
    public void setSemesterId(Long semesterId) { this.semesterId = semesterId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}