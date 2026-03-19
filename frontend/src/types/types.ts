export interface Course {
  id: number;
  code: string;
  name: string;
  description?: string;
  credits: number;
  hoursPerWeek: number;
  courseType: 'core' | 'elective';
  prerequisiteId?: number;
  gradeLevel: {
    min: number;
    max: number;
  };
}

export interface CourseSection {
  id: number;
  courseId: number;
  courseCode: string;
  courseName: string;
  courseType: 'core' | 'elective';
  credits: number;
  sectionLetter: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  teacherName: string;
  classroomName: string;
  maxCapacity: number;
  currentEnrollment: number;
  isFull: boolean;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  gradeLevel: number;
  email: string;
}

export interface StudentProfile extends Student {
  gpa: number;
  creditsEarned: number;
  courseHistory: CourseHistory[];
}

export interface CourseHistory {
  id: number;
  courseId: number;
  courseName: string;
  semesterId: number;
  status: 'passed' | 'failed';
}

export interface Enrollment {
  id: number;
  studentId: number;
  courseSectionId: number;  // changed: section, not course
  semesterId: number;
  status: 'enrolled' | 'completed' | 'dropped';
}

export interface ValidationError {
  type: 'prerequisite' | 'conflict' | 'max_courses' | 'capacity' | 'other';
  message: string;
}