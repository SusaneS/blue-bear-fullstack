import { useState } from 'react';
import type { Course } from '../types/course';
import './CourseList.css';

interface CourseListProps {
  courses: Course[];
  onEnroll?: (selectedCourses: Course[]) => void;
}

function CourseList({ courses, onEnroll }: CourseListProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function toggleAll() {
    if (selectedIds.size === courses.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(courses.map((c) => c.id)));
    }
  }

  function handleEnroll() {
    const selected = courses.filter((c) => selectedIds.has(c.id));
    onEnroll?.(selected);
  }

  const allSelected = courses.length > 0 && selectedIds.size === courses.length;
  const someSelected = selectedIds.size > 0 && selectedIds.size < courses.length;

  return (
    <div className="course-list-container">
      <div className="course-list-header">
        <h2>Course Catalog</h2>
        {selectedIds.size > 0 && (
          <button
            className="enroll-button"
            onClick={handleEnroll}
          >
            Enroll in {selectedIds.size} Course{selectedIds.size !== 1 ? 's' : ''}
          </button>
        )}
      </div>

      <div className="table-wrapper">
        <table className="course-table">
          <thead>
            <tr>
              <th scope="col">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = someSelected;
                  }}
                  onChange={toggleAll}
                  aria-label="Select all courses"
                />
              </th>
              <th scope="col">Course Name</th>
              <th scope="col">Description</th>
              <th scope="col">Credits</th>
              <th scope="col">Prerequisite</th>
              <th scope="col">Grade Level</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => {
              const isSelected = selectedIds.has(course.id);
              return (
                <tr
                  key={course.id}
                  className={isSelected ? 'selected' : ''}
                  onClick={() => toggleSelection(course.id)}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelection(course.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${course.name}`}
                    />
                  </td>
                  <td className="course-name">{course.name}</td>
                  <td className="course-description">{course.description}</td>
                  <td className="course-credits">{course.credits}</td>
                  <td className="course-prerequisite">
                    {course.prerequisiteCourse ?? '—'}
                  </td>
                  <td className="course-grade-level">
                    {course.gradeLevelMin === course.gradeLevelMax
                      ? `Grade ${course.gradeLevelMin}`
                      : `Grades ${course.gradeLevelMin}–${course.gradeLevelMax}`}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {courses.length === 0 && (
          <p className="no-courses">No courses available.</p>
        )}
      </div>
    </div>
  );
}

export default CourseList;
