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
        enrollment_date TEXT NOT NULL DEFAULT (datetime('now')),
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

connection.commit()
print("✅ enrollments table dropped and recreated")
print("✅ capacity trigger added")

cursor.close()
connection.close()