package com.maplewood.dto;

public class CourseDTO {

    public long id;
    public String code;
    public String name;
    public String description;
    public double credits;
    public int hoursPerWeek;
    public String courseType;
    public Long prerequisiteId;
    public GradeLevelDto gradeLevel;

    public static class GradeLevelDto {
        public Integer min;
        public Integer max;

        public GradeLevelDto(Integer min, Integer max) {
            this.min = min;
            this.max = max;
        }
    }

    public CourseDTO(
            long id,
            String code,
            String name,
            String description,
            double credits,
            int hoursPerWeek,
            String courseType,
            Long prerequisiteId,
            GradeLevelDto gradeLevel
    ) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.credits = credits;
        this.hoursPerWeek = hoursPerWeek;
        this.courseType = courseType;
        this.prerequisiteId = prerequisiteId;
        this.gradeLevel = gradeLevel;
    }
}