import React from 'react';
import CourseTable from './components/CourseTable';
import { Course } from './types/types';
import './App.css';

function App() {
  const handleEnroll = (course: Course) => {
    console.log('Enrolled in course:', course);
  };

  return (
    <div className="App">
      <CourseTable onEnroll={handleEnroll} />
    </div>
  );
}

export default App;
