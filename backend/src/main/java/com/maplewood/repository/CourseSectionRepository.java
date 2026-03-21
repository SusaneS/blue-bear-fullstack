package com.maplewood.repository;

import com.maplewood.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {

    @Query("SELECT cs FROM CourseSection cs " +
           "JOIN FETCH cs.course " +
           "JOIN FETCH cs.teacher " +
           "JOIN FETCH cs.classroom " +
           "WHERE cs.semester.id = :semesterId")
    List<CourseSection> findBySemesterIdWithDetails(@Param("semesterId") Long semesterId);

    @Query("SELECT cs FROM CourseSection cs " +
       "JOIN FETCH cs.course c " +
       "JOIN FETCH cs.teacher " +
       "JOIN FETCH cs.classroom " +
       "WHERE cs.semester.id = :semesterId " +
       "AND (:courseId IS NULL OR c.id = :courseId) " +
       "AND (:gradeLevel IS NULL OR (c.gradeLevelMin <= :gradeLevel AND c.gradeLevelMax >= :gradeLevel))")
    List<CourseSection> findFiltered(
            @Param("semesterId") Long semesterId,
            @Param("courseId") Long courseId,
            @Param("gradeLevel") Integer gradeLevel
        );

    @Query("SELECT cs FROM CourseSection cs " +
           "JOIN FETCH cs.teacher " +
           "JOIN FETCH cs.classroom " +
           "WHERE cs.course.id = :courseId AND cs.semester.id = :semesterId")
    List<CourseSection> findByCourseIdAndSemesterId(@Param("courseId") Long courseId,
                                                    @Param("semesterId") Long semesterId);

    @Query("SELECT cs FROM CourseSection cs " +
           "JOIN FETCH cs.course c " +
           "JOIN FETCH cs.teacher " +
           "JOIN FETCH cs.classroom " +
           "WHERE cs.semester.id = :semesterId " +
           "AND c.gradeLevelMin <= :gradeLevel " +
           "AND c.gradeLevelMax >= :gradeLevel")
    List<CourseSection> findAvailableForGrade(@Param("semesterId") Long semesterId,
                                              @Param("gradeLevel") Integer gradeLevel);
}