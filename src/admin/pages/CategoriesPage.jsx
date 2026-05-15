import { useEffect, useMemo, useState } from 'react'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '../services/adminCategoryService.js'
import { MEDCURA_CATEGORIES } from '../../constants/catalog.js'
import { useToast } from '../../context/ToastContext.jsx'
import ConfirmModal from '../../shared/components/ConfirmModal.jsx'

const initialForm = {
  name: '',
  description: MEDCURA_CATEGORIES[0].description,
  sortOrder: 1,
}

function buildCategoryPayload(values, overrides = {}) {
  return {
    name: values.name.trim(),
    description: values.description?.trim() || '',
    sortOrder: Number(values.sortOrder || 0),
    isActive: values.isActive ?? true,
    ...overrides,
  }
}

export default function CategoriesPage() {
  const { addToast } = useToast()
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState(null)
  const [statusUpdatingId, setStatusUpdatingId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)

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
      description: selected.description,
      sortOrder: selected.sortOrder || 1,
    })
  }

  const resetForm = () => {
    setForm(initialForm)
    setEditingId(null)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    try {
      const payload = buildCategoryPayload(form)

      if (editingId) {
        await updateAdminCategory(editingId, payload)
        addToast('Category updated successfully.', 'success')
      } else {
        await createAdminCategory(payload)
        addToast('Category added successfully.', 'success')
      }

      resetForm()
      await load()
    } catch (err) {
      addToast(
        err.response?.data?.message ||
          `Unable to ${editingId ? 'update' : 'add'} category.`,
        'error'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (category) => {
    setEditingId(category._id)
    setForm({
      name: category.name || '',
      description: category.description || '',
      sortOrder: category.sortOrder ?? 1,
      isActive: category.isActive ?? true,
    })
  }

  const handleDelete = async () => {
    if (!deleteId) return

    try {
      await deleteAdminCategory(deleteId)
      addToast('Category deleted successfully.', 'success')
      if (editingId === deleteId) {
        resetForm()
      }
      setDeleteId(null)
      await load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to delete category.', 'error')
    }
  }

  const handleStatusChange = async (category, nextStatus) => {
    const nextIsActive = nextStatus === 'active'
    if (Boolean(category.isActive) === nextIsActive) return

    setStatusUpdatingId(category._id)
    try {
      await updateAdminCategory(
        category._id,
        buildCategoryPayload(category, { isActive: nextIsActive })
      )
      addToast(`Category ${nextIsActive ? 'activated' : 'deactivated'} successfully.`, 'success')
      await load()
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to update category status.', 'error')
    } finally {
      setStatusUpdatingId(null)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h1 className="heading-font text-2xl font-semibold text-slate-900">Categories</h1>
        <p className="mt-1 text-sm text-slate-600">Manage storefront product categories.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-200 bg-white p-4">
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
            {submitting ? (editingId ? 'Saving...' : 'Adding...') : editingId ? 'Update Category' : 'Add Category'}
          </button>
        </div>
        <textarea
          value={form.description}
          onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
          rows={2}
          className="mt-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
          placeholder="Description"
        />
        {editingId ? (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel Edit
            </button>
          </div>
        ) : null}
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
                      <select
                        value={category.isActive ? 'active' : 'inactive'}
                        onChange={(event) => handleStatusChange(category, event.target.value)}
                        disabled={statusUpdatingId === category._id}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-semibold ${
                          category.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-700'
                        } disabled:cursor-not-allowed disabled:opacity-60`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-full border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(category._id)}
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
        )}
      </div>

      {remainingOptions.length > 0 ? (
        <p className="text-xs text-slate-500">
          Preset categories remaining: {remainingOptions.map((item) => item.name).join(', ')}
        </p>
      ) : null}

      <ConfirmModal
        open={Boolean(deleteId)}
        title="Delete category"
        description="This will permanently remove the category from the database."
        confirmLabel="Delete"
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </section>
  )
}
