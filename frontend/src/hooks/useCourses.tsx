import { useEffect, useState } from 'react';
import { coursesApi } from '../api/api-client';
import { Course } from '../types/types';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    coursesApi.getAll()
      .then((res) => setCourses(res.data))
      .catch(() => setError('Failed to load courses'))
      .finally(() => setLoading(false));
  }, []);

  return { courses, loading, error };
};