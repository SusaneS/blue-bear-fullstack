package com.maplewood.dto;

import java.util.List;

public class StudentProfileDTO extends StudentDTO {

    private Double gpa;
    private Double creditsEarned;
    private List<CourseHistoryDTO> courseHistory;

    public StudentProfileDTO() {}

    public StudentProfileDTO(Long id, String firstName, String lastName, Integer gradeLevel, String email,
                            Double gpa, Double creditsEarned, List<CourseHistoryDTO> courseHistory) {
        super(id, firstName, lastName, gradeLevel, email);
        this.gpa = gpa;
        this.creditsEarned = creditsEarned;
        this.courseHistory = courseHistory;
    }

    public Double getGpa() { return gpa; }
    public void setGpa(Double gpa) { this.gpa = gpa; }

    public Double getCreditsEarned() { return creditsEarned; }
    public void setCreditsEarned(Double creditsEarned) { this.creditsEarned = creditsEarned; }

    public List<CourseHistoryDTO> getCourseHistory() { return courseHistory; }
    public void setCourseHistory(List<CourseHistoryDTO> courseHistory) { this.courseHistory = courseHistory; }
}