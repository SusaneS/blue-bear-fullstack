package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.service.CourseService;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class CoursesController {
  private final CourseService courseService;

  public CoursesController(CourseService courseService) {
    this.courseService = courseService;
  }

  @GetMapping("/api/courses")
  public List<CourseDto> getCourses() {
    return courseService.getAllCourses();
  }
}