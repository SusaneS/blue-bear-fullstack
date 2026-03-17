import { Router, Request, Response } from 'express';
import { getDatabase } from '../database';

const router = Router();

// GET /api/courses - Get all courses with prerequisites
router.get('/', (req: Request, res: Response) => {
  const db = getDatabase();
  const { subject, grade_level, search } = req.query;

  let query = `
    SELECT c.*,
      GROUP_CONCAT(p.id) as prerequisite_ids,
      GROUP_CONCAT(p.code) as prerequisite_codes,
      GROUP_CONCAT(p.name) as prerequisite_names
    FROM courses c
    LEFT JOIN prerequisites pr ON c.id = pr.course_id
    LEFT JOIN courses p ON pr.prerequisite_id = p.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (subject) {
    query += ' AND c.subject = ?';
    params.push(subject as string);
  }

  if (grade_level) {
    query += ' AND c.grade_level = ?';
    params.push(Number(grade_level));
  }

  if (search) {
    query += ' AND (c.name LIKE ? OR c.code LIKE ? OR c.description LIKE ?)';
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' GROUP BY c.id ORDER BY c.subject, c.grade_level, c.name';

  const courses = db.prepare(query).all(...params) as CourseRow[];

  const result = courses.map(course => ({
    id: course.id,
    code: course.code,
    name: course.name,
    description: course.description,
    credits: course.credits,
    subject: course.subject,
    grade_level: course.grade_level,
    schedule_slot: course.schedule_slot,
    max_enrollment: course.max_enrollment,
    current_enrollment: course.current_enrollment,
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

// GET /api/courses/subjects - Get unique subjects
router.get('/subjects', (_req: Request, res: Response) => {
  const db = getDatabase();
  const subjects = db.prepare('SELECT DISTINCT subject FROM courses ORDER BY subject').all() as { subject: string }[];
  res.json(subjects.map(s => s.subject));
});

// GET /api/courses/:id - Get a single course
router.get('/:id', (req: Request, res: Response) => {
  const db = getDatabase();
  const course = db.prepare(`
    SELECT c.*,
      GROUP_CONCAT(p.id) as prerequisite_ids,
      GROUP_CONCAT(p.code) as prerequisite_codes,
      GROUP_CONCAT(p.name) as prerequisite_names
    FROM courses c
    LEFT JOIN prerequisites pr ON c.id = pr.course_id
    LEFT JOIN courses p ON pr.prerequisite_id = p.id
    WHERE c.id = ?
    GROUP BY c.id
  `).get(req.params.id) as CourseRow | undefined;

  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  res.json({
    ...course,
    prerequisites: course.prerequisite_ids
      ? course.prerequisite_ids.split(',').map((id: string, index: number) => ({
          id: Number(id),
          code: course.prerequisite_codes!.split(',')[index],
          name: course.prerequisite_names!.split(',')[index],
        }))
      : [],
  });
});

interface CourseRow {
  id: number;
  code: string;
  name: string;
  description: string;
  credits: number;
  subject: string;
  grade_level: number;
  schedule_slot: string;
  max_enrollment: number;
  current_enrollment: number;
  prerequisite_ids: string | null;
  prerequisite_codes: string | null;
  prerequisite_names: string | null;
}

export default router;
