import { useEffect, useMemo, useState } from 'react'
import { getEnquiries, updateEnquiryStatus } from '../services/enquiryService.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import EmptyState from '../../shared/components/EmptyState.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatDateTime } from '../utils.js'

const statusOptions = ['All', 'New', 'Contacted', 'Closed']

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([])
  const [status, setStatus] = useState('All')
  const [loading, setLoading] = useState(true)
  const { addToast } = useToast()

  const load = async () => {
    setLoading(true)
    try {
      const data = await getEnquiries()
      setEnquiries(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filtered = useMemo(() => {
    return status === 'All'
      ? enquiries
      : enquiries.filter((item) => item.status === status)
  }, [enquiries, status])

  const handleMarkResolved = async (id) => {
    await updateEnquiryStatus(id, 'Closed')
    addToast('Enquiry marked as resolved.', 'success')
    await load()
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Service Enquiries</h1>
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm"
        >
          {statusOptions.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </div>

      {loading ? <LoadingSkeleton rows={6} /> : null}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="No enquiries available"
          description="New service enquiries will appear here."
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="space-y-3">
          {filtered.map((item) => (
            <article key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="heading-font text-lg font-semibold text-slate-900">{item.name}</h3>
                  <p className="text-sm text-slate-600">{item.email || '-'}</p>
                  <p className="text-sm text-slate-600">{item.phone}</p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  {item.status}
                </span>
              </div>

              <p className="mt-3 text-sm text-slate-700">{item.message || 'No message provided.'}</p>
              <p className="mt-2 text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>

              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => handleMarkResolved(item._id)}
                  disabled={item.status === 'Closed'}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700 disabled:opacity-50"
                >
                  Mark Resolved
                </button>
                <a
                  href={`mailto:${item.email || ''}`}
                  className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                >
                  Reply Email
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  )
}
