package com.maplewood.dto;

public class EnrollmentRequest {
    private Long studentId;
    private Long sectionId;

    public EnrollmentRequest() {}
    public EnrollmentRequest(Long studentId, Long sectionId) {
        this.studentId = studentId;
        this.sectionId = sectionId;
    }

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }
    public Long getSectionId() { return sectionId; }
    public void setSectionId(Long sectionId) { this.sectionId = sectionId; }
}