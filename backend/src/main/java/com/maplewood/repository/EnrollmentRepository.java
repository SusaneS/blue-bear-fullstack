package com.maplewood.repository;

import com.maplewood.model.Enrollment;
import com.maplewood.model.Enrollment.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long>, EnrollmentCustomRepository {

    List<Enrollment> findByStudentIdAndStatus(Long studentId, Status status);

    Optional<Enrollment> findByStudentIdAndSectionId(Long studentId, Long sectionId);

    long countBySectionIdAndStatus(Long sectionId, Status status);
}