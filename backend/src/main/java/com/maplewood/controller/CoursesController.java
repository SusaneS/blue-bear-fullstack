package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.service.CourseService;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {
  private final CourseService courseService;

  public CoursesController(CourseService courseService) {
    this.courseService = courseService;
  }

  @GetMapping
  public ResponseEntity<List<CourseDto>> getCourses() {
    List<CourseDto> courses = courseService.getAllCourses();
    return ResponseEntity.ok(courses);
  }

  @GetMapping("/{courseId}")
  public ResponseEntity<CourseDto> getCourseById(@PathVariable Long courseId) {
    CourseDto course = courseService.getCourseById(courseId);
    if (course == null) {
      return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok(course);
  }
}