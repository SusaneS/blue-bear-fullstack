package com.maplewood.repository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.format.DateTimeFormatter;

import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.maplewood.model.Enrollment;

@Repository
public class EnrollmentCustomRepositoryImpl implements EnrollmentCustomRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Transactional
    @Override
    public Long insertAndReturnId(Enrollment enrollment) {
        String sql = "INSERT INTO enrollments (enrollment_date, section_id, status, student_id) " +
                     "VALUES (:enrollment_date, :section_id, :status, :student_id) RETURNING id";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("enrollment_date", enrollment.getEnrollmentDate().format(DateTimeFormatter.ofPattern(("yyyy-MM-dd HH:mm:ss"))));
        query.setParameter("section_id", enrollment.getSection().getId());
        query.setParameter("status", enrollment.getStatus().name());
        query.setParameter("student_id", enrollment.getStudent().getId());
        Object result = query.getSingleResult();
        if (result instanceof Number) {
            return ((Number) result).longValue();
        }
        throw new IllegalStateException("Unexpected result from RETURNING: " + result);
    }
}