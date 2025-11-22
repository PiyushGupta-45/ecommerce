import { useOrders } from '../context/OrderContext'
import { OrderTimeline } from '../components/OrderTimeline'
import { useAuth } from '../context/AuthContext'
import { AdminProductPanel } from '../components/AdminProductPanel'

const statusProgression = ['processing', 'packed', 'shipped', 'out-for-delivery', 'delivered'] as const

export function Orders() {
  const { orders, loading, updateStatus } = useOrders()
  const { user } = useAuth()
  const isAdmin = user?.role === 'admin'

  const advanceStatus = async (orderId: string) => {
    const order = orders.find((o) => o._id === orderId)
    if (!order) return
    const currentIndex = statusProgression.indexOf(order.status)
    if (currentIndex < statusProgression.length - 1) {
      await updateStatus(orderId, statusProgression[currentIndex + 1])
    }
  }

  return (
    <div className="page">
      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">{isAdmin ? 'Operations' : 'Track'}</p>
            <h2>{isAdmin ? 'Order operations' : 'Your orders'}</h2>
          </div>
        </div>

        {loading && <p className="muted">Loading orders…</p>}
        {!loading && orders.length === 0 && (
          <p className="muted">No orders yet. Complete a checkout to see tracking updates.</p>
        )}

        <div className="order-list">
          {orders.map((order) => (
            <article key={order._id} className="order-card">
              <header>
                <div>
                  <p className="eyebrow">Order</p>
                  <h3>{order._id}</h3>
                  <p className="muted">Placed {new Date(order.createdAt).toLocaleString()}</p>
                </div>
                <div className="order-total">${order.total.toFixed(2)}</div>
              </header>

              <OrderTimeline order={order} />

              <div className="order-items">
                {order.items.map((item) => (
                  <div key={`${order._id}-${item.product}`}>
                    <strong>
                      {item.name} × {item.quantity}
                    </strong>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <footer>
                <p>
                  Shipping to <strong>{order.address.fullName}</strong>, {order.address.city}
                </p>
                {isAdmin && order.status !== 'delivered' && (
                  <button className="ghost-btn" onClick={() => advanceStatus(order._id)}>
                    Advance status
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
      </section>

      {isAdmin && <AdminProductPanel />}
    </div>
  )
}

