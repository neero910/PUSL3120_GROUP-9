import test from 'node:test'
import assert from 'node:assert/strict'

import app from '../server/server.js'
import { buildApiUrl, resolveApiData } from '../src/services/api.js'


test('buildApiUrl prefixes the configured API base', () => {
  assert.equal(buildApiUrl('/guests'), '/api/guests')
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
