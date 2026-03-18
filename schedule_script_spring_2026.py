import sqlite3
from datetime import datetime
from collections import defaultdict

DB_PATH = 'maplewood_school.sqlite'

# Configuration
LUNCH_START = '12:00'
LUNCH_END = '13:00'
MAX_TEACHER_DAILY_HOURS = 4
SECTION_CAPACITY = 10

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

def has_time_overlap(day1, start1, end1, day2, start2, end2):
    """Check if two time slots overlap"""
    def get_days(day_str):
        days = set()
        if 'M' in day_str:
            days.add('M')
        if 'W' in day_str:
            days.add('W')
        if 'F' in day_str:
            days.add('F')
        if 'T' in day_str and 'Th' not in day_str:
            days.add('T')
        if 'Th' in day_str:
            days.add('Th')
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

def overlaps_lunch(start_time, end_time):
    """Check if time slot overlaps with lunch (12:00-13:00)"""
    lunch_start = datetime.strptime(LUNCH_START, '%H:%M').time()
    lunch_end = datetime.strptime(LUNCH_END, '%H:%M').time()
    slot_start = datetime.strptime(start_time, '%H:%M').time()
    slot_end = datetime.strptime(end_time, '%H:%M').time()
    
    return (slot_start < lunch_end and slot_end > lunch_start)

def get_time_duration(start_time, end_time):
    """Calculate duration in hours"""
    start = datetime.strptime(start_time, '%H:%M')
    end = datetime.strptime(end_time, '%H:%M')
    return (end - start).seconds / 3600

def calculate_teacher_daily_hours(teacher_schedule):
    """Calculate total teaching hours per day for a teacher"""
    daily_hours = defaultdict(float)
    
    for day_str, start, end in teacher_schedule:
        duration = get_time_duration(start, end)
        
        for day in ['M', 'T', 'W', 'Th', 'F']:
            if day == 'T' and 'Th' in day_str:
                continue
            if day in day_str or (day == 'Th' and 'Th' in day_str):
                daily_hours[day] += duration
    
    return daily_hours

def can_assign_teacher(teacher_id, teacher_schedule, day, start, end):
    """Check if teacher can be assigned"""
    # Check time conflicts
    for sched_day, sched_start, sched_end in teacher_schedule[teacher_id]:
        if has_time_overlap(day, start, end, sched_day, sched_start, sched_end):
            return False
    
    # Check daily hour limits
    daily_hours = calculate_teacher_daily_hours(teacher_schedule[teacher_id])
    duration = get_time_duration(start, end)
    
    for check_day in ['M', 'T', 'W', 'Th', 'F']:
        if check_day == 'T' and 'Th' in day:
            continue
        if check_day in day or (check_day == 'Th' and 'Th' in day):
            if daily_hours[check_day] + duration > MAX_TEACHER_DAILY_HOURS:
                return False
    
    return True

def can_assign_room(room_id, room_schedule, day, start, end):
    """Check if room is available"""
    for sched_day, sched_start, sched_end in room_schedule[room_id]:
        if has_time_overlap(day, start, end, sched_day, sched_start, sched_end):
            return False
    return True

