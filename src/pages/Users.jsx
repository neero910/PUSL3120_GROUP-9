import { useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { users } from '../data/users'

function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('All Roles')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedUser, setSelectedUser] = useState(null)

  const filteredUsers = useMemo(() => users.filter((user) => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchesSearch = !normalizedSearch || [user.name, user.email, user.role].some((value) => value.toLowerCase().includes(normalizedSearch))
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter
    const matchesStatus = statusFilter === 'All Status' || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  }), [roleFilter, searchTerm, statusFilter])

  const activeUsers = users.filter((user) => user.status === 'Active').length
  const roles = [...new Set(users.map((user) => user.role))]

  return (
    <div className="page-stack">
      <PageHeader
        title="Users"
        subtitle="Manage access, roles and team activity"
        actions={<button type="button" className="primary-button">Add user</button>}
      />

      <div className="directory-summary user-summary">
        <div><span>Total accounts</span><strong>{users.length}</strong></div>
        <div><span>Active now</span><strong>{activeUsers}</strong></div>
        <div><span>Roles in use</span><strong>{roles.length}</strong></div>
        <div><span>Awaiting activity</span><strong>{users.length - activeUsers}</strong></div>
      </div>

      <div className="toolbar row-gap directory-toolbar">
        <div className="search-box">
          <span>⌕</span>
          <input type="search" placeholder="Search name, email or role" aria-label="Search users" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} />
        </div>
        <select aria-label="Filter user role" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          <option>All Roles</option>
          {roles.map((role) => <option key={role}>{role}</option>)}
        </select>
        <select aria-label="Filter user status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          <option>All Status</option>
          <option>Active</option>
          <option>Away</option>
        </select>
        {(searchTerm || roleFilter !== 'All Roles' || statusFilter !== 'All Status') && <button type="button" className="text-button" onClick={() => { setSearchTerm(''); setRoleFilter('All Roles'); setStatusFilter('All Status') }}>Clear filters</button>}
      </div>

      <div className="panel">
        <div className="panel-heading directory-heading">
          <div><h3>Team accounts</h3><p className="muted-text">{filteredUsers.length} of {users.length} accounts shown</p></div>
          <span className="muted-text">Last active</span>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td><div className="table-person"><div className="avatar small-avatar">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div><strong>{user.name}</strong></div></td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>{user.status}</span>
                  </td>
                  <td>{user.lastActive}</td>
                  <td>
                    <button type="button" className="secondary-button small-button" onClick={() => setSelectedUser(user)}>View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredUsers.length && <div className="empty-state"><strong>No users found</strong><span>Try a different name, role or status.</span></div>}
        </div>
      </div>

      {selectedUser && (
        <aside className="profile-panel" aria-label="Selected user details">
          <div className="profile-panel-header">
            <div className="profile-identity">
              <div className="large-avatar">{selectedUser.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
              <div><h3>{selectedUser.name}</h3><p>{selectedUser.role}</p></div>
            </div>
            <button type="button" className="icon-button" aria-label="Close user details" onClick={() => setSelectedUser(null)}>x</button>
          </div>
          <span className={`status-badge ${selectedUser.status.toLowerCase()}`}>{selectedUser.status}</span>
          <div className="profile-details">
            <div><span>Email</span><strong>{selectedUser.email}</strong></div>
            <div><span>Last active</span><strong>{selectedUser.lastActive}</strong></div>
            <div><span>Access level</span><strong>{selectedUser.role}</strong></div>
            <div><span>Account ID</span><strong>USR-{String(selectedUser.id).padStart(4, '0')}</strong></div>
          </div>
          <button type="button" className="primary-button full-button">Edit permissions</button>
        </aside>
      )}
    </div>
  )
}

export default Users
