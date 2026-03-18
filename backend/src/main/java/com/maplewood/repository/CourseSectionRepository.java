package com.maplewood.repository;

import com.maplewood.model.CourseSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseSectionRepository extends JpaRepository<CourseSection, Long> {
    
    /**
     * Find sections for a course with all related entities
     */
    @Query("""
        SELECT cs, c, s, t, cl
        FROM CourseSection cs
        JOIN CourseEntity c ON cs.courseId = c.id
        JOIN Semester s ON cs.semesterId = s.id
        JOIN Teacher t ON cs.teacherId = t.id
        JOIN Classroom cl ON cs.classroomId = cl.id
        WHERE cs.courseId = :courseId AND cs.semesterId = :semesterId
        ORDER BY cs.sectionLetter
    """)
    List<Object[]> findByCourseIdAndSemesterIdWithDetails(
        @Param("courseId") Long courseId,
        @Param("semesterId") Long semesterId
    );
    
    /**
     * Find a single section with all details
     */
    @Query("""
        SELECT cs, c, s, t, cl
        FROM CourseSection cs
        JOIN CourseEntity c ON cs.courseId = c.id
        JOIN Semester s ON cs.semesterId = s.id
        JOIN Teacher t ON cs.teacherId = t.id
        JOIN Classroom cl ON cs.classroomId = cl.id
        WHERE cs.id = :sectionId
    """)
    List<Object[]> findByIdWithDetails(@Param("sectionId") Long sectionId);
}