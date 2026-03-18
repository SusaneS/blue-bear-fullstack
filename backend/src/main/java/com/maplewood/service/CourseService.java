package com.maplewood.service;

import com.maplewood.dto.CourseDto;
import com.maplewood.mapper.CourseMapper;
import com.maplewood.repository.CourseRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourseService {
  @Autowired
  private CourseRepository courseRepository;

  public CourseService(CourseRepository courseRepository) {
    this.courseRepository = courseRepository;
  }

  public List<CourseDto> getAllCourses() {
    return courseRepository.findAll().stream()
        .map(CourseMapper::toDto)
        .toList();
  }

  public CourseDto getCourseById(Long id) {
    return courseRepository.findById(id)
    .map(CourseMapper::toDto)
    .orElse(null);
  }
}