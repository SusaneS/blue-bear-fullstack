package com.maplewood.repository;

import com.maplewood.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    
    /**
     * Find the currently active semester
     * Should only return ONE semester at a time
     */
    Optional<Semester> findByIsActiveTrue();
    
    /**
     * Find semester by name and year
     * Example: findByNameAndYear("Fall", 2024)
     */
    Optional<Semester> findByNameAndYear(String name, Integer year);
    
    /**
     * Find all semesters for a specific year
     * Example: findByYear(2024) returns [Fall 2024, Spring 2024]
     */
    List<Semester> findByYear(Integer year);
    
    /**
     * Find all semesters ordered by year and order
     * Most recent first
     */
    @Query("SELECT s FROM Semester s ORDER BY s.year DESC, s.orderInYear DESC")
    List<Semester> findAllOrderedByYearDesc();
}