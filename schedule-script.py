import sqlite3
from datetime import datetime
from collections import defaultdict

conn = sqlite3.connect('maplewood_school.sqlite')
cursor = conn.cursor()

print("="*80)
print("Creating course_sections table and populating with sections...")
print("="*80 + "\n")

# Create table
try:
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS course_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      semester_id INTEGER NOT NULL,
      teacher_id INTEGER NOT NULL,
      classroom_id INTEGER NOT NULL,
      section_letter VARCHAR(1) NOT NULL,
      day_of_week VARCHAR(10) NOT NULL,
      start_time TIME NOT NULL,
      end_time TIME NOT NULL,
      max_capacity INTEGER DEFAULT 10,
      current_enrollment INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (semester_id) REFERENCES semesters(id),
      FOREIGN KEY (teacher_id) REFERENCES teachers(id),
      FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
      UNIQUE(teacher_id, semester_id, day_of_week, start_time),
      UNIQUE(classroom_id, semester_id, day_of_week, start_time)
    )
    """)
    
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_course_sections_semester ON course_sections(semester_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_course_sections_course ON course_sections(course_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_course_sections_teacher ON course_sections(teacher_id)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_course_sections_classroom ON course_sections(classroom_id)")
    
    conn.commit()
    print("✅ Table created successfully!\n")
except sqlite3.Error as e:
    print(f"Note: {e}\n")

# Get active semester
cursor.execute("SELECT id, name, year, order_in_year FROM semesters WHERE is_active = 1")
semester_result = cursor.fetchone()

if not semester_result:
    print("ERROR: No active semester found!")
    print("\nAvailable semesters:")
    cursor.execute("SELECT id, name, year, is_active FROM semesters ORDER BY year DESC, order_in_year")
    for row in cursor.fetchall():
        active_status = " (ACTIVE)" if row[3] == 1 else ""
        print(f"  ID {row[0]}: {row[1]} {row[2]}{active_status}")
    exit(1)

semester_id, semester_name, semester_year, semester_order = semester_result
print(f"✓ Using semester: {semester_name} {semester_year} (ID: {semester_id}, Order: {semester_order})\n")

# Room type mapping (specialization_id → room_type_id)
ROOM_TYPE_MAP = {
    1: 1,  # Mathematics → classroom
    2: 1,  # English → classroom
    3: 2,  # Science → science_lab
    4: 1,  # Social Studies → classroom
    5: 3,  # Arts → art_studio
    6: 6,  # Music → music_room
    7: 4,  # PE → gym
    8: 5,  # Computer Science → computer_lab
    9: 1,  # Foreign Language → classroom
}

# STRATEGIC TIME SLOTS - Ensure core courses don't all conflict
STRATEGIC_SLOTS = {
    'ENG': [  # 5 hours - Use TTh patterns
        ('TTh', '08:00', '10:30'),   # Sec A: TTh morning
        ('TTh', '13:00', '15:30'),   # Sec B: TTh afternoon
        ('MWF', '13:00', '15:00'),   # Sec C: MWF afternoon (if 3rd section)
    ],
    'MAT': [  # 6 hours - Use MWF spread across day
        ('MWF', '08:00', '10:00'),   # Sec A: MWF early morning
        ('MWF', '10:00', '12:00'),   # Sec B: MWF late morning
        ('TTh', '08:00', '11:00'),   # Sec C: TTh morning (backup)
    ],
    'SCI': [  # 6 hours - Different MWF times + TTh option
        ('MWF', '10:00', '12:00'),   # Sec A: MWF late morning
        ('TTh', '08:00', '11:00'),   # Sec B: TTh morning
        ('MWF', '13:00', '15:00'),   # Sec C: MWF afternoon
    ],
    'SOC': [  # 4 hours - Use TTh
        ('TTh', '10:00', '12:00'),   # Sec A: TTh late morning
        ('TTh', '13:00', '15:00'),   # Sec B: TTh afternoon
    ],
}

def get_strategic_slots(code, section_num):
    """Get strategic time slots for core courses"""
    subject = code[:3]
    if subject in STRATEGIC_SLOTS:
        slots = STRATEGIC_SLOTS[subject]
        if section_num < len(slots):
            return [slots[section_num]]
        return [slots[0]]
    return None

def get_elective_slots(hours_per_week):
    """Get flexible slots for electives"""
    if hours_per_week <= 3:
        return [
            ('MWF', '08:00', '09:00'),
            ('MWF', '09:00', '10:00'),
            ('MWF', '15:00', '16:00'),
            ('TTh', '15:00', '16:00'),
            ('TTh', '15:30', '16:30'),
        ]
    elif hours_per_week == 4:
        return [
            ('TTh', '08:00', '10:00'),
            ('MWF', '08:00', '10:00'),
            ('MWF', '13:00', '15:00'),
            ('TTh', '13:00', '15:00'),
            ('TTh', '15:00', '17:00'),
        ]
    else:
        return [
            ('MWF', '08:00', '10:00'),
            ('MWF', '10:00', '12:00'),
            ('MWF', '13:00', '15:00'),
            ('TTh', '08:00', '11:00'),
        ]

def get_section_count(code, grade_min):
    """Determine sections based on demand"""
    if code in ['ENG101', 'MAT101', 'SCI101', 'SOC101'] and grade_min == 9:
        return 3
    if code in ['ENG201', 'ENG301', 'MAT201', 'SCI201']:
        return 2
    if code in ['CS101', 'PE101', 'SPAN101', 'ART101']:
        return 2
    return 1

def has_time_overlap(day1, start1, end1, day2, start2, end2):
    """Check if two time slots overlap"""
    def get_days(day_str):
        if 'TTh' in day_str:
            return {'T', 'Th'}
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
    
    days1 = get_days(day1)
    days2 = get_days(day2)
    
    if not days1.intersection(days2):
        return False
    
    start1_time = datetime.strptime(start1, '%H:%M').time()
    end1_time = datetime.strptime(end1, '%H:%M').time()
    start2_time = datetime.strptime(start2, '%H:%M').time()
    end2_time = datetime.strptime(end2, '%H:%M').time()
    
    return (start1_time < end2_time and end1_time > start2_time)

teacher_schedule = defaultdict(list)
room_schedule = defaultdict(list)

def can_assign_teacher(teacher_id, day, start, end):
    for sched_day, sched_start, sched_end in teacher_schedule[teacher_id]:
        if has_time_overlap(day, start, end, sched_day, sched_start, sched_end):
            return False
    return True

def can_assign_room(room_id, day, start, end):
    for sched_day, sched_start, sched_end in room_schedule[room_id]:
        if has_time_overlap(day, start, end, sched_day, sched_start, sched_end):
            return False
    return True

# Get courses for the active semester
# semester_order: 1 = Fall, 2 = Spring
cursor.execute("""
    SELECT id, code, name, hours_per_week, credits, specialization_id, 
           prerequisite_id, grade_level_min, grade_level_max, course_type
    FROM courses
    WHERE semester_order = ?
    ORDER BY 
        CASE WHEN course_type = 'core' THEN 0 ELSE 1 END,
        code
