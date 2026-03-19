package com.maplewood.repository;

import com.maplewood.model.StudentCourseHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentCourseHistoryRepository extends JpaRepository<StudentCourseHistory, Long> {

    @Query("SELECT sch FROM StudentCourseHistory sch " +
           "JOIN FETCH sch.course " +
           "WHERE sch.student.id = :studentId")
    List<StudentCourseHistory> findByStudentIdWithCourse(@Param("studentId") Long studentId);

    @Query("SELECT CASE WHEN COUNT(sch) > 0 THEN true ELSE false END " +
           "FROM StudentCourseHistory sch " +
           "WHERE sch.student.id = :studentId AND sch.course.id = :courseId AND sch.status = 'passed'")
    boolean hasPassedCourse(@Param("studentId") Long studentId, @Param("courseId") Long courseId);
}