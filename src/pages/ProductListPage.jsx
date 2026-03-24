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

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedCategory = searchParams.get('category') || ''
  const selectedSort = searchParams.get('sort') || 'latest'
  const selectedSearch = searchParams.get('search') || ''
  const selectedFeatured = searchParams.get('featured')

  useEffect(() => {
    let ignore = false
    getCategories()
      .then((data) => {
        if (ignore) return
        setCategories(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!ignore) setCategories(MEDCURA_CATEGORIES)
      })

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    let ignore = false
    setLoading(true)
    setError('')

    getProducts({
      category: selectedCategory || undefined,
      sort: selectedSort,
      search: selectedSearch || undefined,
      featured: selectedFeatured || undefined,
    })
      .then((data) => {
        if (ignore) return
        setProducts(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (ignore) return
        setError(err.response?.data?.message || 'Failed to load products.')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [selectedCategory, selectedFeatured, selectedSearch, selectedSort])

  const categoryOptions = useMemo(() => {
    const apiCategories = categories.filter((item) => item?.isActive !== false)
    if (apiCategories.length > 0) return apiCategories
    return MEDCURA_CATEGORIES
  }, [categories])

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams)
    if (!value) {
      next.delete(key)
    } else {
      next.set(key, value)
    }
    setSearchParams(next, { replace: true })
  }

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <div className="rounded-3xl border border-[#c9ecf3] bg-white p-5 sm:p-6">
          <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">Medical Equipment Store</h1>
          <p className="mt-2 text-sm text-[#0e336b]/68 sm:text-base">
            Browse MedCura products by category, compare specifications, and place orders with confidence.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_220px]">
            <input
              value={selectedSearch}
              onChange={(event) => updateParam('search', event.target.value.trimStart())}
              placeholder="Search products, equipment, or use cases"
              className="w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm text-[#0e336b] focus:border-[#3dcbe5] focus:outline-none"
            />
            <select
              value={selectedSort}
              onChange={(event) => updateParam('sort', event.target.value)}
              className="w-full rounded-2xl border border-[#bce8f2] px-4 py-3 text-sm text-[#0e336b] focus:border-[#3dcbe5] focus:outline-none"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => updateParam('category', '')}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                !selectedCategory
                  ? 'bg-[#0e336b] text-white'
                  : 'border border-[#bce8f2] bg-[#edfafe] text-[#0e336b] hover:bg-[#e2f7fb]'
              }`}
            >
              All
            </button>

            {categoryOptions.map((category) => (
              <button
                type="button"
                key={category._id || category.name}
                onClick={() => updateParam('category', category.name)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide transition ${
                  selectedCategory === category.name
                    ? 'bg-[#0e336b] text-white'
                    : 'border border-[#bce8f2] bg-[#edfafe] text-[#0e336b] hover:bg-[#e2f7fb]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="mt-8">
            <Loader label="Loading products..." />
          </div>
        ) : null}

        {error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">{error}</div>
        ) : null}

        {!loading && !error && products.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-[#bce8f2] bg-white p-6 text-sm text-[#0e336b]/70">
            No products found for the selected filters.
          </div>
        ) : null}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product._id || product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
                       