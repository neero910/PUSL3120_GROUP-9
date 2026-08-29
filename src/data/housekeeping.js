export const housekeepingStaff = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
]

export const defaultChecklist = [
  { id: 'c1', label: 'Strip and replace bed linen & pillowcases', completed: true },
  { id: 'c2', label: 'Sanitize and polish bathroom surfaces & mirrors', completed: true },
  { id: 'c3', label: 'Replenish bath towels, hand towels, and bathrobes', completed: false },
  { id: 'c4', label: 'Restock minibar, coffee pods, tea & complimentary water', completed: false },
  { id: 'c5', label: 'Vacuum carpets and mop hard floor surfaces', completed: false },
  { id: 'c6', label: 'Check lighting, TV remotes, AC temperature & safe lock', completed: false },
  { id: 'c7', label: 'Final room fragrance & supervisor inspection readiness', completed: false }
]

export const initialHousekeepingTasks = [
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
]

export const initialMaintenanceIssues = [
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
]

export const initialInventorySupplies = [
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
]

export const housekeepingStages = [
  { id: 'Dirty / Needs Clean', label: 'Needs Cleaning', icon: '🧹', color: '#ef4444' },
  { id: 'In Progress', label: 'Cleaning In Progress', icon: '⏳', color: '#f59e0b' },
  { id: 'Inspection Required', label: 'Inspection Required', icon: '🔍', color: '#8b5cf6' },
  { id: 'Clean & Ready', label: 'Clean & Ready', icon: '✓', color: '#16a34a' },
  { id: 'Out of Order', label: 'Out of Order / Maint.', icon: '🛠️', color: '#64748b' }
]
