package com.maplewood.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "courses")
public class Course {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "code", nullable = false, unique = true, length = 10)
  private String code;

  @Column(name = "name", nullable = false, length = 100)
  private String name;

  @Column(name = "description")
  private String description;

  @Column(name = "credits", nullable = false, precision = 3, scale = 1)
  private BigDecimal credits;

  @Column(name = "hours_per_week", nullable = false)
  private int hoursPerWeek;

  @Column(name = "specialization_id", nullable = false)
  private long specializationId;

  @Column(name = "prerequisite_id")
  private Long prerequisiteId;

  @Column(name = "course_type", nullable = false, length = 20)
  private String courseType;

  @Column(name = "grade_level_min")
  private Integer gradeLevelMin;

  @Column(name = "grade_level_max")
  private Integer gradeLevelMax;

  @Column(name = "semester_order", nullable = false)
  private int semesterOrder;

  @Column(name = "created_at")
  private LocalDateTime createdAt;

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getCode() { return code; }
  public void setCode(String code) { this.code = code; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public BigDecimal getCredits() { return credits; }
  public void setCredits(BigDecimal credits) { this.credits = credits; }

  public Integer getHoursPerWeek() { return hoursPerWeek; }
  public void setHoursPerWeek(Integer hoursPerWeek) { this.hoursPerWeek = hoursPerWeek; }

  public Long getSpecializationId() { return specializationId; }
  public void setSpecializationId(Long specializationId) { this.specializationId = specializationId; }

  public Long getPrerequisiteId() { return prerequisiteId; }
  public void setPrerequisiteId(Long prerequisiteId) { this.prerequisiteId = prerequisiteId; }

  public String getCourseType() { return courseType; }
  public void setCourseType(String courseType) { this.courseType = courseType; }

  public Integer getGradeLevelMin() { return gradeLevelMin; }
  public void setGradeLevelMin(Integer gradeLevelMin) { this.gradeLevelMin = gradeLevelMin; }

  public Integer getGradeLevelMax() { return gradeLevelMax; }
  public void setGradeLevelMax(Integer gradeLevelMax) { this.gradeLevelMax = gradeLevelMax; }

  public Integer getSemesterOrder() { return semesterOrder; }
  public void setSemesterOrder(Integer semesterOrder) { this.semesterOrder = semesterOrder; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}