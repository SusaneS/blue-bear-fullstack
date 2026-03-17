import React, { useState } from 'react';
import { Course } from '../types/types';
import './CoursesTable.css';
import { useCourses } from '../hooks/useCourses';

interface CourseTableProps {
  onEnroll?: (course: Course) => void;
}

function getPrerequisiteName(prerequisiteId: number | undefined, courses: Course[]): string {
  if (prerequisiteId === undefined) return '—';
  const prereq = courses.find((c) => c.id === prerequisiteId);
  return prereq ? `${prereq.code} – ${prereq.name}` : '—';
}

const CourseTable: React.FC<CourseTableProps> = ({ onEnroll }) => {
  const { courses, loading, error } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  //TODO: replace with actual enrollments
  const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set());

  const selectedCourse = courses.find((c: Course) => c.id === selectedCourseId) ?? null;

  const handleRowClick = (course: Course) => {
    setSelectedCourseId(course.id);
  };

  const handleEnroll = () => {
    if (!selectedCourse) return;
    setEnrolledIds((prev) => new Set(prev).add(selectedCourse.id));
    onEnroll?.(selectedCourse);
    setSelectedCourseId(null);
  };

  //TODO: check if pagination for the table is needed 
  //but less priority - make it functional first
  if (loading) {
    return (
      <div className="course-table-wrapper">
        <div className="loading-message">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="course-table-wrapper">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="course-table-wrapper">
      <div className="course-table-header">
        <h2 className="course-table-title">Available Courses</h2>
        <button
          className="enroll-button"
          onClick={handleEnroll}
          disabled={selectedCourse === null || enrolledIds.has(selectedCourse.id)}
        >
        {/*TODO: replace with proper validation and a modal with clear message */}
          {selectedCourse && enrolledIds.has(selectedCourse.id)
            ? 'Already Enrolled'
            : 'Enroll in Selected Course'}
        </button>
      </div>

      {selectedCourse && !enrolledIds.has(selectedCourse.id) && (
        <p className="selection-hint">
          Selected: <strong>{selectedCourse.name}</strong> — click "Enroll in Selected Course" to confirm.
        </p>
      )}

      <div className="course-table-scroll">
        <table className="course-table" aria-label="Courses table">
          <thead>
            <tr>
              <th scope="col">Select</th>
              <th scope="col">Code</th>
              <th scope="col">Name</th>
              <th scope="col">Credits</th>
              <th scope="col">Prerequisite</th>
              <th scope="col">Grade Level (Min – Max)</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const isSelected = course.id === selectedCourseId;
              const isEnrolled = enrolledIds.has(course.id);
              return (
                <tr
                  key={course.id}
                  className={`course-row${isSelected ? ' course-row--selected' : ''}${isEnrolled ? ' course-row--enrolled' : ''}`}
                  onClick={() => handleRowClick(course)}
                  aria-selected={isSelected}
                >
                  <td>
                    <input
                      type="radio"
                      name="selectedCourse"
                      checked={isSelected}
                      onChange={() => handleRowClick(course)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${course.name}`}
                    />
                  </td>
                  <td>{course.code}</td>
                  <td>{course.name}</td>
                  <td className="course-credits">{course.credits}</td>
                  <td>{getPrerequisiteName(course.prerequisiteId, courses)}</td>
                  <td className="course-grade-level">
                    {course.gradeLevel.min} – {course.gradeLevel.max}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

            {/* TODO: check if list of enrolled courses is needed */}
      {enrolledIds.size > 0 && (
        <div className="enrolled-list">
          <h3 className="enrolled-list-title">Enrolled Courses</h3>
          <ul>
            {courses
              .filter((c) => enrolledIds.has(c.id))
              .map((c) => (
                <li key={c.id}>
                  {c.code} – {c.name}
                </li>
              ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseTable;