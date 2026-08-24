function HousekeepingTaskCard({ task, onOpenChecklist, onMoveStage, onAssignStaff, onReportIssue }) {
  const completedChecklistCount = task.checklist ? task.checklist.filter(item => item.completed).length : 0
  const totalChecklistCount = task.checklist ? task.checklist.length : 0
  const progressPercent = totalChecklistCount > 0 ? Math.round((completedChecklistCount / totalChecklistCount) * 100) : 0

  const priorityClass = task.priority.toLowerCase()

  return (
    <div className={`hk-task-card priority-${priorityClass}`}>
      <div className="hk-card-header">
        <div className="hk-room-tag">
          <span className="hk-room-number">Room {task.roomNumber}</span>
          <span className="hk-room-type">{task.roomType} • Floor {task.floor}</span>
        </div>
        <span className={`priority-badge ${priorityClass}`}>{task.priority}</span>
      </div>

      <div className="hk-task-meta">
        <div className="hk-meta-row">
          <span className="hk-meta-label">Task:</span>
          <strong>{task.taskType}</strong>
        </div>
        <div className="hk-meta-row">
          <span className="hk-meta-label">Attendant:</span>
          <button 
            type="button" 
            className="hk-assigned-link"
            onClick={() => onAssignStaff && onAssignStaff(task)}
            title="Click to change assigned staff"
          >
            👤 {task.assignedTo || 'Unassigned'}
          </button>
        </div>
        <div className="hk-meta-row">
          <span className="hk-meta-label">Target:</span>
          <span>{task.dueTime}</span>
        </div>
      </div>

      {task.notes && (
        <p className="hk-task-notes">
          <em>"{task.notes}"</em>
        </p>
      )}

      {totalChecklistCount > 0 && (
        <div className="hk-checklist-progress-wrap">
          <div className="hk-progress-header">
            <span>Checklist ({completedChecklistCount}/{totalChecklistCount})</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="hk-progress-track">
            <div 
              className="hk-progress-bar" 
              style={{ width: `${progressPercent}%`, backgroundColor: progressPercent === 100 ? '#16a34a' : '#1d4ed8' }}
            />
          </div>
        </div>
      )}

      <div className="hk-card-actions">
        <button
          type="button"
          className="secondary-button small-button hk-action-btn"
          onClick={() => onOpenChecklist(task)}
        >
          ✓ Checklist
        </button>

        {task.stage === 'Dirty / Needs Clean' && (
          <button
            type="button"
            className="primary-button small-button hk-action-btn"
            onClick={() => onMoveStage(task.id, 'In Progress')}
          >
            ▶ Start Cleaning
          </button>
        )}

        {task.stage === 'In Progress' && (
          <button
            type="button"
            className="primary-button small-button hk-action-btn"
            onClick={() => onMoveStage(task.id, 'Inspection Required')}
          >
            🔍 Request Inspection
          </button>
        )}

        {task.stage === 'Inspection Required' && (
          <button
            type="button"
            className="primary-button small-button hk-action-btn hk-btn-success"
            onClick={() => onMoveStage(task.id, 'Clean & Ready')}
          >
            ✓ Pass Inspection
          </button>
        )}

        {task.stage === 'Clean & Ready' && (
          <button
            type="button"
            className="secondary-button small-button hk-action-btn text-muted-btn"
            onClick={() => onMoveStage(task.id, 'Dirty / Needs Clean')}
          >
            ⟲ Reset Clean
          </button>
        )}

        {task.stage === 'Out of Order' && (
          <button
            type="button"
            className="primary-button small-button hk-action-btn"
            onClick={() => onMoveStage(task.id, 'Inspection Required')}
          >
            🛠️ Post-Fix Inspect
          </button>
        )}

        <button
          type="button"
          className="hk-icon-subtle-btn"
          title="Report maintenance issue"
          onClick={() => onReportIssue && onReportIssue(task.roomNumber)}
        >
          ⚠️
        </button>
      </div>
    </div>
  )
}

export default HousekeepingTaskCard
