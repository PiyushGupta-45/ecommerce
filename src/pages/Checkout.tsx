import { useState } from 'react'
import type { FormEvent } from 'react'
import { useCart } from '../context/CartContext'
import { useOrders } from '../context/OrderContext'
import type { Address, PaymentDetails } from '../types'

const emptyAddress: Address = {
  fullName: '',
  phone: '',
  street: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
}

const emptyPayment: PaymentDetails = {
  cardholder: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
}

export function Checkout() {
  const { items, total, clearCart } = useCart()
  const { createOrder } = useOrders()

  const [address, setAddress] = useState<Address>(emptyAddress)
  const [payment, setPayment] = useState<PaymentDetails>(emptyPayment)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="page">
        <section className="section">
          <h2>Checkout</h2>
          <p className="muted">Your cart is empty.</p>
        </section>
      </div>
    )
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('processing')
    setMessage(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 600))

      const paymentReference = `PAY-${Math.floor(Math.random() * 900000 + 100000)}`
      const order = await createOrder({
        items,
        address,
        paymentReference,
      })
      clearCart()
      setStatus('success')
      setMessage(`Payment successful! Your order ${order._id} is now processing.`)
    } catch (error) {
      console.error(error)
      setStatus('error')
      setMessage('Payment failed. Please try again.')
    }
  }

  return (
    <div className="page">
      <section className="section">
        <h2>Secure checkout</h2>
        <form className="checkout-grid" onSubmit={handleSubmit}>
          <fieldset>
            <legend>Shipping details</legend>
            <label>
              Full name
              <input value={address.fullName} onChange={(e) => setAddress({ ...address, fullName: e.target.value })} required />
            </label>
            <label>
              Phone
              <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} required />
            </label>
            <label>
              Street
              <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            </label>
            <div className="split">
              <label>
                City
                <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              </label>
              <label>
                State
                <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
              </label>
            </div>
            <div className="split">
              <label>
                Postal code
                <input value={address.postalCode} onChange={(e) => setAddress({ ...address, postalCode: e.target.value })} required />
              </label>
              <label>
                Country
                <input value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
              </label>
            </div>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <label>
              Cardholder
              <input value={payment.cardholder} onChange={(e) => setPayment({ ...payment, cardholder: e.target.value })} required />
            </label>
            <label>
              Card number
              <input value={payment.cardNumber} onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })} required />
            </label>
            <div className="split">
              <label>
                Expiry
                <input value={payment.expiry} onChange={(e) => setPayment({ ...payment, expiry: e.target.value })} required />
              </label>
              <label>
                CVV
                <input value={payment.cvv} onChange={(e) => setPayment({ ...payment, cvv: e.target.value })} required />
              </label>
            </div>
            <button className="primary-btn full" disabled={status === 'processing'}>
              {status === 'processing' ? 'Processing…' : `Pay $${total.toFixed(2)}`}
            </button>
            {message && <p className={status === 'success' ? 'success' : 'error'}>{message}</p>}
          </fieldset>

          <aside className="summary-card">
            <h3>Order summary</h3>
            <ul>
              {items.map((item) => (
                <li key={item.product._id}>
                  <span>
                    {item.product.name} × {item.quantity}
                  </span>
                  <strong>${(item.product.price * item.quantity).toFixed(2)}</strong>
                </li>
              ))}
            </ul>
            <div className="total">
              <span>Total</span>
              <strong>${total.toFixed(2)}</strong>
            </div>
          </aside>
        </form>
      </section>
    </div>
  )
}

