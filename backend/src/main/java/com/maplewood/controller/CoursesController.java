package com.maplewood.controller;

import com.maplewood.dto.CourseDto;
import com.maplewood.dto.CourseSectionDto;
import com.maplewood.service.CourseSectionService;
import com.maplewood.service.CourseService;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/courses")
public class CoursesController {
  @Autowired
  private CourseService courseService;
  @Autowired
  private CourseSectionService courseSectionService;

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

  @GetMapping("/{courseId}/sections")
  public ResponseEntity<List<CourseSectionDto>> getCourseSections(
          @PathVariable Long courseId) {
      
      List<CourseSectionDto> sections = courseSectionService
          .getSectionsByCourseId(courseId);
      
      return ResponseEntity.ok(sections);
  }
  
  @GetMapping("/sections/{sectionId}")
  public ResponseEntity<CourseSectionDto> getSectionById(
          @PathVariable Long sectionId) {
      
      CourseSectionDto section = courseSectionService.getSectionById(sectionId);
      
      if (section == null) {
          return ResponseEntity.notFound().build();
      }
      
      return ResponseEntity.ok(section);
  }
}