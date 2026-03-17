import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import CourseTable from './CourseTable';

describe('CourseTable', () => {
  it('renders the table heading', () => {
    render(<CourseTable />);
    expect(screen.getByText(/available courses/i)).toBeInTheDocument();
  });

  it('renders all mocked courses', () => {
    render(<CourseTable />);
    // Each course row has a radio button with an aria-label
    const radioButtons = screen.getAllByRole('radio');
    expect(radioButtons.length).toBeGreaterThan(0);
  });

  it('renders course columns including description and grade level', () => {
    render(<CourseTable />);
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Credits')).toBeInTheDocument();
    expect(screen.getByText('Prerequisite')).toBeInTheDocument();
    expect(screen.getByText('Grade Level (Min – Max)')).toBeInTheDocument();
  });

  it('enroll button is disabled when no course is selected', () => {
    render(<CourseTable />);
    const enrollButton = screen.getByRole('button', { name: /enroll in selected course/i });
    expect(enrollButton).toBeDisabled();
  });

  it('enroll button is enabled after selecting a course', () => {
    render(<CourseTable />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    const enrollButton = screen.getByRole('button', { name: /enroll in selected course/i });
    expect(enrollButton).not.toBeDisabled();
  });

  it('calls onEnroll callback with the selected course when enrolled', () => {
    const onEnroll = jest.fn();
    render(<CourseTable onEnroll={onEnroll} />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    const enrollButton = screen.getByRole('button', { name: /enroll in selected course/i });
    fireEvent.click(enrollButton);
    expect(onEnroll).toHaveBeenCalledTimes(1);
    expect(onEnroll).toHaveBeenCalledWith(expect.objectContaining({ id: expect.any(Number) }));
  });

  it('shows enrolled courses list after enrolling', () => {
    render(<CourseTable />);
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    fireEvent.click(screen.getByRole('button', { name: /enroll in selected course/i }));
    expect(screen.getByText(/enrolled courses/i)).toBeInTheDocument();
  });

  it('displays prerequisite name for courses that have one', () => {
    render(<CourseTable />);
    // Any course with a prerequisite should show "CODE – Name" format
    const prereqCells = screen.getAllByRole('cell').filter((cell) =>
      /\w+ – .+/.test(cell.textContent ?? '')
    );
    expect(prereqCells.length).toBeGreaterThan(0);
  });

  it('displays a dash for courses without prerequisites', () => {
    render(<CourseTable />);
    // Courses with no prerequisite show "—"
    const dashes = screen.getAllByText('—');
    expect(dashes.length).toBeGreaterThan(0);
  });
});
