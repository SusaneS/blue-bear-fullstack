import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStudents, fetchStudentProfile, clearProfile } from '../store/studentSlice';
import './StudentSelector.css';
import { fetchEnrollments } from '../store/enrollmentSlice';
import { fetchCourseSections } from '../store/courseSectionsSlice';

// Assumption that schedule builder only shows course sections for current semester
const CURRENT_SEMESTER_ID = 10;

const StudentSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, profile, loading } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  // Populate state once student is selected from dropdown in header - fetch profile, enrollments, and course sections for the student's grade level
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = Number(e.target.value);
    if (studentId) {
      dispatch(fetchStudentProfile(studentId));
      dispatch(fetchCourseSections({ semesterId: CURRENT_SEMESTER_ID, gradeLevel: profile?.gradeLevel, openOnly: false }) as any);
      dispatch(fetchEnrollments(studentId));
    } else {
      dispatch(clearProfile());
    }
  };

  return (
    <div className="student-selector">
      <label htmlFor="student-select">Student:</label>
      <select
        id="student-select"
        onChange={handleChange}
        value={profile?.id || ''}
        disabled={loading}
      >
        <option value="">Select a student...</option>
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.firstName} {s.lastName} — Grade {s.gradeLevel}
          </option>
        ))}
      </select>
    </div>
  );
};

export default StudentSelector;