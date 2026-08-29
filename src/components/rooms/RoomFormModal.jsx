import { useState } from 'react'
import { allAmenities } from '../../data/rooms'

function RoomFormModal({ roomToEdit, onClose, onSave }) {
  const isEditing = Boolean(roomToEdit)

  const [roomNumber, setRoomNumber] = useState(roomToEdit?.roomNumber || '')
  const [floor, setFloor] = useState(roomToEdit?.floor || 1)
  const [type, setType] = useState(roomToEdit?.type || 'Standard')
  const [price, setPrice] = useState(roomToEdit?.price || 12000)
  const [bedType, setBedType] = useState(roomToEdit?.bedType || 'Queen Bed')
  const [capacity, setCapacity] = useState(roomToEdit?.capacity || 2)
  const [view, setView] = useState(roomToEdit?.view || 'Garden View')
  const [status, setStatus] = useState(roomToEdit?.status || 'Available')
  const [housekeepingStatus, setHousekeepingStatus] = useState(roomToEdit?.housekeepingStatus || 'Clean & Ready')
  const [assignedAttendant, setAssignedAttendant] = useState(roomToEdit?.assignedAttendant || 'Kamani Silva')
  const [selectedAmenities, setSelectedAmenities] = useState(roomToEdit?.amenities || ['Free WiFi', 'Air Conditioning'])
  const [notes, setNotes] = useState(roomToEdit?.notes || '')

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev =>
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!roomNumber.trim()) return

    const roomPayload = {
      id: roomToEdit?.id || Date.now(),
      roomNumber: roomNumber.trim(),
      floor: parseInt(floor),
      type,
      price: parseInt(price),
      bedType,
      capacity: parseInt(capacity),
      view,
      status,
      housekeepingStatus,
      assignedAttendant,
      amenities: selectedAmenities,
      currentGuest: roomToEdit?.currentGuest || null,
      lastCleaned: roomToEdit?.lastCleaned || 'Just now',
      notes
    }

    onSave(roomPayload, isEditing)
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content room-form-modal">
        <div className="modal-header">
          <div>
            <span className="eyebrow">{isEditing ? 'UPDATE ROOM' : 'NEW INVENTORY'}</span>
            <h2>{isEditing ? `Edit Room ${roomToEdit.roomNumber}` : 'Add New Room'}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body form-stack">
            <div className="form-row two-col">
              <div className="form-group">
                <label className="field-label" htmlFor="room-num">Room Number *</label>
                <input
                  id="room-num"
                  type="text"
                  className="form-input"
                  value={roomNumber}
                  onChange={(e) => setRoomNumber(e.target.value)}
                  placeholder="e.g. 107, 205, 306"
                  required
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="room-floor">Floor Number</label>
                <select
                  id="room-floor"
                  className="form-input"
                  value={floor}
                  onChange={(e) => setFloor(e.target.value)}
                >
                  <option value={1}>Floor 1</option>
                  <option value={2}>Floor 2</option>
                  <option value={3}>Floor 3</option>
                  <option value={4}>Floor 4</option>
                </select>
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="field-label" htmlFor="room-type">Room Type</label>
                <select
                  id="room-type"
                  className="form-input"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="Standard">Standard</option>
                  <option value="Deluxe">Deluxe</option>
                  <option value="Suite">Suite</option>
                  <option value="Family Villa">Family Villa</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="room-price">Price per Night (LKR) *</label>
                <input
                  id="room-price"
                  type="number"
                  className="form-input"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="1000"
                  step="500"
                  required
                />
              </div>
            </div>

            <div className="form-row three-col">
              <div className="form-group">
                <label className="field-label" htmlFor="room-bed">Bedding Setup</label>
                <select
                  id="room-bed"
                  className="form-input"
                  value={bedType}
                  onChange={(e) => setBedType(e.target.value)}
                >
                  <option value="Queen Bed">Queen Bed</option>
                  <option value="King Bed">King Bed</option>
                  <option value="Twin Beds">Twin Beds</option>
                  <option value="King + Sofa Bed">King + Sofa Bed</option>
                  <option value="Super King Bed">Super King Bed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="room-cap">Max Guests</label>
                <input
                  id="room-cap"
                  type="number"
                  className="form-input"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value)}
                  min="1"
                  max="10"
                />
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="room-view">View / Orientation</label>
                <input
                  id="room-view"
                  type="text"
                  className="form-input"
                  value={view}
                  onChange={(e) => setView(e.target.value)}
                  placeholder="e.g. Ocean View"
                />
              </div>
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="field-label" htmlFor="room-status">Initial Room Status</label>
                <select
                  id="room-status"
                  className="form-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="Available">Available</option>
                  <option value="Occupied">Occupied</option>
                  <option value="Reserved">Reserved</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="room-attendant">Assigned Housekeeper</label>
                <select
                  id="room-attendant"
                  className="form-input"
                  value={assignedAttendant}
                  onChange={(e) => setAssignedAttendant(e.target.value)}
                >
                  <option value="Kamani Silva">Kamani Silva</option>
                  <option value="Roshan Bandara">Roshan Bandara</option>
                  <option value="Sunethra Perera">Sunethra Perera</option>
                  <option value="Nuwan Kumara">Nuwan Kumara</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label">Included Amenities</label>
              <div className="amenities-checkbox-grid">
                {allAmenities.map((amenity) => (
                  <label key={amenity} className="amenity-check-chip">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                    />
                    <span>{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="room-notes">Notes & Housekeeping Remarks</label>
              <textarea
                id="room-notes"
                rows="2"
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Special notes or setup requirements..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">
              {isEditing ? 'Save Changes' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default RoomFormModal
