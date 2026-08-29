import { useState } from 'react'

function AssignStaffModal({ taskOrRoom, staffList, onClose, onAssign }) {
  const [selectedStaff, setSelectedStaff] = useState(taskOrRoom?.assignedTo || taskOrRoom?.assignedAttendant || (staffList[0]?.name || ''))
  const [priority, setPriority] = useState(taskOrRoom?.priority || 'Normal')
  const [targetTime, setTargetTime] = useState(taskOrRoom?.dueTime || '14:00')

  const handleSubmit = (e) => {
    e.preventDefault()
    onAssign(taskOrRoom.id || taskOrRoom.roomNumber, {
      assignedTo: selectedStaff,
      assignedAttendant: selectedStaff,
      priority,
      dueTime: targetTime
    })
    onClose()
  }

  const roomNum = taskOrRoom.roomNumber || taskOrRoom.room || taskOrRoom.id

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content hk-modal-sm">
        <div className="modal-header">
          <div>
            <span className="eyebrow">STAFF ASSIGNMENT</span>
            <h2>Assign Attendant - Room {roomNum}</h2>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body form-stack">
            <div className="form-group">
              <label className="field-label" htmlFor="staff-select">Select Housekeeper / Supervisor</label>
              <select
                id="staff-select"
                className="form-input"
                value={selectedStaff}
                onChange={(e) => setSelectedStaff(e.target.value)}
                required
              >
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.name}>
                    {staff.name} — {staff.role} ({staff.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="priority-select">Cleaning Priority</label>
              <select
                id="priority-select"
                className="form-input"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Normal">Normal — Routine daily service</option>
                <option value="High">High — Standard departure checkout</option>
                <option value="Urgent">Urgent — VIP Arrival / Rush turn</option>
              </select>
            </div>

            <div className="form-group">
              <label className="field-label" htmlFor="due-time">Target Completion Time</label>
              <input
                id="due-time"
                type="time"
                className="form-input"
                value={targetTime}
                onChange={(e) => setTargetTime(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Confirm Assignment</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AssignStaffModal
