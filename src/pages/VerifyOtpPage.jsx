import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'
import { sendOtp, verifyOtp } from '../services/auth.js'

const OTP_LENGTH = 6

export default function VerifyOtpPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const { addToast } = useToast()
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [purpose, setPurpose] = useState('login')
  const [redirectTo, setRedirectTo] = useState('/checkout')
  const [otpDigits, setOtpDigits] = useState(() => Array.from({ length: OTP_LENGTH }, () => ''))
  const [resendAvailableAt, setResendAvailableAt] = useState(0)
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const inputRefs = useRef([])

  useEffect(() => {
    const storedContextRaw = localStorage.getItem('medcura_otp_context')
    const storedContext = storedContextRaw ? JSON.parse(storedContextRaw) : null
    const merged = {
      ...(storedContext || {}),
      ...(location.state || {}),
    }

    setEmail(merged.email || '')
    setFullName(merged.fullName || '')
    setPurpose(merged.purpose || 'login')
    setResendAvailableAt(Number(merged.resendAvailableAt) || 0)

    if (location.state?.from) {
      setRedirectTo(location.state.from)
    }
  }, [location.state])

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const otp = useMemo(() => otpDigits.join(''), [otpDigits])
  const [now, setNow] = useState(Date.now())
  const remainingMs = Math.max(resendAvailableAt - now, 0)
  const remainingSeconds = Math.ceil(remainingMs / 1000)
  const canResend = remainingSeconds <= 0 && !!email

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(interval)
  }, [])

  const updateDigit = (index, rawValue) => {
    const onlyDigits = rawValue.replace(/\D/g, '')
    if (!onlyDigits) {
      setOtpDigits((prev) => {
        const next = [...prev]
        next[index] = ''
        return next
      })
      return
    }

    const nextDigits = [...otpDigits]
    for (let i = 0; i < onlyDigits.length; i += 1) {
      const targetIndex = index + i
      if (targetIndex < OTP_LENGTH) {
        nextDigits[targetIndex] = onlyDigits[i]
      }
    }
    setOtpDigits(nextDigits)

    const nextFocusIndex = Math.min(index + onlyDigits.length, OTP_LENGTH - 1)
    inputRefs.current[nextFocusIndex]?.focus()
  }

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (!pasted) return
    event.preventDefault()

    const next = Array.from({ length: OTP_LENGTH }, (_, index) => pasted[index] || '')
    setOtpDigits(next)
    const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
    inputRefs.current[focusIndex]?.focus()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')
    try {
      const data = await verifyOtp({
        email: email.trim(),
        otp,
        fullName: fullName.trim(),
        purpose,
      })

      const token = data.token || data.jwt || data.accessToken
      const customer = data.customer || data.user || { email, fullName }
      if (!token) {
        throw new Error('Token missing from response.')
      }

      login(token, customer)
      localStorage.removeItem('medcura_otp_context')
      addToast('Login successful.', 'success')
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Invalid OTP.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (!canResend) return
    setResending(true)
    setError('')
    setMessage('')
    try {
      const response = await sendOtp({
        email: email.trim(),
        fullName: fullName.trim(),
        purpose,
      })

      const nextContext = {
        email: email.trim(),
        fullName: fullName.trim(),
        purpose,
        resendAvailableAt: Date.now() + (response?.resendAvailableInSeconds || 45) * 1000,
        otpExpiresInSeconds: response?.otpExpiresInSeconds || 300,
      }
      localStorage.setItem('medcura_otp_context', JSON.stringify(nextContext))
      setResendAvailableAt(nextContext.resendAvailableAt)
      setOtpDigits(Array.from({ length: OTP_LENGTH }, () => ''))
      inputRefs.current[0]?.focus()
      setMessage('A new OTP has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP.')
    } finally {
      setResending(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-[#f7fdff] px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-24 top-10 h-60 w-60 rounded-full bg-[#0e336b]/12 blur-3xl" />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="mx-auto max-w-xl rounded-[28px] border border-[#caeaf1] bg-white p-7 shadow-[0_24px_60px_-42px_rgba(14,51,107,0.55)] sm:p-9"
      >
        <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">
          Verify OTP
        </h1>
        <p className="mt-2 text-sm text-[#0e336b]/68">
          Enter the OTP sent to {email || 'your email'}.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-[#0e336b]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-[#0e336b]">OTP</label>
            <div className="mt-2 grid grid-cols-6 gap-2 sm:gap-3" onPaste={handlePaste}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    inputRefs.current[index] = element
                  }}
                  value={digit}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  onChange={(event) => updateDigit(index, event.target.value)}
                  onKeyDown={(event) => handleKeyDown(index, event)}
                  className="h-12 rounded-xl border border-[#caeaf1] text-center text-xl font-semibold text-[#0e336b] shadow-sm focus:border-[#55cce2] focus:outline-none"
                />
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-emerald-700">{message}</p>}

          <div className="flex items-center justify-between text-sm">
            <span className="text-[#0e336b]/65">
              {canResend ? 'Didn’t receive the code?' : `Resend available in ${remainingSeconds}s`}
            </span>
            <button
              type="button"
              disabled={!canResend || resending}
              onClick={handleResend}
              className="font-semibold text-[#0e336b] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend OTP'}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== OTP_LENGTH}
            className="w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18539c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Verifying...' : 'Verify & Continue'}
          </button>
        </form>
      </motion.div>
    </section>
  )
}
