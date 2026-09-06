import HousekeepingTask from '../models/HousekeepingTask.js';
import HousekeepingStaff from '../models/HousekeepingStaff.js';
import MaintenanceIssue from '../models/MaintenanceIssue.js';
import InventorySupply from '../models/InventorySupply.js';
import Room from '../models/Room.js';

// ==========================================
// TASKS MANAGEMENT
// ==========================================

export async function getTasks(req, res, next) {
  try {
    const { search, stage, floor, priority, assignedTo } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { roomNumber: new RegExp(search, 'i') },
        { assignedTo: new RegExp(search, 'i') },
        { taskType: new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') }
      ];
    }
    if (stage && stage !== 'All') query.stage = new RegExp(`^${stage}$`, 'i');
    if (floor && floor !== 'All') query.floor = parseInt(String(floor).replace(/[^0-9]/g, ''), 10);
    if (priority && priority !== 'All') query.priority = new RegExp(`^${priority}$`, 'i');
    if (assignedTo && assignedTo !== 'All') query.assignedTo = new RegExp(`^${assignedTo}$`, 'i');

    const data = await HousekeepingTask.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data: data.map(d => ({ ...d.toObject(), id: d._id })) });
  } catch (error) { next(error); }
}

export async function getTaskById(req, res, next) {
  try {
    const task = await HousekeepingTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });
    res.json({ success: true, data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function createTask(req, res, next) {
  try {
    const { roomNumber, roomType, floor, taskType, priority, stage, assignedTo, dueTime, checklist, notes } = req.body;
    if (!roomNumber) return res.status(400).json({ success: false, message: 'Room number is required' });

    const targetRoom = await Room.findOne({ roomNumber });
    const resolvedType = roomType || (targetRoom ? targetRoom.type : 'Standard');
    const resolvedFloor = floor ? parseInt(floor, 10) : (targetRoom ? targetRoom.floor : parseInt(String(roomNumber)[0], 10) || 1);

    const defaultChecklist = [
      { label: 'Strip and replace bed linen & pillowcases', completed: false },
      { label: 'Sanitize and polish bathroom surfaces & mirrors', completed: false },
      { label: 'Replenish bath towels, hand towels, and bathrobes', completed: false },
      { label: 'Restock minibar, coffee pods, tea & complimentary water', completed: false },
      { label: 'Vacuum carpets and mop hard floor surfaces', completed: false },
      { label: 'Check lighting, TV remotes, AC temperature & safe lock', completed: false },
      { label: 'Final room fragrance & supervisor inspection readiness', completed: false }
    ];

    const task = await HousekeepingTask.create({
      roomNumber, roomType: resolvedType, floor: resolvedFloor,
      taskType: taskType || 'Daily Turnover', priority: priority || 'Normal', stage: stage || 'Dirty / Needs Clean',
      assignedTo: assignedTo || 'Kamani Silva', dueTime: dueTime || '15:00',
      startedAt: stage === 'In Progress' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null,
      checklist: Array.isArray(checklist) ? checklist : defaultChecklist, notes: notes || ''
    });

    if (targetRoom) {
      await Room.findByIdAndUpdate(targetRoom._id, { housekeepingStatus: stage || 'Dirty / Needs Clean' });
    }

    res.status(201).json({ success: true, message: `Cleaning task created for Room ${task.roomNumber}`, data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function updateTaskData(req, res, next) {
  try {
    const task = await HousekeepingTask.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });
    res.json({ success: true, message: 'Task updated successfully', data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function updateTaskStage(req, res, next) {
  try {
    const { stage } = req.body;
    if (!stage) return res.status(400).json({ success: false, message: 'Stage is required' });

    const task = await HousekeepingTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });

    task.stage = stage;
    if (stage === 'In Progress' && !task.startedAt) {
      task.startedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    await task.save();

    const targetRoom = await Room.findOne({ roomNumber: task.roomNumber });
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
      await Room.findByIdAndUpdate(targetRoom._id, roomUpdates);
    }

    res.json({ success: true, message: `Task moved to ${stage}`, data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function updateTaskChecklist(req, res, next) {
  try {
    const { checklist, notes, isCleanAndReady } = req.body;
    const task = await HousekeepingTask.findById(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });

    if (Array.isArray(checklist)) task.checklist = checklist;
    if (notes !== undefined) task.notes = notes;
    if (isCleanAndReady) task.stage = 'Clean & Ready';
    await task.save();

    if (isCleanAndReady) {
      const targetRoom = await Room.findOne({ roomNumber: task.roomNumber });
      if (targetRoom) {
        await Room.findByIdAndUpdate(targetRoom._id, {
          housekeepingStatus: 'Clean & Ready',
          status: targetRoom.status === 'Cleaning' ? 'Available' : targetRoom.status,
          lastCleaned: 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
      }
    }

    res.json({ success: true, message: isCleanAndReady ? `Room ${task.roomNumber} certified Clean & Ready!` : 'Checklist updated successfully', data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function assignTaskStaff(req, res, next) {
  try {
    const { assignedTo, priority, dueTime } = req.body;
    if (!assignedTo) return res.status(400).json({ success: false, message: 'Assigned staff name is required' });

    const updates = { assignedTo };
    if (priority) updates.priority = priority;
    if (dueTime) updates.dueTime = dueTime;

    const task = await HousekeepingTask.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });

    await Room.findOneAndUpdate({ roomNumber: task.roomNumber }, { assignedAttendant: assignedTo });
    res.json({ success: true, message: `Attendant ${assignedTo} assigned`, data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function deleteTaskData(req, res, next) {
  try {
    const task = await HousekeepingTask.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ success: false, message: 'Housekeeping task not found' });
    res.json({ success: true, message: 'Task deleted successfully', data: { ...task.toObject(), id: task._id } });
  } catch (error) { next(error); }
}

export async function getHousekeepingStats(req, res, next) {
  try {
    const [totalTasks, cleanCount, inProgressCount, dirtyCount, inspectionCount, oooCount, openMaintenanceCount] = await Promise.all([
      HousekeepingTask.countDocuments(),
      HousekeepingTask.countDocuments({ stage: 'Clean & Ready' }),
      HousekeepingTask.countDocuments({ stage: 'In Progress' }),
      HousekeepingTask.countDocuments({ stage: 'Dirty / Needs Clean' }),
      HousekeepingTask.countDocuments({ stage: 'Inspection Required' }),
      HousekeepingTask.countDocuments({ stage: 'Out of Order' }),
      MaintenanceIssue.countDocuments({ status: { $ne: 'Resolved' } })
    ]);

    res.json({
      success: true,
      data: {
        totalTasks, cleanCount, inProgressCount, dirtyCount, inspectionCount, oooCount, openMaintenanceCount,
        guestReadyPercentage: totalTasks > 0 ? Math.round((cleanCount / totalTasks) * 100) : 0
      }
    });
  } catch (error) { next(error); }
}

// ==========================================
// STAFF ROSTER MANAGEMENT
// ==========================================

export async function getStaff(req, res, next) {
  try {
    const data = await HousekeepingStaff.find();
    res.json({ success: true, count: data.length, data: data.map(d => ({ ...d.toObject(), id: d._id })) });
  } catch (error) { next(error); }
}

export async function getStaffById(req, res, next) {
  try {
    const member = await HousekeepingStaff.findById(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, data: { ...member.toObject(), id: member._id } });
  } catch (error) { next(error); }
}

export async function createStaff(req, res, next) {
  try {
    const { name, role, shift, floor, phone, status } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Staff name is required' });

    const member = await HousekeepingStaff.create({ name, role, shift, floor, phone, status });
    res.status(201).json({ success: true, message: 'Staff member added successfully', data: { ...member.toObject(), id: member._id } });
  } catch (error) { next(error); }
}

export async function updateStaffData(req, res, next) {
  try {
    const member = await HousekeepingStaff.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, message: 'Staff member updated successfully', data: { ...member.toObject(), id: member._id } });
  } catch (error) { next(error); }
}

export async function deleteStaffData(req, res, next) {
  try {
    const member = await HousekeepingStaff.findByIdAndDelete(req.params.id);
    if (!member) return res.status(404).json({ success: false, message: 'Staff member not found' });
    res.json({ success: true, message: 'Staff member removed successfully', data: { ...member.toObject(), id: member._id } });
  } catch (error) { next(error); }
}

// ==========================================
// MAINTENANCE TICKETS MANAGEMENT
// ==========================================

export async function getMaintenance(req, res, next) {
  try {
    const { status, severity, roomNumber, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { roomNumber: new RegExp(search, 'i') },
        { title: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') },
        { assignedTechnician: new RegExp(search, 'i') },
        { notes: new RegExp(search, 'i') }
      ];
    }
    if (status && status !== 'All') query.status = new RegExp(`^${status}$`, 'i');
    if (severity && severity !== 'All') query.severity = new RegExp(`^${severity}$`, 'i');
    if (roomNumber && roomNumber !== 'All') query.roomNumber = String(roomNumber);

    const data = await MaintenanceIssue.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: data.length, data: data.map(d => ({ ...d.toObject(), id: d._id })) });
  } catch (error) { next(error); }
}

export async function getMaintenanceById(req, res, next) {
  try {
    const issue = await MaintenanceIssue.findById(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
    res.json({ success: true, data: { ...issue.toObject(), id: issue._id } });
  } catch (error) { next(error); }
}

export async function createMaintenance(req, res, next) {
  try {
    const { roomNumber, category, title, severity, reportedBy, assignedTechnician, notes, status } = req.body;
    if (!roomNumber || !title) return res.status(400).json({ success: false, message: 'Room number and issue title are required' });

    const issue = await MaintenanceIssue.create({
      roomNumber, category, title, severity, reportedBy, assignedTechnician, notes, status
    });

    if (severity === 'High' || severity === 'Urgent') {
      await Room.findOneAndUpdate({ roomNumber }, { status: 'Maintenance', housekeepingStatus: 'Out of Order' });
    }

    res.status(201).json({ success: true, message: `Maintenance ticket logged for Room ${issue.roomNumber}`, data: { ...issue.toObject(), id: issue._id } });
  } catch (error) { next(error); }
}

export async function updateMaintenanceData(req, res, next) {
  try {
    const issue = await MaintenanceIssue.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!issue) return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
    res.json({ success: true, message: 'Maintenance issue updated successfully', data: { ...issue.toObject(), id: issue._id } });
  } catch (error) { next(error); }
}

export async function resolveMaintenance(req, res, next) {
  try {
    const issue = await MaintenanceIssue.findByIdAndUpdate(req.params.id, { status: 'Resolved' }, { new: true });
    if (!issue) return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
    res.json({ success: true, message: `Maintenance issue marked as Resolved`, data: { ...issue.toObject(), id: issue._id } });
  } catch (error) { next(error); }
}

export async function deleteMaintenanceData(req, res, next) {
  try {
    const issue = await MaintenanceIssue.findByIdAndDelete(req.params.id);
    if (!issue) return res.status(404).json({ success: false, message: 'Maintenance issue not found' });
    res.json({ success: true, message: 'Maintenance issue deleted successfully', data: { ...issue.toObject(), id: issue._id } });
  } catch (error) { next(error); }
}

// ==========================================
// SUPPLY INVENTORY MANAGEMENT
// ==========================================

export async function getInventory(req, res, next) {
  try {
    const { category, status, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { item: new RegExp(search, 'i') },
        { category: new RegExp(search, 'i') }
      ];
    }
    if (category && category !== 'All') query.category = new RegExp(`^${category}$`, 'i');
    if (status && status !== 'All') query.status = new RegExp(`^${status}$`, 'i');

    const data = await InventorySupply.find(query);
    res.json({ success: true, count: data.length, data: data.map(d => ({ ...d.toObject(), id: d._id })) });
  } catch (error) { next(error); }
}

export async function getInventoryById(req, res, next) {
  try {
    const item = await InventorySupply.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });
    res.json({ success: true, data: { ...item.toObject(), id: item._id } });
  } catch (error) { next(error); }
}

export async function createInventory(req, res, next) {
  try {
    const { item, category, inStock, minRequired, unit, status } = req.body;
    if (!item) return res.status(400).json({ success: false, message: 'Item name is required' });

    const inventory = await InventorySupply.create({
      item, category, inStock: inStock || 0, minRequired: minRequired || 10, unit, status
    });
    res.status(201).json({ success: true, message: 'Inventory item created successfully', data: { ...inventory.toObject(), id: inventory._id } });
  } catch (error) { next(error); }
}

export async function updateInventoryData(req, res, next) {
  try {
    const item = await InventorySupply.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    if (req.body.inStock !== undefined) item.inStock = Number(req.body.inStock);
    if (req.body.minRequired !== undefined) item.minRequired = Number(req.body.minRequired);
    if (req.body.item !== undefined) item.item = req.body.item;
    if (req.body.category !== undefined) item.category = req.body.category;
    if (req.body.unit !== undefined) item.unit = req.body.unit;
    if (req.body.status !== undefined) item.status = req.body.status;
    
    await item.save();

    res.json({ success: true, message: 'Inventory item updated successfully', data: { ...item.toObject(), id: item._id } });
  } catch (error) { next(error); }
}

export async function restockInventoryItem(req, res, next) {
  try {
    const item = await InventorySupply.findById(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });

    const qty = Number(req.body.quantity) || (item.category === 'Linen' || item.category === 'Towels' ? 20 : 30);
    item.inStock += qty;
    await item.save();

    res.json({ success: true, message: `Restocked ${item.item} successfully`, data: { ...item.toObject(), id: item._id } });
  } catch (error) { next(error); }
}

export async function deleteInventoryData(req, res, next) {
  try {
    const item = await InventorySupply.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: 'Inventory item not found' });
    res.json({ success: true, message: 'Inventory item deleted successfully', data: { ...item.toObject(), id: item._id } });
  } catch (error) { next(error); }
}
