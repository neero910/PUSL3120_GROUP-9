import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import ReservationTable from '../components/reservations/ReservationTable'
import { reservations, reservationStatuses } from '../data/reservations'

function Reservations() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('')

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
  }, [dateFilter, searchTerm, statusFilter])

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
