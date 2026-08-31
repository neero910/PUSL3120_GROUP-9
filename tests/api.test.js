import test from 'node:test'
import assert from 'node:assert/strict'

import app from '../server/server.js'
import { buildApiUrl, resolveApiData } from '../src/services/api.js'

test('buildApiUrl prefixes the configured API base', () => {
  assert.equal(buildApiUrl('/guests'), '/api/guests')
  assert.equal(buildApiUrl('/rooms'), '/api/rooms')
  assert.equal(buildApiUrl('/housekeeping/tasks'), '/api/housekeeping/tasks')
})

test('resolveApiData returns mock data when the endpoint is unavailable', () => {
  const data = resolveApiData('guests', [
    { id: 1, name: 'Alice', status: 'Checked In' },
  ])

  assert.deepEqual(data, [
    { id: 1, name: 'Alice', status: 'Checked In' },
  ])
})

test('resolveApiData returns dashboard mock data when the dashboard endpoint is unavailable', () => {
  const fallbackDashboard = {
    stats: [{ label: 'Total Rooms', value: '30', change: '+2 this month' }],
    occupancyData: [{ label: 'Occupied', value: 60, color: '#1a73e8' }],
    todayCheckIns: [{ guest: 'Alice', room: '101', checkIn: '14:00', status: 'Confirmed' }],
    todayCheckOuts: [{ guest: 'Bob', room: '202', checkOut: '11:00', status: 'Scheduled' }],
    recentReservations: [{ id: 'RES-1001', guest: 'Charlie', room: '303', checkIn: '2026-08-20', checkOut: '2026-08-24', status: 'Confirmed' }],
  }

  assert.deepEqual(resolveApiData('dashboard', fallbackDashboard), fallbackDashboard)
})

