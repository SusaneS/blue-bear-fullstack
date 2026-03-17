import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'maplewood.db');

let db: Database.Database;

export function getDatabase(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeSchema(db);
    seedData(db);
  }
  return db;
}

function initializeSchema(db: Database.Database): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      description TEXT,
      credits INTEGER NOT NULL,
      subject TEXT NOT NULL,
      grade_level INTEGER NOT NULL,
      schedule_slot TEXT,
      max_enrollment INTEGER DEFAULT 30,
      current_enrollment INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS prerequisites (
      course_id INTEGER NOT NULL,
      prerequisite_id INTEGER NOT NULL,
      PRIMARY KEY (course_id, prerequisite_id),
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (prerequisite_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      grade INTEGER NOT NULL,
      gpa REAL DEFAULT 0.0,
      credits_earned INTEGER DEFAULT 0,
      credits_required INTEGER DEFAULT 24
    );

    CREATE TABLE IF NOT EXISTS completed_courses (
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      grade TEXT NOT NULL,
      semester TEXT NOT NULL,
      PRIMARY KEY (student_id, course_id),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS scheduled_courses (
      student_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      semester TEXT NOT NULL,
      PRIMARY KEY (student_id, course_id, semester),
      FOREIGN KEY (student_id) REFERENCES students(id),
      FOREIGN KEY (course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS graduation_requirements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL UNIQUE,
      credits_required INTEGER NOT NULL
    );
  `);
}

function seedData(db: Database.Database): void {
  const courseCount = (db.prepare('SELECT COUNT(*) as count FROM courses').get() as { count: number }).count;
  if (courseCount > 0) return;

  // Insert graduation requirements
  const insertReq = db.prepare(`
    INSERT OR IGNORE INTO graduation_requirements (subject, credits_required) VALUES (?, ?)
  `);
  const requirements = [
    ['Mathematics', 4],
    ['English', 4],
    ['Science', 3],
    ['Social Studies', 3],
    ['Physical Education', 2],
    ['Arts', 2],
    ['Technology', 2],
    ['Elective', 4],
  ];
  requirements.forEach(([subject, credits]) => insertReq.run(subject, credits));

  // Insert courses
  const insertCourse = db.prepare(`
    INSERT INTO courses (code, name, description, credits, subject, grade_level, schedule_slot)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const courses = [
    // Mathematics
    ['MATH101', 'Algebra I', 'Introduction to algebraic concepts including variables, equations, and functions.', 1, 'Mathematics', 9, 'A1'],
    ['MATH102', 'Geometry', 'Study of shapes, angles, theorems, and spatial reasoning.', 1, 'Mathematics', 9, 'B2'],
    ['MATH201', 'Algebra II', 'Advanced algebra including polynomials, rational functions, and complex numbers.', 1, 'Mathematics', 10, 'A2'],
    ['MATH202', 'Pre-Calculus', 'Preparation for calculus including trigonometry and advanced functions.', 1, 'Mathematics', 11, 'B1'],
    ['MATH301', 'Calculus', 'Introduction to differential and integral calculus.', 1, 'Mathematics', 12, 'A3'],
    ['MATH302', 'Statistics', 'Data analysis, probability, and statistical reasoning.', 1, 'Mathematics', 11, 'C1'],

    // English
    ['ENG101', 'English 9', 'Literature, writing, and critical thinking skills for 9th graders.', 1, 'English', 9, 'B3'],
    ['ENG102', 'English 10', 'World literature, analytical writing, and research skills.', 1, 'English', 10, 'A4'],
    ['ENG201', 'English 11', 'American literature and advanced composition.', 1, 'English', 11, 'C2'],
    ['ENG202', 'AP English Language', 'College-level rhetoric, composition, and language analysis.', 1, 'English', 12, 'B4'],
    ['ENG301', 'Creative Writing', 'Fiction, poetry, and creative nonfiction writing workshop.', 1, 'English', 10, 'D1'],
    ['ENG302', 'Public Speaking', 'Oral communication, debate, and presentation skills.', 1, 'English', 10, 'C3'],

    // Science
    ['SCI101', 'Biology', 'Cell biology, genetics, ecology, and evolution.', 1, 'Science', 9, 'C4'],
    ['SCI102', 'Chemistry', 'Atomic structure, chemical bonds, reactions, and stoichiometry.', 1, 'Science', 10, 'D2'],
    ['SCI201', 'Physics', 'Mechanics, electricity, waves, and modern physics.', 1, 'Science', 11, 'A5'],
    ['SCI202', 'AP Biology', 'College-level biology with lab emphasis.', 1, 'Science', 12, 'B5'],
    ['SCI301', 'Environmental Science', 'Ecosystems, climate change, and sustainability.', 1, 'Science', 11, 'C5'],
    ['SCI302', 'Anatomy & Physiology', 'Human body systems and their functions.', 1, 'Science', 12, 'D3'],

    // Social Studies
    ['SS101', 'World History', 'Survey of global civilizations from ancient to modern times.', 1, 'Social Studies', 9, 'D4'],
    ['SS102', 'US History', 'American history from colonization through the 20th century.', 1, 'Social Studies', 10, 'A6'],
    ['SS201', 'Government', 'US government, civics, and democratic processes.', 1, 'Social Studies', 11, 'B6'],
    ['SS202', 'Economics', 'Micro and macroeconomics, personal finance.', 1, 'Social Studies', 12, 'C6'],
    ['SS301', 'Psychology', 'Introduction to psychological principles and behavior.', 1, 'Social Studies', 11, 'D5'],

    // Physical Education
    ['PE101', 'Physical Education 9', 'Fitness fundamentals, team sports, and health education.', 0.5, 'Physical Education', 9, 'A7'],
    ['PE102', 'Physical Education 10', 'Advanced fitness, individual sports, and wellness.', 0.5, 'Physical Education', 10, 'B7'],
    ['PE201', 'Health & Wellness', 'Nutrition, mental health, and personal wellness strategies.', 0.5, 'Physical Education', 11, 'C7'],
    ['PE202', 'Team Sports', 'Leadership, strategy, and advanced team sport techniques.', 0.5, 'Physical Education', 12, 'D6'],

    // Arts
    ['ART101', 'Art Foundations', 'Drawing, color theory, and two-dimensional design.', 1, 'Arts', 9, 'A8'],
    ['ART102', 'Music Fundamentals', 'Music theory, ear training, and performance basics.', 1, 'Arts', 9, 'B8'],
    ['ART201', 'Studio Art', 'Advanced painting, sculpture, and mixed media.', 1, 'Arts', 10, 'C8'],
    ['ART202', 'Concert Band', 'Performance ensemble for wind and percussion instruments.', 1, 'Arts', 10, 'D7'],
    ['ART301', 'AP Art History', 'College-level survey of global art history.', 1, 'Arts', 11, 'A9'],

    // Technology
    ['TECH101', 'Computer Science I', 'Introduction to programming with Python.', 1, 'Technology', 9, 'B9'],
    ['TECH102', 'Digital Media', 'Graphic design, photo editing, and digital communications.', 1, 'Technology', 10, 'C9'],
    ['TECH201', 'Computer Science II', 'Data structures, algorithms, and object-oriented programming.', 1, 'Technology', 10, 'D8'],
    ['TECH202', 'AP Computer Science', 'College-level computer science with Java.', 1, 'Technology', 11, 'A10'],
    ['TECH301', 'Web Development', 'HTML, CSS, JavaScript, and full-stack web development.', 1, 'Technology', 11, 'B10'],

    // Electives
    ['ELEC101', 'Spanish I', 'Introduction to Spanish language and Latin American culture.', 1, 'Elective', 9, 'C10'],
    ['ELEC102', 'French I', 'Introduction to French language and Francophone culture.', 1, 'Elective', 9, 'D9'],
    ['ELEC201', 'Spanish II', 'Intermediate Spanish grammar, vocabulary, and conversation.', 1, 'Elective', 10, 'A11'],
    ['ELEC202', 'French II', 'Intermediate French grammar, vocabulary, and conversation.', 1, 'Elective', 10, 'B11'],
    ['ELEC301', 'Drama', 'Acting techniques, stage production, and theatrical performance.', 1, 'Elective', 10, 'C11'],
    ['ELEC302', 'Journalism', 'News writing, media literacy, and school newspaper.', 1, 'Elective', 11, 'D10'],
  ];

  for (const course of courses) {
    insertCourse.run(...course);
  }

  // Insert prerequisites
  const insertPrereq = db.prepare(`
    INSERT OR IGNORE INTO prerequisites (course_id, prerequisite_id)
    SELECT c.id, p.id FROM courses c, courses p
    WHERE c.code = ? AND p.code = ?
  `);

  const prereqs = [
    ['MATH201', 'MATH101'], // Algebra II requires Algebra I
    ['MATH202', 'MATH201'], // Pre-Calc requires Algebra II
    ['MATH202', 'MATH102'], // Pre-Calc requires Geometry
    ['MATH301', 'MATH202'], // Calculus requires Pre-Calc
    ['MATH302', 'MATH201'], // Statistics requires Algebra II
    ['SCI102', 'SCI101'],   // Chemistry requires Biology
    ['SCI201', 'SCI102'],   // Physics requires Chemistry
    ['SCI201', 'MATH202'],  // Physics requires Pre-Calc
    ['SCI202', 'SCI101'],   // AP Biology requires Biology
    ['SCI302', 'SCI101'],   // Anatomy requires Biology
    ['ENG102', 'ENG101'],   // English 10 requires English 9
    ['ENG201', 'ENG102'],   // English 11 requires English 10
    ['ENG202', 'ENG201'],   // AP English requires English 11
    ['ENG301', 'ENG101'],   // Creative Writing requires English 9
    ['MATH201', 'MATH102'], // Algebra II requires Geometry
    ['TECH201', 'TECH101'], // CS II requires CS I
    ['TECH202', 'TECH201'], // AP CS requires CS II
    ['TECH301', 'TECH101'], // Web Dev requires CS I
    ['ELEC201', 'ELEC101'], // Spanish II requires Spanish I
    ['ELEC202', 'ELEC102'], // French II requires French I
    ['SS102', 'SS101'],     // US History requires World History
    ['SS201', 'SS102'],     // Government requires US History
    ['ART201', 'ART101'],   // Studio Art requires Art Foundations
    ['ART301', 'ART201'],   // AP Art History requires Studio Art
  ];

  for (const [course, prereq] of prereqs) {
    insertPrereq.run(course, prereq);
  }

  // Insert a demo student
  const insertStudent = db.prepare(`
    INSERT OR IGNORE INTO students (student_id, name, grade, gpa, credits_earned, credits_required)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertStudent.run('S001', 'Alex Johnson', 11, 3.5, 14, 24);

  // Insert some completed courses for the demo student
  const insertCompleted = db.prepare(`
    INSERT OR IGNORE INTO completed_courses (student_id, course_id, grade, semester)
    SELECT s.id, c.id, ?, ?
    FROM students s, courses c
    WHERE s.student_id = 'S001' AND c.code = ?
  `);

  const completedCourses = [
    ['A', 'Fall 2023', 'MATH101'],
    ['B+', 'Fall 2023', 'ENG101'],
    ['A-', 'Fall 2023', 'SCI101'],
    ['B', 'Fall 2023', 'SS101'],
    ['A', 'Fall 2023', 'PE101'],
    ['A', 'Fall 2023', 'ART101'],
    ['B+', 'Fall 2023', 'TECH101'],
    ['A', 'Fall 2023', 'ELEC101'],
    ['A-', 'Spring 2024', 'MATH102'],
    ['B+', 'Spring 2024', 'ENG102'],
    ['A', 'Spring 2024', 'SCI102'],
    ['B', 'Spring 2024', 'SS102'],
    ['A', 'Spring 2024', 'PE102'],
    ['B+', 'Spring 2024', 'ART102'],
  ];

  for (const [grade, semester, code] of completedCourses) {
    insertCompleted.run(grade, semester, code);
  }
}
