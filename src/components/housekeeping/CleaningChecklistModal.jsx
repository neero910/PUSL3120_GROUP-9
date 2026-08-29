import { useState } from 'react'

function CleaningChecklistModal({ task, onClose, onSaveChecklist, onMarkCleanAndReady }) {
  const [checklist, setChecklist] = useState(task.checklist || [])
  const [notes, setNotes] = useState(task.notes || '')

  const handleToggle = (id) => {
    setChecklist(prev =>
      prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item)
    )
  }

  const handleMarkAll = (completedStatus) => {
    setChecklist(prev => prev.map(item => ({ ...item, completed: completedStatus })))
  }

  const handleSave = () => {
    onSaveChecklist(task.id, checklist, notes)
    onClose()
  }

  const handleMarkReady = () => {
    const allCompleted = checklist.map(item => ({ ...item, completed: true }))
    onMarkCleanAndReady(task.id, allCompleted, notes)
    onClose()
  }

  const completedCount = checklist.filter(c => c.completed).length
  const totalCount = checklist.length
  const isAllDone = totalCount > 0 && completedCount === totalCount

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-content hk-modal-dialog">
        <div className="modal-header">
          <div>
            <span className="eyebrow">HOUSEKEEPING QC</span>
            <h2>Room {task.roomNumber} Cleaning Checklist</h2>
            <p className="muted-text">{task.roomType} • Assigned to {task.assignedTo || 'Staff'}</p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <div className="modal-body">
          <div className="hk-checklist-toolbar">
            <div className="hk-checklist-summary">
              <strong>Progress: {completedCount} of {totalCount} items verified ({totalCount > 0 ? Math.round((completedCount/totalCount)*100) : 0}%)</strong>
            </div>
            <div className="hk-checklist-quick-actions">
              <button type="button" className="text-button" onClick={() => handleMarkAll(true)}>Select All</button>
              <span>•</span>
              <button type="button" className="text-button" onClick={() => handleMarkAll(false)}>Reset All</button>
            </div>
          </div>

          <div className="hk-checklist-items">
            {checklist.map((item) => (
              <label key={item.id} className={`hk-checkbox-item ${item.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.completed}
                  onChange={() => handleToggle(item.id)}
                />
                <span className="hk-check-label">{item.label}</span>
                {item.completed && <span className="hk-checked-badge">✓ Verified</span>}
              </label>
            ))}
          </div>

          <div className="form-group" style={{ marginTop: '18px' }}>
            <label className="field-label" htmlFor="hk-supervisor-notes">Attendant / Supervisor Notes</label>
            <textarea
              id="hk-supervisor-notes"
              rows="3"
              className="form-input"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Linen changed, minibar restocked, special flower bouquet placed for VIP..."
            />
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
          <button type="button" className="primary-button" onClick={handleSave}>Save Progress</button>
          {(!isAllDone) && (
            <button
              type="button"
              className="primary-button hk-btn-success"
              onClick={handleMarkReady}
            >
              ✓ Complete All & Pass QC
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default CleaningChecklistModal
