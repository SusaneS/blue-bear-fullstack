package com.maplewood.repository;

import com.maplewood.model.CourseEntity;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<CourseEntity, Long> {}