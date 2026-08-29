import { useState } from 'react'

function NewMaintenanceModal({ preselectedRoom, onClose, onSubmitIssue }) {
  const [roomNumber, setRoomNumber] = useState(preselectedRoom || '101')
  const [category, setCategory] = useState('HVAC / Air Conditioning')
  const [title, setTitle] = useState('')
  const [severity, setSeverity] = useState('Moderate')
  const [technician, setTechnician] = useState('Nuwan Kumara (Engineering)')
  const [notes, setNotes] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSubmitIssue({
      id: `MNT-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber,
      category,
      title,
      severity,
      reportedBy: 'Housekeeping Staff',
      reportedAt: 'Just now',
      assignedTechnician: technician,
      status: 'Open',
      notes
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content hk-modal-sm">
        <div className="modal-header">
          <div>
            <span className="eyebrow">FACILITIES & MAINTENANCE</span>
            <h2>Log Room Repair / Issue</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body form-stack">
            <div className="form-group">
              <label className="field-label" htmlFor="mnt-room">Room Number</label>
              <input
                id="mnt-room"
                type="text"
                className="form-input"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                placeholder="e.g. 104, 202, 305"
                required
              />
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="mnt-category">Category</label>
              <select
                id="mnt-category"
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="HVAC / Air Conditioning">HVAC / Air Conditioning</option>
                <option value="Plumbing">Plumbing & Drainage</option>
                <option value="Electrical & Lighting">Electrical & Lighting</option>
                <option value="Carpentry & Furniture">Carpentry & Furniture</option>
                <option value="Smart Tech & Electronics">Smart Tech, TV & Keycards</option>
                <option value="Deep Stain / Carpet">Deep Stain / Carpet Treatment</option>
              </select>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="mnt-title">Issue Description</label>
              <input
                id="mnt-title"
                type="text"
                className="form-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Shower head leaking, AC thermostat not responding..."
                required
              />
            </div>

            <div className="form-row two-col">
              <div className="form-group">
                <label className="field-label" htmlFor="mnt-severity">Severity / Urgency</label>
                <select
                  id="mnt-severity"
                  className="form-input"
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="Low">Low (Can wait for routine fix)</option>
                  <option value="Moderate">Moderate (Fix before next checkin)</option>
                  <option value="High">High (Immediate attention)</option>
                  <option value="Urgent">Urgent (Room out of order)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="field-label" htmlFor="mnt-technician">Assigned Technician</label>
                <select
                  id="mnt-technician"
                  className="form-input"
                  value={technician}
                  onChange={(e) => setTechnician(e.target.value)}
                >
                  <option value="Nuwan Kumara (Engineering)">Nuwan Kumara (Engineering)</option>
                  <option value="Dhammika Silva (Plumbing)">Dhammika Silva (Plumbing)</option>
                  <option value="Sampath Alwis (HVAC Tech)">Sampath Alwis (HVAC Tech)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="mnt-notes">Additional Observations</label>
              <textarea
                id="mnt-notes"
                rows="2"
                className="form-input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any specifics, location in room, or temporary actions taken..."
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button hk-btn-danger">Create Repair Ticket</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NewMaintenanceModal
