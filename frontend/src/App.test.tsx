import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders courses table heading', () => {
  render(<App />);
  const heading = screen.getByText(/available courses/i);
  expect(heading).toBeInTheDocument();
});
