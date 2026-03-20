import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchStudents, fetchStudentProfile, clearProfile } from '../store/studentSlice';
import './StudentSelector.css';

const StudentSelector: React.FC = () => {
  const dispatch = useAppDispatch();
  const { students, profile, loading } = useAppSelector((state) => state.student);

  useEffect(() => {
    dispatch(fetchStudents());
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const studentId = Number(e.target.value);
    if (studentId) {
      dispatch(fetchStudentProfile(studentId));
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