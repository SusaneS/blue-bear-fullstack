import { Course } from '../types/types';

export const mockCourses: Course[] = [
  {
    id: 1,
    code: 'ENG101',
    name: 'Introduction to English Literature',
    description:
      'An introductory survey of classic and contemporary literary works, focusing on close reading, analysis, and essay writing.',
    credits: 4,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 12 },
  },
  {
    id: 2,
    code: 'MATH101',
    name: 'Algebra I',
    description:
      'Fundamentals of algebraic reasoning including linear equations, inequalities, functions, and polynomials.',
    credits: 4,
    hoursPerWeek: 5,
    gradeLevel: { min: 9, max: 10 },
  },
  {
    id: 3,
    code: 'MATH201',
    name: 'Algebra II',
    description:
      'Advanced algebra topics including quadratic functions, complex numbers, logarithms, and sequences.',
    credits: 4,
    hoursPerWeek: 5,
    prerequisiteId: 2,
    gradeLevel: { min: 10, max: 11 },
  },
  {
    id: 4,
    code: 'MATH301',
    name: 'Pre-Calculus',
    description:
      'Preparation for calculus covering trigonometry, vectors, and analytical geometry.',
    credits: 4,
    hoursPerWeek: 5,
    prerequisiteId: 3,
    gradeLevel: { min: 11, max: 12 },
  },
  {
    id: 5,
    code: 'SCI101',
    name: 'Biology',
    description:
      'Introduction to living systems, cell biology, genetics, evolution, and ecology.',
    credits: 4,
    hoursPerWeek: 4,
    gradeLevel: { min: 9, max: 10 },
  },
  {
    id: 6,
    code: 'SCI201',
    name: 'Chemistry',
    description:
      'Core principles of chemistry: atomic structure, bonding, reactions, stoichiometry, and thermodynamics.',
    credits: 4,
    hoursPerWeek: 4,
    prerequisiteId: 5,
    gradeLevel: { min: 10, max: 11 },
  },
  {
    id: 7,
    code: 'SCI301',
    name: 'Physics',
    description:
      'Classical mechanics, electricity and magnetism, waves, and introductory modern physics.',
    credits: 4,
    hoursPerWeek: 4,
    prerequisiteId: 4,
    gradeLevel: { min: 11, max: 12 },
  },
  {
    id: 8,
    code: 'HIST101',
    name: 'World History',
    description:
      'Survey of major civilizations and global events from ancient times through the modern era.',
    credits: 3,
    hoursPerWeek: 3,
    gradeLevel: { min: 9, max: 10 },
  },
  {
    id: 9,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    description:
      'Foundational concepts of programming, problem-solving, algorithms, and software design using Python.',
    credits: 3,
    hoursPerWeek: 3,
    gradeLevel: { min: 9, max: 12 },
  },
  {
    id: 10,
    code: 'CS201',
    name: 'Data Structures & Algorithms',
    description:
      'Study of fundamental data structures (lists, trees, graphs) and algorithmic techniques including sorting and searching.',
    credits: 4,
    hoursPerWeek: 4,
    prerequisiteId: 9,
    gradeLevel: { min: 10, max: 12 },
  },
];
