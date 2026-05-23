import { useState, useMemo } from 'react'
import { submitServiceEnquiry } from '../services/enquiries.js'
import { useToast } from '../context/ToastContext.jsx'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'
import {
  contactNumbers,
  officeAddressLines,
  officeMapQuery,
  whatsappNumber,
} from '../constants/contact.js'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  serviceType: 'Home ICU Setup',
  message: '',
}

const serviceOptions = [
  'Home ICU Setup',
  'Home Nursing Care',
  'Elder Care',
  'Post-Surgery Care',
  'Medical Equipment Guidance',
]

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactPage() {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const { addToast } = useToast()

  // Validation Logic
  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Name is required'
    if (!form.phone.trim()) next.phone = 'Phone is required'
    if (form.email && !emailRegex.test(form.email)) next.email = 'Enter a valid email'
    if (!form.message.trim()) next.message = 'Please enter your requirement'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    try {
      await submitServiceEnquiry(form)
      addToast('Enquiry submitted successfully. Our team will contact you soon.', 'success')
      setForm(initialForm)
    } catch (err) {
      addToast(err.response?.data?.message || 'Unable to submit enquiry.', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#0e336b]">
      
      {/* --- Header Section --- */}
      <div className="relative rounded-b-[3rem] bg-[#edfcfe] pb-20 pt-16 text-center overflow-hidden">
        {/* Decorative Arrows Left */}
        <div className="absolute left-10 top-20 hidden text-[#3dcbe5]/30 md:block pointer-events-none">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M0 10 L15 20 L0 30 M20 10 L35 20 L20 30 M40 10 L55 20 L40 30" />
          </svg>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-[#0e336b] md:text-6xl heading-font">
          Contact MedCura
        </h1>
        
        {/* Wavy Underline */}
        <div className="mx-auto mt-4 w-24 text-[#3dcbe5]">
          <svg viewBox="0 0 100 20" fill="none" stroke="currentColor" strokeWidth="4">
            <path d="M0 10 Q25 20 50 10 T100 10" />
          </svg>
        </div>

        <p className="mx-auto mt-6 max-w-2xl px-6 text-[#0e336b]/70 leading-relaxed">
          Need equipment support, care services, or urgent home ICU coordination? Submit your request and our team will respond quickly.
        </p>

        {/* Decorative Arrows Right */}
        <div className="absolute right-10 bottom-20 hidden text-[#3dcbe5]/30 md:block pointer-events-none">
          <svg width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M0 10 L15 20 L0 30 M20 10 L35 20 L20 30 M40 10 L55 20 L40 30" />
          </svg>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 -mt-10 mb-20 relative z-10">
        
        {/* --- Main Grid: Form Left, Dark Card Right --- */}
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr] mt-10">
          
          {/* Left Column: Form */}
          <form onSubmit={onSubmit} className="space-y-5 rounded-3xl bg-white p-2 md:p-4">
            <h2 className="sr-only">Service Enquiry Form</h2>
            
            <div className="grid gap-5 md:grid-cols-2">
              {/* Name */}
              <div>
                <input
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Full Name *"
                  className={`w-full rounded-full bg-[#f0f9fa] px-6 py-4 text-[#0e336b] placeholder-[#0e336b]/50 focus:outline-none focus:ring-2 ${errors.name ? 'ring-2 ring-red-400' : 'focus:ring-[#3dcbe5]'}`}
                />
                {errors.name && <p className="mt-1 ml-4 text-xs text-red-500">{errors.name}</p>}
              </div>

              {/* Phone */}
              <div>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="Phone Number *"
                  className={`w-full rounded-full bg-[#f0f9fa] px-6 py-4 text-[#0e336b] placeholder-[#0e336b]/50 focus:outline-none focus:ring-2 ${errors.phone ? 'ring-2 ring-red-400' : 'focus:ring-[#3dcbe5]'}`}
                />
                {errors.phone && <p className="mt-1 ml-4 text-xs text-red-500">{errors.phone}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={onChange}
                placeholder="Email Address (Optional)"
                className={`w-full rounded-full bg-[#f0f9fa] px-6 py-4 text-[#0e336b] placeholder-[#0e336b]/50 focus:outline-none focus:ring-2 ${errors.email ? 'ring-2 ring-red-400' : 'focus:ring-[#3dcbe5]'}`}
              />
              {errors.email && <p className="mt-1 ml-4 text-xs text-red-500">{errors.email}</p>}
            </div>

            {/* Service Type Dropdown */}
            <div className="relative">
                <select
                    name="serviceType"
                    value={form.serviceType}
                    onChange={onChange}
                    className="w-full appearance-none rounded-full bg-[#f0f9fa] px-6 py-4 text-[#0e336b] focus:outline-none focus:ring-2 focus:ring-[#3dcbe5] cursor-pointer"
                >
                    {serviceOptions.map((service) => (
                    <option key={service} value={service}>
                        {service}
                    </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-6 flex items-center px-2 text-[#0e336b]">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>

            {/* Message */}
            <div>
              <textarea
                name="message"
                value={form.message}
                onChange={onChange}
                rows={5}
                placeholder="Requirement Details *"
                className={`w-full rounded-3xl bg-[#f0f9fa] px-6 py-4 text-[#0e336b] placeholder-[#0e336b]/50 focus:outline-none focus:ring-2 ${errors.message ? 'ring-2 ring-red-400' : 'focus:ring-[#3dcbe5]'}`}
              />
              {errors.message && <p className="mt-1 ml-4 text-xs text-red-500">{errors.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-[#3f6e8a] px-10 py-4 font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#0e336b] disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Enquiry'}
            </button>
          </form>

          {/* Right Column: Dark Info Card */}
          <div className="flex flex-col justify-center rounded-3xl bg-[#03255a] p-8 text-white shadow-xl lg:p-12">
            <h2 className="mb-4 text-2xl font-bold heading-font">Direct Assistance</h2>
            <p className="mb-8 text-white/80 leading-relaxed">
              For urgent requirements regarding home ICU setups or immediate care, 
              connect directly with our support desk.
            </p>
            
            <div className="space-y-4">
                <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noreferrer" 
                    className="flex w-full items-center justify-center rounded-full bg-[#0e336b] py-4 font-semibold text-white transition hover:bg-[#0d2548]"
                >
                    <MessageCircle className="mr-2 h-5 w-5" />
                    WhatsApp Support
                </a>
                
                <div className="rounded-2xl bg-[#0e336b]/30 p-4 backdrop-blur-sm border border-white/10">
                    <p className="text-sm font-semibold opacity-80">Office Hours</p>
                    <p className="text-lg">Mon - Sat: 9:00 AM - 8:00 PM</p>
                </div>
            </div>
          </div>
        </div>

        {/* --- Three Contact Cards Section --- */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
            
          {/* Phone Card */}
          <div className="flex flex-col items-center justify-center rounded-3xl bg-[#cff6fc] p-8 text-center transition hover:-translate-y-1">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0e336b] shadow-sm">
                <Phone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0e336b]">Phone</h3>
            <p className="mt-2 text-sm text-[#0e336b]/70">Call for rapid response</p>
            <div className="mt-1 flex flex-col gap-1">
              {contactNumbers.map((phone) => (
                <a key={phone.raw} href={phone.href} className="font-semibold text-[#0e336b] hover:underline">
                  {phone.label}
                </a>
              ))}
            </div>
          </div>

          {/* Email Card */}
          <div className="flex flex-col items-center justify-center rounded-3xl bg-[#e3fdfd] p-8 text-center transition hover:-translate-y-1">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#0e336b] shadow-sm">
                <Mail className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0e336b]">Email</h3>
            <p className="mt-2 text-sm text-[#0e336b]/70">Send us your queries</p>
            <a href="mailto:connect@thajiratechworks.com" className="mt-1 font-semibold text-[#0e336b] hover:underline break-all">
              connect@thajiratechworks.com
            </a>
          </div>

          {/* Location Card */}
          <div className="flex flex-col items-center justify-center rounded-3xl bg-white border border-[#edfcfe] p-8 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#edfcfe] text-[#0e336b]">
                <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-[#0e336b]">Headquarters</h3>
            <p className="mt-2 text-sm text-[#0e336b]/70">
              {officeAddressLines[0]}<br />{officeAddressLines[1]}
            </p>
          </div>

        </div>

        {/* --- Map Section --- */}
        <div className="mt-16 overflow-hidden rounded-[2.5rem] shadow-lg border border-[#edfcfe]">
            <div className="relative h-[400px] w-full">
                {/* Floating Card on Map */}
                <div className="absolute left-6 top-6 z-10 hidden rounded-2xl bg-white p-4 shadow-lg md:block border border-[#edfcfe]">
                    <p className="font-bold text-[#0e336b]">MedCura Location</p>
                    <div className="flex items-center gap-1 text-xs text-yellow-500">
                        <span>★★★★★</span>
                        <span className="text-gray-400">(4.8)</span>
                    </div>
                </div>

                <iframe
                    title="MedCura Location"
                    src={`https://www.google.com/maps?q=${officeMapQuery}&output=embed`}
                    className="h-full w-full border-0"
                    allowFullScreen=""
                    loading="lazy"
                />
            </div>
        </div>

      </div>
    </div>
  )
}
