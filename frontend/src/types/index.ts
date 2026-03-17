export interface Course {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  subject: string;
  grade_level: number;
  schedule_slot: string | null;
  max_enrollment: number;
  current_enrollment: number;
  prerequisites: { id: number; code: string; name: string }[];
}

export interface Student {
  id: number;
  student_id: string;
  name: string;
  grade: number;
  gpa: number;
  credits_earned: number;
  credits_required: number;
}

export interface CompletedCourse extends Course {
  grade: string;
  semester: string;
}

export interface RequirementProgress {
  subject: string;
  credits_required: number;
  credits_earned: number;
  satisfied: boolean;
}

export interface GraduationProgress {
  student: Student;
  gpa: number;
  credits_earned: number;
  credits_required: number;
  requirements_progress: RequirementProgress[];
  completed_courses: CompletedCourse[];
}

export interface ScheduledCourse extends Course {
  semester: string;
}
