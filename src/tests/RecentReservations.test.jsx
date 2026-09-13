import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecentReservations from '../components/dashboard/RecentReservations';

// Mock recharts to avoid SVG rendering issues in jsdom
vi.mock('recharts', () => ({
  ResponsiveContainer: ({ children }) => children,
  PieChart: ({ children }) => <svg>{children}</svg>,
  Pie: () => null,
  Cell: () => null,
  Tooltip: () => null,
}));

const mockReservations = [
  {
    id: 'RES-001',
    guest: 'Kasun Perera',
    room: '101',
    checkIn: '2026-09-14',
    checkOut: '2026-09-16',
    status: 'Confirmed',
  },
];

describe('RecentReservations Component', () => {
  it('renders the card title', () => {
    render(<RecentReservations reservations={[]} />);
    expect(screen.getByText('Recent Reservations')).toBeInTheDocument();
  });

  it('shows empty state when no reservations', () => {
    render(<RecentReservations reservations={[]} />);
    expect(screen.getByText(/no recent reservations/i)).toBeInTheDocument();
  });

  it('renders reservation rows when data is provided', () => {
    render(<RecentReservations reservations={mockReservations} />);
    expect(screen.getByText('Kasun Perera')).toBeInTheDocument();
    expect(screen.getByText('RES-001')).toBeInTheDocument();
    expect(screen.getByText('Confirmed')).toBeInTheDocument();
  });
});
