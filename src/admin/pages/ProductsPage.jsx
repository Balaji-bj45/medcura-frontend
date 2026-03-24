import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  deleteAdminProduct,
  getAdminProducts,
  updateAdminProduct,
} from '../services/adminProductService.js'
import { resolveAssetUrl } from '../../services/api.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import EmptyState from '../../shared/components/EmptyState.jsx'
import ConfirmModal from '../../shared/components/ConfirmModal.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { formatCurrency } from '../utils.js'
import { MEDCURA_CATEGORIES } from '../../constants/catalog.js'

const PAGE_SIZE = 8

function buildProductFormData(product, overrides = {}) {
  const allowedCategoryNames = MEDCURA_CATEGORIES.map((item) => item.name)
  const normalizedCategory = allowedCategoryNames.includes(product.category)
    ? product.category
    : MEDCURA_CATEGORIES[0].name

  const payload = {
    name: product.name,
    description: product.description,
    category: normalizedCategory,
    price: product.price ?? product.mrp ?? 0,
    discountPrice: product.discountPrice ?? product.salePrice ?? '',
    stock: product.stock ?? 0,
    rating: product.rating ?? 4.5,
    bestSeller: product.bestSeller ?? false,
    featured: product.featured ?? false,
    isActive: product.isActive ?? true,
    specifications: JSON.stringify(product.specifications || []),
    ...overrides,
  }

  const formData = new FormData()
  Object.entries(payload).forEach(([key, value]) => {
    formData.append(key, String(value))
  })
  return formData
}

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)
  const { addToast } = useToast()

  const loadProducts = async () => {
    setLoading(true)
    try {
      const data = await getAdminProducts()
      setProducts(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProducts()
  }, [])

  const statusCounts = useMemo(
    () => ({
      all: products.length,
      active: products.filter((product) => product.isActive).length,
      inactive: products.filter((product) => !product.isActive).length,
    }),
    [products]
  )

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' ? Boolean(product.isActive) : !product.isActive)

      if (!matchesStatus) return false
      if (!query) return true

      return [product.name, product.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    })
  }, [products, search, statusFilter])

  const totalPages = Math.max(Math.ceil(filtered.length / PAGE_SIZE), 1)

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteAdminProduct(deleteId)
    addToast('Product deactivated successfully.', 'success')
    setDeleteId(null)
    await loadProducts()
  }

  const handleToggleFlag = async (product, key) => {
    const formData = buildProductFormData(product, {
      [key]: !product[key],
    })

    await updateAdminProduct(product._id, formData)
    addToast(`${key === 'featured' ? 'Featured' : 'Best seller'} flag updated.`, 'success')
    await loadProducts()
  }

  const handleStatusChange = async (product, nextStatus) => {
    const nextIsActive = nextStatus === 'active'
    if (Boolean(product.isActive) === nextIsActive) return

    setStatusUpdatingId(product._id)
    try {
      const formData = buildProductFormData(product, {
        isActive: nextIsActive,
      })

      await updateAdminProduct(product._id, formData)
      addToast(`Product ${nextIsActive ? 'activated' : 'deactivated'} successfully.`, 'success')
      await loadProducts()
    } finally {
      setStatusUpdatingId(null)
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Products</h1>
        <Link
          to="/admin/products/new"
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
        >
          Add Product
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <input
          value={search}
          onChange={(event) => {
            setSearch(event.target.value)
            setPage(1)
          }}
          placeholder="Search products by name or category"
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Products', count: statusCounts.all },
            { key: 'active', label: 'Active Products', count: statusCounts.active },
            { key: 'inactive', label: 'Inactive Products', count: statusCounts.inactive },
          ].map((option) => (
            <button
              key={option.key}
              type="button"
              onClick={() => {
                setStatusFilter(option.key)
                setPage(1)
              }}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                statusFilter === option.key
                  ? 'bg-slate-900 text-white'
                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
              }`}
            >
              {option.label} ({option.count})
            </button>
          ))}
        </div>
      </div>

      {loading ? <LoadingSkeleton rows={8} /> : null}

      {!loading && filtered.length === 0 ? (
        <EmptyState
          title="No products found"
          description={
            search.trim() || statusFilter !== 'all'
              ? 'Try a different search query or status filter.'
              : 'Add a new product to get started.'
          }
          action={
            <Link
              to="/admin/products/new"
              className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
              Add Product
            </Link>
          }
        />
      ) : null}

      {!loading && filtered.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Flags</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((product) => (
                  <tr key={product._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveAssetUrl(product.images?.[0]) || '/vite.svg'}
                          alt={product.name}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{product.name}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{product.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{product.category}</td>
                    <td className="px-4 py-3 text-slate-700">
                      {formatCurrency(product.discountPrice ?? product.salePrice ?? product.price ?? product.mrp)}
                      <span className="ml-2 text-xs text-slate-400 line-through">
                        {formatCurrency(product.price ?? product.mrp)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{product.stock ?? 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleFlag(product, 'bestSeller')}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.bestSeller ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Best Seller
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleFlag(product, 'featured')}
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            product.featured ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          Featured
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={product.isActive ? 'active' : 'inactive'}
                        onChange={(event) => handleStatusChange(product, event.target.value)}
                        disabled={statusUpdatingId === product._id}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                          product.isActive
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-slate-300 bg-slate-100 text-slate-700'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/products/${product._id}/edit`}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(product._id)}
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-50"
              >
                Prev
              </button>
              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                className="rounded-full border border-slate-300 px-3 py-1 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Deactivate product"
        description="This will mark the product as inactive. You can reactivate it later."
        confirmLabel="Deactivate"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
