/**
 * Housekeeping Controller
 * Handles Tasks, Staff Roster, Maintenance Issues, and Supply Inventory
 */

import {
  housekeepingTasks,
  housekeepingStaff,
  maintenanceIssues,
  inventorySupplies,
  findTaskById,
  addTask,
  updateTask,
  deleteTask,
  findStaffById,
  addStaff,
  updateStaff,
  deleteStaff,
  findMaintenanceById,
  addMaintenance,
  updateMaintenance,
  deleteMaintenance,
  findInventoryById,
  addInventory,
  updateInventory,
  restockInventory,
  deleteInventory
} from '../data/housekeeping.js';

import { findRoomByNumber, updateRoom } from '../data/rooms.js';

// ==========================================
// TASKS MANAGEMENT
// ==========================================

/**
 * Get all housekeeping tasks (with optional query filtering)
 * GET /api/housekeeping/tasks
 */
export function getTasks(req, res, next) {
  try {
    const { search, stage, floor, priority, assignedTo } = req.query;

    let filtered = [...housekeepingTasks];

    if (search) {
      const q = String(search).trim().toLowerCase();
      filtered = filtered.filter(t =>
        t.roomNumber.toLowerCase().includes(q) ||
        t.assignedTo.toLowerCase().includes(q) ||
        t.taskType.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      );
    }

    if (stage && stage !== 'All') {
      filtered = filtered.filter(t => t.stage.toLowerCase() === String(stage).toLowerCase());
    }

    if (floor && floor !== 'All') {
      const floorNum = parseInt(String(floor).replace(/[^0-9]/g, ''), 10);
      if (!isNaN(floorNum)) {
        filtered = filtered.filter(t => t.floor === floorNum);
      }
    }

    if (priority && priority !== 'All') {
      filtered = filtered.filter(t => t.priority.toLowerCase() === String(priority).toLowerCase());
    }

    if (assignedTo && assignedTo !== 'All') {
      filtered = filtered.filter(t => t.assignedTo.toLowerCase().includes(String(assignedTo).toLowerCase()));
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single task by ID or roomNumber
 * GET /api/housekeeping/tasks/:id
 */
export function getTaskById(req, res, next) {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create new housekeeping task
 * POST /api/housekeeping/tasks
 */
export function createTask(req, res, next) {
  try {
    const { roomNumber, roomType, floor, taskType, priority, stage, assignedTo, dueTime, checklist, notes } = req.body;

    if (!roomNumber) {
      return res.status(400).json({
        success: false,
        message: 'Room number is required'
      });
    }

    // Auto-lookup room details if roomType / floor not provided
    const targetRoom = findRoomByNumber(roomNumber);
    const resolvedType = roomType || (targetRoom ? targetRoom.type : 'Standard');
    const resolvedFloor = floor ? parseInt(floor, 10) : (targetRoom ? targetRoom.floor : parseInt(String(roomNumber)[0], 10) || 1);

    const newTask = addTask({
      roomNumber: String(roomNumber).trim(),
      roomType: resolvedType,
      floor: resolvedFloor,
      taskType: taskType || 'Daily Turnover',
      priority: priority || 'Normal',
      stage: stage || 'Dirty / Needs Clean',
      assignedTo: assignedTo || (housekeepingStaff[0]?.name || 'Kamani Silva'),
      dueTime: dueTime || '15:00',
      startedAt: stage === 'In Progress' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      checklist: Array.isArray(checklist) ? checklist : undefined,
      notes: notes || ''
    });

    // Sync room housekeeping status
    if (targetRoom) {
      const roomHk = stage || 'Dirty / Needs Clean';
      updateRoom(targetRoom.id, { housekeepingStatus: roomHk });
    }

    res.status(201).json({
      success: true,
      message: `Cleaning task created for Room ${newTask.roomNumber}`,
      data: newTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update task
 * PUT/PATCH /api/housekeeping/tasks/:id
 */
export function updateTaskData(req, res, next) {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    const updatedTask = updateTask(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update task stage (Kanban move)
 * PATCH /api/housekeeping/tasks/:id/stage
 */
export function updateTaskStage(req, res, next) {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    const { stage } = req.body;

    if (!stage) {
      return res.status(400).json({
        success: false,
        message: 'Stage is required'
      });
    }

    const updates = { stage };
    if (stage === 'In Progress' && !task.startedAt) {
      updates.startedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    const updatedTask = updateTask(req.params.id, updates);

    // Sync room housekeepingStatus & room status
    const targetRoom = findRoomByNumber(task.roomNumber);
    if (targetRoom) {
      const roomUpdates = { housekeepingStatus: stage };
      if (stage === 'Clean & Ready' && targetRoom.status === 'Cleaning') {
        roomUpdates.status = 'Available';
        roomUpdates.lastCleaned = 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      } else if (stage === 'In Progress' && targetRoom.status === 'Available') {
        roomUpdates.status = 'Cleaning';
      } else if (stage === 'Out of Order') {
        roomUpdates.status = 'Maintenance';
      }
      updateRoom(targetRoom.id, roomUpdates);
    }

    res.json({
      success: true,
      message: `Task ${task.id} moved to ${stage}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update task checklist & completion
 * PATCH /api/housekeeping/tasks/:id/checklist
 */
export function updateTaskChecklist(req, res, next) {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    const { checklist, notes, isCleanAndReady } = req.body;

    const updates = {};
    if (Array.isArray(checklist)) updates.checklist = checklist;
    if (notes !== undefined) updates.notes = notes;

    if (isCleanAndReady) {
      updates.stage = 'Clean & Ready';
    }

    const updatedTask = updateTask(req.params.id, updates);

    if (isCleanAndReady) {
      const targetRoom = findRoomByNumber(task.roomNumber);
      if (targetRoom) {
        updateRoom(targetRoom.id, {
          housekeepingStatus: 'Clean & Ready',
          status: targetRoom.status === 'Cleaning' ? 'Available' : targetRoom.status,
          lastCleaned: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }

    res.json({
      success: true,
      message: isCleanAndReady ? `Room ${task.roomNumber} certified Clean & Ready!` : 'Checklist updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Assign staff to task
 * PATCH /api/housekeeping/tasks/:id/assign
 */
export function assignTaskStaff(req, res, next) {
  try {
    const task = findTaskById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    const { assignedTo, priority, dueTime } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Assigned staff name is required'
      });
    }

    const updates = { assignedTo };
    if (priority) updates.priority = priority;
    if (dueTime) updates.dueTime = dueTime;

    const updatedTask = updateTask(req.params.id, updates);

    // Sync room assigned attendant
    const targetRoom = findRoomByNumber(task.roomNumber);
    if (targetRoom) {
      updateRoom(targetRoom.id, { assignedAttendant: assignedTo });
    }

    res.json({
      success: true,
      message: `Attendant ${assignedTo} assigned to Room ${task.roomNumber}`,
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete task
 * DELETE /api/housekeeping/tasks/:id
 */
export function deleteTaskData(req, res, next) {
  try {
    const deleted = deleteTask(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Housekeeping task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get Housekeeping summary statistics
 * GET /api/housekeeping/stats/summary
 */
export function getHousekeepingStats(req, res, next) {
  try {
    const totalTasks = housekeepingTasks.length;
    const cleanCount = housekeepingTasks.filter(t => t.stage === 'Clean & Ready').length;
    const inProgressCount = housekeepingTasks.filter(t => t.stage === 'In Progress').length;
    const dirtyCount = housekeepingTasks.filter(t => t.stage === 'Dirty / Needs Clean').length;
    const inspectionCount = housekeepingTasks.filter(t => t.stage === 'Inspection Required').length;
    const oooCount = housekeepingTasks.filter(t => t.stage === 'Out of Order').length;
    const openMaintenanceCount = maintenanceIssues.filter(m => m.status !== 'Resolved').length;

    res.json({
      success: true,
      data: {
        totalTasks,
        cleanCount,
        inProgressCount,
        dirtyCount,
        inspectionCount,
        oooCount,
        openMaintenanceCount,
        guestReadyPercentage: totalTasks > 0 ? Math.round((cleanCount / totalTasks) * 100) : 0
      }
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// STAFF ROSTER MANAGEMENT
// ==========================================

/**
 * Get all housekeeping staff
 * GET /api/housekeeping/staff
 */
export function getStaff(req, res, next) {
  try {
    res.json({
      success: true,
      count: housekeepingStaff.length,
      data: housekeepingStaff
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get staff by ID
 * GET /api/housekeeping/staff/:id
 */
export function getStaffById(req, res, next) {
  try {
    const member = findStaffById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      data: member
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create staff member
 * POST /api/housekeeping/staff
 */
export function createStaff(req, res, next) {
  try {
    const { name, role, shift, floor, phone, status } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Staff name is required'
      });
    }

    const newStaff = addStaff({
      name,
      role: role || 'Housekeeping Attendant',
      shift: shift || 'Morning (07:00 - 15:30)',
      floor: floor || 'Floor 1 & 2',
      phone: phone || '',
      status: status || 'On Duty'
    });

    res.status(201).json({
      success: true,
      message: 'Staff member added successfully',
      data: newStaff
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update staff member
 * PUT/PATCH /api/housekeeping/staff/:id
 */
export function updateStaffData(req, res, next) {
  try {
    const member = findStaffById(req.params.id);

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    const updated = updateStaff(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Staff member updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete staff member
 * DELETE /api/housekeeping/staff/:id
 */
export function deleteStaffData(req, res, next) {
  try {
    const deleted = deleteStaff(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Staff member not found'
      });
    }

    res.json({
      success: true,
      message: 'Staff member removed successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// MAINTENANCE TICKETS MANAGEMENT
// ==========================================

/**
 * Get all maintenance issues
 * GET /api/housekeeping/maintenance
 */
export function getMaintenance(req, res, next) {
  try {
    const { status, severity, roomNumber, search } = req.query;

    let filtered = [...maintenanceIssues];

    if (search) {
      const q = String(search).trim().toLowerCase();
      filtered = filtered.filter(m =>
        m.roomNumber.toLowerCase().includes(q) ||
        m.title.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.assignedTechnician.toLowerCase().includes(q) ||
        (m.notes && m.notes.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(m => m.status.toLowerCase() === String(status).toLowerCase());
    }

    if (severity && severity !== 'All') {
      filtered = filtered.filter(m => m.severity.toLowerCase() === String(severity).toLowerCase());
    }

    if (roomNumber && roomNumber !== 'All') {
      filtered = filtered.filter(m => m.roomNumber === String(roomNumber));
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get single maintenance issue
 * GET /api/housekeeping/maintenance/:id
 */
export function getMaintenanceById(req, res, next) {
  try {
    const issue = findMaintenanceById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance issue not found'
      });
    }

    res.json({
      success: true,
      data: issue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create maintenance issue (repair ticket)
 * POST /api/housekeeping/maintenance
 */
export function createMaintenance(req, res, next) {
  try {
    const { roomNumber, category, title, severity, reportedBy, assignedTechnician, notes, status } = req.body;

    if (!roomNumber || !title) {
      return res.status(400).json({
        success: false,
        message: 'Room number and issue title are required'
      });
    }

    const newIssue = addMaintenance({
      roomNumber: String(roomNumber).trim(),
      category: category || 'General Repair',
      title,
      severity: severity || 'Normal',
      reportedBy: reportedBy || 'Staff Member',
      assignedTechnician: assignedTechnician || 'Nuwan Kumara',
      notes: notes || '',
      status: status || 'Open'
    });

    // If high or urgent severity, automatically put room into Maintenance & Out of Order
    if (severity === 'High' || severity === 'Urgent') {
      const targetRoom = findRoomByNumber(roomNumber);
      if (targetRoom) {
        updateRoom(targetRoom.id, {
          status: 'Maintenance',
          housekeepingStatus: 'Out of Order'
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Maintenance ticket ${newIssue.id} logged for Room ${newIssue.roomNumber}`,
      data: newIssue
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update maintenance issue
 * PUT/PATCH /api/housekeeping/maintenance/:id
 */
export function updateMaintenanceData(req, res, next) {
  try {
    const issue = findMaintenanceById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance issue not found'
      });
    }

    const updated = updateMaintenance(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Maintenance issue updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Resolve maintenance issue
 * PATCH /api/housekeeping/maintenance/:id/resolve
 */
export function resolveMaintenance(req, res, next) {
  try {
    const issue = findMaintenanceById(req.params.id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance issue not found'
      });
    }

    const updated = updateMaintenance(req.params.id, { status: 'Resolved' });

    res.json({
      success: true,
      message: `Maintenance issue ${issue.id} marked as Resolved`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete maintenance issue
 * DELETE /api/housekeeping/maintenance/:id
 */
export function deleteMaintenanceData(req, res, next) {
  try {
    const deleted = deleteMaintenance(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Maintenance issue not found'
      });
    }

    res.json({
      success: true,
      message: 'Maintenance issue deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
}

// ==========================================
// SUPPLY INVENTORY MANAGEMENT
// ==========================================

/**
 * Get all inventory supplies
 * GET /api/housekeeping/inventory
 */
export function getInventory(req, res, next) {
  try {
    const { category, status, search } = req.query;

    let filtered = [...inventorySupplies];

    if (search) {
      const q = String(search).trim().toLowerCase();
      filtered = filtered.filter(i =>
        i.item.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.id.toLowerCase().includes(q)
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(i => i.category.toLowerCase() === String(category).toLowerCase());
    }

    if (status && status !== 'All') {
      filtered = filtered.filter(i => i.status.toLowerCase() === String(status).toLowerCase());
    }

    res.json({
      success: true,
      count: filtered.length,
      data: filtered
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Get inventory item by ID
 * GET /api/housekeeping/inventory/:id
 */
export function getInventoryById(req, res, next) {
  try {
    const item = findInventoryById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      data: item
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Create inventory item
 * POST /api/housekeeping/inventory
 */
export function createInventory(req, res, next) {
  try {
    const { item, category, inStock, minRequired, unit, status } = req.body;

    if (!item) {
      return res.status(400).json({
        success: false,
        message: 'Item name is required'
      });
    }

    const newItem = addInventory({
      item,
      category: category || 'General',
      inStock: inStock !== undefined ? parseInt(inStock, 10) : 0,
      minRequired: minRequired !== undefined ? parseInt(minRequired, 10) : 10,
      unit: unit || 'Pcs',
      status
    });

    res.status(201).json({
      success: true,
      message: 'Inventory item created successfully',
      data: newItem
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Update inventory item
 * PUT/PATCH /api/housekeeping/inventory/:id
 */
export function updateInventoryData(req, res, next) {
  try {
    const item = findInventoryById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const updated = updateInventory(req.params.id, req.body);

    res.json({
      success: true,
      message: 'Inventory item updated successfully',
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Restock inventory item
 * POST/PATCH /api/housekeeping/inventory/:id/restock
 */
export function restockInventoryItem(req, res, next) {
  try {
    const item = findInventoryById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    const { quantity } = req.body;
    const updated = restockInventory(req.params.id, quantity);

    res.json({
      success: true,
      message: `Restocked ${item.item} successfully`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Delete inventory item
 * DELETE /api/housekeeping/inventory/:id
 */
export function deleteInventoryData(req, res, next) {
  try {
    const deleted = deleteInventory(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      });
    }

    res.json({
      success: true,
      message: 'Inventory item deleted successfully',
      data: deleted
    });
  } catch (error) {
    next(error);
  }
}
