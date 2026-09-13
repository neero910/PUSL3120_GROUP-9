import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import RoomFormModal from '../components/rooms/RoomFormModal';

describe('RoomFormModal - Client-side Persistence & Form Handling', () => {
  const mockOnClose = vi.fn();
  const mockOnSave = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders modal with default values when no draft exists', () => {
    render(<RoomFormModal onClose={mockOnClose} onSave={mockOnSave} />);
    expect(screen.getByText('Add New Room')).toBeInTheDocument();
    expect(screen.getByLabelText(/room number/i)).toHaveValue('');
  });

  it('restores draft data from localStorage on mount (Phase 4)', () => {
    const draftData = {
      roomNumber: '501',
      price: 18500,
      type: 'Deluxe',
      floor: 5,
      notes: 'Draft note for room 501'
    };
    localStorage.setItem('roomFormDraft', JSON.stringify(draftData));

    render(<RoomFormModal onClose={mockOnClose} onSave={mockOnSave} />);

    expect(screen.getByLabelText(/room number/i)).toHaveValue('501');
    expect(screen.getByLabelText(/price per night/i)).toHaveValue(18500);
    expect(screen.getByDisplayValue('Draft note for room 501')).toBeInTheDocument();
  });

  it('persists changes to localStorage as the user types (Phase 4)', () => {
    render(<RoomFormModal onClose={mockOnClose} onSave={mockOnSave} />);

    const roomNumberInput = screen.getByLabelText(/room number/i);
    fireEvent.change(roomNumberInput, { target: { value: '302' } });

    const savedDraft = JSON.parse(localStorage.getItem('roomFormDraft'));
    expect(savedDraft).toBeDefined();
    expect(savedDraft.roomNumber).toBe('302');
  });

  it('clears draft from localStorage and calls onSave upon form submission', () => {
    localStorage.setItem('roomFormDraft', JSON.stringify({ roomNumber: '404' }));

    render(<RoomFormModal onClose={mockOnClose} onSave={mockOnSave} />);

    const submitBtn = screen.getByRole('button', { name: /create room/i });
    fireEvent.click(submitBtn);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
    expect(mockOnSave).toHaveBeenCalledWith(
      expect.objectContaining({ roomNumber: '404' }),
      false
    );
    expect(localStorage.getItem('roomFormDraft')).toBeNull();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes modal when Cancel button is clicked', () => {
    render(<RoomFormModal onClose={mockOnClose} onSave={mockOnSave} />);

    const cancelBtn = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelBtn);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
