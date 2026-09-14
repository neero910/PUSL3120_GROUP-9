import { useEffect, useMemo, useState } from 'react'
import io from 'socket.io-client'
import PageHeader from '../components/layout/PageHeader'
import ReservationTable from '../components/reservations/ReservationTable'
import { reservationStatuses } from '../data/reservations'
import { reservationsApi } from '../services/api'

function normalizeReservation(item) {
  const guest = item.guest || {}
  const room = item.room || {}
  return {
    id: item.reservationNumber || item.id || item._id,
    guest: guest.fullName || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Unknown guest',
    room: room.roomNumber || 'N/A',
    checkIn: String(item.checkInDate || '').slice(0, 10),
    checkOut: String(item.checkOutDate || '').slice(0, 10),
    guests: (item.adults || item.numberOfAdults || 0) + (item.children || item.numberOfChildren || 0),
    status: item.status || 'Pending',
    amount: `LKR ${Number(item.totalAmount || 0).toLocaleString()}`,
  }
}

function Reservations() {
  const [searchTerm, setSearchTerm] = useState(() => JSON.parse(localStorage.getItem('reservation-filters') || '{}').searchTerm || '')
  const [statusFilter, setStatusFilter] = useState(() => JSON.parse(localStorage.getItem('reservation-filters') || '{}').statusFilter || 'All')
  const [dateFilter, setDateFilter] = useState(() => JSON.parse(localStorage.getItem('reservation-filters') || '{}').dateFilter || '')
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    reservationsApi.getAll().then((response) => {
      setReservations((response.data || []).map(normalizeReservation))
    }).catch(() => setReservations([]))

    // Determine WebSocket URL:
    // 1. Use VITE_WS_URL if explicitly set (e.g., pointing to Render/Railway backend)
    // 2. Fall back to localhost only during local development
    // 3. Skip WebSocket silently in production when no WS URL is configured
    const wsUrl = import.meta.env.VITE_WS_URL ||
      (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : null);

    if (!wsUrl) {
      // Production without dedicated backend – skip WebSocket gracefully
      return;
    }

    const socket = io(wsUrl, { transports: ['websocket', 'polling'] });

    socket.on('reservationCreated', (newReservation) => {
      setReservations((prev) => [normalizeReservation(newReservation), ...prev]);
    });
    
    socket.on('reservationUpdated', (updatedReservation) => {
      const normalized = normalizeReservation(updatedReservation);
      setReservations((prev) => prev.map(res => res.id === normalized.id ? normalized : res));
    });

    socket.on('reservationDeleted', (deletedReservation) => {
      const id = deletedReservation._id || deletedReservation.id || deletedReservation.reservationNumber;
      setReservations((prev) => prev.filter(res => res.id !== id));
    });

    return () => socket.disconnect();
  }, [])

  useEffect(() => {
    localStorage.setItem('reservation-filters', JSON.stringify({ searchTerm, statusFilter, dateFilter }))
  }, [dateFilter, searchTerm, statusFilter])

  const filteredReservations = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return reservations.filter((reservation) => {
      const searchableValues = [
        reservation.id,
        reservation.guest,
        reservation.room,
        reservation.checkIn,
        reservation.checkOut,
        reservation.status,
      ]
      const matchesSearch = !normalizedSearch || searchableValues.some((value) => value.toLowerCase().includes(normalizedSearch))
      const matchesStatus = statusFilter === 'All' || reservation.status === statusFilter
      const matchesDate = !dateFilter || (reservation.checkIn <= dateFilter && reservation.checkOut >= dateFilter)

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [dateFilter, reservations, searchTerm, statusFilter])

  const hasActiveFilters = searchTerm || statusFilter !== 'All' || dateFilter

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('All')
    setDateFilter('')
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Reservations"
        subtitle="Upcoming and active bookings"
        actions={<button type="button" className="primary-button">New Reservation</button>}
      />

      <div className="toolbar row-gap reservation-toolbar">
        <div className="search-box">
          <span aria-hidden="true">⌕</span>
          <input type="search" placeholder="Search guest, room or reservation ID" aria-label="Search reservations" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
        <select aria-label="Filter reservation status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {reservationStatuses.map((status) => (
            <option key={status} value={status}>{status === 'All' ? 'All Status' : status}</option>
          ))}
        </select>
        <label className="date-filter">
          <span>Stay date</span>
          <input type="date" aria-label="Filter reservations by stay date" value={dateFilter} onChange={(event) => setDateFilter(event.target.value)} />
        </label>
        {hasActiveFilters && <button type="button" className="text-button" onClick={clearFilters}>Clear filters</button>}
      </div>

      <div className="results-summary" aria-live="polite">
        <strong>{filteredReservations.length} {filteredReservations.length === 1 ? 'reservation' : 'reservations'}</strong>
        {hasActiveFilters && <span>matching your filters</span>}
      </div>

      <ReservationTable reservations={filteredReservations} />
    </div>
  )
}

export default Reservations