""", (semester_order,))
fall_courses = cursor.fetchall()

# Build resource pools
teacher_pool = defaultdict(list)
cursor.execute("SELECT id, specialization_id, first_name, last_name FROM teachers")
for tid, sid, fname, lname in cursor.fetchall():
    teacher_pool[sid].append((tid, fname, lname))

room_pool = defaultdict(list)
cursor.execute("SELECT id, room_type_id, name FROM classrooms")
for rid, rtid, rname in cursor.fetchall():
    room_pool[rtid].append((rid, rname))

print(f"📚 Scheduling {len(fall_courses)} courses for {semester_name} {semester_year}\n")
print("="*80 + "\n")

sections_created = 0
sections_skipped = 0
teacher_index = defaultdict(int)
room_index = defaultdict(int)

for course in fall_courses:
    cid, code, name, hours, credits, spec_id, prereq, grade_min, grade_max, ctype = course
    
    section_count = get_section_count(code, grade_min)
    room_type_id = ROOM_TYPE_MAP.get(spec_id, 1)
    
    print(f"{code} - {name} ({ctype.upper()}, {hours}h/week)")
    print(f"  Creating {section_count} section(s)...")
    
    available_teachers = teacher_pool.get(spec_id, [])
    available_rooms = room_pool.get(room_type_id, [])
    
    if not available_teachers or not available_rooms:
        print(f"  ❌ Insufficient resources")
        sections_skipped += section_count
        print()
        continue
    
    for section_num in range(section_count):
        section_letter = chr(65 + section_num)
        section_scheduled = False
        
        strategic_slots = get_strategic_slots(code, section_num)
        if not strategic_slots:
            strategic_slots = get_elective_slots(hours)
        
        for day, start, end in strategic_slots:
            if section_scheduled:
                break
            
            for _ in range(len(available_teachers)):
                tid, tfname, tlname = available_teachers[teacher_index[spec_id] % len(available_teachers)]
                teacher_index[spec_id] += 1
                
                if not can_assign_teacher(tid, day, start, end):
                    continue
                
                for _ in range(len(available_rooms)):
                    rid, rname = available_rooms[room_index[room_type_id] % len(available_rooms)]
                    room_index[room_type_id] += 1
                    
                    if not can_assign_room(rid, day, start, end):
                        continue
                    
                    try:
                        cursor.execute("""
                            INSERT INTO course_sections 
                            (course_id, semester_id, teacher_id, classroom_id, section_letter, 
                             day_of_week, start_time, end_time, max_capacity, current_enrollment)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 10, 0)
                        """, (cid, semester_id, tid, rid, section_letter, day, start, end))
                        
                        teacher_schedule[tid].append((day, start, end))
                        room_schedule[rid].append((day, start, end))
                        
                        print(f"    ✅ Sec {section_letter}: {tfname} {tlname}, {rname}, {day} {start}-{end}")
                        sections_created += 1
                        section_scheduled = True
                        break
                    except sqlite3.IntegrityError as e:
                        continue
                
                if section_scheduled:
                    break
        
        if not section_scheduled:
            print(f"    ⚠️  Sec {section_letter}: Could not schedule")
            sections_skipped += 1
    
    print()

conn.commit()

print("="*80)
print(f"✅ Created {sections_created} sections")
print(f"⚠️  Skipped {sections_skipped} sections")
print("="*80)

# Quick verification
print(f"\n📋 Sample Sections Created for {semester_name} {semester_year}:")
cursor.execute("""
    SELECT 
        c.code,
        cs.section_letter,
        cs.day_of_week,
        cs.start_time || '-' || cs.end_time as time,
        t.first_name || ' ' || t.last_name as teacher
    FROM course_sections cs
    JOIN courses c ON cs.course_id = c.id
    JOIN teachers t ON cs.teacher_id = t.id
    WHERE cs.semester_id = ?
    ORDER BY c.code, cs.section_letter
    LIMIT 15
""", (semester_id,))

print("  Code    | Sec | Days | Time          | Teacher")
print("  --------|-----|------|---------------|------------------")
for row in cursor.fetchall():
    print(f"  {row[0]:<7} | {row[1]:^3} | {row[2]:^4} | {row[3]:<13} | {row[4]}")

# Check for potential student schedule
print(f"\n🔍 Verification: Can build complete schedule?")
cursor.execute("""
    SELECT c.code, cs.section_letter, cs.day_of_week, cs.start_time, cs.end_time
    FROM course_sections cs
    JOIN courses c ON cs.course_id = c.id
    WHERE cs.semester_id = ?
    AND c.code IN ('ENG101', 'MAT101', 'SCI101', 'SOC101')
    ORDER BY c.code, cs.section_letter
""", (semester_id,))

print("\nCore course sections available:")
for row in cursor.fetchall():
    print(f"  {row[0]} Sec {row[1]}: {row[2]} {row[3]}-{row[4]}")

conn.close()
print("\n✅ Done!")