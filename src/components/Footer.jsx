import { Link } from 'react-router-dom'

import { contactNumbers } from '../constants/contact.js'

const quickLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Care Services', to: '/care' },
  { label: 'Products', to: '/products' },
]

const supportLinks = [
  { label: 'Contact', to: '/contact' },
  { label: 'My Orders', to: '/orders' },
  { label: 'Cart', to: '/cart' },
  { label: 'Sign In', to: '/login' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[#bfe9f3] bg-[#021b40] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_1fr_1fr] lg:px-10">
        <section>
          <Link to="/" className="heading-font text-2xl font-semibold">MedCura</Link>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80">
            Medical e-commerce and care support platform for homes, clinics, and hospitals.
          </p>
          <div className="mt-5 grid gap-2 text-sm text-white/85">
            <a href="mailto:support@medcura.com" className="transition hover:text-[#bfeefa]">
              support@medcura.com
            </a>
            {contactNumbers.map((phone) => (
              <a key={phone.raw} href={phone.href} className="transition hover:text-[#bfeefa]">
                {phone.label}
              </a>
            ))}
            <p>Mon-Sat, 9:00 AM - 8:00 PM</p>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bfeefa]">Explore</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {quickLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-[#bfeefa]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#bfeefa]">Support</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/85">
            {supportLinks.map((item) => (
              <li key={item.label}>
                <Link to={item.to} className="transition hover:text-[#bfeefa]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/75 sm:px-6 lg:px-10">
        Copyright {year} MedCura. All rights reserved.
      </div>
    </footer>
  )
}
