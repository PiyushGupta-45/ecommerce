import { useState } from 'react'
import type { FormEvent } from 'react'
import { useProducts } from '../context/ProductContext'

const initialForm = {
  name: '',
  description: '',
  image: '',
  price: '',
  stock: '',
  category: '',
  rating: '4.5',
}

export function AdminProductPanel() {
  const { products, createProduct, deleteProduct } = useProducts()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createProduct({
        name: form.name,
        description: form.description,
        image: form.image,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
        rating: Number(form.rating),
        tags: [],
      })
      setForm(initialForm)
    } catch (err) {
      setError('Unable to create product. Check your inputs and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="section admin-panel">
      <div className="section-header">
        <div>
          <p className="eyebrow">Admin</p>
          <h2>Product manager</h2>
        </div>
      </div>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="split">
          <label>
            Name
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            Category
            <input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          </label>
        </div>
        <label>
          Description
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        </label>
        <div className="split">
          <label>
            Image URL
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} required />
          </label>
          <label>
            Price
            <input type="number" min={0} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          </label>
        </div>
        <div className="split">
          <label>
            Stock
            <input type="number" min={0} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          </label>
          <label>
            Rating
            <input type="number" step="0.1" min={0} max={5} value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </label>
        </div>
        <button className="primary-btn" disabled={submitting}>
          {submitting ? 'Adding…' : 'Add product'}
        </button>
        {error && <p className="error">{error}</p>}
      </form>

      <div className="admin-products">
        {products.map((product) => (
          <div key={product._id} className="admin-product-row">
            <div>
              <strong>{product.name}</strong>
              <p className="muted">${product.price.toFixed(2)} • {product.stock} in stock</p>
            </div>
            <button className="ghost-btn" onClick={() => deleteProduct(product._id)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </section>
  )
}

