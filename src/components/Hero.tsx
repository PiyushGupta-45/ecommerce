import { Link } from 'react-router-dom'

export function Hero() {
  return (
    <section className="hero">
      <div>
        <p className="eyebrow">Holiday drops • Limited stock</p>
        <h1>Design-first commerce built for the modern shopper.</h1>
        <p className="muted">
          Discover curated collections, seamless checkout, and transparent order tracking – all in one place.
        </p>
        <div className="hero-actions">
          <Link to="/products" className="primary-btn">
            Shop new arrivals
          </Link>
          <Link to="/auth" className="ghost-btn">
            Join the club
          </Link>
        </div>
      </div>
      <div className="hero-card">
        <p>Trusted by over 25k shoppers</p>
        <div className="hero-metrics">
          <div>
            <span>890+</span>
            <small>products curated</small>
          </div>
          <div>
            <span>4.9/5</span>
            <small>average rating</small>
          </div>
          <div>
            <span>48h</span>
            <small>avg delivery</small>
          </div>
        </div>
      </div>
    </section>
  )
}

