import type { Course } from '../types';

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-purple-100 text-purple-700',
  English: 'bg-blue-100 text-blue-700',
  Science: 'bg-green-100 text-green-700',
  'Social Studies': 'bg-yellow-100 text-yellow-700',
  'Physical Education': 'bg-orange-100 text-orange-700',
  Arts: 'bg-pink-100 text-pink-700',
  Technology: 'bg-cyan-100 text-cyan-700',
  Elective: 'bg-gray-100 text-gray-600',
};

interface CourseCardProps {
  course: Course;
  isScheduled?: boolean;
  isCompleted?: boolean;
  canAdd?: boolean;
  onAdd?: (course: Course) => void;
  onRemove?: (course: Course) => void;
  loading?: boolean;
}

export default function CourseCard({
  course,
  isScheduled = false,
  isCompleted = false,
  canAdd = true,
  onAdd,
  onRemove,
  loading = false,
}: CourseCardProps) {
  const subjectColor = SUBJECT_COLORS[course.subject] || 'bg-gray-100 text-gray-600';

  return (
    <div
      className={`card hover:shadow-md transition-shadow duration-200 flex flex-col gap-3 ${
        isCompleted ? 'opacity-75 border-green-200' : ''
      } ${isScheduled ? 'border-blue-300 bg-blue-50' : ''}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-xs text-gray-500">{course.code}</span>
            {isCompleted && (
              <span className="badge bg-green-100 text-green-700">✓ Completed</span>
            )}
            {isScheduled && (
              <span className="badge bg-blue-100 text-blue-700">📅 Scheduled</span>
            )}
          </div>
          <h3 className="font-semibold text-gray-900 mt-0.5 leading-tight">{course.name}</h3>
        </div>
        <span className={`badge flex-shrink-0 ${subjectColor}`}>{course.subject}</span>
      </div>

      {/* Description */}
      {course.description && (
        <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
      )}

      {/* Details */}
      <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
        <span className="flex items-center gap-1">
          <span>📝</span>
          <span>{course.credits} credit{course.credits !== 1 ? 's' : ''}</span>
        </span>
        <span className="flex items-center gap-1">
          <span>🎓</span>
          <span>Grade {course.grade_level}+</span>
        </span>
        {course.schedule_slot && (
          <span className="flex items-center gap-1">
            <span>⏰</span>
            <span>Slot {course.schedule_slot}</span>
          </span>
        )}
      </div>

      {/* Prerequisites */}
      {(course.prerequisites ?? []).length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 mb-1">Prerequisites:</p>
          <div className="flex flex-wrap gap-1">
            {(course.prerequisites ?? []).map(prereq => (
              <span
                key={prereq.id}
                className="badge bg-gray-100 text-gray-600"
                title={prereq.name}
              >
                {prereq.code}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {(onAdd || onRemove) && (
        <div className="pt-1 mt-auto">
          {isScheduled && onRemove ? (
            <button
              className="btn-danger w-full text-center"
              onClick={() => onRemove(course)}
              disabled={loading}
            >
              {loading ? 'Removing...' : '✕ Remove from Schedule'}
            </button>
          ) : isCompleted ? (
            <div className="text-center text-xs text-green-600 font-medium py-1">
              ✓ Already Completed
            </div>
          ) : canAdd && onAdd ? (
            <button
              className="btn-primary w-full text-center text-sm"
              onClick={() => onAdd(course)}
              disabled={loading || isScheduled}
            >
              {loading ? 'Adding...' : '+ Add to Schedule'}
            </button>
          ) : !canAdd ? (
            <div className="text-center text-xs text-amber-600 font-medium py-1 bg-amber-50 rounded-lg px-2">
              ⚠ Prerequisites not met
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
