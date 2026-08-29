import { useEffect, useMemo, useState } from 'react'
import PageHeader from '../components/layout/PageHeader'
import { api } from '../api/client'

const categories = ['All', 'Breakfast', 'Main Course', 'Beverages', 'Desserts']

function Restaurant() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [foodItems, setFoodItems] = useState([])
  const [cart, setCart] = useState([])
  const [room, setRoom] = useState('305')
  const [orderNote, setOrderNote] = useState('')
  const [orderMessage, setOrderMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getMenuItems()
      .then(setFoodItems)
      .catch((loadError) => setError(loadError.message))
      .finally(() => setIsLoading(false))
  }, [])

  const visibleItems = useMemo(
    () => selectedCategory === 'All'
      ? foodItems
      : foodItems.filter((item) => item.category === selectedCategory),
    [foodItems, selectedCategory],
  )

  const amountValue = (amount) => Number(String(amount).replace(/[^0-9.-]/g, ''))
  const total = cart.reduce((sum, item) => sum + amountValue(item.price) * item.quantity, 0)
  const formatPrice = (price) => `LKR ${amountValue(price).toLocaleString()}`

  function addToCart(item) {
    setOrderMessage('')
    setCart((currentCart) => {
      const existingItem = currentCart.find((cartItem) => cartItem.name === item.name)
      if (existingItem) {
        return currentCart.map((cartItem) => cartItem.name === item.name
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem)
      }
      return [...currentCart, { ...item, quantity: 1 }]
    })
  }

  function changeQuantity(itemName, change) {
    setCart((currentCart) => currentCart
      .map((item) => item.name === itemName ? { ...item, quantity: item.quantity + change } : item)
      .filter((item) => item.quantity > 0))
  }

  async function placeOrder() {
    if (!cart.length) return
    setIsSubmitting(true)
    setError('')
    try {
      await api.createOrder({ room, note: orderNote, items: cart, total })
      setOrderMessage(`Order sent to room ${room}`)
      setCart([])
      setOrderNote('')
    } catch (submitError) {
      setError(submitError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="page-stack">
      <PageHeader title="Restaurant" subtitle="Build and send an in-room dining order" />

      <div className="restaurant-layout">
        <div className="panel">
          <div className="panel-heading">
            <h3>Categories</h3>
          </div>
          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={`category-chip ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="menu-grid">
            {isLoading && <p className="muted-text">Loading menu...</p>}
            {!isLoading && !visibleItems.length && <p className="empty-state">No menu items available.</p>}
            {visibleItems.map((item) => (
              <div key={item.name} className="menu-item">
                <div>
                  <strong>{item.name}</strong>
                  <span className="menu-category">{item.category}</span>
                </div>
                <span className="menu-price">{formatPrice(item.price)}</span>
                <button type="button" className="secondary-button small-button" onClick={() => addToCart(item)}>Add to order</button>
              </div>
            ))}
          </div>
        </div>

        <div className="panel order-panel">
          <div className="panel-heading">
            <h3>Current order</h3>
            <p className="muted-text">{cart.length ? `${cart.reduce((sum, item) => sum + item.quantity, 0)} items selected` : 'No items selected'}</p>
          </div>

          <div className="order-items">
            {cart.map((item) => (
              <div className="order-row" key={item.name}>
                <div><span>{item.name}</span><small>{formatPrice(item.price)} each</small></div>
                <div className="quantity-control">
                  <button type="button" onClick={() => changeQuantity(item.name, -1)} aria-label={`Remove one ${item.name}`}>-</button>
                  <strong>{item.quantity}</strong>
                  <button type="button" onClick={() => changeQuantity(item.name, 1)} aria-label={`Add one ${item.name}`}>+</button>
                </div>
              </div>
            ))}
            {!cart.length && <p className="empty-state">Choose a menu item to begin.</p>}
          </div>

          <div className="order-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          <label className="field-label" htmlFor="room-number">Deliver to room</label>
          <select id="room-number" value={room} onChange={(event) => setRoom(event.target.value)}>
            <option>305</option>
            <option>210</option>
            <option>118</option>
            <option>408</option>
          </select>
          <label className="field-label" htmlFor="order-note">Special instructions</label>
          <textarea id="order-note" value={orderNote} onChange={(event) => setOrderNote(event.target.value)} placeholder="Optional note for the kitchen" rows="2" />
          <button type="button" className="primary-button full-button" onClick={placeOrder} disabled={!cart.length || isSubmitting}>{isSubmitting ? 'Sending...' : 'Place order'}</button>
          {orderMessage && <p className="success-message" role="status">{orderMessage}</p>}
          {error && <p className="error-message" role="alert">{error}</p>}
        </div>
      </div>
    </div>
  )
}

export default Restaurant
