package com.maplewood.dto;

public class CourseDto {
  public long id;
  public String code;
  public String name;
  public double credits;
  public int hoursPerWeek;
  public Long prerequisiteId; // nullable => optional in UI
  public GradeLevelDto gradeLevel;

  public static class GradeLevelDto {
    public Integer min;
    public Integer max;

    public GradeLevelDto(Integer min, Integer max) {
      this.min = min;
      this.max = max;
    }
  }

  public CourseDto(
      long id,
      String code,
      String name,
      double credits,
      int hoursPerWeek,
      Long prerequisiteId,
      GradeLevelDto gradeLevel
  ) {
    this.id = id;
    this.code = code;
    this.name = name;
    this.credits = credits;
    this.hoursPerWeek = hoursPerWeek;
    this.prerequisiteId = prerequisiteId;
    this.gradeLevel = gradeLevel;
  }
}