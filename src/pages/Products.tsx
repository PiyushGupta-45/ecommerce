import { useMemo, useState } from 'react'
import { ProductCard } from '../components/ProductCard'
import { useProducts } from '../context/ProductContext'

export function Products() {
  const { products, loading } = useProducts()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesQuery =
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      const matchesCategory = category === 'all' || product.category === category
      return matchesQuery && matchesCategory
    })
  }, [query, category])

  const categories = ['all', ...new Set(products.map((p) => p.category))]

  return (
    <div className="page">
      <section className="section">
        <div className="filters">
          <input
            placeholder="Search products"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
        {loading ? (
          <p className="muted">Loading products…</p>
        ) : filtered.length === 0 ? (
          <p className="muted">No products match your filters.</p>
        ) : (
          <div className="grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

