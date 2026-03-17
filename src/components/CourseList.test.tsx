import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CourseList from './CourseList';
import type { Course } from '../types/course';

const sampleCourses: Course[] = [
  {
    id: 'ENG101',
    name: 'English Composition I',
    description: 'Introduction to writing.',
    credits: 3,
    prerequisiteCourse: null,
    gradeLevelMin: 9,
    gradeLevelMax: 12,
  },
  {
    id: 'MATH101',
    name: 'Algebra I',
    description: 'Fundamentals of algebra.',
    credits: 4,
    prerequisiteCourse: null,
    gradeLevelMin: 9,
    gradeLevelMax: 10,
  },
  {
    id: 'MATH201',
    name: 'Algebra II',
    description: 'Advanced algebraic concepts.',
    credits: 4,
    prerequisiteCourse: 'Algebra I',
    gradeLevelMin: 10,
    gradeLevelMax: 11,
  },
];

describe('CourseList', () => {
  it('renders the course catalog heading', () => {
    render(<CourseList courses={sampleCourses} />);
    expect(screen.getByRole('heading', { name: /course catalog/i })).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(<CourseList courses={sampleCourses} />);
    expect(screen.getByRole('columnheader', { name: /course name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /description/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /credits/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /prerequisite/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /grade level/i })).toBeInTheDocument();
  });

  it('renders a row for each course', () => {
    render(<CourseList courses={sampleCourses} />);
    const table = screen.getByRole('table');
    expect(within(table).getByRole('cell', { name: 'English Composition I' })).toBeInTheDocument();
    expect(within(table).getAllByRole('cell', { name: 'Algebra I' }).length).toBeGreaterThanOrEqual(1);
    expect(within(table).getByRole('cell', { name: 'Algebra II' })).toBeInTheDocument();
  });

  it('displays course fields: description, credits, prerequisite, grade level', () => {
    render(<CourseList courses={sampleCourses} />);
    expect(screen.getByText('Introduction to writing.')).toBeInTheDocument();
    expect(screen.getAllByRole('cell', { name: '4' })).toHaveLength(2);
    expect(screen.getByText('Grades 9–12')).toBeInTheDocument();
    expect(screen.getByText('Grades 10–11')).toBeInTheDocument();
  });

  it('shows "—" for courses with no prerequisite', () => {
    render(<CourseList courses={sampleCourses} />);
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThanOrEqual(2);
  });

  it('shows "Grade X" (singular) when min and max are the same', () => {
    const single: Course[] = [
      { ...sampleCourses[0], gradeLevelMin: 10, gradeLevelMax: 10 },
    ];
    render(<CourseList courses={single} />);
    expect(screen.getByText('Grade 10')).toBeInTheDocument();
  });

  it('does not show the enroll button when nothing is selected', () => {
    render(<CourseList courses={sampleCourses} />);
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('shows the enroll button after selecting a course', async () => {
    const user = userEvent.setup();
    render(<CourseList courses={sampleCourses} />);

    const checkbox = screen.getByRole('checkbox', { name: /select english composition i/i });
    await user.click(checkbox);

    expect(screen.getByRole('button', { name: /enroll in 1 course/i })).toBeInTheDocument();
  });

  it('calls onEnroll with the selected courses when enroll button is clicked', async () => {
    const user = userEvent.setup();
    const onEnroll = vi.fn();
    render(<CourseList courses={sampleCourses} onEnroll={onEnroll} />);

    await user.click(screen.getByRole('checkbox', { name: 'Select Algebra I' }));
    await user.click(screen.getByRole('button', { name: /enroll in 1 course/i }));

    expect(onEnroll).toHaveBeenCalledOnce();
    expect(onEnroll).toHaveBeenCalledWith([sampleCourses[1]]);
  });

  it('selects and deselects all courses with the header checkbox', async () => {
    const user = userEvent.setup();
    render(<CourseList courses={sampleCourses} />);

    const selectAll = screen.getByRole('checkbox', { name: /select all courses/i });
    await user.click(selectAll);

    const enrollButton = screen.getByRole('button', { name: /enroll in 3 courses/i });
    expect(enrollButton).toBeInTheDocument();

    await user.click(selectAll);
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('renders "No courses available." when courses array is empty', () => {
    render(<CourseList courses={[]} />);
    expect(screen.getByText(/no courses available/i)).toBeInTheDocument();
  });

  it('highlights a row when its course is selected', async () => {
    const user = userEvent.setup();
    render(<CourseList courses={sampleCourses} />);

    const checkbox = screen.getByRole('checkbox', { name: /select algebra ii/i });
    await user.click(checkbox);

    const row = screen.getByText('Algebra II').closest('tr');
    expect(row).toHaveClass('selected');
  });

  it('allows clicking the table row itself to toggle selection', async () => {
    const user = userEvent.setup();
    render(<CourseList courses={sampleCourses} />);

    const nameCell = screen.getByText('English Composition I');
    await user.click(nameCell);

    expect(screen.getByRole('button', { name: /enroll in 1 course/i })).toBeInTheDocument();

    await user.click(nameCell);
    expect(screen.queryByRole('button', { name: /enroll/i })).not.toBeInTheDocument();
  });

  it('shows correct pluralization in enroll button for multiple courses', async () => {
    const user = userEvent.setup();
    render(<CourseList courses={sampleCourses} />);

    await user.click(screen.getByRole('checkbox', { name: 'Select Algebra I' }));
    await user.click(screen.getByRole('checkbox', { name: 'Select Algebra II' }));

    expect(screen.getByRole('button', { name: /enroll in 2 courses/i })).toBeInTheDocument();
  });
});
