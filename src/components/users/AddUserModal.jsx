import { useState } from 'react'

function AddUserModal({ isOpen, onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Front Desk',
    status: 'Active',
    password: ''
  })

  if (!isOpen) return null

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Name and email are required')
      return
    }

    onAddUser({
      id: Date.now(),
      name: formData.name,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      lastActive: 'Just now'
    })
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-dialog standard-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Team Member</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body form-stack">
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="e.g. Priyantha Silva"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="e.g. priyantha@hotel.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-row two-col">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={formData.role} onChange={handleChange}>
                <option value="Administrator">Administrator</option>
                <option value="Manager">Manager</option>
                <option value="Front Desk">Front Desk</option>
                <option value="Housekeeping">Housekeeping</option>
                <option value="Accountant">Accountant</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select name="status" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Away">Away</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Initial Temporary Password</label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={onClose}>Cancel</button>
            <button type="submit" className="primary-button">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddUserModal
