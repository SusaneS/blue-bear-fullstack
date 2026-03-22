package com.maplewood.dto;

public class CourseSectionDTO {

    private Long id;
    private Long courseId;
    private String courseCode;
    private String courseName;
    private String courseType;
    private Double credits;
    private String sectionLetter;
    private String dayOfWeek;
    private String startTime;
    private String endTime;
    private String teacherName;
    private String classroomName;
    private Integer maxCapacity;
    private Integer currentEnrollment;
    private boolean isFull;

    public CourseSectionDTO() {}

    public CourseSectionDTO(Long id, Long courseId, String courseCode, String courseName,
                           String courseType, Double credits, String sectionLetter,
                           String dayOfWeek, String startTime, String endTime,
                           String teacherName, String classroomName,
                           Integer maxCapacity, Integer currentEnrollment) {
        this.id = id;
        this.courseId = courseId;
        this.courseCode = courseCode;
        this.courseName = courseName;
        this.courseType = courseType;
        this.credits = credits;
        this.sectionLetter = sectionLetter;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.teacherName = teacherName;
        this.classroomName = classroomName;
        this.maxCapacity = maxCapacity;
        this.currentEnrollment = currentEnrollment;
        this.isFull = currentEnrollment >= maxCapacity;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public String getCourseCode() { return courseCode; }
    public void setCourseCode(String courseCode) { this.courseCode = courseCode; }

    public String getCourseName() { return courseName; }
    public void setCourseName(String courseName) { this.courseName = courseName; }

    public String getCourseType() { return courseType; }
    public void setCourseType(String courseType) { this.courseType = courseType; }

    public Double getCredits() { return credits; }
    public void setCredits(Double credits) { this.credits = credits; }

    public String getSectionLetter() { return sectionLetter; }
    public void setSectionLetter(String sectionLetter) { this.sectionLetter = sectionLetter; }

    public String getDayOfWeek() { return dayOfWeek; }
    public void setDayOfWeek(String dayOfWeek) { this.dayOfWeek = dayOfWeek; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getTeacherName() { return teacherName; }
    public void setTeacherName(String teacherName) { this.teacherName = teacherName; }

    public String getClassroomName() { return classroomName; }
    public void setClassroomName(String classroomName) { this.classroomName = classroomName; }

    public Integer getMaxCapacity() { return maxCapacity; }
    public void setMaxCapacity(Integer maxCapacity) { this.maxCapacity = maxCapacity; }

    public Integer getCurrentEnrollment() { return currentEnrollment; }
    public void setCurrentEnrollment(Integer currentEnrollment) { this.currentEnrollment = currentEnrollment; }

    public boolean isFull() { return isFull; }
    public void setFull(boolean full) { isFull = full; }
}