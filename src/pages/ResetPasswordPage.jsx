import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { resetCustomerPassword } from '../services/auth.js'
import { useToast } from '../context/ToastContext.jsx'

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const token = searchParams.get('token') || ''

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setMessage('')

    if (!token) {
      setError('Reset token is missing from the link.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const responseMessage = await resetCustomerPassword({ token, password })
      setMessage(responseMessage || 'Password reset successful.')
      addToast('Password reset successful.', 'success')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#f7fdff] px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#3dcbe5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-[#0e336b]/12 blur-3xl" />

      <div className="mx-auto max-w-lg rounded-[28px] border border-[#caeaf1] bg-white/95 p-7 shadow-[0_24px_60px_-42px_rgba(14,51,107,0.55)] sm:p-9">
        <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-[#0e336b]/68">
          Enter your new password to complete your MedCura customer password reset.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-[#0e336b]">New Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
              placeholder="Enter at least 8 characters"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0e336b]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
              placeholder="Re-enter your new password"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-green-600">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18539c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Resetting password...' : 'Reset password'}
          </button>
        </form>

        <Link
          to="/login"
          className="mt-5 inline-flex text-sm font-semibold text-[#0e336b]"
        >
          Back to login
        </Link>
      </div>
    </section>
  )
}
