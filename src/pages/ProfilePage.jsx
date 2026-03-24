import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  addAddress,
  deleteAddress,
  getMyProfile,
  updateAddress,
  updateMyProfile,
} from '../services/customer.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import Loader from '../components/Loader.jsx'

const emptyAddress = {
  type: 'Home',
  label: '',
  line1: '',
  line2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  phone: '',
  isDefault: false,
}

function AddressForm({ value, onChange, onSubmit, onCancel, submitLabel, loading }) {
  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl border border-[#d5edf3] bg-[#f9fdff] p-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Type</label>
          <select
            value={value.type}
            onChange={(event) => onChange({ ...value, type: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          >
            <option value="Home">Home</option>
            <option value="Work">Work</option>
            <option value="Others">Others</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Label</label>
          <input
            value={value.label}
            onChange={(event) => onChange({ ...value, label: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
            placeholder="Apartment, Office Floor..."
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Address Line 1</label>
        <input
          value={value.line1}
          required
          onChange={(event) => onChange({ ...value, line1: event.target.value })}
          className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
        />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Address Line 2</label>
        <input
          value={value.line2}
          onChange={(event) => onChange({ ...value, line2: event.target.value })}
          className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">City</label>
          <input
            value={value.city}
            required
            onChange={(event) => onChange({ ...value, city: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">State</label>
          <input
            value={value.state}
            required
            onChange={(event) => onChange({ ...value, state: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Postal Code</label>
          <input
            value={value.postalCode}
            required
            onChange={(event) => onChange({ ...value, postalCode: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Country</label>
          <input
            value={value.country}
            required
            onChange={(event) => onChange({ ...value, country: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-[#4b728f]">Phone</label>
          <input
            value={value.phone}
            onChange={(event) => onChange({ ...value, phone: event.target.value })}
            className="mt-1 w-full rounded-xl border border-[#cdeaf2] px-3 py-2 text-sm focus:border-[#4cc6df] focus:outline-none"
          />
        </div>
      </div>
      <label className="inline-flex items-center gap-2 text-sm text-[#0e336b]/80">
        <input
          type="checkbox"
          checked={value.isDefault}
          onChange={(event) => onChange({ ...value, isDefault: event.target.checked })}
          className="h-4 w-4 rounded border-[#99d9e8]"
        />
        Set as default address
      </label>
      <div className="flex flex-wrap justify-end gap-2">
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-[#98d5e4] px-4 py-2 text-sm font-semibold text-[#0e336b]"
          >
            Cancel
          </button>
        ) : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}

export default function ProfilePage() {
  const { customer, updateCustomer } = useAuth()
  const { addToast } = useToast()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingName, setSavingName] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [newAddress, setNewAddress] = useState(emptyAddress)
  const [addingAddress, setAddingAddress] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState('')
  const [editingAddress, setEditingAddress] = useState(emptyAddress)
  const [updatingAddress, setUpdatingAddress] = useState(false)

  const addresses = useMemo(() => profile?.addresses || [], [profile])
  const recentOrders = useMemo(() => profile?.recentOrders || [], [profile])

  useEffect(() => {
    let ignore = false
    getMyProfile()
      .then((data) => {
        if (ignore) return
        setProfile(data)
        setNameInput(data?.fullName || '')
        if (data) {
          updateCustomer({
            ...customer,
            fullName: data.fullName,
            email: data.email,
          })
        }
      })
      .catch((err) => {
        if (ignore) return
        addToast(err.response?.data?.message || 'Failed to load profile.', 'error')
      })
      .finally(() => {
        if (!ignore) setLoading(false)
      })

    return () => {
      ignore = true
    }
  }, [addToast, customer, updateCustomer])

  const onSaveName = async (event) => {
    event.preventDefault()
    setSavingName(true)
    try {
      const data = await updateMyProfile({ fullName: nameInput })
      setProfile((prev) => ({ ...prev, ...data }))
      updateCustomer({ ...customer, ...data })
      addToast('Profile updated.', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update profile.', 'error')
    } finally {
      setSavingName(false)
    }
  }

  const onAddAddress = async (event) => {
    event.preventDefault()
    setAddingAddress(true)
    try {
      const data = await addAddress(newAddress)
      setProfile((prev) => ({ ...prev, addresses: data.addresses }))
      setNewAddress(emptyAddress)
      addToast('Address added.', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to add address.', 'error')
    } finally {
      setAddingAddress(false)
    }
  }

  const onUpdateAddress = async (event) => {
    event.preventDefault()
    if (!editingAddressId) return
    setUpdatingAddress(true)
    try {
      const data = await updateAddress(editingAddressId, editingAddress)
      setProfile((prev) => ({ ...prev, addresses: data.addresses }))
      setEditingAddressId('')
      setEditingAddress(emptyAddress)
      addToast('Address updated.', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to update address.', 'error')
    } finally {
      setUpdatingAddress(false)
    }
  }

  const onDeleteAddress = async (addressId) => {
    try {
      const data = await deleteAddress(addressId)
      setProfile((prev) => ({ ...prev, addresses: data.addresses }))
      addToast('Address deleted.', 'success')
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to delete address.', 'error')
    }
  }

  if (loading) {
    return (
      <section className="px-4 py-10 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <Loader label="Loading profile..." />
        </div>
      </section>
    )
  }

  return (
    <section className="bg-[#f8fdff] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-[#cdeaf2] bg-white p-6"
        >
          <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">My Profile</h1>
          <p className="mt-2 text-sm text-[#0e336b]/66">
            Manage your account details and shipping addresses.
          </p>

          <form onSubmit={onSaveName} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Full Name</label>
              <input
                value={nameInput}
                onChange={(event) => setNameInput(event.target.value)}
                required
                className="mt-2 w-full rounded-2xl border border-[#cdeaf2] px-4 py-3 text-sm focus:border-[#4fcbe2] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Email</label>
              <input
                value={profile?.email || ''}
                disabled
                className="mt-2 w-full rounded-2xl border border-[#d8ecf2] bg-[#f6fbfd] px-4 py-3 text-sm text-[#0e336b]/70"
              />
            </div>
            <button
              type="submit"
              disabled={savingName}
              className="rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {savingName ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          <div className="mt-8">
            <h2 className="heading-font text-2xl font-semibold text-[#0e336b]">Saved Addresses</h2>
            <p className="mt-1 text-sm text-[#0e336b]/65">Home, Work, and other delivery addresses.</p>

            <div className="mt-4 space-y-3">
              {addresses.length === 0 ? (
                <p className="rounded-2xl border border-[#d5edf3] bg-[#f9fdff] p-4 text-sm text-[#0e336b]/70">
                  No address saved yet.
                </p>
              ) : (
                addresses.map((address) => (
                  <div key={address._id} className="rounded-2xl border border-[#d5edf3] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-[#0e336b]">
                          {address.type}
                          {address.isDefault ? (
                            <span className="ml-2 rounded-full bg-[#e3f7fb] px-2 py-1 text-[10px] font-bold uppercase text-[#0e336b]">
                              Default
                            </span>
                          ) : null}
                        </p>
                        <p className="text-sm text-[#0e336b]/70">
                          {[address.line1, address.line2, address.city, address.state, address.postalCode, address.country]
                            .filter(Boolean)
                            .join(', ')}
                        </p>
                        {address.phone ? (
                          <p className="text-xs text-[#0e336b]/55">{address.phone}</p>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingAddressId(address._id)
                            setEditingAddress({
                              type: address.type || 'Home',
                              label: address.label || '',
                              line1: address.line1 || '',
                              line2: address.line2 || '',
                              city: address.city || '',
                              state: address.state || '',
                              postalCode: address.postalCode || '',
                              country: address.country || 'India',
                              phone: address.phone || '',
                              isDefault: Boolean(address.isDefault),
                            })
                          }}
                          className="rounded-full border border-[#9ad9e8] px-3 py-1.5 text-xs font-semibold text-[#0e336b]"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteAddress(address._id)}
                          className="rounded-full border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    {editingAddressId === address._id ? (
                      <div className="mt-4">
                        <AddressForm
                          value={editingAddress}
                          onChange={setEditingAddress}
                          onSubmit={onUpdateAddress}
                          onCancel={() => {
                            setEditingAddressId('')
                            setEditingAddress(emptyAddress)
                          }}
                          submitLabel="Update Address"
                          loading={updatingAddress}
                        />
                      </div>
                    ) : null}
                  </div>
                ))
              )}
            </div>

            <div className="mt-5">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-[#4b728f]">Add New Address</h3>
              <div className="mt-2">
                <AddressForm
                  value={newAddress}
                  onChange={setNewAddress}
                  onSubmit={onAddAddress}
                  submitLabel="Add Address"
                  loading={addingAddress}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="h-fit rounded-3xl border border-[#cdeaf2] bg-white p-6"
        >
          <h2 className="heading-font text-2xl font-semibold text-[#0e336b]">Recent Orders</h2>
          <p className="mt-2 text-sm text-[#0e336b]/65">
            Latest orders from your account.
          </p>

          <div className="mt-4 space-y-3">
            {recentOrders.length === 0 ? (
              <p className="rounded-2xl border border-[#d5edf3] bg-[#f9fdff] p-4 text-sm text-[#0e336b]/70">
                No orders yet.
              </p>
            ) : (
              recentOrders.map((order) => (
                <Link
                  key={order._id}
                  to={`/orders/${order._id}`}
                  className="block rounded-2xl border border-[#d5edf3] p-4 transition hover:border-[#86d7e8] hover:bg-[#f8fdff]"
                >
                  <p className="text-sm font-semibold text-[#0e336b]">Order #{order._id}</p>
                  <p className="mt-1 text-xs uppercase tracking-wide text-[#0e336b]/60">
                    {order.status}
                  </p>
                  <p className="mt-2 text-sm text-[#0e336b]/75">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </Link>
              ))
            )}
          </div>

          <Link
            to="/orders"
            className="mt-5 inline-flex rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold !text-white"
          >
            View all orders
          </Link>
        </motion.aside>
      </div>
    </section>
  )
}