def get_all_time_slots(code):
    """Get ALL available time slots for a course (more options!)"""
    
    # Core course slots (5-6 hours)
    if code.startswith('ENG') or code.startswith('MAT') or code.startswith('SCI'):
        slots = [
            # Morning slots
            ('MWF', '08:00', '10:00'),
            ('MWF', '09:00', '11:00'),
            ('MWF', '10:00', '12:00'),
            ('TTh', '08:00', '10:30'),
            ('TTh', '09:00', '11:30'),
            ('TTh', '10:00', '12:30'),
            # Afternoon slots
            ('MWF', '13:00', '15:00'),
            ('MWF', '14:00', '16:00'),
            ('TTh', '13:00', '15:30'),
            ('TTh', '14:00', '16:30'),
            ('TTh', '13:00', '16:00'),
        ]
    
    # Social Studies (4 hours)
    elif code.startswith('SOC'):
        slots = [
            ('TTh', '08:00', '10:00'),
            ('TTh', '09:00', '11:00'),
            ('TTh', '10:00', '12:00'),
            ('TTh', '13:00', '15:00'),
            ('TTh', '14:00', '16:00'),
            ('MWF', '08:00', '09:20'),
            ('MWF', '09:00', '10:20'),
            ('MWF', '10:00', '11:20'),
            ('MWF', '13:00', '14:20'),
            ('MWF', '14:00', '15:20'),
        ]
    
    # Electives (2-4 hours)
    else:
        slots = [
            # Short slots (2-3 hours)
            ('MWF', '08:00', '09:00'),
            ('MWF', '09:00', '10:00'),
            ('MWF', '10:00', '11:00'),
            ('MWF', '11:00', '12:00'),
            ('MWF', '13:00', '14:00'),
            ('MWF', '14:00', '15:00'),
            ('MWF', '15:00', '16:00'),
            ('TTh', '08:00', '09:00'),
            ('TTh', '09:00', '10:00'),
            ('TTh', '10:00', '11:00'),
            ('TTh', '11:00', '12:00'),
            ('TTh', '13:00', '14:00'),
            ('TTh', '14:00', '15:00'),
            ('TTh', '15:00', '16:00'),
            ('TTh', '15:30', '16:30'),
            # Medium slots (4 hours)
            ('TTh', '08:00', '10:00'),
            ('TTh', '10:00', '12:00'),
            ('MWF', '08:00', '09:20'),
            ('MWF', '09:00', '10:20'),
            ('MWF', '10:00', '11:20'),
            ('MWF', '13:00', '14:20'),
            ('MWF', '14:00', '15:20'),
            ('TTh', '13:00', '15:00'),
            ('TTh', '14:00', '16:00'),
        ]
    
    # Filter out lunch conflicts
    slots = [s for s in slots if not overlaps_lunch(s[1], s[2])]
    
    return slots

def get_section_count(code, grade_min, course_type):
    """Determine number of sections based on student demand"""
    
    # 400 students total, 100 per grade
    
    # CORE COURSES - High enrollment expected
    
    # Freshman Spring core (grade 9) - expect 80-90% enrollment
    if code in ['ENG102', 'MAT102', 'SCI102'] and grade_min == 9:
        return 8  # 80 students (80% of 100 freshmen)
    
    # Sophomore Spring core (grade 10) - expect 70-80% enrollment
    if code in ['ENG202', 'MAT202'] and grade_min == 10:
        return 7  # 70 students
    
    # Junior Spring core (grade 11) - expect 60-70% enrollment
    if code in ['ENG302', 'SCI301', 'SOC201'] and grade_min == 11:
        return 6  # 60 students
    
    # Senior Spring core (grade 12) - expect 50-60% enrollment
    if code in ['ENG402'] and grade_min == 12:
        return 5  # 50 students
    
    # ELECTIVES - Variable enrollment
    
    # Popular electives (expect 30-40 students across all grades)
    if code in ['CS201', 'PE201', 'SPAN201', 'ART201', 'BAND101', 'CHOIR201', 'HLTH101']:
        return 4  # 40 students
    
    # Standard electives (expect 20-30 students)
    if code in ['CS401', 'ART401', 'PHOT201', 'MUS201', 'DRAMA201', 
                'FREN201', 'GERM201', 'SPAN301', 'ENVIRON101', 
                'STATS101', 'DEBATE101']:
        return 3  # 30 students
    
    # Specialized/advanced courses (expect 10-20 students)
    if course_type == 'elective':
        return 2  # 20 students
    
    # Very specialized
    return 1  # 10 students

