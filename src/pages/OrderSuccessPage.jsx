import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function OrderSuccessPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const order = location.state?.order

  if (!order) {
    return (
      <section className="px-4 py-8 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#bdeaf2] bg-white p-8 text-center">
          <h1 className="heading-font text-2xl font-semibold text-[#0e336b]">Order Completed</h1>
          <p className="mt-2 text-sm text-[#0e336b]/68">Your order was placed successfully.</p>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="mt-6 rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold text-white"
          >
            Continue Shopping
          </button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f6fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl rounded-3xl border border-[#bdeaf2] bg-white p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          <div>
            <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">Payment Successful</h1>
            <p className="mt-1 text-sm text-[#0e336b]/68">Your order has been confirmed and is now in processing.</p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-[#d8eef4] bg-[#f9fdff] p-5 text-sm text-[#0e336b]/72">
          <div className="flex items-center justify-between">
            <span>Order ID</span>
            <span className="font-semibold text-[#0e336b]">{order._id || order.id}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Status</span>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase text-emerald-700">
              {order.status || 'Paid'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span>Total</span>
            <span className="font-semibold text-[#0e336b]">{formatPrice(order.amount)}</span>
          </div>
          {typeof order.subtotal === 'number' ? (
            <>
              <div className="mt-2 flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Delivery</span>
                <span>{formatPrice(order.deliveryCharge || 0)}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
            </>
          ) : null}
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#3f6e8a]">Shipping Address</p>
            <p className="mt-1">
              {order.customerDetails?.name}
              <br />
              {order.customerDetails?.email}
              <br />
              {order.customerDetails?.phone}
              <br />
              {order.customerDetails?.address}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="rounded-full border border-[#0e336b] px-4 py-2 text-sm font-semibold text-[#0e336b]"
          >
            View Orders
          </button>
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold text-white"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </section>
  )
}
