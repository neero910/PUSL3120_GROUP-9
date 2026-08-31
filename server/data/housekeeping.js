/**
 * Housekeeping Data Store
 * In-Memory Storage for Hotel Management System
 */

export let housekeepingStaff = [
  {
    id: '1',
    name: 'Kamani Silva',
    role: 'Senior Housekeeper',
    shift: 'Morning (07:00 - 15:30)',
    floor: 'Floor 1 & 2',
    status: 'On Duty',
    assignedRooms: ['101', '104', '202', '301'],
    completedToday: 5,
    avatar: 'KS',
    phone: '+94 77 234 5671'
  },
  {
    id: '2',
    name: 'Roshan Bandara',
    role: 'Housekeeping Attendant',
    shift: 'Morning (07:00 - 15:30)',
    floor: 'Floor 1 & 2',
    status: 'On Duty',
    assignedRooms: ['102', '201', '204', '401'],
    completedToday: 4,
    avatar: 'RB',
    phone: '+94 71 889 1234'
  },
  {
    id: '3',
    name: 'Sunethra Perera',
    role: 'Floor Supervisor',
    shift: 'General (08:00 - 16:30)',
    floor: 'Floor 3 & 4',
    status: 'On Duty',
    assignedRooms: ['103', '106', '203', '302', '304'],
    completedToday: 6,
    avatar: 'SP',
    phone: '+94 76 543 9012'
  },
  {
    id: '4',
    name: 'Nuwan Kumara',
    role: 'Maintenance Attendant',
    shift: 'Evening (14:00 - 22:30)',
    floor: 'All Floors',
    status: 'On Duty',
    assignedRooms: ['105', '303', '402'],
    completedToday: 3,
    avatar: 'NK',
    phone: '+94 78 654 3210'
  }
];

export const defaultChecklist = [
  { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: false },
  { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: false },
  { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: false },
  { id: 'c4', label: 'Restock minibar, coffee pods, tea & complimentary water', completed: false },
  { id: 'c5', label: 'Vacuum carpets and mop hard floor surfaces', completed: false },
  { id: 'c6', label: 'Check lighting, TV remotes, AC temperature & safe lock', completed: false },
  { id: 'c7', label: 'Final room fragrance & supervisor inspection readiness', completed: false }
];

