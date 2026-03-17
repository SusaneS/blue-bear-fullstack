import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

// GET /api/students - Get all students
router.get('/', (_req: Request, res: Response) => {
  const db = getDatabase();
  const students = db.prepare('SELECT * FROM students ORDER BY name').all();
  res.json(students);
});

// GET /api/students/:id - Get a student by student_id
router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id);

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json(student);
});

// GET /api/students/:id/schedule - Get current semester schedule
router.get('/:id/schedule', (req: Request, res: Response) => {
  const db = getDatabase();
  const { semester = 'Fall 2025' } = req.query;

  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id) as StudentRow | undefined;
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const scheduled = db.prepare(`
    SELECT c.*, sc.semester,
      GROUP_CONCAT(p.id) as prerequisite_ids,
      GROUP_CONCAT(p.code) as prerequisite_codes,
      GROUP_CONCAT(p.name) as prerequisite_names
    FROM scheduled_courses sc
    JOIN courses c ON sc.course_id = c.id
    LEFT JOIN prerequisites pr ON c.id = pr.course_id
    LEFT JOIN courses p ON pr.prerequisite_id = p.id
    WHERE sc.student_id = ? AND sc.semester = ?
    GROUP BY c.id
  `).all(student.id, semester as string) as (CourseRow & { semester: string; prerequisite_ids: string | null; prerequisite_codes: string | null; prerequisite_names: string | null })[];

  const result = scheduled.map(course => ({
    ...course,
    prerequisites: course.prerequisite_ids
      ? course.prerequisite_ids.split(',').map((id: string, index: number) => ({
          id: Number(id),
          code: course.prerequisite_codes!.split(',')[index],
          name: course.prerequisite_names!.split(',')[index],
        }))
      : [],
  }));

  res.json(result);
});

// POST /api/students/:id/schedule - Add course to schedule
router.post('/:id/schedule', (req: Request, res: Response) => {
  const db = getDatabase();
  const { course_id, semester = 'Fall 2025' } = req.body;

  if (!course_id) {
    return res.status(400).json({ error: 'course_id is required' });
  }

  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id) as StudentRow | undefined;
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(course_id) as CourseRow | undefined;
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Check for schedule slot conflicts
  if (course.schedule_slot) {
    const conflict = db.prepare(`
      SELECT c.code, c.name FROM scheduled_courses sc
      JOIN courses c ON sc.course_id = c.id
      WHERE sc.student_id = ? AND sc.semester = ? AND c.schedule_slot = ?
    `).get(student.id, semester, course.schedule_slot) as { code: string; name: string } | undefined;

    if (conflict) {
      return res.status(409).json({
        error: `Schedule conflict: ${course.schedule_slot} is already taken by ${conflict.name} (${conflict.code})`,
      });
    }
  }

  // Check prerequisites
  const prerequisites = db.prepare(`
    SELECT p.id, p.code, p.name FROM prerequisites pr
    JOIN courses p ON pr.prerequisite_id = p.id
    WHERE pr.course_id = ?
  `).all(course_id) as { id: number; code: string; name: string }[];

  const completedCourseIds = new Set(
    (db.prepare('SELECT course_id FROM completed_courses WHERE student_id = ?').all(student.id) as { course_id: number }[])
      .map(c => c.course_id)
  );

  const missingPrereqs = prerequisites.filter(p => !completedCourseIds.has(p.id));
  if (missingPrereqs.length > 0) {
    return res.status(409).json({
      error: `Missing prerequisites: ${missingPrereqs.map(p => p.name).join(', ')}`,
      missing_prerequisites: missingPrereqs,
    });
  }

  // Check if already scheduled
  const existing = db.prepare(
    'SELECT 1 FROM scheduled_courses WHERE student_id = ? AND course_id = ? AND semester = ?'
  ).get(student.id, course_id, semester);

  if (existing) {
    return res.status(409).json({ error: 'Course is already in your schedule for this semester' });
  }

  // Check if already completed
  if (completedCourseIds.has(Number(course_id))) {
    return res.status(409).json({ error: 'You have already completed this course' });
  }

  db.prepare(
    'INSERT INTO scheduled_courses (student_id, course_id, semester) VALUES (?, ?, ?)'
  ).run(student.id, course_id, semester);

  res.status(201).json({ message: 'Course added to schedule successfully' });
});

// DELETE /api/students/:id/schedule/:courseId - Remove course from schedule
router.delete('/:id/schedule/:courseId', (req: Request, res: Response) => {
  const db = getDatabase();
  const { semester = 'Fall 2025' } = req.query;

  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id) as StudentRow | undefined;
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const result = db.prepare(
    'DELETE FROM scheduled_courses WHERE student_id = ? AND course_id = ? AND semester = ?'
  ).run(student.id, req.params.courseId, semester as string);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Course not found in schedule' });
  }

  res.json({ message: 'Course removed from schedule' });
});

// GET /api/students/:id/progress - Get graduation progress
router.get('/:id/progress', (req: Request, res: Response) => {
  const db = getDatabase();

  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id) as StudentRow | undefined;
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  // Get completed courses with grades
  const completedCourses = db.prepare(`
    SELECT c.*, cc.grade, cc.semester
    FROM completed_courses cc
    JOIN courses c ON cc.course_id = c.id
    WHERE cc.student_id = ?
    ORDER BY cc.semester, c.subject
  `).all(student.id) as CompletedCourseRow[];

  // Get graduation requirements
  const requirements = db.prepare('SELECT * FROM graduation_requirements ORDER BY subject').all() as RequirementRow[];

  // Calculate credits earned by subject
  const creditsBySubject = completedCourses.reduce<Record<string, number>>((acc, course) => {
    acc[course.subject] = (acc[course.subject] || 0) + course.credits;
    return acc;
  }, {});

  // Calculate GPA
  const gradePoints: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0,
  };

  let totalPoints = 0;
  let totalCredits = 0;
  completedCourses.forEach(course => {
    const points = gradePoints[course.grade] || 0;
    totalPoints += points * course.credits;
    totalCredits += course.credits;
  });
  const gpa = totalCredits > 0 ? Math.round((totalPoints / totalCredits) * 100) / 100 : 0;

  // Build requirements progress
  const requirementsProgress = requirements.map(req => ({
    subject: req.subject,
    credits_required: req.credits_required,
    credits_earned: creditsBySubject[req.subject] || 0,
    satisfied: (creditsBySubject[req.subject] || 0) >= req.credits_required,
  }));

  const creditsEarned = Object.values(creditsBySubject).reduce((a, b) => a + b, 0);

  res.json({
    student,
    gpa,
    credits_earned: creditsEarned,
    credits_required: student.credits_required,
    requirements_progress: requirementsProgress,
    completed_courses: completedCourses,
  });
});

// GET /api/students/:id/completed-course-ids - Get IDs of completed courses
router.get('/:id/completed-course-ids', (req: Request, res: Response) => {
  const db = getDatabase();

  const student = db.prepare('SELECT * FROM students WHERE student_id = ?').get(req.params.id) as StudentRow | undefined;
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  const ids = db.prepare('SELECT course_id FROM completed_courses WHERE student_id = ?')
    .all(student.id) as { course_id: number }[];

  res.json(ids.map(r => r.course_id));
});

interface StudentRow {
  id: number;
  student_id: string;
  name: string;
  grade: number;
  gpa: number;
  credits_earned: number;
  credits_required: number;
}

interface CourseRow {
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
}

interface CompletedCourseRow extends CourseRow {
  grade: string;
  semester: string;
}

interface RequirementRow {
  id: number;
  subject: string;
  credits_required: number;
}

export default router;
