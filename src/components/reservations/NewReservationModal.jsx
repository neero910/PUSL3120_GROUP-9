import { useState } from 'react'

function NewReservationModal({ isOpen, onClose, onAddReservation }) {
  const [formData, setFormData] = useState({
    guest: '',
    room: '101',
    roomType: 'Standard',
    checkIn: new Date().toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    adults: 2,
    children: 0,
    amount: '45,000',
    status: 'Confirmed'
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.guest.trim()) {
      alert('Guest name is required')
      return
    }

    const newRes = {
      id: `RES-${Date.now().toString().slice(-4)}`,
      guest: formData.guest,
      room: formData.room,
      checkIn: formData.checkIn,
      checkOut: formData.checkOut,
      guests: Number(formData.adults) + Number(formData.children),
      status: formData.status,
      amount: `LKR ${formData.amount}`
    }

    onAddReservation(newRes)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Create New Reservation</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-stack">
          <div className="form-group">
            <label>Guest Full Name *</label>
            <input
              type="text"
              name="guest"
              required
              placeholder="e.g. Maya Wickramasinghe"
              value={formData.guest}
              onChange={handleChange}
            />
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Room Assignment</label>
              <select name="room" value={formData.room} onChange={handleChange}>
                <option value="101">Room 101 (Standard - LKR 20,000/night)</option>
                <option value="102">Room 102 (Standard - LKR 20,000/night)</option>
                <option value="201">Room 201 (Deluxe - LKR 35,000/night)</option>
                <option value="202">Room 202 (Deluxe - LKR 35,000/night)</option>
                <option value="301">Room 301 (Suite - LKR 60,000/night)</option>
                <option value="302">Room 302 (Presidential - LKR 100,000/night)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Total Amount (LKR)</label>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Check-in Date *</label>
              <input
                type="date"
                name="checkIn"
                required
                value={formData.checkIn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date *</label>
              <input
                type="date"
                name="checkOut"
                required
                value={formData.checkOut}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Adults</label>
              <input
                type="number"
                name="adults"
                min="1"
                max="6"
                value={formData.adults}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Children</label>
              <input
                type="number"
                name="children"
                min="0"
                max="6"
                value={formData.children}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reservation Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Confirmed">Confirmed</option>
              <option value="Pending">Pending</option>
              <option value="Checked In">Checked In</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewReservationModal
