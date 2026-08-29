import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import GuestTable from '../components/guests/GuestTable'
import { guests as fallbackGuests } from '../data/guests'
import { fetchApiData, normalizeGuest } from '../services/api'

function Guests() {
  const [guests, setGuests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedGuest, setSelectedGuest] = useState(null)

  useEffect(() => {
    let isMounted = true

    fetchApiData('guests', fallbackGuests, normalizeGuest)
      .then((data) => {
        if (isMounted) {
          setGuests(data)
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setGuests(fallbackGuests)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

  const filteredGuests = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    return guests.filter((guest) => {
      const matchesSearch = !normalizedSearch || [guest.name, guest.contact, guest.idNumber, guest.room]
        .some((value) => value.toLowerCase().includes(normalizedSearch))
      const matchesStatus = statusFilter === 'All Status' || guest.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [guests, searchTerm, statusFilter])

  const guestCounts = {
    total: guests.length,
    checkedIn: guests.filter((guest) => guest.status === 'Checked In').length,
    upcoming: guests.filter((guest) => guest.status === 'Confirmed').length,
    pending: guests.filter((guest) => guest.status === 'Pending').length,
  }

  return (
    <div className="page-stack">
      <PageHeader
        title="Guests"
        subtitle="Guest profile overview and current stays"
        actions={<button type="button" className="primary-button">Add Guest</button>}
      />

      <div className="directory-summary">
        <div><span>Total guests</span><strong>{guestCounts.total}</strong></div>
        <div><span>Checked in</span><strong>{guestCounts.checkedIn}</strong></div>
        <div><span>Upcoming stays</span><strong>{guestCounts.upcoming}</strong></div>
        <div><span>Needs attention</span><strong>{guestCounts.pending}</strong></div>
      </div>

      <div className="toolbar row-gap directory-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input type="search" placeholder="Search by name, room, ID or phone" aria-label="Search guests" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
        <select aria-label="Filter guest status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option>All Status</option>
          <option>Checked In</option>
          <option>Confirmed</option>
          <option>Pending</option>
          <option>Checked Out</option>
        </select>
        {(searchTerm || statusFilter !== 'All Status') && <button type="button" className="text-button" onClick={() => { setSearchTerm(''); setStatusFilter('All Status') }}>Clear filters</button>}
      </div>

      {isLoading ? (
        <div className="panel empty-state"><strong>Loading guests...</strong><span>Fetching the latest guest records.</span></div>
      ) : (
        <GuestTable guests={filteredGuests} onView={setSelectedGuest} />
      )}

      {selectedGuest && (
        <aside className="profile-panel" aria-label="Selected guest profile">
          <div className="profile-panel-header">
            <div className="profile-identity">
              <div className="large-avatar">{selectedGuest.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              <div><h3>{selectedGuest.name}</h3><p>Guest profile</p></div>
            </div>
            <button type="button" className="icon-button" aria-label="Close guest profile" onClick={() => setSelectedGuest(null)}>x</button>
          </div>
          <span className={`status-badge ${selectedGuest.status.toLowerCase().replace(/\s+/g, '-')}`}>{selectedGuest.status}</span>
          <div className="profile-details">
            <div><span>Phone</span><strong>{selectedGuest.contact}</strong></div>
            <div><span>NIC / Passport</span><strong>{selectedGuest.idNumber}</strong></div>
            <div><span>Room</span><strong>{selectedGuest.room}</strong></div>
            <div><span>Stay dates</span><strong>{selectedGuest.checkIn} to {selectedGuest.checkOut}</strong></div>
          </div>
          <button type="button" className="primary-button full-button">Open full profile</button>
        </aside>
      )}
    </div>
  )
}

export default Guests