export let housekeepingTasks = [
  {
    id: 'HK-101',
    roomNumber: '104',
    roomType: 'Deluxe',
    floor: 1,
    taskType: 'Checkout Turnover',
    priority: 'High',
    stage: 'In Progress',
    assignedTo: 'Kamani Silva',
    dueTime: '13:30',
    startedAt: '12:15',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: true },
      { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: true },
      { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: true },
      { id: 'c4', label: 'Restock minibar, coffee pods, tea & water', completed: false },
      { id: 'c5', label: 'Vacuum carpets and mop hard floors', completed: false },
      { id: 'c6', label: 'Final room fragrance & supervisor check', completed: false }
    ],
    notes: 'New guest arriving at 14:00. Fast turnaround required.'
  },
  {
    id: 'HK-102',
    roomNumber: '204',
    roomType: 'Deluxe',
    floor: 2,
    taskType: 'Deep Clean',
    priority: 'Normal',
    stage: 'In Progress',
    assignedTo: 'Roshan Bandara',
    dueTime: '14:00',
    startedAt: '12:30',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: true },
      { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: true },
      { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: false },
      { id: 'c4', label: 'Restock minibar, coffee pods, tea & water', completed: false },
      { id: 'c5', label: 'Vacuum carpets and mop hard floors', completed: false },
      { id: 'c6', label: 'Final room fragrance & supervisor check', completed: false }
    ],
    notes: 'Deep carpet shampoo and curtain dusting requested.'
  },
  {
    id: 'HK-103',
    roomNumber: '103',
    roomType: 'Suite',
    floor: 1,
    taskType: 'VIP Arrival Prep',
    priority: 'Urgent',
    stage: 'Inspection Required',
    assignedTo: 'Sunethra Perera',
    dueTime: '14:30',
    startedAt: '11:00',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: true },
      { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: true },
      { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: true },
      { id: 'c4', label: 'Restock minibar, coffee pods, tea & water', completed: true },
      { id: 'c5', label: 'Vacuum carpets and mop hard floors', completed: true },
      { id: 'c6', label: 'Final room fragrance & supervisor check', completed: false }
    ],
    notes: 'VIP Guest Maya Wickramasinghe. Welcome fruit basket & wine set placed.'
  },
  {
    id: 'HK-104',
    roomNumber: '202',
    roomType: 'Deluxe',
    floor: 2,
    taskType: 'Stayover Daily Clean',
    priority: 'Normal',
    stage: 'Dirty / Needs Clean',
    assignedTo: 'Kamani Silva',
    dueTime: '15:00',
    startedAt: null,
    checklist: [
      { id: 'c1', label: 'Make bed and arrange pillows', completed: false },
      { id: 'c2', label: 'Clean bathroom and replace used towels', completed: false },
      { id: 'c3', label: 'Empty bins and wipe surfaces', completed: false },
      { id: 'c4', label: 'Replenish mineral water and tea/coffee', completed: false }
    ],
    notes: 'Guest requested service after 14:00.'
  },
  {
    id: 'HK-105',
    roomNumber: '303',
    roomType: 'Suite',
    floor: 3,
    taskType: 'Full Turnover',
    priority: 'High',
    stage: 'Dirty / Needs Clean',
    assignedTo: 'Nuwan Kumara',
    dueTime: '16:00',
    startedAt: null,
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: false },
      { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: false },
      { id: 'c3', label: 'Replenish bath towels & bathrobes', completed: false },
      { id: 'c4', label: 'Restock minibar, coffee pods, tea & water', completed: false },
      { id: 'c5', label: 'Vacuum carpets and mop hard floors', completed: false }
    ],
    notes: 'Guest checked out late. Next arrival at 17:30.'
  },
  {
    id: 'HK-106',
    roomNumber: '101',
    roomType: 'Standard',
    floor: 1,
    taskType: 'Routine Clean',
    priority: 'Normal',
    stage: 'Clean & Ready',
    assignedTo: 'Kamani Silva',
    dueTime: '11:00',
    startedAt: '10:00',
    checklist: [
      { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: true },
      { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: true },
      { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: true },
      { id: 'c4', label: 'Restock minibar, coffee pods, tea & water', completed: true },
      { id: 'c5', label: 'Vacuum carpets and mop hard floors', completed: true }
    ],
    notes: 'Inspected and certified ready by Sunethra.'
  },
  {
    id: 'HK-107',
    roomNumber: '105',
    roomType: 'Standard',
    floor: 1,
    taskType: 'Maintenance Hold',
    priority: 'Normal',
    stage: 'Out of Order',
    assignedTo: 'Nuwan Kumara',
    dueTime: 'Tomorrow',
    startedAt: null,
    checklist: [
      { id: 'c1', label: 'HVAC repair', completed: false },
      { id: 'c2', label: 'Post-repair cleaning', completed: false }
    ],
    notes: 'AC fan coil unit needs parts replacement.'
  }
];

export let maintenanceIssues = [
  {
    id: 'MNT-401',
    roomNumber: '105',
    category: 'HVAC / Air Conditioning',
    title: 'AC unit blowing lukewarm air',
    severity: 'High',
    reportedBy: 'Kamani Silva (Housekeeping)',
    reportedAt: 'Today, 08:30 AM',
    assignedTechnician: 'Nuwan Kumara (Engineering)',
    status: 'In Progress',
    notes: 'Compressor valve needs replacement. Parts ordered.'
  },
  {
    id: 'MNT-402',
    roomNumber: '402',
    category: 'Plumbing',
    title: 'Jacuzzi jet drainage valve blocked',
    severity: 'Urgent',
    reportedBy: 'Sunethra Perera (Supervisor)',
    reportedAt: 'Yesterday, 04:15 PM',
    assignedTechnician: 'Dhammika Silva (Plumbing)',
    status: 'Pending Parts',
    notes: 'High-end penthouse suite. Must be ready before Friday booking.'
  },
  {
    id: 'MNT-403',
    roomNumber: '202',
    category: 'Electrical & Lighting',
    title: 'Balcony ambient spotlight flickering',
    severity: 'Low',
    reportedBy: 'Roshan Bandara (Attendant)',
    reportedAt: 'Today, 11:20 AM',
    assignedTechnician: 'Nuwan Kumara',
    status: 'Open',
    notes: 'Bulb connector loose, quick replacement needed.'
  }
];

