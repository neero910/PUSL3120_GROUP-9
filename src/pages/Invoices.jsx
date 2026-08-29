import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { api } from '../api/client'

function Invoices() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  const [selectedInvoice, setSelectedInvoice] = useState(null)
  const [invoices, setInvoices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getInvoices()
      .then(setInvoices)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false))
  }, [])

  const filteredInvoices = useMemo(() => invoices.filter((invoice) => {
    const search = searchTerm.toLowerCase()
    const matchesSearch = [invoice.id, invoice.guest, invoice.room].some((value) => value.toLowerCase().includes(search))
    return matchesSearch && (statusFilter === 'All Status' || invoice.paymentStatus === statusFilter)
  }), [invoices, searchTerm, statusFilter])

  const outstandingTotal = invoices.filter((invoice) => invoice.paymentStatus === 'Pending').reduce((total, invoice) => total + Number(String(invoice.amount).replace(/[^0-9]/g, '')), 0)

  return (
    <div className="page-stack">
      <PageHeader
        title="Invoices"
        subtitle="Review balances, payment status, and guest billing details"
        actions={<button type="button" className="primary-button" onClick={() => setSelectedInvoice(invoices[0])} disabled={!invoices.length}>View latest invoice</button>}
      />

      <div className="summary-boxes">
        <div className="summary-box"><span>Total invoices</span><strong>{invoices.length}</strong><small>Issued records</small></div>
        <div className="summary-box summary-positive"><span>Paid invoices</span><strong>{invoices.filter((invoice) => invoice.paymentStatus === 'Paid').length}</strong><small>Settled accounts</small></div>
        <div className="summary-box summary-warning"><span>Outstanding</span><strong>LKR {outstandingTotal.toLocaleString()}</strong><small>Needs follow-up</small></div>
      </div>

      <div className="panel">
        <div className="toolbar row-gap ledger-toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input type="search" value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search invoice, guest or room" aria-label="Search invoices" />
          </div>
          <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label="Filter invoice status">
            <option>All Status</option>
            <option>Paid</option>
            <option>Pending</option>
          </select>
        </div>
        {error && <p className="error-message" role="alert">{error}</p>}
        <div className="table-caption">Showing {filteredInvoices.length} of {invoices.length} invoices</div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Guest</th>
                <th>Room</th>
                <th>Amount</th>
                <th>Issued Date</th>
                <th>Payment Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && <tr><td colSpan="7">Loading invoices...</td></tr>}
              {!isLoading && filteredInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.guest}</td>
                  <td>{invoice.room}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.issuedDate}</td>
                  <td>
                    <span className={`status-badge ${invoice.paymentStatus.toLowerCase().replace(/\s+/g, '-')}`}>{invoice.paymentStatus}</span>
                  </td>
                  <td>
                    <button type="button" className="secondary-button small-button" onClick={() => setSelectedInvoice(invoice)}>View details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredInvoices.length && <p className="empty-state">No invoices match these filters.</p>}
        </div>
        {selectedInvoice && (
          <div className="invoice-detail" role="status">
            <div><strong>{selectedInvoice.id}</strong><span>{selectedInvoice.guest} · Room {selectedInvoice.room}</span></div>
            <div><span>Balance</span><strong>{selectedInvoice.amount}</strong></div>
            <span className={`status-badge ${selectedInvoice.paymentStatus.toLowerCase()}`}>{selectedInvoice.paymentStatus}</span>
            <button type="button" className="text-button" onClick={() => setSelectedInvoice(null)}>Close details</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Invoices
