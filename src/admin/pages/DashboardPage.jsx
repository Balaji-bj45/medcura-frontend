import { useEffect, useMemo, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { getAdminOrders } from '../services/adminOrderService.js'
import { getEnquiries } from '../services/enquiryService.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import { formatCurrency } from '../utils.js'

function StatCard({ label, value }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
      <h3 className="mt-2 heading-font text-2xl font-semibold text-slate-900">{value}</h3>
    </article>
  )
}

export default function DashboardPage() {
  const [orders, setOrders] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ordersData, enquiriesData] = await Promise.all([
          getAdminOrders(),
          getEnquiries(),
        ])
        setOrders(ordersData)
        setEnquiries(enquiriesData)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const metrics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + (order.amount || 0), 0)
    const pendingOrders = orders.filter((order) =>
      ['Paid', 'Processing', 'Shipped'].includes(order.status)
    ).length
    const deliveredOrders = orders.filter((order) => order.status === 'Delivered').length
    const newEnquiries = enquiries.filter((item) => item.status === 'New').length

    const today = new Date()
    const labels = []
    const trendMap = new Map()

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      const label = date.toLocaleDateString('en-IN', { weekday: 'short' })
      labels.push({ key, label })
      trendMap.set(key, 0)
    }

    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10)
      if (trendMap.has(key)) {
        trendMap.set(key, trendMap.get(key) + (order.amount || 0))
      }
    })

    const salesTrend = labels.map((item) => ({
      label: item.label,
      value: trendMap.get(item.key) || 0,
    }))

    return {
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders,
      deliveredOrders,
      newEnquiries,
      salesTrend,
    }
  }, [orders, enquiries])

  if (loading) {
    return <LoadingSkeleton rows={8} />
  }

  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total Orders" value={metrics.totalOrders} />
        <StatCard label="Total Revenue" value={formatCurrency(metrics.totalRevenue)} />
        <StatCard label="Pending Orders" value={metrics.pendingOrders} />
        <StatCard label="Delivered Orders" value={metrics.deliveredOrders} />
        <StatCard label="New Enquiries" value={metrics.newEnquiries} />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="heading-font text-lg font-semibold text-slate-900">Sales Trend (Last 7 Days)</h3>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.salesTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>
    </section>
  )
}
