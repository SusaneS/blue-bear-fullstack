package com.maplewood.repository;

import com.maplewood.model.Semester;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SemesterRepository extends JpaRepository<Semester, Long> {
    
    Optional<Semester> findByIsActiveTrue();
    
    @Query("SELECT s FROM Semester s ORDER BY s.year DESC, s.orderInYear DESC")
    List<Semester> findAllOrderedByYearDesc();
}