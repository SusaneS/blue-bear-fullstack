package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.model.CourseEntity;
import com.maplewood.repository.CourseRepository;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CoursesController {

  private final CourseRepository courseRepository;

  public CoursesController(CourseRepository courseRepository) {
    this.courseRepository = courseRepository;
  }

  @GetMapping("/api/courses")
  public List<CourseDto> getCourses() {
    return courseRepository.findAll().stream()
        .map(this::toDto)
        .toList();
  }

  private CourseDto toDto(CourseEntity e) {
    return new CourseDto(
        e.getId(),
        e.getCode(),
        e.getName(),
        e.getCredits().doubleValue(),
        e.getHoursPerWeek(),
        e.getPrerequisiteId(),
        new CourseDto.GradeLevelDto(e.getGradeLevelMin(), e.getGradeLevelMax())
    );
  }
}