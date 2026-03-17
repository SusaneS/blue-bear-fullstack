import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Home from '../pages/Home';
import ProgressBar from '../components/ProgressBar';

describe('Home Page', () => {
  it('renders the welcome heading', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getByText(/Maplewood Course Planning/i)).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>
    );
    expect(screen.getAllByText(/Course Catalog/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Semester Planner/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Graduation Progress/i).length).toBeGreaterThan(0);
  });
});

describe('ProgressBar Component', () => {
  it('renders the label and value', () => {
    render(<ProgressBar label="Mathematics" value={3} max={4} />);
    expect(screen.getByText('Mathematics')).toBeInTheDocument();
    expect(screen.getByText('3/4 credits')).toBeInTheDocument();
  });

  it('shows satisfied state when value equals max', () => {
    render(<ProgressBar label="English" value={4} max={4} />);
    expect(screen.getByText(/✓/)).toBeInTheDocument();
  });

  it('shows 0% progress when value is 0', () => {
    render(<ProgressBar label="Science" value={0} max={3} />);
    expect(screen.getByText('0/3 credits')).toBeInTheDocument();
  });
});
