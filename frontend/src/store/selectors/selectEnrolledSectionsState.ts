import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { CourseSection, Enrollment } from '../../types/types';

export const selectEnrolledSectionsState = createSelector(
  [
    (state: RootState) => state.courseSections.sections,
    (state: RootState) => state.enrollment.enrollments,
    (state: RootState) => state.enrollment.loading,
    (state: RootState) => state.enrollment.error,
    (state: RootState) => state.courseSections.loading,
    (state: RootState) => state.courseSections.error,
  ],
  (sections, enrollments, enrollmentLoading, enrollmentError, courseSectionsLoading, courseSectionsError) => ({
    enrolledSections: sections.filter((cs: CourseSection) =>
      enrollments.some((e: Enrollment) => e.status === 'enrolled' && e.courseSectionId === cs.id)
    ),
    loading: enrollmentLoading || courseSectionsLoading,
    error: enrollmentError || courseSectionsError,
  })
);