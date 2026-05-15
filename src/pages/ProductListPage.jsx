import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'
import { getProducts } from '../services/products.js'
import { getCategories } from '../services/categories.js'
import { MEDCURA_CATEGORIES } from '../constants/catalog.js'

const PAGE_SIZE = 12

const sortOptions = [
  { value: 'latest', label: 'Latest' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
]

// Custom hook for managing search params
function useProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const parsedPage = Number.parseInt(searchParams.get('page') || '1', 10)

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'latest',
      search: searchParams.get('search') || '',
      featured: searchParams.get('featured') || '',
      page: Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1,
    }),
    [parsedPage, searchParams]
  )

  const updateFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        value ? next.set(key, value) : next.delete(key)
        if (key !== 'page') {
          next.delete('page')
        }
        return next
      },
      { replace: true }
    )
  }

  return { filters, updateFilter }
}

// Custom hook for fetching data
function useProducts(filters) {
  const [productCollection, setProductCollection] = useState({
    items: [],
    total: 0,
    page: 1,
    pageSize: PAGE_SIZE,
    hasMore: false,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    setError('')

    getProducts({
      category: filters.category || undefined,
      sort: filters.sort,
      search: filters.search || undefined,
      featured: filters.featured || undefined,
      page: filters.page,
      pageSize: PAGE_SIZE,
    }, { signal: controller.signal })
      .then((data) => setProductCollection(data))
      .catch((err) => {
        if (err.name !== 'AbortError' && err.code !== 'ERR_CANCELED') {
          setError(err.response?.data?.message || 'Failed to load products.')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [filters.category, filters.featured, filters.page, filters.search, filters.sort])

  return { productCollection, loading, error }
}

function useCategories() {
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const controller = new AbortController()

    getCategories({ signal: controller.signal })
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => setCategories(MEDCURA_CATEGORIES))

    return () => controller.abort()
  }, [])

  const activeCategories = useMemo(
    () =>
      categories.filter((item) => item?.isActive !== false).length > 0
        ? categories.filter((item) => item?.isActive !== false)
        : MEDCURA_CATEGORIES,
    [categories]
  )

  return activeCategories
}

// Separate components
function SearchBar({ value, onChange }) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value.trimStart())}
      placeholder="Search products, equipment, or use cases"
      className="w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm text-[#0e336b] focus:border-[#3dcbe5] focus:outline-none"
    />
  )
}

function SortSelect({ value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm text-[#0e336b] focus:border-[#3dcbe5] focus:outline-none"
    >
      {sortOptions.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  )
}

function CategoryFilter({ categories, selected, onChange }) {
  const buttonClass = (isActive) =>
    `rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
      isActive
        ? 'bg-[#0e336b] text-white'
        : 'border border-[#bce8f2] bg-[#edfafe] text-[#0e336b] hover:bg-[#e2f7fb]'
    }`

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      <button type="button" onClick={() => onChange('')} className={buttonClass(!selected)}>
        All
      </button>

      {categories.map((category) => (
        <button
          type="button"
          key={category._id || category.name}
          onClick={() => onChange(category.name)}
          className={buttonClass(selected === category.name)}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}

function ProductGrid({ products, loading, error }) {
  if (loading) {
    return (
      <div className="mt-8">
        <Loader label="Loading products..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="mt-8 rounded-2xl border border-[#bce8f2] bg-white p-6 text-sm text-[#0e336b]/70">
        No products found for the selected filters.
      </div>
    )
  }

  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id || product.id} product={product} />
      ))}
    </div>
  )
}

function Pagination({ page, total, pageSize, hasMore, onChange }) {
  if (total <= pageSize) return null

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  return (
    <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#c9ecf3] bg-white px-4 py-4 text-sm text-[#0e336b]/70 sm:flex-row sm:items-center sm:justify-between">
      <p>
        Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total} products
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-full border border-[#bdeaf2] px-4 py-2 font-semibold text-[#0e336b] transition hover:bg-[#edfafe] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Prev
        </button>
        <span className="min-w-20 text-center font-semibold text-[#0e336b]">
          Page {page} / {totalPages}
        </span>
        <button
          type="button"
          disabled={!hasMore}
          onClick={() => onChange(page + 1)}
          className="rounded-full border border-[#bdeaf2] px-4 py-2 font-semibold text-[#0e336b] transition hover:bg-[#edfafe] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

// Main component
export default function ProductListPage() {
  const { filters, updateFilter } = useProductFilters()
  const { productCollection, loading, error } = useProducts(filters)
  const categories = useCategories()
  const products = productCollection.items

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-3xl border border-[#c9ecf3] bg-white p-5 sm:p-6">
          <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">Medical Equipment Store</h1>
          <p className="mt-2 text-sm text-[#0e336b]/68 sm:text-base">
            Browse MedCura products by category, compare specifications, and place orders with confidence.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px]">
            <SearchBar value={filters.search} onChange={(value) => updateFilter('search', value)} />
            <SortSelect value={filters.sort} onChange={(value) => updateFilter('sort', value)} />
          </div>

          <CategoryFilter
            categories={categories}
            selected={filters.category}
            onChange={(value) => updateFilter('category', value)}
          />
        </div>

        <ProductGrid products={products} loading={loading} error={error} />
        <Pagination
          page={productCollection.page}
          total={productCollection.total}
          pageSize={productCollection.pageSize}
          hasMore={productCollection.hasMore}
          onChange={(value) => updateFilter('page', String(value))}
        />
      </div>
    </section>
  )
}
