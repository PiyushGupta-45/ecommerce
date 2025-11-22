import type { Product } from '../types'
import { useCart } from '../context/CartContext'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const rating = product.rating ?? 4.8
  return (
    <article className="product-card">
      <div className="product-media">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className="badge">{product.category}</span>
      </div>
      <div className="product-body">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="product-meta">
          <span className="price">${product.price.toFixed(2)}</span>
          <span className="rating">★ {rating.toFixed(1)}</span>
        </div>
        <button className="primary-btn full" onClick={() => addItem(product)}>
          Add to cart
        </button>
      </div>
    </article>
  )
}