def populate_spring_2026():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    
    print("="*90)
    print("POPULATING SPRING 2026 COURSE SECTIONS (EXPANDED)")
    print("="*90 + "\n")
    
    # Get Spring 2026 semester
    cursor.execute("SELECT id, name, year FROM semesters WHERE name = 'Spring' AND year = 2026")
    semester = cursor.fetchone()
    
    if not semester:
        print("❌ ERROR: Spring 2026 semester not found!")
        print("Please add it first:")
        print("  INSERT INTO semesters (name, year, order_in_year, start_date, end_date, is_active)")
        print("  VALUES ('Spring', 2026, 2, '2026-01-15', '2026-05-15', 1);")
        conn.close()
        return
    
    semester_id, semester_name, semester_year = semester
    print(f"✓ Found {semester_name} {semester_year} (ID: {semester_id})\n")
    
    # Check for existing sections
    cursor.execute("SELECT COUNT(*) FROM course_sections WHERE semester_id = ?", (semester_id,))
    existing = cursor.fetchone()[0]
    
    if existing > 0:
        print(f"⚠️  WARNING: {existing} sections already exist for Spring 2026")
        confirm = input("Delete and recreate? (yes/no): ").strip().lower()
        if confirm in ['yes', 'y']:
            cursor.execute("DELETE FROM course_sections WHERE semester_id = ?", (semester_id,))
            conn.commit()
            print(f"✓ Deleted {existing} existing sections\n")
        else:
            print("❌ Aborted")
            conn.close()
            return
    
    # Get Spring courses (semester_order = 2)
    cursor.execute("""
        SELECT id, code, name, hours_per_week, credits, specialization_id,
               prerequisite_id, grade_level_min, grade_level_max, course_type
        FROM courses
        WHERE semester_order = 2
        ORDER BY 
            CASE WHEN course_type = 'core' THEN 0 ELSE 1 END,
            code
    """)
    courses = cursor.fetchall()
    
    print(f"📚 Found {len(courses)} Spring courses\n")
    
    # Build resource pools
    teacher_pool = defaultdict(list)
    cursor.execute("SELECT id, first_name, last_name, specialization_id FROM teachers")
    for tid, fname, lname, spec_id in cursor.fetchall():
        teacher_pool[spec_id].append((tid, fname, lname))
    
    room_pool = defaultdict(list)
    cursor.execute("SELECT id, name, room_type_id, capacity FROM classrooms")
    for rid, rname, room_type_id, capacity in cursor.fetchall():
        room_pool[room_type_id].append((rid, rname, capacity))
    
    print(f"✓ {sum(len(v) for v in teacher_pool.values())} teachers available")
    print(f"✓ {sum(len(v) for v in room_pool.values())} classrooms available\n")
    
    # Tracking schedules
    teacher_schedule = defaultdict(list)
    room_schedule = defaultdict(list)
    teacher_index = defaultdict(int)
    room_index = defaultdict(int)
    
    sections_created = 0
    sections_skipped = 0
    
    print("="*90)
    print("SCHEDULING COURSES")
    print("="*90 + "\n")
    
    for course in courses:
        cid, code, name, hours, credits, spec_id, prereq, grade_min, grade_max, ctype = course
        
        section_count = get_section_count(code, grade_min, ctype)
        room_type_id = ROOM_TYPE_MAP.get(spec_id, 1)
        
        print(f"{code} - {name}")
        print(f"  Type: {ctype.upper()}, Hours: {hours}/week, Target Sections: {section_count}")
        
        available_teachers = teacher_pool.get(spec_id, [])
        available_rooms = room_pool.get(room_type_id, [])
        
        if not available_teachers:
            print(f"  ❌ No teachers for specialization {spec_id}")
            sections_skipped += section_count
            print()
            continue
        
        if not available_rooms:
            print(f"  ❌ No rooms for type {room_type_id}")
            sections_skipped += section_count
            print()
            continue
        
        # Get all possible time slots
        all_slots = get_all_time_slots(code)
        
        for section_num in range(section_count):
            section_letter = chr(65 + section_num)
            section_scheduled = False
            
            # Try all available time slots
            for time_slot in all_slots:
                if section_scheduled:
                    break
                
                day, start, end = time_slot
                
                # Try to find teacher
                for _ in range(len(available_teachers)):
                    if section_scheduled:
                        break
                    
                    tid, tfname, tlname = available_teachers[teacher_index[spec_id] % len(available_teachers)]
                    teacher_index[spec_id] += 1
                    
                    if not can_assign_teacher(tid, teacher_schedule, day, start, end):
                        continue
                    
                    # Try to find room
                    for _ in range(len(available_rooms)):
                        rid, rname, capacity = available_rooms[room_index[room_type_id] % len(available_rooms)]
                        room_index[room_type_id] += 1
                        
                        if capacity < SECTION_CAPACITY:
                            continue
                        
                        if not can_assign_room(rid, room_schedule, day, start, end):
                            continue
                        
                        # Insert section
                        try:
                            cursor.execute("""
                                INSERT INTO course_sections 
                                (course_id, semester_id, teacher_id, classroom_id, section_letter,
                                 day_of_week, start_time, end_time, max_capacity, current_enrollment)
                                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
                            """, (cid, semester_id, tid, rid, section_letter, day, start, end, SECTION_CAPACITY))
                            
                            teacher_schedule[tid].append((day, start, end))
                            room_schedule[rid].append((day, start, end))
                            
                            print(f"    ✅ Sec {section_letter}: {tfname} {tlname}, {rname}, {day} {start}-{end}")
                            sections_created += 1
                            section_scheduled = True
                            break
                            
                        except sqlite3.IntegrityError as e:
                            continue
            
            if not section_scheduled:
                print(f"    ⚠️  Sec {section_letter}: Could not schedule (no available slot)")
                sections_skipped += 1
        
        print()
    
    conn.commit()
    
    print("="*90)
    print("SUMMARY")
    print("="*90)
    print(f"✅ Created: {sections_created} sections")
    print(f"⚠️  Skipped: {sections_skipped} sections")
    print(f"📊 Total Capacity: {sections_created * SECTION_CAPACITY} students")
    print("="*90 + "\n")
    
    # Verification
    print("📊 VERIFICATION\n")
    
    # By course type
    cursor.execute("""
        SELECT c.course_type, COUNT(*) as count, SUM(cs.max_capacity) as capacity
        FROM course_sections cs
        JOIN courses c ON cs.course_id = c.id
        WHERE cs.semester_id = ?
        GROUP BY c.course_type
    """, (semester_id,))
    
    print("Sections by type:")
    for row in cursor.fetchall():
        print(f"  {row[0].upper():12} {row[1]:3} sections ({row[2]:3} student capacity)")
    
    print()
    
    # Top courses by section count
    cursor.execute("""
        SELECT c.code, c.name, COUNT(*) as sections, SUM(cs.max_capacity) as capacity
        FROM course_sections cs
        JOIN courses c ON cs.course_id = c.id
        WHERE cs.semester_id = ?
        GROUP BY c.id
        ORDER BY sections DESC
        LIMIT 10
    """, (semester_id,))
    
    print("Top 10 courses by section count:")
    for row in cursor.fetchall():
        print(f"  {row[0]:<10} {row[1]:<35} {row[2]:2} sections ({row[3]:3} capacity)")
    
    print()
    
    # Check lunch conflicts
    cursor.execute("""
        SELECT COUNT(*)
        FROM course_sections
        WHERE semester_id = ?
        AND (start_time < ? AND end_time > ?)
    """, (semester_id, LUNCH_END, LUNCH_START))
    
    lunch_conflicts = cursor.fetchone()[0]
    if lunch_conflicts > 0:
        print(f"⚠️  WARNING: {lunch_conflicts} sections overlap with lunch time!")
    else:
        print(f"✅ No lunch time conflicts (12:00-13:00 clear)")
    
    conn.close()
    print("\n✅ Done!")

if __name__ == "__main__":
    populate_spring_2026()