import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../components/dashboard/StatCard';

describe('StatCard Component', () => {
  it('renders the label correctly', () => {
    render(<StatCard label="Total Rooms" value="6" />);
    expect(screen.getByText('Total Rooms')).toBeInTheDocument();
  });

  it('renders the value correctly', () => {
    render(<StatCard label="Total Rooms" value="6" />);
    expect(screen.getByText('6')).toBeInTheDocument();
  });

  it('renders the change badge when provided', () => {
    render(<StatCard label="Total Rooms" value="6" change="+2 this week" />);
    expect(screen.getByText('+2 this week')).toBeInTheDocument();
  });

  it('does not render change badge when not provided', () => {
    render(<StatCard label="Total Rooms" value="6" />);
    expect(screen.queryByText(/this week/i)).not.toBeInTheDocument();
  });
});
