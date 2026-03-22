// Example API client using axios
import axios from 'axios';
import { Course } from '../types/types';
import { get } from 'http';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request/response interceptors if needed
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Example API functions
export const coursesApi = {
  getAll: () => apiClient.get('/courses'),
  getById: (id: number) => apiClient.get(`/courses/${id}`),
};

export const courseSectionsApi = {
  getFiltered: (
    semesterId: number,
    courseId?: number,
    gradeLevel?: number, openOnly?: boolean) => apiClient.get(
      '/sections', 
      { params: { semesterId, courseId, gradeLevel, openOnly } 
    })
};

export const studentsApi = {
  getAll: () => apiClient.get('/students'),
  getById: (id: number) => apiClient.get(`/students/${id}`),
  getProfile: (id: number) => apiClient.get(`/students/${id}/profile`),
  getSchedule: (id: number) => apiClient.get(`/students/${id}/schedule`),
};

export const enrollmentsApi = {
  enroll: (studentId: number, sectionId: number) =>
    apiClient.post('/enrollments/enroll', { studentId, sectionId }),
  drop: (studentId: number, sectionId: number) =>
    apiClient.put('/enrollments/drop', { studentId, sectionId }),
  complete: (studentId: number, sectionId: number) => 
    apiClient.post('/enrollments/complete', { studentId, sectionId }),
};
