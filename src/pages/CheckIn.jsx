import { useState, useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { searchReservation, getReservationDetails, confirmCheckIn } from '../services/checkInService'

function CheckIn() {
  const [searchQuery, setSearchQuery] = useState('')
  const [reservation, setReservation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [confirming, setConfirming] = useState(false)

  // Handle search on Enter key
  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      await performSearch()
    }
  }

  // Perform search
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a reservation ID or guest name')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      // Try to search for reservation by ID or guest name
      const result = await searchReservation(searchQuery)
      
      if (result && result.id) {
        // Fetch full reservation details
        const details = await getReservationDetails(result.id)
        setReservation(details)
      } else {
        setError('Reservation not found. Please check the ID or guest name.')
        setReservation(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to search reservation')
      setReservation(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle confirm check-in
  const handleConfirmCheckIn = async () => {
    if (!reservation) return

    setConfirming(true)
    setError(null)

    try {
      const checkInData = {
        reservationId: reservation.id,
        guestId: reservation.guestId,
        roomId: reservation.roomId,
        checkInTime: new Date().toISOString(),
        notes: '',
      }

      const result = await confirmCheckIn(checkInData)
      
      setSuccess(true)
      setReservation(null)
      setSearchQuery('')
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to confirm check-in')
    } finally {
      setConfirming(false)
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('')
    setReservation(null)
    setError(null)
    setSuccess(false)
  }

  return (
    <div className="page-stack">
      <PageHeader title="Check-In" subtitle="Search reservation and confirm guest arrival" />

      {success && (
        <div className="alert alert-success" role="alert">
          ✓ Check-in confirmed successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠ {error}
        </div>
      )}

      <div className="panel form-panel">
        <div className="toolbar row-gap">
          <div className="search-box wide-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search Reservation ID or Guest Name"
              aria-label="Search Reservation"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              disabled={loading}
            />
            <button
              onClick={performSearch}
              disabled={loading || !searchQuery.trim()}
              className="search-btn"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button onClick={handleClearSearch} className="clear-btn">
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading reservation details...</p>
          </div>
        ) : reservation ? (
          <div className="form-grid">
            <div className="form-section">
              <h3>Guest Information</h3>
              <div className="detail-list">
                <div><span>Guest</span><strong>{reservation.guestName}</strong></div>
                <div><span>Contact</span><strong>{reservation.guestContact}</strong></div>
                <div><span>Email</span><strong>{reservation.guestEmail}</strong></div>
                <div><span>Passport/ID</span><strong>{reservation.passportNumber}</strong></div>
              </div>
            </div>

            <div className="form-section">
              <h3>Room Information</h3>
              <div className="detail-list">
                <div><span>Room</span><strong>{reservation.roomNumber}</strong></div>
                <div><span>Type</span><strong>{reservation.roomType}</strong></div>
                <div><span>Rate</span><strong>{reservation.roomRate}</strong></div>
                <div><span>Floor</span><strong>{reservation.floor}</strong></div>
              </div>
            </div>

            <div className="form-section full-width">
              <h3>Stay Information</h3>
              <div className="detail-list two-column">
                <div><span>Reservation ID</span><strong>{reservation.id}</strong></div>
                <div><span>Check-In Date</span><strong>{reservation.checkInDate}</strong></div>
                <div><span>Expected Check-Out</span><strong>{reservation.checkOutDate}</strong></div>
                <div><span>Number of Guests</span><strong>{reservation.numberOfGuests}</strong></div>
                <div><span>Total Booking Amount</span><strong>{reservation.totalAmount}</strong></div>
                <div><span>Current Status</span><strong>{reservation.status}</strong></div>
              </div>
            </div>

            <div className="form-section full-width">
              <h3>Special Requests</h3>
              <p>{reservation.specialRequests || 'None'}</p>
            </div>
          </div>
        ) : (
          <div className="empty-state">
            <p>Enter a reservation ID or guest name to proceed with check-in</p>
          </div>
        )}

        {reservation && (
          <div className="form-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleConfirmCheckIn}
              disabled={confirming}
            >
              {confirming ? 'Processing...' : 'Confirm Check-In'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleClearSearch}
              disabled={confirming}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckIn
