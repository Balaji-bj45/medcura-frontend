import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminOrders } from '../services/adminOrderService.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import EmptyState from '../../shared/components/EmptyState.jsx'
import { formatCurrency, formatDate } from '../utils.js'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const data = await getAdminOrders()
        setOrders(data)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orders.filter((order) => {
      const statusOk = statusFilter === 'All' ? true : order.status === statusFilter

      const created = new Date(order.createdAt)
      const fromOk = fromDate ? created >= new Date(fromDate) : true
      const toOk = toDate ? created <= new Date(`${toDate}T23:59:59`) : true

      const haystack = [
        order._id,
        order.customerDetails?.name,
        order.customerDetails?.email,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()

      const searchOk = query ? haystack.includes(query) : true

      return statusOk && fromOk && toOk && searchOk
    })
  }, [orders, search, statusFilter, fromDate, toDate])

  const revenue = filtered.reduce((sum, order) => sum + (order.amount || 0), 0)

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Orders</h1>
        <p className="text-sm text-slate-600">Filtered revenue: {formatCurrency(revenue)}</p>
      </div>

      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 xl:grid-cols-5">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search customer / email / order"
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm xl:col-span-2"
        />

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
        >
          <option value="All">All statuses</option>
          <option value="Paid">Paid</option>
          <option value="Processing">Processing</option>
          <option value="Shipped">Shipped</option>
          <option value="Delivered">Delivered</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(event) => setFromDate(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />

        <input
          type="date"
          value={toDate}
          onChange={(event) => setToDate(event.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />
      </div>

      {loading ? <LoadingSkeleton rows={8} /> : null}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="No orders found"
          description="No orders match your current filters."
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Order</th>
                  <th className="px-4 py-3">Customer</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order._id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-medium text-slate-900">#{order._id.slice(-8)}</td>
                    <td className="px-4 py-3 text-slate-700">
                      <p>{order.customerDetails?.name || '-'}</p>
                      <p className="text-xs text-slate-500">{order.customerDetails?.email || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatCurrency(order.amount)}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{formatDate(order.createdAt)}</td>
                    <td className="px-4 py-3">
                      <Link
                        to={`/admin/orders/${order._id}`}
                        className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  )
}
