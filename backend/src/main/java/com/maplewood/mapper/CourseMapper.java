package com.maplewood.mapper;

import com.maplewood.dto.CourseDto;
import com.maplewood.model.CourseEntity;

public final class CourseMapper {
  private CourseMapper() {}

  public static CourseDto toDto(CourseEntity entity) {
    if (entity == null) return null;

    return new CourseDto(
        entity.getId(),
        entity.getCode(),
        entity.getName(),
        entity.getCredits().doubleValue(),
        entity.getHoursPerWeek(),
        entity.getPrerequisiteId(),
        new CourseDto.GradeLevelDto(entity.getGradeLevelMin(), entity.getGradeLevelMax())
    );
  }
}