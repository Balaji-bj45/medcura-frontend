import { useEffect, useEffectEvent, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  forgotCustomerPassword,
  loginCustomer,
  loginWithGoogle,
  registerCustomer,
} from '../services/auth.js'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

const GOOGLE_SCRIPT_ID = 'medcura-google-identity-script'
const GOOGLE_CLIENT_ID = (import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()

function loadGoogleIdentityScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve()
      return
    }

    const existingScript = document.getElementById(GOOGLE_SCRIPT_ID)

    if (existingScript) {
      existingScript.addEventListener('load', resolve, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Google sign-in.')),
        { once: true }
      )
      return
    }

    const script = document.createElement('script')
    script.id = GOOGLE_SCRIPT_ID
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = resolve
    script.onerror = () => reject(new Error('Failed to load Google sign-in.'))
    document.head.appendChild(script)
  })
}

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, token } = useAuth()
  const { addToast } = useToast()
  const buttonRef = useRef(null)
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [googleReady, setGoogleReady] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (token) {
      navigate(location.state?.from || '/', { replace: true })
    }
  }, [location.state, navigate, token])

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const clearFeedback = () => {
    setError('')
    setMessage('')
  }

  const handleModeChange = (nextMode) => {
    setMode(nextMode)
    clearFeedback()
  }

  const completeCustomerLogin = (data, toastMessage) => {
    login(data?.token, data?.customer)
    addToast(toastMessage, 'success')
    navigate(location.state?.from || '/', { replace: true })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    clearFeedback()
    setLoading(true)

    try {
      if (mode === 'register') {
        if (form.password !== form.confirmPassword) {
          setError('Passwords do not match.')
          return
        }

        const data = await registerCustomer({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          password: form.password,
        })
        completeCustomerLogin(data, 'Account created successfully.')
        return
      }

      if (mode === 'forgot') {
        const responseMessage = await forgotCustomerPassword({
          email: form.email.trim(),
        })
        setMessage(responseMessage || 'Reset password email sent.')
        addToast('Password reset email sent.', 'success')
        return
      }

      const data = await loginCustomer({
        email: form.email.trim(),
        password: form.password,
      })
      completeCustomerLogin(data, 'Login successful.')
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to continue.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleResponse = useEffectEvent(async (response) => {
    const credential = response?.credential?.trim()

    if (!credential) {
      setError('Google sign-in did not return a valid credential.')
      return
    }

    setGoogleLoading(true)
    clearFeedback()

    try {
      const data = await loginWithGoogle({ credential })
      login(data?.token, data?.customer)
      setMessage(
        data?.isNewUser
          ? 'Your MedCura account has been created with Google.'
          : 'Signed in successfully with Google.'
      )
      addToast(
        data?.isNewUser ? 'Account created successfully.' : 'Login successful.',
        'success'
      )
      navigate(location.state?.from || '/', { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Google sign-in failed.')
    } finally {
      setGoogleLoading(false)
    }
  })

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return
    }

    let isMounted = true

    loadGoogleIdentityScript()
      .then(() => {
        if (!isMounted || !buttonRef.current || !window.google?.accounts?.id) {
          return
        }

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: handleGoogleResponse,
          ux_mode: 'popup',
          auto_select: false,
          context: 'signin',
          use_fedcm_for_prompt: true,
        })

        buttonRef.current.innerHTML = ''
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: 'outline',
          size: 'large',
          text: mode === 'register' ? 'signup_with' : 'continue_with',
          shape: 'pill',
          width: 360,
        })

        setGoogleReady(true)
      })
      .catch(() => {
        if (!isMounted) return
        setError('Unable to load Google sign-in right now. Please try again.')
      })

    return () => {
      isMounted = false
      window.google?.accounts?.id?.cancel()
    }
  }, [mode])

  return (
    <section className="relative overflow-hidden bg-[#f7fdff] px-4 py-12 sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute -left-16 top-16 h-56 w-56 rounded-full bg-[#3dcbe5]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-8 h-56 w-56 rounded-full bg-[#0e336b]/12 blur-3xl" />

      <div className="mx-auto max-w-xl rounded-[28px] border border-[#caeaf1] bg-white/95 p-7 shadow-[0_24px_60px_-42px_rgba(14,51,107,0.55)] sm:p-9">
        <h1 className="heading-font text-3xl font-semibold text-[#0e336b]">
          Customer Account
        </h1>
        <p className="mt-2 text-sm text-[#0e336b]/68">
          Sign in, register, or reset your MedCura customer password from one place.
        </p>

        <div className="mt-6 grid grid-cols-3 rounded-full border border-[#bce8f2] bg-[#f2fbff] p-1">
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'login' ? 'bg-[#0e336b] text-white' : 'text-[#0e336b]/70'
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'register' ? 'bg-[#0e336b] text-white' : 'text-[#0e336b]/70'
            }`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => handleModeChange('forgot')}
            className={`rounded-full px-3 py-2 text-sm font-semibold transition ${
              mode === 'forgot' ? 'bg-[#0e336b] text-white' : 'text-[#0e336b]/70'
            }`}
          >
            Forgot
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'register' ? (
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">
                Full Name
              </label>
              <input
                name="fullName"
                type="text"
                required
                value={form.fullName}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
                placeholder="John Doe"
              />
            </div>
          ) : null}

          <div>
            <label className="text-sm font-semibold text-[#0e336b]">Email ID</label>
            <input
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          {mode !== 'forgot' ? (
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">Password</label>
              <input
                name="password"
                type="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
                placeholder="Enter at least 8 characters"
              />
            </div>
          ) : null}

          {mode === 'register' ? (
            <div>
              <label className="text-sm font-semibold text-[#0e336b]">
                Confirm Password
              </label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={form.confirmPassword}
                onChange={handleChange}
                className="mt-2 w-full rounded-2xl border border-[#caeaf1] px-4 py-3 text-sm shadow-sm focus:border-[#55cce2] focus:outline-none"
                placeholder="Re-enter your password"
              />
            </div>
          ) : null}

          {mode === 'login' ? (
            <button
              type="button"
              onClick={() => handleModeChange('forgot')}
              className="text-sm font-semibold text-[#0e336b]"
            >
              Forgot password?
            </button>
          ) : null}

          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          {message ? <p className="text-sm text-green-600">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#0e336b] px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#18539c] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading
              ? mode === 'forgot'
                ? 'Sending reset link...'
                : 'Please wait...'
              : mode === 'register'
                ? 'Create account'
                : mode === 'forgot'
                  ? 'Send reset link'
                  : 'Login'}
          </button>
        </form>

        <div className="mt-8 rounded-[24px] border border-[#caeaf1] bg-[#f6fcff] p-5">
          <p className="text-sm text-[#0e336b]/75">
            Prefer faster access? Continue with Google and use the same MedCura
            customer profile, cart, checkout, and orders.
          </p>
          <div className="mt-5 flex min-h-12 items-center justify-center">
            <div
              ref={buttonRef}
              className={`w-full max-w-[360px] ${googleReady ? '' : 'opacity-70'}`}
            />
          </div>
          {googleLoading ? (
            <p className="mt-4 text-center text-sm text-[#0e336b]/70">
              Signing you in with Google...
            </p>
          ) : null}
          {!GOOGLE_CLIENT_ID ? (
            <p className="mt-4 text-center text-sm text-[#0e336b]/65">
              Google sign-in is currently not configured.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  )
}
