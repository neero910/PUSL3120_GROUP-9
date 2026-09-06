const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/$/, '')

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const contentType = response.headers.get('content-type') || ''
  const body = contentType.includes('application/json') ? await response.json() : null

  if (!response.ok) {
    throw new Error(body?.message || `Request failed with status ${response.status}`)
  }

  return body
}

function listFromResponse(body) {
  return Array.isArray(body) ? body : body?.data || []
}

function normalizePayment(payment = {}) {
  const guest = payment.guest || {}
  const invoice = payment.invoice || {}
  const status = payment.status === 'Completed' ? 'Paid' : payment.status
  return {
    id: payment.paymentNumber || payment.id || payment._id,
    guest: guest.fullName || `${guest.firstName || ''} ${guest.lastName || ''}`.trim() || 'Unknown guest',
    invoice: invoice.invoiceNumber || invoice.id || invoice._id || 'N/A',
    amount: `LKR ${Number(payment.amount || 0).toLocaleString()}`,
    method: payment.paymentMethod || payment.method || 'N/A',
    date: String(payment.paymentDate || payment.date || '').slice(0, 10),
    status: status || 'Pending',
  }
}

export const api = {
  async getMenuItems() {
    return listFromResponse(await request('/menu-items'))
  },
  async createOrder(order) {
    return request('/orders', { method: 'POST', body: JSON.stringify(order) })
  },
  async getPayments() {
    return listFromResponse(await request('/payments')).map(normalizePayment)
  },
  async markPaymentAsPaid(paymentId) {
    return request(`/payments/${encodeURIComponent(paymentId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'Paid' }),
    })
  },
  async getInvoices() {
    return listFromResponse(await request('/invoices'))
  },
}
