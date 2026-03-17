package com.maplewood.service;

import com.maplewood.dto.CourseDto;
import com.maplewood.mapper.CourseMapper;
import com.maplewood.repository.CourseRepository;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class CourseService {

  private final CourseRepository courseRepository;

  public CourseService(CourseRepository courseRepository) {
    this.courseRepository = courseRepository;
  }

  public List<CourseDto> getAllCourses() {
    return courseRepository.findAll().stream()
        .map(CourseMapper::toDto)
        .toList();
  }
}