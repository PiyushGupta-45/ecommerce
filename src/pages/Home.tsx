import { Link } from 'react-router-dom'
import { Hero } from '../components/Hero'
import { FeatureGrid } from '../components/FeatureGrid'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'

export function Home() {
  const { products, loading } = useProducts()
  const featured = products.filter((product) => product.isFeatured).slice(0, 4)
  const display = featured.length > 0 ? featured : products.slice(0, 4)

  return (
    <div className="page">
      <Hero />
      <FeatureGrid />

      <section className="section">
        <div className="section-header">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h2>Featured drops</h2>
          </div>
          <Link to="/products" className="ghost-btn">
            View all
          </Link>
        </div>
        {loading ? (
          <p className="muted">Loading products…</p>
        ) : display.length === 0 ? (
          <p className="muted">No products yet.</p>
        ) : (
          <div className="grid">
            {display.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

