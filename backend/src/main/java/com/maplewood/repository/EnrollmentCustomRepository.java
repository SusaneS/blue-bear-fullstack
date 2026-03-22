package com.maplewood.repository;

import com.maplewood.model.Enrollment;

public interface EnrollmentCustomRepository {
    Long insertAndReturnId(Enrollment enrollment);
}