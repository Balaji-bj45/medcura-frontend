import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import Loader from '../components/Loader.jsx'
import { getProducts } from '../services/products.js'
import { getCategories } from '../services/categories.js'
import { MEDCURA_CATEGORIES } from '../constants/catalog.js'

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

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      sort: searchParams.get('sort') || 'latest',
      search: searchParams.get('search') || '',
      featured: searchParams.get('featured') || '',
    }),
    [searchParams]
  )

  const updateFilter = (key, value) => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        value ? next.set(key, value) : next.delete(key)
        return next
      },
      { replace: true }
    )
  }

  return { filters, updateFilter }
}

// Custom hook for fetching data
function useProducts(filters) {
  const [products, setProducts] = useState([])
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
      signal: controller.signal,
    })
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          setError(err.response?.data?.message || 'Failed to load products.')
        }
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [filters.category, filters.featured, filters.search, filters.sort])

  return { products, loading, error }
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

// Main component
export default function ProductListPage() {
  const { filters, updateFilter } = useProductFilters()
  const { products, loading, error } = useProducts(filters)
  const categories = useCategories()

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
      </div>
    </section>
  )
}