test('restaurant and billing endpoints are exposed by the API', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    const menuResponse = await fetch(`http://127.0.0.1:${port}/api/menu-items`)
    const menu = await menuResponse.json()
    assert.equal(menuResponse.status, 200)
    assert.ok(Array.isArray(menu.data), 'menu items should be returned in a data array')
    assert.ok(menu.data.length > 0)

    const paymentResponse = await fetch(`http://127.0.0.1:${port}/api/payments`)
    const paymentData = await paymentResponse.json()
    assert.equal(paymentResponse.status, 200)
    assert.ok(Array.isArray(paymentData.data), 'payments should be returned in a data array')
    assert.ok(paymentData.data.length > 0)

    const invoiceResponse = await fetch(`http://127.0.0.1:${port}/api/invoices`)
    const invoiceData = await invoiceResponse.json()
    assert.equal(invoiceResponse.status, 200)
    assert.ok(Array.isArray(invoiceData.data), 'invoices should be returned in a data array')
    assert.ok(invoiceData.data.length > 0)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('check-in and check-out flows are exposed by the API', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    const checkInSearchResponse = await fetch(`http://127.0.0.1:${port}/api/check-in/search?query=RES001`)
    const checkInSearch = await checkInSearchResponse.json()
    assert.equal(checkInSearchResponse.status, 200)
    assert.equal(checkInSearch.id, 'RES001')

    const checkInConfirmResponse = await fetch(`http://127.0.0.1:${port}/api/check-in/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reservationId: 'RES001', guestId: 'G001', roomId: '103', checkInTime: '2026-08-30T12:00:00Z', notes: 'Late arrival' }),
    })
    const checkInConfirm = await checkInConfirmResponse.json()
    assert.equal(checkInConfirmResponse.status, 200)
    assert.equal(checkInConfirm.success, true)

    const checkOutSearchResponse = await fetch(`http://127.0.0.1:${port}/api/check-out/search?query=G001`)
    const checkOutSearch = await checkOutSearchResponse.json()
    assert.equal(checkOutSearchResponse.status, 200)
    assert.equal(checkOutSearch.guestId, 'G001')

    const checkOutProcessResponse = await fetch(`http://127.0.0.1:${port}/api/check-out/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestId: 'G001', reservationId: 'RES001', checkOutTime: '2026-09-02T11:00:00Z', paymentMethod: 'Card', totalAmount: 45000, paymentDetails: { method: 'Card', amount: 45000 }, notes: '' }),
    })
    const checkOutProcess = await checkOutProcessResponse.json()
    assert.equal(checkOutProcessResponse.status, 200)
    assert.equal(checkOutProcess.success, true)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('rooms management endpoints support full CRUD, filtering, quick status changes and statistics', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    // 1. Get all rooms
    const getAllRes = await fetch(`http://127.0.0.1:${port}/api/rooms`)
    const allRoomsData = await getAllRes.json()
    assert.equal(getAllRes.status, 200)
    assert.equal(allRoomsData.success, true)
    assert.ok(Array.isArray(allRoomsData.data))
    assert.ok(allRoomsData.data.length >= 16)

    // 2. Filter rooms by type & floor
    const filterRes = await fetch(`http://127.0.0.1:${port}/api/rooms?type=Deluxe&floor=1`)
    const filterData = await filterRes.json()
    assert.equal(filterRes.status, 200)
    assert.ok(filterData.data.every(r => r.type === 'Deluxe' && r.floor === 1))

    // 3. Room statistics summary
    const statsRes = await fetch(`http://127.0.0.1:${port}/api/rooms/stats/summary`)
    const statsData = await statsRes.json()
    assert.equal(statsRes.status, 200)
    assert.equal(statsData.success, true)
    assert.ok(statsData.data.totalRooms >= 16)
    assert.ok(statsData.data.occupancyRate.includes('%'))

    // 4. Create new room
    const testRoomNumber = `90${Math.floor(Math.random() * 90 + 10)}`
    const createRes = await fetch(`http://127.0.0.1:${port}/api/rooms`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomNumber: testRoomNumber,
        floor: 9,
        type: 'Penthouse',
        price: 60000,
        bedType: 'Master King',
        capacity: 4,
        view: 'Helipad & Skyline',
        amenities: ['Free WiFi', 'Private Terrace', 'Jacuzzi'],
        status: 'Available',
        assignedAttendant: 'Kamani Silva',
        notes: 'Top floor exclusive suite'
      })
    })
    const createData = await createRes.json()
    assert.equal(createRes.status, 201)
    assert.equal(createData.success, true)
    assert.equal(createData.data.roomNumber, testRoomNumber)
    const newRoomId = createData.data.id

    // 5. Get single room by ID
    const getSingleRes = await fetch(`http://127.0.0.1:${port}/api/rooms/${newRoomId}`)
    const singleData = await getSingleRes.json()
    assert.equal(getSingleRes.status, 200)
    assert.equal(singleData.data.roomNumber, testRoomNumber)

    // 6. Quick status change PATCH /api/rooms/:id/status
    const statusRes = await fetch(`http://127.0.0.1:${port}/api/rooms/${newRoomId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'Cleaning' })
    })
    const statusData = await statusRes.json()
    assert.equal(statusRes.status, 200)
    assert.equal(statusData.data.status, 'Cleaning')
    assert.equal(statusData.data.housekeepingStatus, 'In Progress')

    // 7. Update room details PUT /api/rooms/:id
    const updateRes = await fetch(`http://127.0.0.1:${port}/api/rooms/${newRoomId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ price: 65000, notes: 'Updated notes' })
    })
    const updateData = await updateRes.json()
    assert.equal(updateRes.status, 200)
    assert.equal(updateData.data.price, 65000)
    assert.equal(updateData.data.notes, 'Updated notes')

    // 8. Delete room
    const deleteRes = await fetch(`http://127.0.0.1:${port}/api/rooms/${newRoomId}`, {
      method: 'DELETE'
    })
    const deleteData = await deleteRes.json()
    assert.equal(deleteRes.status, 200)
    assert.equal(deleteData.success, true)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})

