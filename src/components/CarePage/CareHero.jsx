import { motion as Motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageSquare, CheckCircle2 } from 'lucide-react'
import care from '../../assets/care2.png'

export default function CareHero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden  bg-gradient-to-r  to-[#ece9e4]">
      
      {/* Container */}
      <div className="mx-auto w-full max-w-7xl px-6 py-12 md:px-10 lg:px-3">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-10 ">
          
          {/* --- Left Side: Content --- */}
          <div className="max-w-2xl">
            
            {/* Tag: Pill Style */}
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0e336b]/10 bg-white px-4 py-1.5 text-sm font-semibold text-[#0e336b] shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3dcbe5] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dcbe5]"></span>
              </span>
              Care Services
            </Motion.div>

            {/* Main Headline */}
            <Motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl leading-[1.3] tracking-tight text-[#0e336b] sm:text-5xl lg:text-7xl"
            >
              <span className="font-medium">Care that supports</span> <br />
              {/* Highlighter Effect */}
              <span className="font-black">
                <span className="bg-gradient-to-r from-[#3dcbe5]/30 to-transparent px-2 decoration-clone leading-[1.3]">
                  Life, Comfort & Recovery.
                </span>
              </span>
            </Motion.h1>

            {/* Description */}
            <Motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 text-lg text-[#0e336b]/70 md:text-xl"
            >
              At MedCura, we provide comprehensive healthcare designed to support patients and clinics. Our services focus on <span className="font-bold text-[#0e336b] underline decoration-[#3dcbe5] decoration-2 underline-offset-2">quality, safety, and compassion</span> ensuring care that adapts to real medical needs.
            </Motion.p>

            {/* Checklist */}
            <Motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#0e336b]/80"
            >
              {['24/7 Support', 'Verified Staff', 'Anytime Care'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3dcbe5]" />
                      {item}
                  </div>
              ))}
            </Motion.div>

            {/* Buttons */}
            <Motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link 
                to="/products" 
                className="flex h-14 items-center gap-2 rounded-full bg-[#0e336b] px-8 text-base font-bold !text-white transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                Explore Products
                <ArrowRight className="h-5 w-5" />
              </Link>
              
              <Link 
                to="/contact" 
                className="flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-bold text-[#0e336b] shadow-sm ring-1 ring-[#0e336b]/10 transition-colors hover:bg-[#f0f9fa] hover:text-[#0e336b]"
              >
                <MessageSquare className="h-5 w-5 text-[#3dcbe5]" />
                Talk to a Specialist
              </Link>
            </Motion.div>
          </div>

          {/* --- Right Side: Big Image (No Background) --- */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="flex h-full w-full items-center justify-center lg:justify-end "
          >
            <img 
              src={care} 
              alt="Care Services" 
              className="w-full max-w-none object-contain lg:w-[110%] lg:pl-20" 
            />
          </Motion.div>

        </div>
      </div>
    </section>
  )
}
