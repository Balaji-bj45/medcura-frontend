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
import { getAdminProducts } from '../services/adminProductService.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import { formatCurrency } from '../utils.js'

function MetricsChart({ data, title, tooltipType = 'currency' }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="heading-font text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-4 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip
              formatter={(value) =>
                tooltipType === 'currency' ? formatCurrency(value) : value
              }
            />
            <Bar dataKey="value" fill="#0f172a" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </article>
  )
}

export default function AnalyticsPage() {
  const [orders, setOrders] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const [ordersData, productsData] = await Promise.all([
          getAdminOrders(),
          getAdminProducts(),
        ])
        setOrders(ordersData)
        setProducts(productsData)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const { revenueByDay, ordersByDay, topProducts } = useMemo(() => {
    const today = new Date()
    const labels = []
    const revenueMap = new Map()
    const ordersMap = new Map()
    const productSales = new Map()

    for (let i = 6; i >= 0; i -= 1) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const key = date.toISOString().slice(0, 10)
      const label = date.toLocaleDateString('en-IN', { weekday: 'short' })
      labels.push({ key, label })
      revenueMap.set(key, 0)
      ordersMap.set(key, 0)
    }

    orders.forEach((order) => {
      const key = new Date(order.createdAt).toISOString().slice(0, 10)
      if (revenueMap.has(key)) {
        revenueMap.set(key, revenueMap.get(key) + (order.amount || 0))
        ordersMap.set(key, ordersMap.get(key) + 1)
      }

      order.items?.forEach((item) => {
        productSales.set(item.name, (productSales.get(item.name) || 0) + item.quantity)
      })
    })

    const revenueByDay = labels.map((item) => ({
      label: item.label,
      value: revenueMap.get(item.key) || 0,
    }))

    const ordersByDay = labels.map((item) => ({
      label: item.label,
      value: ordersMap.get(item.key) || 0,
    }))

    const topProducts = Array.from(productSales.entries())
      .map(([name, quantity]) => ({ name, quantity }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5)

    return { revenueByDay, ordersByDay, topProducts }
  }, [orders])

  if (loading) return <LoadingSkeleton rows={8} />

  return (
    <section className="space-y-4">
      <h1 className="heading-font text-2xl font-semibold text-slate-900">Analytics</h1>

      <div className="grid gap-4 lg:grid-cols-2">
        <MetricsChart data={revenueByDay} title="Revenue (Last 7 days)" />
        <MetricsChart data={ordersByDay} title="Orders per day (Last 7 days)" tooltipType="count" />
      </div>

      <article className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="heading-font text-lg font-semibold text-slate-900">Most Sold Products</h3>
        <div className="mt-4 space-y-3">
          {topProducts.length === 0 ? <p className="text-sm text-slate-600">No sales data yet.</p> : null}
          {topProducts.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-100 px-3 py-2 text-sm">
              <div>
                <span className="mr-2 text-slate-400">#{index + 1}</span>
                <span className="font-semibold text-slate-900">{item.name}</span>
              </div>
              <span className="text-slate-700">{item.quantity} units</span>
            </div>
          ))}
        </div>

        <p className="mt-5 text-xs text-slate-500">
          Total products in catalog: {products.length} | Total revenue: {formatCurrency(orders.reduce((sum, order) => sum + (order.amount || 0), 0))}
        </p>
      </article>
    </section>
  )
}
