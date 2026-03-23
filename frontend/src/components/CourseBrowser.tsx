import React, { useEffect, useState } from 'react';
import { useCourses } from '../hooks/useCourses';
import './CourseBrowser.css';
import { Course } from '../types/types';
import { useAppSelector } from '../store/hooks';

const GRADE_LEVELS = [
  9, 10, 11, 12
];

enum CourseTypeFilter {
  ALL = 'all',
  CORE = 'core',
  ELECTIVE = 'elective',
}

const FILTER_CONFIG = [
  { key: CourseTypeFilter.ALL, label: 'All' },
  { key: CourseTypeFilter.CORE, label: 'Core' },
  { key: CourseTypeFilter.ELECTIVE, label: 'Elective' },
];

const getPrerequisiteName = (prerequisiteId: number | undefined, courses: Course[]): string => {
  if (prerequisiteId === undefined) return '—';
  const prereq = courses.find((c) => c.id === prerequisiteId);
  return prereq ? `${prereq.code} – ${prereq.name}` : '—';
}

const CourseBrowser: React.FC = () => {
  const { profile } = useAppSelector((state) => state.student);
  const { courses, loading, error } = useAppSelector((state) => state.course);

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<CourseTypeFilter>(CourseTypeFilter.ALL);
  const [selectedGradeLevel, setSelectedGradeLevel] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (profile?.gradeLevel) {
      setSelectedGradeLevel(profile.gradeLevel);
    }
  }, [profile]);
  
  const filtered = courses.filter((course) => {
    if (
      selectedGradeLevel !== undefined &&
      (course.gradeLevel.min > selectedGradeLevel ||
        course.gradeLevel.max < selectedGradeLevel)
    ) {
      return false;
    }

    if (typeFilter !== CourseTypeFilter.ALL && course.courseType !== typeFilter) {
      return false;
    }

    if (search) {
      const term = search.toLowerCase();
      return (
        course.name.toLowerCase().includes(term) ||
        course.code.toLowerCase().includes(term)
      );
    }

    return true;
  });

  if (loading) return <div className="loading">Loading courses...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="course-browser">
      <div className="browser-filters card">
        <input
          type="text"
          className="search-input"
          placeholder="🔍 Search by course name or code..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="grade-filter">
            <label htmlFor="grade-level-dropdown">Grade:&nbsp;</label>
            <select
              id="grade-level-dropdown"
              value={selectedGradeLevel ?? ''}
              onChange={e =>
                setSelectedGradeLevel(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
            >
              <option value="">All Grades</option>
              {GRADE_LEVELS.map((gl) => (
                <option key={gl} value={gl}>{gl}</option>
              ))}
            </select>
          </div>
        <div className="filter-buttons">
          {FILTER_CONFIG.map((f) => (
            <button
              key={f.key}
              className={`filter-btn ${typeFilter === f.key ? 'active' : ''}`}
              onClick={() => setTypeFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <span className="filter-summary">
          Showing {filtered.length} of {courses.length} courses
        </span>
      </div>

      <div className="course-grid">
        {filtered.length === 0 ? (
          <div className="card empty">No courses match your filters.</div>
        ) : (
          filtered.map((course) => (
            <div key={course.id} className="course-card card">
              <div className="course-card-header">
                <h3>{course.code} — {course.name}</h3>
                <span className={`badge-type ${course.courseType}`}>
                  {course.courseType}
                </span>
              </div>

              {course.description && (
                <p className="course-description">{course.description}</p>
              )}

              <div className="course-details">
                <span>📘 {course.credits} credits</span>
                <span>🕐 {course.hoursPerWeek} hrs/week</span>
                <span>🎓 Grades {course.gradeLevel.min}–{course.gradeLevel.max}</span>
              </div>

               {getPrerequisiteName(course.prerequisiteId, courses) && (
                <div className="course-prereq">
                  ⚠️ Requires: <strong>{getPrerequisiteName(course.prerequisiteId, courses)}</strong>
                </div>

              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseBrowser;