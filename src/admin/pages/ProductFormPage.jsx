import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createAdminProduct,
  getAdminProductById,
  updateAdminProduct,
} from '../services/adminProductService.js'
import { getAdminCategories } from '../services/adminCategoryService.js'
import { resolveAssetUrl } from '../../services/api.js'
import LoadingSkeleton from '../../shared/components/LoadingSkeleton.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { MEDCURA_CATEGORIES } from '../../constants/catalog.js'

const initialForm = {
  name: '',
  description: '',
  category: MEDCURA_CATEGORIES[0].name,
  price: '',
  discountPrice: '',
  stock: '',
  rating: '4.5',
  bestSeller: false,
  featured: false,
  isActive: true,
}
const MAX_IMAGE_COUNT = 5

export default function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToast } = useToast()

  const isEdit = Boolean(id)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(isEdit)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState([])
  const [video, setVideo] = useState(null)
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  const [videoPreviewUrl, setVideoPreviewUrl] = useState('')
  const [existingImages, setExistingImages] = useState([])
  const [existingVideo, setExistingVideo] = useState('')
  const [categories, setCategories] = useState([])
  const specificationRowIdRef = useRef(1)
  const buildSpecificationRow = (item = {}) => {
    const row = {
      id: `spec-${specificationRowIdRef.current}`,
      key: item?.key ? String(item.key) : '',
      value: item?.value ? String(item.value) : '',
    }
    specificationRowIdRef.current += 1
    return row
  }
  const [specifications, setSpecifications] = useState([{ id: 'spec-0', key: '', value: '' }])

  useEffect(() => {
    getAdminCategories()
      .then((data) => {
        const active = data.filter((item) => item.isActive)
        setCategories(active)
      })
      .catch(() => {
        setCategories(MEDCURA_CATEGORIES)
      })
  }, [])

  useEffect(() => {
    if (!isEdit) return

    const load = async () => {
      setLoading(true)
      try {
        const product = await getAdminProductById(id)
        const allowedCategoryNames = MEDCURA_CATEGORIES.map((item) => item.name)
        setForm({
          name: product.name || '',
          description: product.description || '',
          category: allowedCategoryNames.includes(product.category)
            ? product.category
            : MEDCURA_CATEGORIES[0].name,
          price: String(product.price ?? product.mrp ?? ''),
          discountPrice: String(product.discountPrice ?? product.salePrice ?? ''),
          stock: String(product.stock ?? ''),
          rating: String(product.rating ?? 4.5),
          bestSeller: Boolean(product.bestSeller),
          featured: Boolean(product.featured),
          isActive: Boolean(product.isActive),
        })
        setExistingImages(
          Array.isArray(product.images) ? product.images.map(resolveAssetUrl).filter(Boolean) : []
        )
        setExistingVideo(resolveAssetUrl(product.video) || '')

        if (Array.isArray(product.specifications) && product.specifications.length > 0) {
          setSpecifications(product.specifications.map((item) => buildSpecificationRow(item)))
        } else {
          setSpecifications([buildSpecificationRow()])
        }
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, isEdit])

  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file))
    setImagePreviewUrls(urls)

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [images])

  useEffect(() => {
    if (!video) {
      setVideoPreviewUrl('')
      return undefined
    }

    const url = URL.createObjectURL(video)
    setVideoPreviewUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [video])

  const saleTooHigh = useMemo(() => {
    const price = Number(form.price)
    const discountPrice = Number(form.discountPrice)
    if (!form.discountPrice) return false
    return price > 0 && discountPrice > price
  }, [form.price, form.discountPrice])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSpecificationChange = (index, field, value) => {
    setSpecifications((prev) => {
      const next = [...prev]
      next[index] = {
        ...next[index],
        [field]: value,
      }
      return next
    })
  }

  const handleImagesChange = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    if (selectedFiles.length === 0) return

    setImages((prev) => {
      const mergedBySignature = new Map()
      ;[...prev, ...selectedFiles].forEach((file) => {
        const signature = `${file.name}-${file.size}-${file.lastModified}`
        mergedBySignature.set(signature, file)
      })

      const mergedFiles = Array.from(mergedBySignature.values())
      if (mergedFiles.length > MAX_IMAGE_COUNT) {
        addToast(`Only ${MAX_IMAGE_COUNT} images are allowed.`, 'error')
      }
      return mergedFiles.slice(0, MAX_IMAGE_COUNT)
    })

    event.target.value = ''
  }

  const addSpecificationRow = () => {
    setSpecifications((prev) => [...prev, buildSpecificationRow()])
  }

  const removeSpecificationRow = (index) => {
    setSpecifications((prev) => {
      const next = prev.filter((_, i) => i !== index)
      return next.length > 0 ? next : [buildSpecificationRow()]
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!isEdit && images.length === 0) {
      setError('Please upload at least one product image.')
      return
    }

    if (saleTooHigh) {
      setError('Discount price cannot be greater than price.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const cleanSpecifications = specifications
        .map((item) => ({
          key: item.key?.trim(),
          value: item.value?.trim(),
        }))
        .filter((item) => item.key && item.value)

      const formData = new FormData()
      formData.append('name', form.name)
      formData.append('description', form.description)
      formData.append('category', form.category)
      formData.append('price', form.price)
      formData.append('discountPrice', form.discountPrice || '')
      formData.append('stock', form.stock)
      formData.append('rating', form.rating)
      formData.append('bestSeller', String(form.bestSeller))
      formData.append('featured', String(form.featured))
      formData.append('isActive', String(form.isActive))
      formData.append('specifications', JSON.stringify(cleanSpecifications))

      images.forEach((file) => {
        formData.append('images', file)
      })

      if (video) {
        formData.append('video', video)
      }

      if (isEdit) {
        await updateAdminProduct(id, formData)
      } else {
        await createAdminProduct(formData)
      }

      addToast(`Product ${isEdit ? 'updated' : 'created'} successfully.`, 'success')
      navigate('/admin/products')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save product.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSkeleton rows={8} />
  }

  const visibleImagePreviews = imagePreviewUrls.length > 0 ? imagePreviewUrls : existingImages
  const visibleVideoPreview = videoPreviewUrl || existingVideo

  return (
    <section className="mx-auto max-w-4xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="heading-font text-2xl font-semibold text-slate-900">
          {isEdit ? 'Edit Product' : 'Add Product'}
        </h1>
        <Link
          to="/admin/products"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
        >
          Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-slate-700">Description</label>
            <textarea
              required
              minLength={10}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="mt-2 min-h-28 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select
              required
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            >
              {(categories.length ? categories : MEDCURA_CATEGORIES).map((category) => (
                <option key={category._id || category.name} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Price</label>
              <input
                required
                type="number"
                min="1"
                step="0.01"
                name="price"
                value={form.price}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Discount Price</label>
              <input
                type="number"
                min="0"
                step="0.01"
                name="discountPrice"
                value={form.discountPrice}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-semibold text-slate-700">Stock</label>
              <input
                required
                type="number"
                min="0"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-slate-700">Rating (0-5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                name="rating"
                value={form.rating}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Images</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImagesChange}
              className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">
              Upload up to {MAX_IMAGE_COUNT} images. Selected: {images.length}
            </p>
            {visibleImagePreviews.length > 0 ? (
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-600">Image Preview</p>
                <div className="mt-2 flex gap-3 overflow-x-auto pb-2">
                  {visibleImagePreviews.map((src, index) => (
                    <div
                      key={`${src}-${index}`}
                      className="h-28 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                    >
                      <img
                        src={src}
                        alt={`Product preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Video (optional)</label>
            <input
              type="file"
              accept="video/*"
              onChange={(event) => setVideo(event.target.files?.[0] || null)}
              className="mt-2 block w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
            {visibleVideoPreview ? (
              <div className="mt-3 overflow-x-auto pb-2">
                <div className="w-full min-w-[280px] max-w-xl overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                  <video
                    controls
                    src={visibleVideoPreview}
                    className="max-h-56 w-full bg-black object-contain"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <div className="sm:col-span-2">
            <div className="flex flex-wrap items-center gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={form.bestSeller}
                  onChange={handleChange}
                />
                Best Seller
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />
                Featured
              </label>
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                Active
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-700">Specifications</h3>
            <button
              type="button"
              onClick={addSpecificationRow}
              className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              Add Row
            </button>
          </div>

          <div className="space-y-3">
            {specifications.map((item, index) => (
              <div key={item.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                <input
                  value={item?.key ?? ''}
                  onChange={(event) => handleSpecificationChange(index, 'key', event.target.value)}
                  placeholder="Key (e.g. Weight Capacity)"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <input
                  value={item?.value ?? ''}
                  onChange={(event) => handleSpecificationChange(index, 'value', event.target.value)}
                  placeholder="Value (e.g. 180 kg)"
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => removeSpecificationRow(index)}
                  className="rounded-xl border border-red-300 px-3 py-2 text-xs font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        {saleTooHigh ? <p className="mt-4 text-sm text-red-600">Discount price cannot exceed price.</p> : null}
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

        <div className="mt-6 flex justify-end gap-3">
          <Link
            to="/admin/products"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={submitting || saleTooHigh}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
          </button>
        </div>
      </form>
    </section>
  )
}
