import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CartItem from '../components/CartItem.jsx'
import Loader from '../components/Loader.jsx'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

function getItemPrice(item) {
  return (
    item.product?.discountPrice ??
    item.product?.salePrice ??
    item.product?.effectivePrice ??
    item.product?.price ??
    item.product?.mrp ??
    item.price ??
    0
  )
}

export default function CartPage() {
  const navigate = useNavigate()
  const { items, loading, error, updateItem, removeItem, refreshCart } = useCart()
  const [updatingId, setUpdatingId] = useState(null)
  const [requiresAuth, setRequiresAuth] = useState(false)

  useEffect(() => {
    refreshCart()
      .then(() => setRequiresAuth(false))
      .catch((err) => {
        if (err.response?.status === 401) {
          setRequiresAuth(true)
        }
      })
  }, [refreshCart])

  const handleUpdate = async (item, quantity) => {
    const productId = item.productId || item.product?._id || item.product?.id
    if (!productId) return
    setUpdatingId(productId)
    try {
      await updateItem(productId, quantity)
    } catch (err) {
      if (err.response?.status === 401) {
        setRequiresAuth(true)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const handleRemove = async (item) => {
    const productId = item.productId || item.product?._id || item.product?.id
    if (!productId) return
    setUpdatingId(productId)
    try {
      await removeItem(productId)
    } catch (err) {
      if (err.response?.status === 401) {
        setRequiresAuth(true)
      }
    } finally {
      setUpdatingId(null)
    }
  }

  const subtotal = useMemo(() => {
    return items.reduce((total, item) => total + getItemPrice(item) * (item.quantity || 1), 0)
  }, [items])
  const delivery = subtotal >= 15000 ? 0 : items.length ? 350 : 0
  const tax = Number((subtotal * 0.05).toFixed(2))
  const total = Number((subtotal + tax + delivery).toFixed(2))

  if (loading) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <Loader label="Loading cart..." />
      </section>
    )
  }

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">Your Cart</h1>
          <p className="mt-2 text-sm text-[#0e336b]/65">Review and adjust quantities before checkout.</p>

          {error ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">{error}</div>
          ) : null}

          {items.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-[#bce8f2] bg-white p-6 text-sm text-[#0e336b]/68">
              {requiresAuth ? (
                <div className="space-y-4">
                  <p>Please sign in to continue with checkout.</p>
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="rounded-full bg-[#0e336b] px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white"
                  >
                    Sign in
                  </button>
                </div>
              ) : (
                'Your cart is empty. Add products to continue.'
              )}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {items.map((item) => {
                const itemId = item.productId || item.product?._id || item.product?.id
                return (
                  <CartItem
                    key={itemId}
                    item={item}
                    onUpdate={handleUpdate}
                    onRemove={handleRemove}
                    isUpdating={updatingId === itemId}
                  />
                )
              })}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-3xl border border-[#bdeaf2] bg-white p-6 shadow-[0_20px_55px_-40px_rgba(14,51,107,0.4)]">
          <h2 className="heading-font text-2xl font-semibold text-[#0e336b]">Price Breakdown</h2>

          <div className="mt-5 space-y-3 text-sm text-[#0e336b]/70">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax (5%)</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{delivery === 0 ? 'Free' : formatPrice(delivery)}</span>
            </div>
            <div className="h-px bg-[#d7edf3]" />
            <div className="flex items-center justify-between text-base font-semibold text-[#0e336b]">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={items.length === 0}
            className="mt-6 w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#19559f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </section>
  )
}
