import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createOrder, verifyPayment } from '../services/orders.js'
import { useCart } from '../context/CartContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { getMyProfile } from '../services/customer.js'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

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

export default function CheckoutPage() {
  const navigate = useNavigate()
  const { items, clearCartState } = useCart()
  const { addToast } = useToast()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    postalCode: '',
    note: '',
    paymentMethod: 'Razorpay',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    getMyProfile()
      .then((profile) => {
        if (ignore || !profile) return

        const defaultAddress =
          profile.addresses?.find((address) => address.isDefault) ||
          profile.addresses?.[0]

        setForm((prev) => ({
          ...prev,
          name: prev.name || profile.fullName || '',
          email: prev.email || profile.email || '',
          line1: prev.line1 || defaultAddress?.line1 || '',
          city: prev.city || defaultAddress?.city || '',
          state: prev.state || defaultAddress?.state || '',
          postalCode: prev.postalCode || defaultAddress?.postalCode || '',
          phone: prev.phone || defaultAddress?.phone || '',
        }))
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  const totals = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + getItemPrice(item) * (item.quantity || 1), 0)
    const delivery = subtotal >= 15000 ? 0 : items.length ? 350 : 0
    const tax = Number((subtotal * 0.05).toFixed(2))
    const total = Number((subtotal + delivery + tax).toFixed(2))
    return { subtotal, delivery, tax, total }
  }, [items])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!items.length) {
      setError('Your cart is empty.')
      return
    }

    setLoading(true)
    setError('')

    const fullAddress = [form.line1, form.city, form.state, form.postalCode].filter(Boolean).join(', ')

    try {
      const razorpayOrder = await createOrder({
        name: form.name,
        email: form.email,
        phone: form.phone,
        address: fullAddress,
        paymentMethod: form.paymentMethod,
      })
      if (!razorpayOrder?.id) {
        throw new Error('Payment order not created.')
      }

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        throw new Error('Unable to load payment checkout. Please try again.')
      }
      if (!RAZORPAY_KEY_ID) {
        throw new Error('Missing VITE_RAZORPAY_KEY_ID for payment integration.')
      }

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'MedCura',
        description: 'Medical Equipment Order',
        order_id: razorpayOrder.id,
        handler: async (response) => {
          try {
            const order = await verifyPayment({
              ...response,
              name: form.name,
              email: form.email,
              phone: form.phone,
              address: fullAddress,
              paymentMethod: form.paymentMethod,
            })
            clearCartState()
            addToast('Order placed successfully.', 'success')
            navigate('/order-success', { replace: true, state: { order } })
          } catch (err) {
            setError(err.response?.data?.message || 'Payment verification failed.')
          }
        },
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#0e336b',
        },
        modal: {
          ondismiss: () => {
            addToast('Payment cancelled by user.', 'error')
          },
        },
      }

      const razorpay = new window.Razorpay(options)
      razorpay.on('payment.failed', () => {
        addToast('Payment failed. Please try again.', 'error')
      })
      razorpay.open()
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to place order.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <form onSubmit={handleSubmit} className="rounded-3xl border border-[#bdeaf2] bg-white p-6 sm:p-7">
          <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">Checkout</h1>
          <p className="mt-2 text-sm text-[#0e336b]/68">
            Enter shipping details and complete secure payment to confirm your order.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[#0e336b]">Full Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Phone</label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[#0e336b]">Address Line</label>
              <input
                name="line1"
                value={form.line1}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">City</label>
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">State</label>
              <input
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Postal Code</label>
              <input
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Payment Method</label>
              <select
                name="paymentMethod"
                value={form.paymentMethod}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              >
                <option value="Razorpay">Razorpay (Gateway)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-semibold text-[#0e336b]">Order Note (optional)</label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows={3}
                className="mt-2 w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm focus:border-[#3dcbe5] focus:outline-none"
              />
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <button
            type="submit"
            disabled={loading || !items.length}
            className="mt-6 w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#18539c] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Processing...' : 'Pay and Place Order'}
          </button>
        </form>

        <aside className="h-fit rounded-3xl border border-[#bdeaf2] bg-white p-6">
          <h2 className="heading-font text-2xl font-semibold text-[#0e336b]">Order Summary</h2>
          <div className="mt-4 space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-[#0e336b]/65">No items in cart.</p>
            ) : (
              items.map((item) => (
                <div key={item.product?._id || item.productId} className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#0e336b]">{item.product?.name || 'Product'}</p>
                    <p className="text-xs text-[#0e336b]/60">Qty: {item.quantity || 1}</p>
                  </div>
                  <p className="text-sm text-[#0e336b]">{formatPrice(getItemPrice(item) * (item.quantity || 1))}</p>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-3 border-t border-[#d9edf3] pt-4 text-sm text-[#0e336b]/70">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tax (5%)</span>
              <span>{formatPrice(totals.tax)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Delivery</span>
              <span>{totals.delivery === 0 ? 'Free' : formatPrice(totals.delivery)}</span>
            </div>
            <div className="h-px bg-[#d9edf3]" />
            <div className="flex items-center justify-between text-base font-semibold text-[#0e336b]">
              <span>Total</span>
              <span>{formatPrice(totals.total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
