import { useState, useEffect } from 'react';
import { api } from '../api';
import type { GraduationProgress } from '../types';
import ProgressBar from '../components/ProgressBar';
import toast from 'react-hot-toast';

const STUDENT_ID = 'S001';

const GRADE_COLORS: Record<string, string> = {
  'A+': 'bg-emerald-100 text-emerald-700',
  'A': 'bg-emerald-100 text-emerald-700',
  'A-': 'bg-green-100 text-green-700',
  'B+': 'bg-blue-100 text-blue-700',
  'B': 'bg-blue-100 text-blue-700',
  'B-': 'bg-blue-100 text-blue-700',
  'C+': 'bg-yellow-100 text-yellow-700',
  'C': 'bg-yellow-100 text-yellow-700',
  'C-': 'bg-orange-100 text-orange-700',
  'D+': 'bg-red-100 text-red-600',
  'D': 'bg-red-100 text-red-600',
  'F': 'bg-red-200 text-red-700',
};

export default function GraduationProgressPage() {
  const [progress, setProgress] = useState<GraduationProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProgress(STUDENT_ID)
      .then(setProgress)
      .catch(() => toast.error('Failed to load graduation progress'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500">Loading your progress...</p>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">Failed to load graduation progress</p>
      </div>
    );
  }

  const { student, gpa, credits_earned, credits_required, requirements_progress, completed_courses } = progress;

  const satisfiedRequirements = requirements_progress.filter(r => r.satisfied).length;
  const graduationPercentage = Math.round((credits_earned / credits_required) * 100);
  const onTrack = credits_earned >= credits_required * 0.5 && gpa >= 2.0;

  const gpaColor = gpa >= 3.5 ? 'text-emerald-600' : gpa >= 3.0 ? 'text-blue-600' : gpa >= 2.0 ? 'text-yellow-600' : 'text-red-600';
  const gpaLabel = gpa >= 3.5 ? 'Excellent' : gpa >= 3.0 ? 'Good' : gpa >= 2.0 ? 'Satisfactory' : 'Needs Improvement';

  // Group completed courses by semester
  const bySemester = completed_courses.reduce<Record<string, typeof completed_courses>>((acc, course) => {
    if (!acc[course.semester]) acc[course.semester] = [];
    acc[course.semester].push(course);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Graduation Progress</h1>
        <p className="text-gray-500 mt-1">Track your journey to graduation, {student.name}</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className={`text-3xl font-bold ${gpaColor}`}>{gpa.toFixed(2)}</div>
          <div className="text-sm text-gray-500 mt-1">GPA</div>
          <div className={`text-xs font-medium mt-0.5 ${gpaColor}`}>{gpaLabel}</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{credits_earned}</div>
          <div className="text-sm text-gray-500 mt-1">Credits Earned</div>
          <div className="text-xs text-gray-400 mt-0.5">of {credits_required} required</div>
        </div>

        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600">{satisfiedRequirements}</div>
          <div className="text-sm text-gray-500 mt-1">Requirements Met</div>
          <div className="text-xs text-gray-400 mt-0.5">of {requirements_progress.length} total</div>
        </div>

        <div className="card text-center">
          <div className={`text-3xl font-bold ${onTrack ? 'text-green-600' : 'text-orange-600'}`}>
            {onTrack ? '✓' : '!'}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {onTrack ? 'On Track' : 'Needs Attention'}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">Grade {student.grade}</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
            <span>🎓</span> Overall Graduation Progress
          </h2>
          <span className={`badge text-sm px-3 py-1 font-semibold ${
            graduationPercentage >= 75 ? 'bg-green-100 text-green-700' :
            graduationPercentage >= 50 ? 'bg-blue-100 text-blue-700' :
            'bg-yellow-100 text-yellow-700'
          }`}>
            {graduationPercentage}%
          </span>
        </div>

        <div className="mb-4">
          <div className="h-5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${graduationPercentage}%` }}
            >
              {graduationPercentage >= 15 && (
                <span className="text-white text-xs font-bold">{graduationPercentage}%</span>
              )}
            </div>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0 credits</span>
            <span>{credits_required} credits needed to graduate</span>
          </div>
        </div>
      </div>

      {/* Requirements by Subject */}
      <div className="card">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
          <span>📋</span> Requirements by Subject
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {requirements_progress.map(req => (
            <div
              key={req.subject}
              className={`p-3 rounded-lg border ${
                req.satisfied ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'
              }`}
            >
              <ProgressBar
                label={req.subject}
                value={req.credits_earned}
                max={req.credits_required}
              />
            </div>
          ))}
        </div>
      </div>

      {/* GPA Details */}
      <div className="card">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
          <span>📊</span> GPA Breakdown
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className={`text-2xl font-bold ${gpaColor}`}>{gpa.toFixed(2)}</div>
            <div className="text-sm text-gray-500">Cumulative GPA</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">{completed_courses.length}</div>
            <div className="text-sm text-gray-500">Courses Completed</div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-gray-700">{credits_earned}</div>
            <div className="text-sm text-gray-500">Credits Earned</div>
          </div>
        </div>

        {/* Scale Legend */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[['A/A+', '4.0'], ['A-', '3.7'], ['B+', '3.3'], ['B', '3.0'], ['B-', '2.7'], ['C+', '2.3'], ['C', '2.0']].map(([grade, points]) => (
            <span key={grade} className={`badge ${GRADE_COLORS[grade.split('/')[0]]} px-2 py-1`}>
              {grade} = {points}
            </span>
          ))}
        </div>
      </div>

      {/* Completed Courses by Semester */}
      <div className="card">
        <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2 mb-4">
          <span>✅</span> Completed Courses
        </h2>

        {Object.keys(bySemester).length === 0 ? (
          <p className="text-gray-400 text-center py-6">No completed courses yet</p>
        ) : (
          <div className="space-y-6">
            {Object.entries(bySemester).map(([semester, semCourses]) => {
              const semCredits = semCourses.reduce((sum, c) => sum + c.credits, 0);
              return (
                <div key={semester}>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-700">{semester}</h3>
                    <span className="text-xs text-gray-500">{semCredits} credits</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                          <th className="pb-2 pr-4">Code</th>
                          <th className="pb-2 pr-4">Course</th>
                          <th className="pb-2 pr-4">Subject</th>
                          <th className="pb-2 pr-4 text-center">Credits</th>
                          <th className="pb-2 text-center">Grade</th>
                        </tr>
                      </thead>
                      <tbody>
                        {semCourses.map(course => (
                          <tr key={course.id} className="border-b border-gray-50 hover:bg-gray-50">
                            <td className="py-2 pr-4 font-mono text-xs text-gray-500">{course.code}</td>
                            <td className="py-2 pr-4 font-medium">{course.name}</td>
                            <td className="py-2 pr-4">
                              <span className="text-xs text-gray-500">{course.subject}</span>
                            </td>
                            <td className="py-2 pr-4 text-center text-gray-600">{course.credits}</td>
                            <td className="py-2 text-center">
                              <span className={`badge px-2 py-0.5 font-bold ${GRADE_COLORS[course.grade] || 'bg-gray-100 text-gray-600'}`}>
                                {course.grade}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
