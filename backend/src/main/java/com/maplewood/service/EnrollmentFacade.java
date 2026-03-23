package com.maplewood.service;

import com.maplewood.dto.EnrollmentDTO;
import com.maplewood.exception.EnrollmentException;
import org.springframework.orm.ObjectOptimisticLockingFailureException;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentFacade {

    private final EnrollmentService enrollmentService;

    public EnrollmentFacade(EnrollmentService enrollmentService) {
        this.enrollmentService = enrollmentService;
    }

    public EnrollmentDTO enroll(Long studentId, Long sectionId) {
        try {
            return enrollmentService.enroll(studentId, sectionId);
        } catch (ObjectOptimisticLockingFailureException e) {
            throw new EnrollmentException(
                EnrollmentException.ErrorType.SECTION_FULL,
                "Section just filled up. Please refresh and try another section."
            );
        } catch (EnrollmentException e) {
            throw e;
        } catch (Exception e) {
            throw new EnrollmentException(
                EnrollmentException.ErrorType.ENROLLMENT_NOT_FOUND,
                "An unexpected error occurred during enrollment."
            );
        }
    }
}