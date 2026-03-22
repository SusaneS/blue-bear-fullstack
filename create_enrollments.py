import sqlite3

DB_PATH = 'maplewood_school.sqlite'

connection = sqlite3.connect(DB_PATH)
cursor = connection.cursor()

cursor.execute("PRAGMA foreign_keys = ON")

cursor.execute("DROP TRIGGER IF EXISTS check_section_capacity")
cursor.execute("DROP TABLE IF EXISTS enrollments")

cursor.execute("""
    CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        section_id INTEGER NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('ENROLLED', 'DROPPED', 'COMPLETED')),
        enrollment_date DATE,
        FOREIGN KEY (student_id) REFERENCES students(id),
        FOREIGN KEY (section_id) REFERENCES course_sections(id),
        UNIQUE (student_id, section_id)
    )
""")

cursor.execute("""
    CREATE TRIGGER IF NOT EXISTS check_section_capacity
        BEFORE INSERT ON enrollments
        FOR EACH ROW
        WHEN NEW.status = 'ENROLLED'
    BEGIN
        SELECT CASE
            WHEN (
                SELECT COUNT(*) FROM enrollments
                WHERE section_id = NEW.section_id
                AND status = 'ENROLLED'
            ) >= (
                SELECT max_capacity FROM course_sections
                WHERE id = NEW.section_id
            )
            THEN RAISE(ABORT, 'Section is full')
        END;
    END;
""")

cursor.execute("""
   CREATE TRIGGER enforce_prerequisite_on_enrollment
BEFORE INSERT ON enrollments
FOR EACH ROW
WHEN NEW.status = 'ENROLLED'
BEGIN
    /* This finds the prerequisite of the course for the section being enrolled, if it exists.
       If it exists, we check student_course_history to see if student has passed it.
       If not, abort the enrollment. */
    SELECT CASE
        WHEN (
            -- Find prerequisite course id for THIS section's course
            SELECT c.prerequisite_id
            FROM courses c
            WHERE c.id = (SELECT cs.course_id FROM course_sections cs WHERE cs.id = NEW.section_id)
        ) IS NOT NULL
        AND NOT EXISTS (
            -- Student must have PASSED the prerequisite course (any semester)
            SELECT 1
            FROM student_course_history sch
            WHERE sch.student_id = NEW.student_id
              AND sch.course_id = (
                  SELECT c.prerequisite_id
                  FROM courses c
                  WHERE c.id = (SELECT cs.course_id FROM course_sections cs WHERE cs.id = NEW.section_id)
              )
              AND sch.status = 'passed'
        )
        THEN RAISE(ABORT, 'Student must pass prerequisite course before enrolling in this course.')
    END;
END;
""")

connection.commit()
print("✅ enrollments table dropped and recreated")
print("✅ capacity trigger added")
print("✅ prerequisite trigger added")

cursor.close()
connection.close()