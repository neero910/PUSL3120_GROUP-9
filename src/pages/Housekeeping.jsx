import { useState, useMemo } from 'react'
import PageHeader from '../components/layout/PageHeader'
import HousekeepingTaskCard from '../components/housekeeping/HousekeepingTaskCard'
import CleaningChecklistModal from '../components/housekeeping/CleaningChecklistModal'
import AssignStaffModal from '../components/housekeeping/AssignStaffModal'
import NewMaintenanceModal from '../components/housekeeping/NewMaintenanceModal'
import {
  housekeepingStaff,
  initialHousekeepingTasks,
  initialMaintenanceIssues,
  initialInventorySupplies,
  housekeepingStages
} from '../data/housekeeping'

function Housekeeping() {
  const [activeTab, setActiveTab] = useState('board') // 'board' | 'staff' | 'maintenance' | 'inventory'
  const [tasks, setTasks] = useState(initialHousekeepingTasks)
  const [staff, setStaff] = useState(housekeepingStaff)
  const [maintenanceIssues, setMaintenanceIssues] = useState(initialMaintenanceIssues)
  const [inventory, setInventory] = useState(initialInventorySupplies)

  // Filters for the task board
  const [searchTerm, setSearchTerm] = useState('')
  const [floorFilter, setFloorFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')

  // Modals state
  const [activeChecklistTask, setActiveChecklistTask] = useState(null)
  const [assigningTask, setAssigningTask] = useState(null)
  const [showMaintenanceModal, setShowMaintenanceModal] = useState(false)
  const [maintenanceRoomTarget, setMaintenanceRoomTarget] = useState('')
  const [toastMessage, setToastMessage] = useState(null)

  const showToast = (msg) => {
    setToastMessage(msg)
    setTimeout(() => {
      setToastMessage(null)
    }, 3500)
  }

  // Handle stage moves
  const handleMoveStage = (taskId, newStage) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          stage: newStage,
          startedAt: newStage === 'In Progress' && !t.startedAt ? 'Just now' : t.startedAt
        }
      }
      return t
    }))
    showToast(`Task ${taskId} moved to ${newStage}`)
  }

  // Handle checklist update
  const handleSaveChecklist = (taskId, updatedChecklist, notes) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, checklist: updatedChecklist, notes }
      }
      return t
    }))
    showToast(`Checklist for task updated`)
  }

  // Handle mark clean & ready
  const handleMarkCleanAndReady = (taskId, updatedChecklist, notes) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          stage: 'Clean & Ready',
          checklist: updatedChecklist,
          notes
        }
      }
      return t
    }))
    showToast(`Room certified Clean & Ready!`)
  }

  // Handle staff assignment
  const handleAssignStaff = (taskIdOrRoom, assignmentDetails) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskIdOrRoom || t.roomNumber === taskIdOrRoom) {
        return {
          ...t,
          assignedTo: assignmentDetails.assignedTo,
          priority: assignmentDetails.priority || t.priority,
          dueTime: assignmentDetails.dueTime || t.dueTime
        }
      }
      return t
    }))
    showToast(`Attendant ${assignmentDetails.assignedTo} assigned to Room ${taskIdOrRoom}`)
  }

  // Handle maintenance issue submission
  const handleAddMaintenance = (newIssue) => {
    setMaintenanceIssues(prev => [newIssue, ...prev])
    showToast(`Maintenance ticket ${newIssue.id} logged for Room ${newIssue.roomNumber}`)
  }

  // Handle maintenance resolve
  const handleResolveIssue = (issueId) => {
    setMaintenanceIssues(prev => prev.map(item => {
      if (item.id === issueId) {
        return { ...item, status: 'Resolved' }
      }
      return item
    }))
    showToast(`Issue ${issueId} marked as Resolved`)
  }

  // Handle inventory restock
  const handleRestockItem = (itemId) => {
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const added = item.category === 'Linen' || item.category === 'Towels' ? 20 : 30
        return {
          ...item,
          inStock: item.inStock + added,
          status: 'In Stock'
        }
      }
      return item
    }))
    showToast(`Restocked supply item successfully`)
  }

  // Quick action: Add new task
  const handleQuickAddTask = () => {
    const randomRoom = `${Math.floor(Math.random() * 4 + 1)}0${Math.floor(Math.random() * 6 + 1)}`
    const newTask = {
      id: `HK-${Math.floor(100 + Math.random() * 900)}`,
      roomNumber: randomRoom,
      roomType: 'Standard',
      floor: parseInt(randomRoom[0]),
      taskType: 'Daily Turnover',
      priority: 'Normal',
      stage: 'Dirty / Needs Clean',
      assignedTo: staff[0]?.name || 'Kamani Silva',
      dueTime: '15:00',
      startedAt: null,
      checklist: [
        { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: false },
        { id: 'c2', label: 'Sanitize and polish bathroom surfaces', completed: false },
        { id: 'c3', label: 'Replenish towels and bathroom amenities', completed: false },
        { id: 'c4', label: 'Restock minibar & coffee supplies', completed: false },
        { id: 'c5', label: 'Vacuum & fragrance room', completed: false }
      ],
      notes: 'Standard daily cleaning requested.'
    }
    setTasks(prev => [newTask, ...prev])
    showToast(`New cleaning task created for Room ${randomRoom}`)
  }

  // KPI Calculations
  const totalTasks = tasks.length
  const cleanCount = tasks.filter(t => t.stage === 'Clean & Ready').length
  const inProgressCount = tasks.filter(t => t.stage === 'In Progress').length
  const dirtyCount = tasks.filter(t => t.stage === 'Dirty / Needs Clean').length
  const inspectionCount = tasks.filter(t => t.stage === 'Inspection Required').length
  const oooCount = tasks.filter(t => t.stage === 'Out of Order').length
  const openMntCount = maintenanceIssues.filter(i => i.status !== 'Resolved').length

  // Filtered tasks for Board
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      const matchesSearch = !searchTerm ||
        t.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.taskType.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesFloor = floorFilter === 'All' || String(t.floor) === floorFilter
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter

      return matchesSearch && matchesFloor && matchesPriority
    })
  }, [tasks, searchTerm, floorFilter, priorityFilter])

  return (
    <div className="page-stack">
      {toastMessage && (
        <div className="toast-notification" role="status">
          <span>✨</span>
          <div>{toastMessage}</div>
        </div>
      )}

      <PageHeader
        title="Housekeeping Management"
        subtitle="Live cleaning workflows, staff duty rosters, maintenance tracking, and supplies"
        actions={
          <div className="page-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => { setMaintenanceRoomTarget('101'); setShowMaintenanceModal(true) }}
            >
              ⚠️ Report Repair
            </button>
            <button
              type="button"
              className="primary-button"
              onClick={handleQuickAddTask}
            >
              + Create Cleaning Task
            </button>
          </div>
        }
      />

      {/* KPI Overview Summary */}
      <div className="hk-summary-grid">
        <div className="hk-kpi-card hk-kpi-clean">
          <div className="hk-kpi-header">
            <span>Clean & Ready</span>
            <span className="hk-kpi-badge">Ready</span>
          </div>
          <div className="hk-kpi-value">{cleanCount} <small>/ {totalTasks}</small></div>
          <p className="hk-kpi-sub">{totalTasks > 0 ? Math.round((cleanCount/totalTasks)*100) : 0}% of rooms guest-ready</p>
        </div>

        <div className="hk-kpi-card hk-kpi-progress">
          <div className="hk-kpi-header">
            <span>In Progress</span>
            <span className="hk-kpi-badge">Active</span>
          </div>
          <div className="hk-kpi-value">{inProgressCount}</div>
          <p className="hk-kpi-sub">Attendants currently cleaning</p>
        </div>

        <div className="hk-kpi-card hk-kpi-dirty">
          <div className="hk-kpi-header">
            <span>Needs Cleaning</span>
            <span className="hk-kpi-badge">Queued</span>
          </div>
          <div className="hk-kpi-value">{dirtyCount}</div>
          <p className="hk-kpi-sub">Awaiting turnover start</p>
        </div>

        <div className="hk-kpi-card hk-kpi-inspect">
          <div className="hk-kpi-header">
            <span>Needs Inspection</span>
            <span className="hk-kpi-badge">QC Hold</span>
          </div>
          <div className="hk-kpi-value">{inspectionCount}</div>
          <p className="hk-kpi-sub">Awaiting supervisor sign-off</p>
        </div>

        <div className="hk-kpi-card hk-kpi-repair">
          <div className="hk-kpi-header">
            <span>Repairs / OOO</span>
            <span className="hk-kpi-badge">{openMntCount} Open</span>
          </div>
          <div className="hk-kpi-value">{oooCount}</div>
          <p className="hk-kpi-sub">Rooms on maintenance hold</p>
        </div>
      </div>

      {/* Mode Tabs Navigation */}
      <div className="hk-tab-nav">
        <button
          type="button"
          className={`hk-tab-btn ${activeTab === 'board' ? 'active' : ''}`}
          onClick={() => setActiveTab('board')}
        >
          📋 Active Cleaning Tasks Board
        </button>
        <button
          type="button"
          className={`hk-tab-btn ${activeTab === 'staff' ? 'active' : ''}`}
          onClick={() => setActiveTab('staff')}
        >
          🧹 Staff Workload & Duty Roster
        </button>
        <button
          type="button"
          className={`hk-tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => setActiveTab('maintenance')}
        >
          🛠️ Maintenance Tickets ({openMntCount})
        </button>
        <button
          type="button"
          className={`hk-tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
          onClick={() => setActiveTab('inventory')}
        >
          🧴 Linen & Supply Inventory
        </button>
      </div>

      {/* TAB 1: KANBAN CLEANING BOARD */}
      {activeTab === 'board' && (
        <div className="page-stack">
          <div className="toolbar row-gap">
            <div className="search-box">
              <span>⌕</span>
              <input
                type="text"
                placeholder="Search room #, attendant, or task type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label="Search housekeeping tasks"
              />
            </div>

            <select
              value={floorFilter}
              onChange={(e) => setFloorFilter(e.target.value)}
              aria-label="Filter tasks by floor"
            >
              <option value="All">All Floors</option>
              <option value="1">Floor 1</option>
              <option value="2">Floor 2</option>
              <option value="3">Floor 3</option>
              <option value="4">Floor 4</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Filter tasks by priority"
            >
              <option value="All">All Priorities</option>
              <option value="Urgent">Urgent (VIP)</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
            </select>

            {(searchTerm || floorFilter !== 'All' || priorityFilter !== 'All') && (
              <button
                type="button"
                className="text-button"
                onClick={() => { setSearchTerm(''); setFloorFilter('All'); setPriorityFilter('All') }}
              >
                Clear Filters
              </button>
            )}
          </div>

          <div className="hk-kanban-board">
            {housekeepingStages.map((stage) => {
              const stageTasks = filteredTasks.filter(t => t.stage === stage.id)

              return (
                <div key={stage.id} className="hk-kanban-column">
                  <div className="hk-column-header">
                    <div className="hk-col-title">
                      <span className="hk-col-icon">{stage.icon}</span>
                      <strong>{stage.label}</strong>
                    </div>
                    <span className="hk-col-count">{stageTasks.length}</span>
                  </div>

                  <div className="hk-column-body">
                    {stageTasks.map((task) => (
                      <HousekeepingTaskCard
                        key={task.id}
                        task={task}
                        onOpenChecklist={(t) => setActiveChecklistTask(t)}
                        onMoveStage={handleMoveStage}
                        onAssignStaff={(t) => setAssigningTask(t)}
                        onReportIssue={(roomNum) => {
                          setMaintenanceRoomTarget(roomNum)
                          setShowMaintenanceModal(true)
                        }}
                      />
                    ))}

                    {stageTasks.length === 0 && (
                      <div className="hk-empty-col">
                        <span>No rooms in this stage</span>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 2: STAFF ROSTER & WORKLOAD */}
      {activeTab === 'staff' && (
        <div className="page-stack">
          <div className="hk-staff-grid">
            {staff.map((member) => {
              const activeCount = tasks.filter(t => t.assignedTo === member.name && t.stage !== 'Clean & Ready').length
              const completedCount = tasks.filter(t => t.assignedTo === member.name && t.stage === 'Clean & Ready').length

              return (
                <div key={member.id} className="hk-staff-card">
                  <div className="hk-staff-card-header">
                    <div className="avatar large-avatar">{member.avatar}</div>
                    <div className="hk-staff-info">
                      <h3>{member.name}</h3>
                      <p className="muted-text">{member.role}</p>
                      <span className="status-badge active">{member.status}</span>
                    </div>
                  </div>

                  <div className="hk-staff-details">
                    <div className="hk-staff-detail-row">
                      <span>Shift:</span>
                      <strong>{member.shift}</strong>
                    </div>
                    <div className="hk-staff-detail-row">
                      <span>Primary Zone:</span>
                      <strong>{member.floor}</strong>
                    </div>
                    <div className="hk-staff-detail-row">
                      <span>Contact:</span>
                      <strong>{member.phone}</strong>
                    </div>
                  </div>

                  <div className="hk-staff-stats">
                    <div className="hk-stat-pill">
                      <span>Active Tasks</span>
                      <strong>{activeCount}</strong>
                    </div>
                    <div className="hk-stat-pill success">
                      <span>Cleaned Today</span>
                      <strong>{completedCount}</strong>
                    </div>
                  </div>

                  <div className="hk-staff-assigned-rooms">
                    <span className="hk-sub-title">Assigned Rooms:</span>
                    <div className="hk-room-chips">
                      {tasks.filter(t => t.assignedTo === member.name).map(t => (
                        <span key={t.id} className={`hk-room-chip ${t.stage === 'Clean & Ready' ? 'done' : 'active'}`}>
                          Room {t.roomNumber} ({t.stage === 'Clean & Ready' ? 'Ready' : 'Working'})
                        </span>
                      ))}
                      {tasks.filter(t => t.assignedTo === member.name).length === 0 && (
                        <span className="muted-text">No active rooms assigned</span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    className="primary-button full-button"
                    onClick={() => setAssigningTask({ roomNumber: '102', assignedTo: member.name })}
                  >
                    + Assign New Room Task
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* TAB 3: MAINTENANCE TICKETS */}
      {activeTab === 'maintenance' && (
        <div className="panel">
          <div className="panel-heading directory-heading">
            <div>
              <h3>Room Maintenance & Damage Log</h3>
              <p className="muted-text">Track repairs, HVAC, plumbing, and fixtures with engineering</p>
            </div>
            <button
              type="button"
              className="primary-button"
              onClick={() => { setMaintenanceRoomTarget('101'); setShowMaintenanceModal(true) }}
            >
              + Log New Repair Ticket
            </button>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Ticket ID</th>
                  <th>Room</th>
                  <th>Category</th>
                  <th>Issue Details</th>
                  <th>Severity</th>
                  <th>Technician</th>
                  <th>Reported</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceIssues.map((issue) => (
                  <tr key={issue.id}>
                    <td><strong>{issue.id}</strong></td>
                    <td>
                      <span className="hk-room-number-tag">Room {issue.roomNumber}</span>
                    </td>
                    <td>{issue.category}</td>
                    <td>
                      <strong>{issue.title}</strong>
                      {issue.notes && <p className="table-subnote">{issue.notes}</p>}
                    </td>
                    <td>
                      <span className={`status-badge ${issue.severity.toLowerCase()}`}>
                        {issue.severity}
                      </span>
                    </td>
                    <td>{issue.assignedTechnician}</td>
                    <td><small>{issue.reportedAt}</small></td>
                    <td>
                      <span className={`status-badge ${issue.status.toLowerCase().replace(/\s+/g, '-')}`}>
                        {issue.status}
                      </span>
                    </td>
                    <td>
                      {issue.status !== 'Resolved' ? (
                        <button
                          type="button"
                          className="secondary-button small-button"
                          onClick={() => handleResolveIssue(issue.id)}
                        >
                          ✓ Resolve
                        </button>
                      ) : (
                        <span className="muted-text">Fixed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: LINEN & INVENTORY SUPPLIES */}
      {activeTab === 'inventory' && (
        <div className="panel">
          <div className="panel-heading directory-heading">
            <div>
              <h3>Housekeeping Supplies & Amenity Stock</h3>
              <p className="muted-text">Maintain par levels for linens, luxury towels, toiletries, and minibar goods</p>
            </div>
          </div>

          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Category</th>
                  <th>Current Stock</th>
                  <th>Min. Par Level</th>
                  <th>Stock Status</th>
                  <th>Quick Action</th>
                </tr>
              </thead>
              <tbody>
                {inventory.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.id}</strong></td>
                    <td><strong>{item.item}</strong></td>
                    <td><span className="category-chip">{item.category}</span></td>
                    <td>
                      <strong className={item.inStock <= item.minRequired ? 'text-danger' : ''}>
                        {item.inStock} {item.unit}
                      </strong>
                    </td>
                    <td>{item.minRequired} {item.unit}</td>
                    <td>
                      <span className={`status-badge ${item.status === 'In Stock' ? 'active' : item.status === 'Low Stock' ? 'pending' : 'cancelled'}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="secondary-button small-button"
                        onClick={() => handleRestockItem(item.id)}
                      >
                        + Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODALS */}
      {activeChecklistTask && (
        <CleaningChecklistModal
          task={activeChecklistTask}
          onClose={() => setActiveChecklistTask(null)}
          onSaveChecklist={handleSaveChecklist}
          onMarkCleanAndReady={handleMarkCleanAndReady}
        />
      )}

      {assigningTask && (
        <AssignStaffModal
          taskOrRoom={assigningTask}
          staffList={staff}
          onClose={() => setAssigningTask(null)}
          onAssign={handleAssignStaff}
        />
      )}

      {showMaintenanceModal && (
        <NewMaintenanceModal
          preselectedRoom={maintenanceRoomTarget}
          onClose={() => setShowMaintenanceModal(false)}
          onSubmitIssue={handleAddMaintenance}
        />
      )}
    </div>
  )
}

export default Housekeeping
