import { motion as Motion } from 'framer-motion'

const reviews = [
  {
    name: 'Dr. Arunachalam',
    role: 'Medical Practitioner',
    text: 'Medcura has been consistently reliable with equipment quality and response time. Their team understands clinical urgency and handles deliveries with professionalism. This level of service is valuable for both patients and practitioners.',
    rating: 5,
  },
  {
    name: 'Dr. Manikavasagam',
    role: 'Doctor',
    text: 'Our experience with Medcura has been smooth and dependable. The equipment condition, installation process, and coordination were handled efficiently. A trustworthy provider for medical equipment requirements.',
    rating: 5,
  },
  {
    name: 'Ayesha N.',
    role: 'Daughter & Caregiver',
    text: 'MedCura made home recovery easier for my father. Delivery was quick and setup guidance was clear. Great experience from start to finish.',
    rating: 5,
  },
]

function Testimonials() {
  return (
    <section className="bg-[#edfcfe] px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-6xl">
        
        {/* Header */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <span className="text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-[#48d1e9]">
              Testimonials
            </span>
            <h2 className="mt-3 text-[1.85rem] font-bold leading-tight text-[#0e336b] md:text-[2.5rem]">
              Trusted by Doctors
              <br />
              & Families
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-xl text-[#0e336b]">★</span>
              ))}
            </div>
            <span className="ml-2 text-sm font-semibold text-[#0e336b]">4.9/5</span>
            <span className="text-sm text-[#48d1e9]">(500+ reviews)</span>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="grid gap-5 md:grid-cols-3">
          {reviews.map((review, i) => (
            <Motion.article
              key={review.name}
              className="group flex flex-col justify-between rounded-2xl bg-[#edfcfe] p-7 transition-all hover:bg-white hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div>
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} className="text-base text-[#0e336b]">★</span>
                  ))}
                </div>
                
                {/* Text */}
                <p className="mt-4 text-[0.95rem] leading-relaxed text-[#0e336b]/70">
                  "{review.text}"
                </p>
              </div>
              
              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0e336b] text-sm font-bold text-white">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#0e336b]">
                    {review.name}
                  </p>
                  <p className="text-xs text-[#48d1e9]">
                    {review.role}
                  </p>
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials