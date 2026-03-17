import { useState } from 'react';
import CourseList from './components/CourseList';
import { courses } from './data/courses';
import type { Course } from './types/course';
import './App.css';

function App() {
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  function handleEnroll(selected: Course[]) {
    setEnrolledCourses(selected);
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Blue Bear Course Enrollment</h1>
      </header>
      <main>
        <CourseList courses={courses} onEnroll={handleEnroll} />
        {enrolledCourses.length > 0 && (
          <div className="enrollment-confirmation" role="status" aria-live="polite">
            <h3>Enrollment Submitted</h3>
            <p>
              You have enrolled in: {enrolledCourses.map((c) => c.name).join(', ')}.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
