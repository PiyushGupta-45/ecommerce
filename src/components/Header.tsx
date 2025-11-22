import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export function Header() {
  const { isAuthenticated, user, signout } = useAuth()
  const { items } = useCart()

  return (
    <header className="header">
      <Link to="/" className="logo">
        NovaCommerce
      </Link>
      <nav>
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Shop</NavLink>
        <NavLink to="/cart">Cart ({items.length})</NavLink>
        {isAuthenticated && <NavLink to="/orders">Orders</NavLink>}
      </nav>
      <div className="auth-controls">
        {isAuthenticated ? (
          <>
            <span className="welcome">Hi, {user?.name.split(' ')[0]}</span>
            <button onClick={signout} className="ghost-btn">
              Sign out
            </button>
          </>
        ) : (
          <Link to="/auth" className="primary-btn">
            Sign in
          </Link>
        )}
      </div>
    </header>
  )
}

