import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import type { Course, ScheduledCourse } from '../types';
import CourseCard from '../components/CourseCard';
import toast from 'react-hot-toast';

const CURRENT_SEMESTER = 'Fall 2025';
const STUDENT_ID = 'S001';
const MAX_CREDITS = 8;

const SEMESTERS = ['Fall 2025', 'Spring 2026', 'Fall 2026', 'Spring 2027'];

export default function SemesterPlanner() {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [scheduled, setScheduled] = useState<ScheduledCourse[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<number>>(new Set());
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<number | null>(null);

  // Filters for available courses
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(CURRENT_SEMESTER);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesData, subjectsData, scheduleData, completedIdsData] = await Promise.all([
        api.getCourses(),
        api.getSubjects(),
        api.getSchedule(STUDENT_ID, selectedSemester),
        api.getCompletedCourseIds(STUDENT_ID),
      ]);
      setAllCourses(coursesData);
      setSubjects(subjectsData);
      setScheduled(scheduleData);
      setCompletedIds(new Set(completedIdsData));
    } catch {
      toast.error('Failed to load schedule. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  }, [selectedSemester]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const scheduledIds = new Set(scheduled.map(c => c.id));

  const scheduledCredits = scheduled.reduce((sum, c) => sum + c.credits, 0);

  const handleAdd = async (course: Course) => {
    setActionId(course.id);
    try {
      await api.addToSchedule(STUDENT_ID, course.id, selectedSemester);
      const updatedSchedule = await api.getSchedule(STUDENT_ID, selectedSemester);
      setScheduled(updatedSchedule);
      toast.success(`${course.name} added to your ${selectedSemester} schedule!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to add course');
    } finally {
      setActionId(null);
    }
  };

  const handleRemove = async (course: Course) => {
    setActionId(course.id);
    try {
      await api.removeFromSchedule(STUDENT_ID, course.id, selectedSemester);
      setScheduled(prev => prev.filter(c => c.id !== course.id));
      toast.success(`${course.name} removed from your schedule`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to remove course');
    } finally {
      setActionId(null);
    }
  };

  const canAddCourse = (course: Course): boolean => {
    return course.prerequisites.every(p => completedIds.has(p.id));
  };

  // Available courses = not yet scheduled and not completed
  const availableCourses = allCourses.filter(c => {
    if (scheduledIds.has(c.id)) return false;
    if (completedIds.has(c.id)) return false;
    if (subjectFilter && c.subject !== subjectFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!c.name.toLowerCase().includes(q) && !c.code.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const creditLoad = scheduledCredits <= 4 ? 'Light' : scheduledCredits <= 6 ? 'Normal' : 'Heavy';
  const creditLoadColor = scheduledCredits <= 4 ? 'text-green-600' : scheduledCredits <= 6 ? 'text-blue-600' : 'text-orange-600';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading planner...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semester Planner</h1>
          <p className="text-gray-500 mt-1">Build your course schedule and avoid conflicts</p>
        </div>
        <select
          className="select w-auto"
          value={selectedSemester}
          onChange={e => setSelectedSemester(e.target.value)}
        >
          {SEMESTERS.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Current Schedule */}
        <div className="lg:col-span-1 space-y-4">
          <div className="card">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <span>📅</span> {selectedSemester} Schedule
            </h2>

            {/* Credit Meter */}
            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600 font-medium">Total Credits</span>
                <span className={`font-bold ${creditLoadColor}`}>
                  {scheduledCredits}/{MAX_CREDITS} · {creditLoad}
                </span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    scheduledCredits <= 4 ? 'bg-green-500' :
                    scheduledCredits <= 6 ? 'bg-blue-500' : 'bg-orange-500'
                  }`}
                  style={{ width: `${Math.min((scheduledCredits / MAX_CREDITS) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1.5">Max recommended: {MAX_CREDITS} credits/semester</p>
            </div>
          </div>

          {/* Scheduled Course List */}
          {scheduled.length === 0 ? (
            <div className="card text-center py-8">
              <div className="text-4xl mb-3">📭</div>
              <p className="text-gray-500 font-medium">No courses scheduled yet</p>
              <p className="text-gray-400 text-sm mt-1">Add courses from the right panel</p>
            </div>
          ) : (
            <div className="space-y-3">
              {scheduled.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  isScheduled
                  onRemove={handleRemove}
                  loading={actionId === course.id}
                />
              ))}
            </div>
          )}

          {/* Schedule Info */}
          {scheduled.length > 0 && (
            <div className="card bg-blue-50 border-blue-200">
              <h3 className="font-semibold text-blue-800 text-sm mb-2">📊 Schedule Summary</h3>
              <div className="space-y-1 text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Courses</span>
                  <span className="font-medium">{scheduled.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Credits</span>
                  <span className="font-medium">{scheduledCredits}</span>
                </div>
                <div className="flex justify-between">
                  <span>Workload</span>
                  <span className={`font-medium ${creditLoadColor}`}>{creditLoad}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Available Courses */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card">
            <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
              <span>📚</span> Available Courses
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {availableCourses.length} courses available · {completedIds.size} completed
            </p>
          </div>

          {availableCourses.length === 0 ? (
            <div className="card text-center py-10">
              <p className="text-gray-400">No available courses match your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {availableCourses.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  canAdd={canAddCourse(course)}
                  onAdd={handleAdd}
                  loading={actionId === course.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