export let inventorySupplies = [
  { id: 'INV-01', item: 'Egyptian Cotton Bed Sheets (King)', category: 'Linen', inStock: 64, minRequired: 40, unit: 'Sets', status: 'In Stock' },
  { id: 'INV-02', item: 'Egyptian Cotton Bed Sheets (Queen)', category: 'Linen', inStock: 48, minRequired: 35, unit: 'Sets', status: 'In Stock' },
  { id: 'INV-03', item: 'Luxury Bath Towels (White 600 GSM)', category: 'Towels', inStock: 120, minRequired: 80, unit: 'Pcs', status: 'In Stock' },
  { id: 'INV-04', item: 'Hand Towels & Washcloths', category: 'Towels', inStock: 32, minRequired: 50, unit: 'Pcs', status: 'Low Stock' },
  { id: 'INV-05', item: 'Spa Bathrobes (Velour / Waffle)', category: 'Apparel', inStock: 28, minRequired: 25, unit: 'Pcs', status: 'In Stock' },
  { id: 'INV-06', item: 'Herbal Shampoo & Body Wash (250ml)', category: 'Toiletries', inStock: 18, minRequired: 45, unit: 'Bottles', status: 'Reorder Needed' },
  { id: 'INV-07', item: 'Bamboo Dental Kits & Vanity Packs', category: 'Amenities', inStock: 85, minRequired: 60, unit: 'Kits', status: 'In Stock' },
  { id: 'INV-08', item: 'Mineral Spring Bottled Water (500ml)', category: 'Minibar', inStock: 140, minRequired: 100, unit: 'Bottles', status: 'In Stock' },
  { id: 'INV-09', item: 'Specialty Coffee Pods (Nespresso)', category: 'Minibar', inStock: 42, minRequired: 50, unit: 'Boxes', status: 'Low Stock' },
  { id: 'INV-10', item: 'Plush Disposable Guest Slippers', category: 'Amenities', inStock: 110, minRequired: 70, unit: 'Pairs', status: 'In Stock' }
];

// --- Task helpers ---
export function findTaskById(id) {
  if (!id) return null;
  const strId = String(id).trim();
  return housekeepingTasks.find(t => String(t.id) === strId || String(t.roomNumber) === strId);
}

export function addTask(taskData) {
  const newTask = {
    id: taskData.id || `HK-${Math.floor(100 + Math.random() * 900)}`,
    roomNumber: String(taskData.roomNumber),
    roomType: taskData.roomType || 'Standard',
    floor: Number(taskData.floor) || (taskData.roomNumber ? parseInt(String(taskData.roomNumber)[0], 10) : 1),
    taskType: taskData.taskType || 'Daily Turnover',
    priority: taskData.priority || 'Normal',
    stage: taskData.stage || 'Dirty / Needs Clean',
    assignedTo: taskData.assignedTo || (housekeepingStaff[0]?.name || 'Kamani Silva'),
    dueTime: taskData.dueTime || '15:00',
    startedAt: taskData.startedAt || null,
    checklist: Array.isArray(taskData.checklist) && taskData.checklist.length > 0 ? taskData.checklist : defaultChecklist.map(c => ({ ...c })),
    notes: taskData.notes || ''
  };

  housekeepingTasks.unshift(newTask);
  return newTask;
}

export function updateTask(id, updates) {
  const task = findTaskById(id);
  if (task) {
    if (updates.id !== undefined) delete updates.id;
    if (updates.floor !== undefined) updates.floor = Number(updates.floor);
    Object.assign(task, updates);
  }
  return task;
}

export function deleteTask(id) {
  const index = housekeepingTasks.findIndex(t => String(t.id) === String(id) || String(t.roomNumber) === String(id));
  if (index > -1) {
    return housekeepingTasks.splice(index, 1)[0];
  }
  return null;
}

// --- Staff helpers ---
export function findStaffById(id) {
  if (!id) return null;
  const strId = String(id).trim();
  return housekeepingStaff.find(s => String(s.id) === strId || s.name.toLowerCase() === strId.toLowerCase());
}

export function addStaff(staffData) {
  const numericIds = housekeepingStaff.map(s => parseInt(s.id, 10)).filter(n => !isNaN(n));
  const nextId = numericIds.length ? String(Math.max(...numericIds) + 1) : '1';

  const newStaff = {
    id: staffData.id ? String(staffData.id) : nextId,
    name: staffData.name,
    role: staffData.role || 'Housekeeping Attendant',
    shift: staffData.shift || 'Morning (07:00 - 15:30)',
    floor: staffData.floor || 'Floor 1 & 2',
    status: staffData.status || 'On Duty',
    assignedRooms: Array.isArray(staffData.assignedRooms) ? staffData.assignedRooms : [],
    completedToday: Number(staffData.completedToday) || 0,
    avatar: staffData.avatar || (staffData.name ? staffData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : 'HK'),
    phone: staffData.phone || ''
  };

  housekeepingStaff.push(newStaff);
  return newStaff;
}

