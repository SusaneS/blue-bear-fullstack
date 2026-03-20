import React from 'react';
import { useAppSelector } from '../store/hooks';
import './StudentProfile.css';

enum CourseStatus {
  PASSED = 'passed',
  FAILED = 'failed',
}

const STATUS_CONFIG = {
  [CourseStatus.PASSED]: { label: 'Passed', className: 'status-passed' },
  [CourseStatus.FAILED]: { label: 'Failed', className: 'status-failed' },
};

const CREDITS_TO_GRADUATE = 30;

const StudentProfile: React.FC = () => {
  const { profile, loading, error } = useAppSelector((state) => state.student);

  if (loading) return <div className="loading">Loading profile...</div>;
  if (error) return <div className="error">{error}</div>;

  if (!profile) {
    return (
      <div className="placeholder card">
        <h2>📊 Student Profile</h2>
        <p>Select a student from the header to view their profile.</p>
      </div>
    );
  }

  const progressPercent = Math.min(
    Math.round((profile.creditsEarned / CREDITS_TO_GRADUATE) * 100),
    100
  );
  const isGraduationReady = profile.creditsEarned >= CREDITS_TO_GRADUATE;

  return (
    <div className="student-profile">
      {/* Overview */}
      <div className="profile-overview card">
        <h2>{profile.firstName} {profile.lastName}</h2>
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-label">Grade</span>
            <span className="stat-value">{profile.gradeLevel}</span>
          </div>
          <div className="stat">
            <span className="stat-label">GPA</span>
            <span className="stat-value">{profile.gpa.toFixed(2)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Credits Earned</span>
            <span className="stat-value">{profile.creditsEarned}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Email</span>
            <span className="stat-value email">{profile.email}</span>
          </div>
        </div>
      </div>

       {/* Graduation Progress */}
      <div className="graduation-progress card">
        <div className="graduation-header">
          <h3>🎓 Graduation Progress</h3>
          <span className={`graduation-status ${isGraduationReady ? 'ready' : ''}`}>
            {isGraduationReady ? '✅ Ready to Graduate!' : `${CREDITS_TO_GRADUATE - profile.creditsEarned} credits remaining`}
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className={`progress-bar-fill ${isGraduationReady ? 'complete' : ''}`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="progress-label">
          {profile.creditsEarned} / {CREDITS_TO_GRADUATE} credits ({progressPercent}%)
        </div>
      </div>

      {/* Course History */}
      <div className="course-history card">
        <h3>📜 Course History</h3>
        {profile.courseHistory.length === 0 ? (
          <p className="empty">No course history yet.</p>
        ) : (
          <table className="history-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Semester</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {profile.courseHistory.map((entry) => {
                const statusInfo = STATUS_CONFIG[entry.status as CourseStatus];
                return (
                  <tr key={entry.id}>
                    <td>{entry.courseName}</td>
                    <td>Semester {entry.semesterId}</td>
                    <td>
                      <span className={`status-badge ${statusInfo.className}`}>
                        {statusInfo.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;