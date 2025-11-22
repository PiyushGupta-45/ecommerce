import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export function Cart() {
  const { items, total, updateQuantity, removeItem } = useCart()

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Your bag</p>
            <h2>Cart summary</h2>
          </div>
          {items.length > 0 && (
            <Link className="primary-btn" to="/checkout">
              Proceed to checkout
            </Link>
          )}
        </div>

        {items.length === 0 && <p className="muted">No items yet. Browse the shop to get started.</p>}

        <div className="cart-list">
          {items.map((item) => (
            <article key={item.product._id} className="cart-card">
              <img src={item.product.image} alt={item.product.name} />
              <div>
                <h3>{item.product.name}</h3>
                <p>{item.product.description}</p>
                <span className="price">${item.product.price.toFixed(2)}</span>
              </div>
              <div className="cart-actions">
                <label>
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(event) => updateQuantity(item.product._id, Number(event.target.value))}
                  />
                </label>
                <button onClick={() => removeItem(item.product._id)} className="ghost-btn">
                  Remove
                </button>
              </div>
            </article>
          ))}
        </div>

        {items.length > 0 && (
          <div className="summary-card">
            <p>Subtotal</p>
            <h3>${total.toFixed(2)}</h3>
            <p className="muted">Shipping and taxes are calculated at checkout.</p>
            <Link className="primary-btn full" to="/checkout">
              Checkout securely
            </Link>
          </div>
        )}
      </section>
    </div>
  )
}

