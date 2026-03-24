import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  getAdminOrderById,
  updateAdminOrderStatus,
} from '../services/adminOrderService.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import { formatCurrency, formatDateTime } from '../utils.js'
import { useToast } from '../../context/ToastContext.jsx'

const statusOptions = ['Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled']

export default function OrderDetailPage() {
  const { id } = useParams()
  const { addToast } = useToast()

  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getAdminOrderById(id)
        setOrder(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id])

  const handleStatusChange = async (event) => {
    const nextStatus = event.target.value
    setUpdating(true)

    try {
      const updated = await updateAdminOrderStatus(id, nextStatus)
      setOrder(updated)
      addToast('Order status updated.', 'success')
    } finally {
      setUpdating(false)
    }
  }

  if (loading) return <LoadingSkeleton rows={8} />
  if (!order) return <p className="text-sm text-slate-600">Order not found.</p>

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Order Details</h1>
        <Link
          to="/admin/orders"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back to Orders
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2">
          <h3 className="heading-font text-lg font-semibold text-slate-900">Ordered Items</h3>
          <div className="mt-4 space-y-3">
            {order.items?.map((item, index) => (
              <div
                key={`${item.product?._id || index}-${index}`}
                className="rounded-xl border border-slate-100 p-3"
              >
                <p className="font-semibold text-slate-900">{item.name}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Qty {item.quantity} x {formatCurrency(item.price)}
                </p>
              </div>
            ))}
          </div>
        </article>

        <article className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Order ID</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{order._id}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Customer</p>
            <p className="mt-1 text-sm font-semibold text-slate-900">{order.customerDetails?.name || '-'}</p>
            <p className="text-sm text-slate-600">{order.customerDetails?.email || '-'}</p>
            <p className="text-sm text-slate-600">{order.customerDetails?.phone || '-'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Address</p>
            <p className="mt-1 text-sm text-slate-700">{order.customerDetails?.address || '-'}</p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Total Amount</p>
            <p className="mt-1 heading-font text-xl font-semibold text-slate-900">
              {formatCurrency(order.amount)}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-wider text-slate-500">Placed At</p>
            <p className="mt-1 text-sm text-slate-700">{formatDateTime(order.createdAt)}</p>
          </div>

          <div>
            <label className="text-xs uppercase tracking-wider text-slate-500">Update status</label>
            <select
              value={order.status}
              onChange={handleStatusChange}
              disabled={updating}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>
        </article>
      </div>
    </section>
  )
}
