import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { Course } from '../types';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';

const CURRENT_SEMESTER = 'Fall 2025';
const STUDENT_ID = 'S001';

export default function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<string[]>([]);
  const [scheduledIds, setScheduledIds] = useState<Set<number>>(new Set());
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState<number | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesData, subjectsData, scheduleData, completedIdsData] = await Promise.all([
        api.getCourses(),
        api.getSubjects(),
        api.getSchedule(STUDENT_ID, CURRENT_SEMESTER),
        api.getCompletedCourseIds(STUDENT_ID),
      ]);
      setCourses(coursesData);
      setSubjects(subjectsData);
      setScheduledIds(new Set(scheduleData.map(c => c.id)));
      setCompletedIds(new Set(completedIdsData));
    } catch (err) {
      toast.error('Failed to load courses. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAdd = async (course: Course) => {
    setAddingId(course.id);
    try {
      await api.addToSchedule(STUDENT_ID, course.id, CURRENT_SEMESTER);
      setScheduledIds(prev => new Set([...prev, course.id]));
      toast.success(`${course.name} added to your schedule!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add course');
    } finally {
      setAddingId(null);
    }
  };

  // Apply filters
  const filtered = courses.filter(c => {
    if (subjectFilter && c.subject !== subjectFilter) return false;
    if (gradeFilter && c.grade_level !== Number(gradeFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q) && !c.description?.toLowerCase().includes(q)) {
        return false;
      }
    }
    return true;
  });

  const canAddCourse = (course: Course): boolean => {
    return course.prerequisites.every(p => completedIds.has(p.id));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Catalog</h1>
        <p className="text-gray-500 mt-1">Browse and discover {courses.length} available courses</p>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            type="text"
            className="input"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="select"
            value={subjectFilter}
            onChange={e => setSubjectFilter(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <select
            className="select"
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
          >
            <option value="">All Grade Levels</option>
            {[9, 10, 11, 12].map(g => (
              <option key={g} value={g}>Grade {g}</option>
            ))}
          </select>
        </div>

        {/* Active filters count */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <span className="text-sm text-gray-500">
            Showing <strong>{filtered.length}</strong> of <strong>{courses.length}</strong> courses
          </span>
          {(search || subjectFilter || gradeFilter) && (
            <button
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              onClick={() => { setSearch(''); setSubjectFilter(''); setGradeFilter(''); }}
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Status Legend */}
      <div className="flex items-center gap-4 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-green-400 inline-block" />
          Completed
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-400 inline-block" />
          Scheduled for {CURRENT_SEMESTER}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
          Prerequisites not met
        </span>
      </div>

      {/* Course Grid */}
      {filtered.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg">No courses match your filters</p>
          <button
            className="mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
            onClick={() => { setSearch(''); setSubjectFilter(''); setGradeFilter(''); }}
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(course => (
            <CourseCard
              key={course.id}
              course={course}
              isScheduled={scheduledIds.has(course.id)}
              isCompleted={completedIds.has(course.id)}
              canAdd={canAddCourse(course)}
              onAdd={handleAdd}
              loading={addingId === course.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
