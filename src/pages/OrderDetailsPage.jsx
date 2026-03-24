import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Loader from '../components/Loader.jsx'
import { getMyOrderById } from '../services/orders.js'

function formatPrice(value) {
  if (typeof value !== 'number') return value
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function OrderDetailsPage() {
  const { id } = useParams()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let ignore = false
    getMyOrderById(id)
      .then((data) => {
        if (!ignore) setOrder(data)
      })
      .catch((err) => {
        if (!ignore) setError(err.response?.data?.message || 'Failed to fetch order details.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [id])

  const items = useMemo(() => order?.items || [], [order])

  if (loading) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Loader label="Loading order..." />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      </section>
    )
  }

  if (!order) {
    return null
  }

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-6xl rounded-3xl border border-[#cdeaf2] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[#0e336b]/62">Order ID</p>
            <h1 className="heading-font text-2xl font-semibold text-[#0e336b]">{order._id}</h1>
            <p className="mt-1 text-sm text-[#0e336b]/68">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
          <span className="rounded-full bg-[#e6f8fd] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0e336b]">
            {order.status}
          </span>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-2xl border border-[#d7edf3] p-4">
            <h2 className="text-lg font-semibold text-[#0e336b]">Items</h2>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item._id || item.product?._id} className="flex items-center justify-between gap-3 border-b border-[#edf5f8] pb-3 text-sm last:border-none last:pb-0">
                  <div>
                    <p className="font-semibold text-[#0e336b]">{item.name || item.product?.name}</p>
                    <p className="text-[#0e336b]/62">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-[#0e336b]">{formatPrice((item.price || 0) * (item.quantity || 1))}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-[#d7edf3] p-4 text-sm">
            <h2 className="text-lg font-semibold text-[#0e336b]">Summary</h2>
            <div className="mt-3 space-y-2 text-[#0e336b]/74">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(order.subtotal || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Delivery</span>
                <span>{formatPrice(order.deliveryCharge || 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tax</span>
                <span>{formatPrice(order.tax || 0)}</span>
              </div>
              <div className="h-px bg-[#e7f2f6]" />
              <div className="flex items-center justify-between text-base font-semibold text-[#0e336b]">
                <span>Total</span>
                <span>{formatPrice(order.amount || 0)}</span>
              </div>
            </div>

            <div className="mt-5 rounded-xl bg-[#f8fdff] p-3 text-[#0e336b]/74">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#50738f]">
                Shipping Details
              </p>
              <p className="mt-2">
                {order.customerDetails?.name}
                <br />
                {order.customerDetails?.email}
                <br />
                {order.customerDetails?.phone}
                <br />
                {order.customerDetails?.address}
              </p>
            </div>
          </aside>
        </div>

        <div className="mt-6">
          <Link
            to="/orders"
            className="inline-flex rounded-full border border-[#0e336b] px-4 py-2 text-sm font-semibold text-[#0e336b]"
          >
            Back to orders
          </Link>
        </div>
      </div>
    </section>
  )
}
