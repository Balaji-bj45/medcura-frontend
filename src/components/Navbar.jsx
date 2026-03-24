import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ChevronDown, CircleUserRound, Menu, ShoppingCart, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import logo from '../assets/logo.PNG'

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/care', label: 'Care Services' },
  { to: '/contact', label: 'Contact' },
  { to: '/products', label: 'Products' },
]

export default function Navbar() {
  const { token, customer, logout } = useAuth()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const customerInitial = useMemo(() => {
    const source = customer?.fullName || customer?.email || ''
    return source ? source.trim().charAt(0).toUpperCase() : 'U'
  }, [customer])

  useEffect(() => {
    if (!menuOpen) return undefined
    const handleClickOutside = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [menuOpen])

  const linkClass = ({ isActive }) =>
    `text-sm font-semibold transition ${isActive ? 'text-[#0e336b]' : 'text-[#0e336b]/70 hover:text-[#0e336b]'}`

  return (
    <header className="sticky top-0 z-30 border-b border-[#c4e9f2] bg-[#edfcfe]/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
        
        {/* Changed: Replaced text with Logo Image */}
        <Link to="/">
          <img src={logo} alt="MedCura" className="h-12 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'} className={linkClass}>
              {link.label}
            </NavLink>
          ))}
          <NavLink to="/cart" className={linkClass}>
            <span className="inline-flex items-center gap-1">
              <ShoppingCart className="h-4 w-4" />
              Cart
            </span>
            <span className="ml-2 rounded-full bg-[#0e336b] px-2 py-0.5 text-xs font-semibold text-white">{count}</span>
          </NavLink>
          {token ? (
            <NavLink to="/orders" className={linkClass}>
              My Orders
            </NavLink>
          ) : null}
        </nav>

        <div className="flex items-center gap-3">
          {!token ? (
            <Link
              to="/login"
              className="hidden rounded-full bg-[#0e336b] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[#1656a2] lg:inline-flex"
            >
              Sign In
            </Link>
          ) : (
            <div ref={menuRef} className="relative hidden lg:block">
              <button
                type="button"
                onClick={() => setMenuOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 rounded-full border border-[#8ec7d6] bg-white px-2.5 py-1.5 text-sm font-semibold text-[#0e336b] transition hover:bg-[#dff7fb]"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#0e336b] text-xs font-bold text-white">
                  {customerInitial}
                </span>
                <ChevronDown className="h-4 w-4" />
              </button>

              {menuOpen ? (
                <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-[#caeaf1] bg-white p-2 shadow-[0_18px_40px_-30px_rgba(14,51,107,0.65)]">
                  <div className="border-b border-[#e4f1f6] px-3 py-2">
                    <p className="truncate text-sm font-semibold text-[#0e336b]">
                      {customer?.fullName || 'Customer'}
                    </p>
                    <p className="truncate text-xs text-[#0e336b]/60">
                      {customer?.email || ''}
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#0e336b] transition hover:bg-[#f2fbff]"
                  >
                    <CircleUserRound className="h-4 w-4" />
                    Profile
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setMenuOpen(false)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-[#0e336b] transition hover:bg-[#f2fbff]"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    My Orders
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      logout()
                      setMenuOpen(false)
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-[#c62f2f] transition hover:bg-[#fff1f1]"
                  >
                    Logout
                  </button>
                </div>
              ) : null}
            </div>
          )}
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#bfe9f3] text-[#0e336b] lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
      {open ? (
        <nav className="border-t border-[#c4e9f2] bg-white px-4 py-4 sm:px-6 lg:hidden">
          <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink to="/cart" className={linkClass} onClick={() => setOpen(false)}>
              Cart ({count})
            </NavLink>
            {token ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  Profile
                </NavLink>
                <NavLink to="/orders" className={linkClass} onClick={() => setOpen(false)}>
                  My Orders
                </NavLink>
              </>
            ) : null}

            {!token ? (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="rounded-full bg-[#0e336b] px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="rounded-full border border-[#8ec7d6] px-4 py-2 text-sm font-semibold text-[#0e336b]"
              >
                Logout
              </button>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  )
}