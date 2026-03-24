import { useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { sendOtp } from '../services/auth.js'
import { useToast } from '../context/ToastContext.jsx'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { addToast } = useToast()
  const [mode, setMode] = useState('login')
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const submitLabel = useMemo(
    () => (mode === 'signup' ? 'Create account with OTP' : 'Continue with OTP'),
    [mode]
  )

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const payload = {
        email: email.trim(),
        purpose: mode,
      }

      if (mode === 'signup') {
        payload.fullName = fullName.trim()
      }

      const response = await sendOtp(payload)

      const otpContext = {
        email: email.trim(),
        fullName: fullName.trim(),
        purpose: mode,
        resendAvailableAt:
          Date.now() + (response?.resendAvailableInSeconds || 45) * 1000,
        otpExpiresInSeconds: response?.otpExpiresInSeconds || 300,
      }

      localStorage.setItem('medcura_otp_context', JSON.stringify(otpContext))
      setMessage('OTP sent. Please check your inbox.')
      addToast('OTP sent successfully.', 'success')
      navigate('/verify-otp', {
        state: { ...otpContext, from: location.state?.from },
      })
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send OTP.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#f7fdff] px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#3dcbe5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-[#0e336b]/12 blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto max-w-xl rounded-[28px] border border-[#caeaf1] bg-white/95 p-7 shadow-[0_24px_60px_-42px_rgba(14,51,107,0.55)] sm:p-9"
      >
        <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">
          {mode === 'signup' ? 'Create your account' : 'Welcome back'}
        </h1>
        <p className="mt-2 text-sm text-[#0e336b]/68">
          {mode === 'signup'
            ? 'Sign up with email OTP. No passwords, no friction.'
            : 'Login securely with your email OTP in seconds.'}
        </p>

        <div className="mt-6 grid grid-cols-2 rounded-full border border-[#bce8f2] bg-[#f2fbff] p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-[#0e336b] text-white' : 'text-[#0e336b]/70'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setMode('signup')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'signup' ? 'bg-[#0e336b] text-white' : 'text-[#0e336b]/70'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' ? (
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">
                Full Name
              </label>
              <input
                type="text"
                required={mode === 'signup'}
                value={fullName}
                onChange={(event) => setFullName(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
                placeholder="John Doe"
              />
            </div>
          ) : null}
          <div>
            <label className="text-sm font-semibold text-[#0e336b]">Email ID</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-600">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18539c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Sending OTP...' : submitLabel}
          </button>
        </form>
      </motion.div>
    </section>
  )
}
