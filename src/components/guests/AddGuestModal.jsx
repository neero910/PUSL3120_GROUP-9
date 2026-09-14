import { useState } from 'react'

function AddGuestModal({ isOpen, onClose, onAddGuest }) {
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    email: '',
    idNumber: '',
    room: '101',
    checkIn: new Date().toISOString().slice(0, 10),
    checkOut: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
    status: 'Confirmed'
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim()) {
      alert('Guest name is required')
      return
    }
    onAddGuest(formData)
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Guest</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-stack">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Kasun Perera"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="contact"
                required
                placeholder="e.g. +94 77 123 4567"
                value={formData.contact}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>NIC / Passport Number *</label>
              <input
                type="text"
                name="idNumber"
                required
                placeholder="e.g. 199012345678"
                value={formData.idNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. guest@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Assigned Room</label>
              <select name="room" value={formData.room} onChange={handleChange}>
                <option value="101">Room 101 (Standard)</option>
                <option value="102">Room 102 (Standard)</option>
                <option value="201">Room 201 (Deluxe)</option>
                <option value="202">Room 202 (Deluxe)</option>
                <option value="301">Room 301 (Suite)</option>
                <option value="302">Room 302 (Presidential)</option>
              </select>
            </div>
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Check-in Date</label>
              <input
                type="date"
                name="checkIn"
                value={formData.checkIn}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Check-out Date</label>
              <input
                type="date"
                name="checkOut"
                value={formData.checkOut}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Initial Status</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="Confirmed">Confirmed</option>
              <option value="Checked In">Checked In</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Register Guest</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddGuestModal
