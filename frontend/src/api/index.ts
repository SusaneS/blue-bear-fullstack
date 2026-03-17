const API_BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

export const api = {
  // Courses
  getCourses: (params?: { subject?: string; grade_level?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.subject) query.set('subject', params.subject);
    if (params?.grade_level) query.set('grade_level', String(params.grade_level));
    if (params?.search) query.set('search', params.search);
    const qs = query.toString();
    return request<import('../types').Course[]>(`/courses${qs ? `?${qs}` : ''}`);
  },

  getSubjects: () => request<string[]>('/courses/subjects'),

  getCourse: (id: number) => request<import('../types').Course>(`/courses/${id}`),

  // Students
  getStudents: () => request<import('../types').Student[]>('/students'),

  getStudent: (studentId: string) => request<import('../types').Student>(`/students/${studentId}`),

  getSchedule: (studentId: string, semester?: string) => {
    const qs = semester ? `?semester=${encodeURIComponent(semester)}` : '';
    return request<import('../types').ScheduledCourse[]>(`/students/${studentId}/schedule${qs}`);
  },

  addToSchedule: (studentId: string, courseId: number, semester?: string) =>
    request<{ message: string }>(`/students/${studentId}/schedule`, {
      method: 'POST',
      body: JSON.stringify({ course_id: courseId, semester }),
    }),

  removeFromSchedule: (studentId: string, courseId: number, semester?: string) => {
    const qs = semester ? `?semester=${encodeURIComponent(semester)}` : '';
    return request<{ message: string }>(`/students/${studentId}/schedule/${courseId}${qs}`, {
      method: 'DELETE',
    });
  },

  getProgress: (studentId: string) =>
    request<import('../types').GraduationProgress>(`/students/${studentId}/progress`),

  getCompletedCourseIds: (studentId: string) =>
    request<number[]>(`/students/${studentId}/completed-course-ids`),
};
