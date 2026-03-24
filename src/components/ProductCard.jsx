import { motion as Motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingCart, Star } from 'lucide-react'
import { resolveAssetUrl } from '../services/api.js'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function ProductCard({ product, badgeLabel }) {
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { addToast } = useToast()

  const id = product._id || product.id
  const name = product.name || product.title || 'Product'
  const price = product.discountPrice ?? product.salePrice ?? product.price ?? product.mrp ?? 0
  const originalPrice = product.price ?? product.mrp
  const rating = Number(product.rating || 0).toFixed(1)
  const imageUrl = resolveAssetUrl(
    product.images?.[0] || product.image || product.imageUrl || product.thumbnail
  )
  const availableStock = Number(product.stock ?? 10)
  const isOutOfStock = availableStock <= 0

  const handleAddToCart = async (event) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      await addItem(id, 1)
      addToast(`${name} added to cart`, 'success')
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login', { state: { from: `/products/${id}` } })
        return
      }
      addToast(err.response?.data?.message || 'Unable to add to cart', 'error')
    }
  }

  return (
    <Motion.article whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Link
        to={`/products/${id}`}
        className="group flex h-full flex-col overflow-hidden rounded-3xl border border-[#bdeaf2] bg-white shadow-[0_18px_55px_-38px_rgba(14,51,107,0.45)] transition hover:border-[#7dd8ea]"
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#eef9fc]">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-[#0e336b]/50">No image</div>
          )}

          {badgeLabel ? (
            <span className="absolute left-3 top-3 rounded-full bg-[#0e336b] px-3 py-1 text-xs font-semibold text-white">
              {badgeLabel}
            </span>
          ) : null}

          <span
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${
              isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
              {isOutOfStock ? 'Out of stock' : `${availableStock} in stock`}
            </span>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#3f6e8a]">{product.category}</p>
            <h3 className="mt-1 heading-font text-lg font-semibold text-[#0e336b]">{name}</h3>
          </div>

          <div className="flex items-center gap-1 text-sm text-[#0e336b]/70">
            <Star className="h-4 w-4 fill-[#f4ba43] text-[#f4ba43]" />
            <span className="font-semibold">{rating}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3">
            <div>
              <p className="text-lg font-bold text-[#0e336b]">{formatPrice(price)}</p>
              {typeof originalPrice === 'number' && originalPrice > price ? (
                <p className="text-xs text-[#0e336b]/45 line-through">{formatPrice(originalPrice)}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className="inline-flex items-center gap-1 rounded-full bg-[#0e336b] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#1655a8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              Add
            </button>
          </div>
        </div>
      </Link>
    </Motion.article>
  )
}

export default ProductCard

