import sqlite3

DB_PATH = "maplewood_school.sqlite"  # Replace this with your actual DB file path

def add_version_column(db_path):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if the column already exists
    cursor.execute("PRAGMA table_info(course_sections)")
    columns = [info[1] for info in cursor.fetchall()]
    if "version" in columns:
        print("Column 'version' already exists in 'course_sections'.")
        conn.close()
        return

    # Add the column version with default 0 and NOT NULL
    alter_sql = "ALTER TABLE course_sections ADD COLUMN version INTEGER NOT NULL DEFAULT 0;"
    cursor.execute(alter_sql)
    conn.commit()
    print("Column 'version' added to 'course_sections' with default 0.")

    conn.close()

if __name__ == "__main__":
    add_version_column(DB_PATH)