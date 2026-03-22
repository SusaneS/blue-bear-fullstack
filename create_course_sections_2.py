import sqlite3
from collections import defaultdict

DB_PATH = 'maplewood_school.sqlite'

def create_course_sections():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    print("=" * 80)
    print("CREATING SPRING 2026 SEMESTER + COURSE SECTIONS")
    print("=" * 80)

    # =========================================================================
    # STEP 1: Add Spring 2026 semester
    # =========================================================================
    cursor.execute("SELECT id FROM semesters WHERE name = 'Spring' AND year = 2026")
    if cursor.fetchone():
        print("Spring 2026 already exists, skipping...")
    else:
        cursor.execute("""
            INSERT INTO semesters (name, year, order_in_year, start_date, end_date, is_active)
            VALUES ('Spring', 2026, 2, '2026-01-15', '2026-05-15', 1)
        """)
        print("✓ Created Spring 2026 semester")

    cursor.execute("SELECT id FROM semesters WHERE name = 'Spring' AND year = 2026")
    semester_id = cursor.fetchone()[0]
    print(f"  Semester ID: {semester_id}")

    # =========================================================================
    # STEP 2: Create course_sections table
    # =========================================================================
    cursor.execute("DROP TABLE IF EXISTS course_sections")
    cursor.execute("""
        CREATE TABLE course_sections (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            course_id INTEGER NOT NULL,
            semester_id INTEGER NOT NULL,
            teacher_id INTEGER NOT NULL,
            classroom_id INTEGER NOT NULL,
            section_letter VARCHAR(1) NOT NULL,
            day_of_week VARCHAR(5) NOT NULL,
            start_time VARCHAR(5) NOT NULL,
            end_time VARCHAR(5) NOT NULL,
            max_capacity INTEGER NOT NULL DEFAULT 10,
            current_enrollment INTEGER NOT NULL DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (course_id) REFERENCES courses(id),
            FOREIGN KEY (semester_id) REFERENCES semesters(id),
            FOREIGN KEY (teacher_id) REFERENCES teachers(id),
            FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
            UNIQUE(semester_id, teacher_id, day_of_week, start_time),
            UNIQUE(semester_id, classroom_id, day_of_week, start_time)
        )
    """)
    cursor.execute("CREATE INDEX idx_course_sections_semester ON course_sections(semester_id)")
    cursor.execute("CREATE INDEX idx_course_sections_course ON course_sections(course_id)")
    cursor.execute("CREATE INDEX idx_course_sections_teacher ON course_sections(teacher_id)")
    print("✓ Created course_sections table")

    # =========================================================================
    # STEP 3: Load resources
    # =========================================================================

    cursor.execute("""
        SELECT id, code, name, hours_per_week, specialization_id,
               grade_level_min, grade_level_max, course_type
        FROM courses
        WHERE semester_order = 2
        ORDER BY
            CASE WHEN course_type = 'core' THEN 0 ELSE 1 END,
            grade_level_min,
            code
    """)
    courses = cursor.fetchall()

    teacher_pool = defaultdict(list)
    cursor.execute("SELECT id, first_name, last_name, specialization_id FROM teachers")
    for tid, fname, lname, spec_id in cursor.fetchall():
        teacher_pool[spec_id].append((tid, f"{fname} {lname}"))

    room_pool = defaultdict(list)
    cursor.execute("SELECT id, name, room_type_id FROM classrooms")
    for rid, rname, rtype in cursor.fetchall():
        room_pool[rtype].append((rid, rname))

    spec_room_map = {}
    cursor.execute("SELECT id, room_type_id FROM specializations")
    for spec_id, room_type_id in cursor.fetchall():
        spec_room_map[spec_id] = room_type_id

    print(f"✓ {len(courses)} Spring courses")
    print(f"✓ {sum(len(v) for v in teacher_pool.values())} teachers")
    print(f"✓ {sum(len(v) for v in room_pool.values())} classrooms")

    # =========================================================================
    # STEP 4: Define time slots (NO LUNCH 12:00-13:00)
    # =========================================================================

    core_slots = [
        ('MWF', '08:00', '09:40'),
        ('MWF', '09:00', '10:40'),
        ('MWF', '10:00', '11:40'),
        ('MWF', '13:00', '14:40'),
        ('MWF', '14:00', '15:40'),
        ('MWF', '15:00', '16:00'),
        ('TTh', '08:00', '10:30'),
        ('TTh', '09:00', '11:30'),
        ('TTh', '10:00', '12:00'),
        ('TTh', '13:00', '15:30'),
        ('TTh', '14:00', '16:00'),
        ('TTh', '14:30', '16:30'),
    ]

    elective_slots = [
        ('MWF', '08:00', '09:00'),
        ('MWF', '09:00', '10:00'),
        ('MWF', '10:00', '11:00'),
        ('MWF', '11:00', '12:00'),
        ('MWF', '13:00', '14:00'),
        ('MWF', '14:00', '15:00'),
        ('MWF', '15:00', '16:00'),
        ('TTh', '08:00', '09:30'),
        ('TTh', '09:00', '10:30'),
        ('TTh', '09:30', '11:00'),
        ('TTh', '10:00', '11:30'),
        ('TTh', '10:30', '12:00'),
        ('TTh', '13:00', '14:30'),
        ('TTh', '13:30', '15:00'),
        ('TTh', '14:00', '15:30'),
        ('TTh', '14:30', '16:00'),
        ('TTh', '15:00', '16:00'),
        ('TTh', '15:00', '16:30'),
    ]

    # =========================================================================
    # STEP 5: Determine section counts by course demand
    # =========================================================================

    def get_section_count(code, grade_min, course_type):
        if course_type == 'core' and grade_min == 9:
            return 6
        if course_type == 'core' and grade_min == 10:
            return 5
        if course_type == 'core' and grade_min == 11:
            return 4
        if course_type == 'core' and grade_min == 12:
            return 3
        if code in ['PE201', 'HLTH101', 'SPAN201', 'CS201']:
            return 3
        if code in ['ART201', 'BAND101', 'CHOIR201', 'FREN201', 'GERM201']:
            return 2
        return 2

    # =========================================================================
    # STEP 6: Schedule sections with round-robin slots
    # =========================================================================

    def parse_days(day_str):
        days = set()
        i = 0
        while i < len(day_str):
            if i + 1 < len(day_str) and day_str[i:i+2] == 'Th':
                days.add('Th')
                i += 2
            else:
                days.add(day_str[i])
                i += 1
        return days

    def times_overlap(s1, e1, s2, e2):
        return s1 < e2 and e1 > s2

    def has_conflict(day1, start1, end1, day2, start2, end2):
        days1 = parse_days(day1)
        days2 = parse_days(day2)
        if not days1.intersection(days2):
            return False
        return times_overlap(start1, end1, start2, end2)

    def hours_to_float(time_str):
        h, m = time_str.split(':')
        return int(h) + int(m) / 60.0

    def get_duration(start, end):
        return hours_to_float(end) - hours_to_float(start)

    teacher_schedule = defaultdict(list)
    room_schedule = defaultdict(list)
    teacher_idx = defaultdict(int)
    room_idx = defaultdict(int)

    def can_assign_teacher(tid, day, start, end):
        for d, s, e in teacher_schedule[tid]:
            if has_conflict(day, start, end, d, s, e):
                return False
        duration = get_duration(start, end)
        for check_day in parse_days(day):
            daily = duration
            for d, s, e in teacher_schedule[tid]:
                if check_day in parse_days(d):
                    daily += get_duration(s, e)
            if daily > 4.0:
                return False
        return True

    def can_assign_room(rid, day, start, end):
        for d, s, e in room_schedule[rid]:
            if has_conflict(day, start, end, d, s, e):
                return False
        return True

    sections_created = 0
    sections_failed = 0

    print("\n" + "=" * 80)
    print("SCHEDULING")
    print("=" * 80)

    for cid, code, name, hours, spec_id, grade_min, grade_max, ctype in courses:
        section_count = get_section_count(code, grade_min, ctype)
        room_type = spec_room_map.get(spec_id, 1)
        slots = core_slots if ctype == 'core' else elective_slots
        teachers = teacher_pool.get(spec_id, [])
        rooms = room_pool.get(room_type, [])

        if not teachers or not rooms:
            print(f"  ❌ {code}: No teachers or rooms available")
            sections_failed += section_count
            continue

        print(f"\n{code} - {name} ({ctype}, {section_count} sections)")

        # ---------- Round-robin slot pointer for this course ----------
        slot_pointer = 0

        for sec_num in range(section_count):
            letter = chr(65 + sec_num)
            scheduled = False

            # ---------- Round-robin slot try for each section ----------
            for try_idx in range(len(slots)):
                slot_idx = (slot_pointer + try_idx) % len(slots)
                day, start, end = slots[slot_idx]

                for _ in range(len(teachers)):
                    tid, tname = teachers[teacher_idx[spec_id] % len(teachers)]
                    teacher_idx[spec_id] += 1

                    if not can_assign_teacher(tid, day, start, end):
                        continue

                    for _ in range(len(rooms)):
                        rid, rname = rooms[room_idx[room_type] % len(rooms)]
                        room_idx[room_type] += 1

                        if not can_assign_room(rid, day, start, end):
                            continue

                        # Schedule it!
                        cursor.execute("""
                            INSERT INTO course_sections
                            (course_id, semester_id, teacher_id, classroom_id,
                             section_letter, day_of_week, start_time, end_time,
                             max_capacity, current_enrollment)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 10, 0)
                        """, (cid, semester_id, tid, rid, letter, day, start, end))

                        teacher_schedule[tid].append((day, start, end))
                        room_schedule[rid].append((day, start, end))

                        print(f"  ✅ {letter}: {tname}, {rname}, {day} {start}-{end}")
                        sections_created += 1
                        scheduled = True
                        break

                    if scheduled:
                        break
                if scheduled:
                    # ---------- Advance slot pointer for next section ----------
                    slot_pointer = (slot_idx + 1) % len(slots)
                    break

            if not scheduled:
                print(f"  ⚠️  {letter}: Could not schedule")
                sections_failed += 1

    conn.commit()

    # =========================================================================
    # STEP 7: Summary
    # =========================================================================

    print("\n" + "=" * 80)
    print("SUMMARY")
    print("=" * 80)

    cursor.execute("SELECT COUNT(*) FROM course_sections WHERE semester_id = ?", (semester_id,))
    total = cursor.fetchone()[0]

    cursor.execute("""
        SELECT c.course_type, COUNT(*) as cnt
        FROM course_sections cs
        JOIN courses c ON cs.course_id = c.id
        WHERE cs.semester_id = ?
        GROUP BY c.course_type
    """, (semester_id,))

    print(f"\nTotal sections: {total}")
    print(f"Created: {sections_created} | Failed: {sections_failed}")
    print(f"Total student capacity: {total * 10}")
    for ctype, cnt in cursor.fetchall():
        print(f"  {ctype.upper():12} {cnt} sections")

    cursor.execute("""
        SELECT COUNT(*) FROM course_sections
        WHERE semester_id = ?
        AND start_time < '13:00' AND end_time > '12:00'
    """, (semester_id,))
    lunch = cursor.fetchone()[0]
    print(f"\n{'❌' if lunch else '✅'} Lunch conflicts: {lunch}")

    print("\n" + "=" * 80)
    print("ALL SECTIONS")
    print("=" * 80)

    cursor.execute("""
        SELECT c.code, cs.section_letter, cs.day_of_week,
               cs.start_time, cs.end_time,
               t.first_name || ' ' || t.last_name,
               cl.name
        FROM course_sections cs
        JOIN courses c ON cs.course_id = c.id
        JOIN teachers t ON cs.teacher_id = t.id
        JOIN classrooms cl ON cs.classroom_id = cl.id
        WHERE cs.semester_id = ?
        ORDER BY c.code, cs.section_letter
    """, (semester_id,))

    print(f"\n{'Code':<10} {'Sec':<4} {'Days':<5} {'Time':<14} {'Teacher':<22} {'Room':<12}")
    print("-" * 75)
    for row in cursor.fetchall():
        print(f"{row[0]:<10} {row[1]:<4} {row[2]:<5} {row[3]}-{row[4]:<8} {row[5]:<22} {row[6]:<12}")

    conn.close()
    print("\n✅ Done!")

if __name__ == "__main__":
    create_course_sections()