test('housekeeping management endpoints support tasks, staff roster, maintenance tickets, and inventory supply restocking', async () => {
  const server = app.listen(0)
  const { port } = server.address()

  try {
    // --- 1. Housekeeping Stats ---
    const statsRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/stats/summary`)
    const statsData = await statsRes.json()
    assert.equal(statsRes.status, 200)
    assert.equal(statsData.success, true)
    assert.ok(statsData.data.totalTasks >= 7)

    // --- 2. Tasks CRUD & Workflow ---
    const tasksRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/tasks`)
    const tasksData = await tasksRes.json()
    assert.equal(tasksRes.status, 200)
    assert.ok(Array.isArray(tasksData.data))
    assert.ok(tasksData.data.length >= 7)

    // Create task
    const createTaskRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomNumber: '106',
        taskType: 'VIP Turnover',
        priority: 'Urgent',
        stage: 'Dirty / Needs Clean',
        assignedTo: 'Kamani Silva',
        dueTime: '16:00',
        notes: 'VIP incoming'
      })
    })
    const createdTaskData = await createTaskRes.json()
    assert.equal(createTaskRes.status, 201)
    assert.equal(createdTaskData.success, true)
    const testTaskId = createdTaskData.data.id

    // Stage change (Kanban move)
    const stageRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/tasks/${testTaskId}/stage`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stage: 'In Progress' })
    })
    const stageData = await stageRes.json()
    assert.equal(stageRes.status, 200)
    assert.equal(stageData.data.stage, 'In Progress')
    assert.ok(stageData.data.startedAt)

    // Checklist update & certification
    const checklistRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/tasks/${testTaskId}/checklist`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        checklist: [
          { id: 'c1', label: 'Sanitize surfaces', completed: true }
        ],
        notes: 'Supervisor inspected',
        isCleanAndReady: true
      })
    })
    const checklistData = await checklistRes.json()
    assert.equal(checklistRes.status, 200)
    assert.equal(checklistData.data.stage, 'Clean & Ready')

    // Assign staff
    const assignRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/tasks/${testTaskId}/assign`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ assignedTo: 'Sunethra Perera', priority: 'High', dueTime: '17:00' })
    })
    const assignData = await assignRes.json()
    assert.equal(assignRes.status, 200)
    assert.equal(assignData.data.assignedTo, 'Sunethra Perera')

    // --- 3. Staff Roster Endpoints ---
    const staffRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/staff`)
    const staffData = await staffRes.json()
    assert.equal(staffRes.status, 200)
    assert.ok(Array.isArray(staffData.data))
    assert.ok(staffData.data.length >= 4)

    const createStaffRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/staff`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Anoma Wickrama',
        role: 'Housekeeping Attendant',
        shift: 'Morning',
        floor: 'Floor 1',
        phone: '+94 77 111 2233'
      })
    })
    const createStaffData = await createStaffRes.json()
    assert.equal(createStaffRes.status, 201)
    assert.equal(createStaffData.data.name, 'Anoma Wickrama')

    // --- 4. Maintenance Tickets Endpoints ---
    const mntRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/maintenance`)
    const mntData = await mntRes.json()
    assert.equal(mntRes.status, 200)
    assert.ok(Array.isArray(mntData.data))

    const createMntRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/maintenance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        roomNumber: '201',
        category: 'Plumbing',
        title: 'Bathroom sink leaking',
        severity: 'High',
        reportedBy: 'Kamani Silva',
        notes: 'Needs washer replacement'
      })
    })
    const createMntData = await createMntRes.json()
    assert.equal(createMntRes.status, 201)
    const newMntId = createMntData.data.id

    const resolveMntRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/maintenance/${newMntId}/resolve`, {
      method: 'PATCH'
    })
    const resolveMntData = await resolveMntRes.json()
    assert.equal(resolveMntRes.status, 200)
    assert.equal(resolveMntData.data.status, 'Resolved')

    // --- 5. Supply Inventory Endpoints ---
    const invRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/inventory`)
    const invData = await invRes.json()
    assert.equal(invRes.status, 200)
    assert.ok(Array.isArray(invData.data))
    assert.ok(invData.data.length >= 10)

    const restockRes = await fetch(`http://127.0.0.1:${port}/api/housekeeping/inventory/INV-01/restock`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: 20 })
    })
    const restockData = await restockRes.json()
    assert.equal(restockRes.status, 200)
    assert.ok(restockData.data.inStock >= 84)
  } finally {
    await new Promise((resolve) => server.close(resolve))
  }
})
