import { useState, useEffect } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { searchActiveGuest, getCheckOutDetails, processCheckOut, applyDiscount } from '../services/checkOutService'

function CheckOut() {
  const [searchQuery, setSearchQuery] = useState('')
  const [checkOutDetails, setCheckOutDetails] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('Cash')
  const [discountAmount, setDiscountAmount] = useState(0)
  const [discountReason, setDiscountReason] = useState('')
  const [applyingDiscount, setApplyingDiscount] = useState(false)

  // Handle search for active guest
  const handleSearch = async (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      await performSearch()
    }
  }

  // Perform search
  const performSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a guest name or room number')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const result = await searchActiveGuest(searchQuery)
      
      if (result && result.guestId) {
        const details = await getCheckOutDetails(result.guestId)
        setCheckOutDetails(details)
        setDiscountAmount(0)
        setDiscountReason('')
      } else {
        setError('Active guest not found. Please check the guest name or room number.')
        setCheckOutDetails(null)
      }
    } catch (err) {
      setError(err.message || 'Failed to search for guest')
      setCheckOutDetails(null)
    } finally {
      setLoading(false)
    }
  }

  // Handle apply discount
  const handleApplyDiscount = async () => {
    if (!checkOutDetails || !discountAmount) {
      setError('Please enter a discount amount')
      return
    }

    setApplyingDiscount(true)
    setError(null)

    try {
      const result = await applyDiscount(checkOutDetails.guestId, {
        amount: parseFloat(discountAmount),
        reason: discountReason,
        approvedBy: 'Staff',
      })

      setCheckOutDetails(result)
      setDiscountAmount(0)
      setDiscountReason('')
    } catch (err) {
      setError(err.message || 'Failed to apply discount')
    } finally {
      setApplyingDiscount(false)
    }
  }

  // Handle complete check-out
  const handleCompleteCheckOut = async () => {
    if (!checkOutDetails) return

    setProcessing(true)
    setError(null)

    try {
      const checkOutData = {
        guestId: checkOutDetails.guestId,
        reservationId: checkOutDetails.reservationId,
        checkOutTime: new Date().toISOString(),
        paymentMethod,
        totalAmount: checkOutDetails.totalCharges,
        paymentDetails: {
          method: paymentMethod,
          amount: checkOutDetails.totalCharges,
          transactionId: '',
          reference: '',
        },
        notes: '',
      }

      const result = await processCheckOut(checkOutData)
      
      setSuccess(true)
      setCheckOutDetails(null)
      setSearchQuery('')
      setPaymentMethod('Cash')
      
      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.message || 'Failed to process check-out')
    } finally {
      setProcessing(false)
    }
  }

  // Clear search
  const handleClearSearch = () => {
    setSearchQuery('')
    setCheckOutDetails(null)
    setError(null)
    setSuccess(false)
    setDiscountAmount(0)
    setDiscountReason('')
  }

  // Calculate total with applied discount
  const calculateTotal = () => {
    if (!checkOutDetails) return 0
    const subtotal = checkOutDetails.totalCharges || 0
    const discount = parseFloat(discountAmount) || 0
    return Math.max(0, subtotal - discount)
  }

  return (
    <div className="page-stack">
      <PageHeader title="Check-Out" subtitle="Finalize guest departure and settlement" />

      {success && (
        <div className="alert alert-success" role="alert">
          ✓ Check-out completed successfully!
        </div>
      )}

      {error && (
        <div className="alert alert-error" role="alert">
          ⚠ {error}
        </div>
      )}

      <div className="panel form-panel">
        <div className="toolbar row-gap">
          <div className="search-box wide-search">
            <span>⌕</span>
            <input
              type="text"
              placeholder="Search Guest Name or Room Number"
              aria-label="Search Guest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
              disabled={loading}
            />
            <button
              onClick={performSearch}
              disabled={loading || !searchQuery.trim()}
              className="search-btn"
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
            {searchQuery && (
              <button onClick={handleClearSearch} className="clear-btn">
                Clear
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <p>Loading guest check-out details...</p>
          </div>
        ) : checkOutDetails ? (
          <>
            <div className="checkout-summary">
              <div className="checkout-row">
                <span>Guest</span>
                <strong>{checkOutDetails.guestName}</strong>
              </div>
              <div className="checkout-row">
                <span>Room</span>
                <strong>{checkOutDetails.roomNumber}</strong>
              </div>
              <div className="checkout-row">
                <span>Reservation ID</span>
                <strong>{checkOutDetails.reservationId}</strong>
              </div>
              <div className="checkout-row">
                <span>Check-In Date</span>
                <strong>{checkOutDetails.checkInDate}</strong>
              </div>
              <div className="checkout-row">
                <span>Stay Duration</span>
                <strong>{checkOutDetails.numberOfNights} night(s)</strong>
              </div>
              <hr />
              <div className="checkout-row">
                <span>Room Charges</span>
                <strong>{checkOutDetails.roomCharges}</strong>
              </div>
              <div className="checkout-row">
                <span>Restaurant Charges</span>
                <strong>{checkOutDetails.restaurantCharges}</strong>
              </div>
              <div className="checkout-row">
                <span>Additional Charges</span>
                <strong>{checkOutDetails.additionalCharges}</strong>
              </div>
              <div className="checkout-row">
                <span>Subtotal</span>
                <strong>{checkOutDetails.subtotal}</strong>
              </div>
              
              {checkOutDetails.discount && (
                <div className="checkout-row">
                  <span>Discount</span>
                  <strong>-{checkOutDetails.discount}</strong>
                </div>
              )}
              
              <div className="checkout-row total-row">
                <span>Total Due</span>
                <strong>{checkOutDetails.totalCharges}</strong>
              </div>
            </div>

            <div className="discount-section">
              <h3>Apply Discount (Optional)</h3>
              <div className="discount-inputs">
                <input
                  type="number"
                  placeholder="Discount Amount"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(e.target.value)}
                  disabled={applyingDiscount}
                />
                <input
                  type="text"
                  placeholder="Reason for Discount"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  disabled={applyingDiscount}
                />
                <button
                  onClick={handleApplyDiscount}
                  disabled={applyingDiscount || !discountAmount}
                  className="secondary-button"
                >
                  {applyingDiscount ? 'Applying...' : 'Apply'}
                </button>
              </div>
            </div>

            <div className="payment-method-box">
              <h3>Payment Method</h3>
              <div className="payment-options">
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="Cash"
                    checked={paymentMethod === 'Cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    checked={paymentMethod === 'Card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Card
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="Bank Transfer"
                    checked={paymentMethod === 'Bank Transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Bank Transfer
                </label>
                <label>
                  <input
                    type="radio"
                    name="payment"
                    value="Check"
                    checked={paymentMethod === 'Check'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Check
                </label>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p>Enter a guest name or room number to proceed with check-out</p>
          </div>
        )}

        {checkOutDetails && (
          <div className="form-actions">
            <button
              type="button"
              className="primary-button"
              onClick={handleCompleteCheckOut}
              disabled={processing}
            >
              {processing ? 'Processing...' : 'Complete Check-Out'}
            </button>
            <button
              type="button"
              className="secondary-button"
              onClick={handleClearSearch}
              disabled={processing}
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CheckOut
