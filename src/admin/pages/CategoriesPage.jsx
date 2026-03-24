import { useEffect, useMemo, useState } from 'react'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../services/adminCategoryService.js'
import { MEDCURA_CATEGORIES } from '../../constants/catalog.js'
import { useToast } from '../../context/ToastContext.jsx'

const initialForm = {
  name: '',
  icon: MEDCURA_CATEGORIES[0].icon,
  description: MEDCURA_CATEGORIES[0].description,
  sortOrder: 1,
}

export default function CategoriesPage() {
  const { addToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getAdminCategories()
      setCategories(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const remainingOptions = useMemo(() => {
    const existing = new Set(categories.map((item) => item.name))
    return MEDCURA_CATEGORIES.filter((item) => !existing.has(item.name))
  }, [categories])

  const handlePresetChange = (name) => {
    const selected = MEDCURA_CATEGORIES.find((item) => item.name === name)
    if (!selected) {
      setForm((prev) => ({ ...prev, name }))
      return
    }
    setForm({
      name: selected.name,
      icon: selected.icon,
      description: selected.description,
      sortOrder: selected.sortOrder || 1,
    })
  }

  const handleCreate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      await createAdminCategory({
        ...form,
        name: form.name.trim(),
        sortOrder: Number(form.sortOrder || 0),
      })
      addToast('Category added successfully.', 'success')
      await load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to add category.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeactivate = async (categoryId) => {
    try {
      await deleteAdminCategory(categoryId)
      addToast('Category deactivated.', 'success')
      await load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to deactivate category.', 'error')
    }
  }

  const handleActivate = async (category) => {
    try {
      await updateAdminCategory(category._id, { isActive: true, name: category.name })
      addToast('Category activated.', 'success')
      await load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to activate category.', 'error')
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-600">Manage storefront product categories.</p>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={form.name}
            onChange={(event) => handlePresetChange(event.target.value)}
            list="category-presets"
            placeholder="Category name"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
            required
          />
          <datalist id="category-presets">
            {MEDCURA_CATEGORIES.map((item) => (
              <option key={item.name} value={item.name} />
            ))}
          </datalist>
          <input
            value={form.icon}
            onChange={(event) => setForm((prev) => ({ ...prev, icon: event.target.value }))}
            placeholder="Icon name"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <input
            type="number"
            min="1"
            value={form.sortOrder}
            onChange={(event) => setForm((prev) => ({ ...prev, sortOrder: event.target.value }))}
            placeholder="Sort order"
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={submitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {submitting ? 'Adding...' : 'Add Category'}
          </button>
        </div>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={2}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Description"
        />
      </form>

      <div className="rounded-2xl border border-slate-200 bg-white">
        {loading ? (
          <p className="p-4 text-sm text-slate-600">Loading categories...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-t border-slate-100">
                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900">{category.name}</p>
                      <p className="text-xs text-slate-500">{category.description || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{category.sortOrder}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {category.isActive ? (
                        <button
                          type="button"
                          onClick={() => handleDeactivate(category._id)}
                          className="rounded-full border border-red-300 px-3 py-1 text-xs font-semibold text-red-600"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleActivate(category)}
                          className="rounded-full border border-emerald-300 px-3 py-1 text-xs font-semibold text-emerald-700"
                        >
                          Activate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {remainingOptions.length > 0 ? (
        <p className="text-xs text-slate-500">
          Preset categories remaining: {remainingOptions.map((item) => item.name).join(', ')}
        </p>
      ) : null}
    </section>
  )
}
