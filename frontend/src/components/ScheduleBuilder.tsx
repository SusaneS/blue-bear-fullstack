import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchCourseSections } from '../store/courseSectionsSlice';
import { fetchEnrollments, enrollInSection } from '../store/enrollmentSlice';
import { CourseSection } from '../types/types';
import './ScheduleBuilder.css';
import { useAppSelector } from '../store/hooks';

//TODO: fix logic - not correct, need courses list
const hasMetPrerequisites = (
  section: CourseSection,
  courseHistory: { courseId: number; status: string }[]
) => {
  if (!(section as any).prerequisiteId) return true;
  return courseHistory.some(
    (h) => h.courseId === (section as any).prerequisiteId && h.status.toLowerCase() === 'passed'
  );
}

const hasSectionTimeConflict = (
  newSection: CourseSection,
  enrolledSections: CourseSection[]
) => {
  const newStart = Number(newSection.startTime.replace(':', ''));
  const newEnd = Number(newSection.endTime.replace(':', ''));
  const newDay = newSection.dayOfWeek.trim().toLowerCase();
  return enrolledSections.some((enr) => {
    const enrDay = enr.dayOfWeek.trim().toLowerCase();
    const enrStart = Number(enr.startTime.replace(':', ''));
    const enrEnd = Number(enr.endTime.replace(':', ''));
    return newDay === enrDay && newStart < enrEnd && newEnd > enrStart;
  });
}

const isSectionAvailable = (
  section: CourseSection,
  enrolledSections: CourseSection[],
  courseHistory: { courseId: number; status: string }[],
  scheduleFull: boolean
) => {
  if (enrolledSections.some(enr => enr.courseId === section.courseId)) return false;
  if (scheduleFull) return false;
  if (section.currentEnrollment >= section.maxCapacity) return false;
  if (!hasMetPrerequisites(section, courseHistory)) return false;
  if (hasSectionTimeConflict(section, enrolledSections)) return false;
  return true;
}

const getSectionUnavailableReason = (
  section: CourseSection,
  enrolledSections: CourseSection[],
  courseHistory: { courseId: number; status: string }[],
  scheduleFull: boolean
) => {
  if (enrolledSections.some(enr => enr.courseId === section.courseId)) return 'Already enrolled';
  if (section.currentEnrollment >= section.maxCapacity) return 'Full';
  if (!hasMetPrerequisites(section, courseHistory)) return 'Prerequisite not met';
  if (hasSectionTimeConflict(section, enrolledSections)) return 'Time conflict';
  if (scheduleFull) return 'Max enrollments';
  return '';
}

function Modal({
  open, title, children, onConfirm, onCancel, confirmLoading, okText = 'OK',
}: {
  open: boolean; title: string; children: React.ReactNode;
  onConfirm: () => void; onCancel: () => void;
  confirmLoading?: boolean; okText?: string;
}) {
  if (!open) return null;
  return (
    <div className="modal-overlay">
      <div className="modal" role="dialog" aria-modal>
        <div className="modal-title">{title}</div>
        <div>{children}</div>
        <div className="modal-actions">
          <button className="enroll-btn" onClick={onCancel} disabled={confirmLoading}>
            Cancel
          </button>
          <button
            className="enroll-btn"
            style={{ marginLeft: 10 }}
            onClick={onConfirm}
            disabled={confirmLoading}
          >
            {confirmLoading ? "Processing..." : okText}
          </button>
        </div>
      </div>
    </div>
  );
}

// Assumption that schedule builder only shows course sections for current semester
const CURRENT_SEMESTER_ID = 10;