export function updateStaff(id, updates) {
  const member = findStaffById(id);
  if (member) {
    if (updates.id !== undefined) delete updates.id;
    Object.assign(member, updates);
  }
  return member;
}

export function deleteStaff(id) {
  const index = housekeepingStaff.findIndex(s => String(s.id) === String(id));
  if (index > -1) {
    return housekeepingStaff.splice(index, 1)[0];
  }
  return null;
}

// --- Maintenance helpers ---
export function findMaintenanceById(id) {
  if (!id) return null;
  const strId = String(id).trim();
  return maintenanceIssues.find(m => String(m.id) === strId);
}

export function addMaintenance(issueData) {
  const newIssue = {
    id: issueData.id || `MNT-${Math.floor(400 + Math.random() * 500)}`,
    roomNumber: String(issueData.roomNumber),
    category: issueData.category || 'General Repair',
    title: issueData.title,
    severity: issueData.severity || 'Normal',
    reportedBy: issueData.reportedBy || 'Staff Member',
    reportedAt: issueData.reportedAt || 'Today, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    assignedTechnician: issueData.assignedTechnician || 'Nuwan Kumara',
    status: issueData.status || 'Open',
    notes: issueData.notes || ''
  };

  maintenanceIssues.unshift(newIssue);
  return newIssue;
}

export function updateMaintenance(id, updates) {
  const issue = findMaintenanceById(id);
  if (issue) {
    if (updates.id !== undefined) delete updates.id;
    Object.assign(issue, updates);
  }
  return issue;
}

export function deleteMaintenance(id) {
  const index = maintenanceIssues.findIndex(m => String(m.id) === String(id));
  if (index > -1) {
    return maintenanceIssues.splice(index, 1)[0];
  }
  return null;
}

// --- Inventory helpers ---
export function findInventoryById(id) {
  if (!id) return null;
  const strId = String(id).trim();
  return inventorySupplies.find(i => String(i.id) === strId);
}

export function addInventory(itemData) {
  const numericIds = inventorySupplies.map(i => parseInt(i.id.replace(/[^0-9]/g, ''), 10)).filter(n => !isNaN(n));
  const nextNum = numericIds.length ? Math.max(...numericIds) + 1 : 1;
  const idStr = itemData.id || `INV-${String(nextNum).padStart(2, '0')}`;

  const inStock = Number(itemData.inStock) || 0;
  const minRequired = Number(itemData.minRequired) || 10;
  let status = itemData.status;
  if (!status) {
    if (inStock >= minRequired) status = 'In Stock';
    else if (inStock > 0) status = 'Low Stock';
    else status = 'Reorder Needed';
  }

  const newItem = {
    id: idStr,
    item: itemData.item,
    category: itemData.category || 'General',
    inStock,
    minRequired,
    unit: itemData.unit || 'Pcs',
    status
  };

  inventorySupplies.push(newItem);
  return newItem;
}

export function updateInventory(id, updates) {
  const item = findInventoryById(id);
  if (item) {
    if (updates.id !== undefined) delete updates.id;
    if (updates.inStock !== undefined) updates.inStock = Number(updates.inStock);
    if (updates.minRequired !== undefined) updates.minRequired = Number(updates.minRequired);

    Object.assign(item, updates);

    // Recalculate status if inStock/minRequired changed and status was not explicitly overridden
    if (updates.inStock !== undefined || updates.minRequired !== undefined) {
      if (!updates.status) {
        if (item.inStock >= item.minRequired) item.status = 'In Stock';
        else if (item.inStock > 0) item.status = 'Low Stock';
        else item.status = 'Reorder Needed';
      }
    }
  }
  return item;
}

export function restockInventory(id, addedQuantity) {
  const item = findInventoryById(id);
  if (item) {
    const qty = Number(addedQuantity) || (item.category === 'Linen' || item.category === 'Towels' ? 20 : 30);
    item.inStock += qty;
    if (item.inStock >= item.minRequired) {
      item.status = 'In Stock';
    } else {
      item.status = 'Low Stock';
    }
  }
  return item;
}

export function deleteInventory(id) {
  const index = inventorySupplies.findIndex(i => String(i.id) === String(id));
  if (index > -1) {
    return inventorySupplies.splice(index, 1)[0];
  }
  return null;
}