const ScheduleBuilder: React.FC = () => {
  const dispatch = useDispatch();

  const { profile, loading } = useAppSelector((state) => state.student);
  const { sections, loading: sectionsLoading } = useAppSelector((state) => state.courseSections);
  const { enrollments, loading: enrollmentLoading } = useAppSelector((state) => state.enrollment);

  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const maxEnrollments = 5;
  const gradeLevel = profile?.gradeLevel;
  const studentId = profile?.id;
  const courseHistory = profile?.courseHistory ?? [];
  const enrolledSections = sections.filter(cs =>
    enrollments.some(e => e.status === 'enrolled' && e.courseSectionId === cs.id)
  );
  const isScheduleFull = enrolledSections.length >= maxEnrollments;
  // const isScheduleFull = true;

  useEffect(() => {
    if (profile && gradeLevel != null && studentId != null) {
      dispatch(fetchCourseSections({ semesterId: CURRENT_SEMESTER_ID, gradeLevel, openOnly: false }) as any);
      dispatch(fetchEnrollments(studentId) as any);
    }
  }, [dispatch, gradeLevel, studentId, profile]);

  const handleEnrollClick = (section: CourseSection) => {
    setSelectedSection(section);
    setValidationError(null);
    setSuccessMsg(null);
  };
  
  const handleModalOk = async () => {
    if (!selectedSection) return;
    if (!profile || !profile.courseHistory) {
      setValidationError("Student data not loaded. Please refresh.");
      return;
    }
   
    try {
      const action = await dispatch(
        enrollInSection({ studentId: profile.id, courseSectionId: selectedSection.id }) as any
      );
      if (enrollInSection.rejected.match(action)) {
        if (typeof action.payload === 'string') {
          setValidationError(action.payload);
        } else {
          setValidationError('Enrollment failed.');
        }
      } else {
        setSuccessMsg("Enrollment successful!");

        dispatch(fetchEnrollments(profile.id) as any);
        dispatch(fetchCourseSections({ semesterId: CURRENT_SEMESTER_ID, gradeLevel, openOnly: false }) as any);
        setTimeout(() => setSelectedSection(null), 1100);
      }
    } catch {
      setValidationError('Unexpected error during enrollment.');
    }
  };

  const handleModalCancel = () => {
    setSelectedSection(null);
    setValidationError(null);
    setSuccessMsg(null);
  };

  // Filter sections by search term
  const filteredSections = sections.filter(section => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      section.courseName.toLowerCase().includes(term) ||
      section.sectionLetter.toLowerCase().includes(term) ||
      section.teacherName.toLowerCase().includes(term) ||
      section.classroomName.toLowerCase().includes(term)
    );
  });

  return (
    <div className="schedule-builder-outer">
    <div className="browser-filters card schedule-search-bar">
      <input
        type="text"
        className="search-input"
        placeholder="🔍 Search by section name, teacher, or room..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: 240 }}
      />
      <span className="filter-summary" style={{ marginLeft: 12 }}>
        Showing {filteredSections.length} of {sections.length} sections
      </span>
    </div>
    <div className="schedule-builder-container">
      {/* All Sections List */}
      <div className="panel">
        <h3>Course Sections</h3>
        {isScheduleFull && (
          <div className="banner">
            You have reached the maximum number of {maxEnrollments} active sections for this semester. Drop a section to enroll in another.
          </div>
        )}
        <div className="course-grid">
        {sectionsLoading ? (
            <div className="card empty">Loading...</div>
          ) : filteredSections.length === 0 ? (
            <div className="card empty">No sections found.</div>
          ) : filteredSections.map(section => {
              const disabled = !isSectionAvailable(
                section,
                enrolledSections,
                courseHistory,
                isScheduleFull
              );
              const reason = getSectionUnavailableReason(
                section,
                enrolledSections,
                courseHistory,
                isScheduleFull
              );
              return (
                <div
                  className={`course-card card${disabled ? ' section-item--disabled' : ''}`}
                  key={section.id}
                  style={disabled ? { opacity: 0.67 } : {}}
                >
                  <div className="course-card-header">
                    <h3>{section.courseName} — {section.sectionLetter}</h3>
                    <span className="badge-type core">{section.teacherName}</span>
                  </div>
                  <div className="course-details">
                    <span>📅 {section.dayOfWeek}</span>
                    <span>🕒 {section.startTime}-{section.endTime}</span>
                    <span>🏫 {section.classroomName}</span>
                    <span>👥 {section.currentEnrollment} / {section.maxCapacity} enrolled</span>
                  </div>
                  <div className="card-validation-area">
                    {disabled && reason ? (
                      <div className="section-unavailable">⚠️ {reason}</div>
                    ) : null}
                  </div>
                  <div className="btn-action-footer">
                    <button
                      className="enroll-btn"
                      onClick={() => handleEnrollClick(section)}
                      disabled={disabled}
                      aria-disabled={disabled}
                      tabIndex={disabled ? -1 : 0}
                    >
                      Enroll
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
      {/* Enrolled Sections */}
      <div className="panel">
        <h3>Your Enrolled Sections</h3>
        <div className="course-grid">
          {enrollmentLoading ? (
            <div className="card empty">Loading...</div>
          ) : enrolledSections.length === 0 ? (
            <div className="card empty">No enrolled sections.</div>
          ) : enrolledSections.map(section => (
            <div className="course-card card" key={section.id}>
              <div className="course-card-header">
                <h3>{section.courseName} — {section.sectionLetter}</h3>
                <span className="badge-type core">
                  {section.teacherName}
                </span>
              </div>
              <div className="course-details">
                <span>📅 {section.dayOfWeek}</span>
                <span>🕒 {section.startTime}-{section.endTime}</span>
                <span>🏫 {section.classroomName}</span>
                <span>👥 {section.currentEnrollment} / {section.maxCapacity} enrolled</span>
              </div>
              <div className="card-validation-area"></div>
              <div className="btn-action-footer">
                <button
                  className="drop-btn"
                  onClick={() => handleEnrollClick(section)}
                >
                  Drop
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
      {/* Modal */}
      <Modal
        open={!!selectedSection}
        title="Confirm Enrollment"
        onConfirm={handleModalOk}
        onCancel={handleModalCancel}
        confirmLoading={enrollmentLoading}
        okText="Enroll"
      >
        {selectedSection && (
          <div>
            <p>
              Enroll in <strong>{selectedSection.courseName} {selectedSection.sectionLetter}</strong>?
            </p>
            <p>
              Time: {selectedSection.dayOfWeek}, {selectedSection.startTime}-{selectedSection.endTime}<br />
              Teacher: {selectedSection.teacherName}<br />
              Room: {selectedSection.classroomName}
            </p>
            {validationError && <div className="modal-error">{validationError}</div>}
            {successMsg && <div style={{color:'#40701a',marginTop:10}}>{successMsg}</div>}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ScheduleBuilder;