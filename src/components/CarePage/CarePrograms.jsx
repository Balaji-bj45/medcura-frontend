import { motion as Motion } from 'framer-motion'

const programs = [
  {
    title: 'Elderly and Geriatric Care',
    summary: 'Dedicated care focused on comfort, safety, and independence.',
    items: [
      'Daily assistance and health supervision',
      'Chronic condition monitoring',
      'Fall prevention and mobility support',
      'Emotional care and companionship',
    ],
  },
  {
    title: 'Chronic Care Management',
    summary: 'Ongoing care for long-term medical conditions.',
    items: [
      'Diabetes and hypertension monitoring',
      'Respiratory care support',
      'Regular health assessments',
      'Equipment and lifestyle guidance',
    ],
  },
  {
    title: 'Post-Surgical Recovery Care',
    summary: 'Structured recovery support after hospital discharge.',
    items: [
      'Wound and medication management',
      'Mobility assistance',
      'Vital monitoring and follow-ups',
      'Recovery progress tracking',
    ],
  },
]

function CarePrograms() {
  return (
    <section className="px-6 pb-16 md:px-10 md:pb-24">
      <div className="mx-auto max-w-6xl rounded-3xl border border-[#3dcbe5] bg-[#edfcfe] p-8 md:p-10">
        <Motion.h2
          className="text-3xl font-bold text-[#0e336b] md:text-4xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Specialized Care Programs
        </Motion.h2>

        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {programs.map((program, index) => (
            <Motion.article
              key={program.title}
              className="rounded-2xl border border-[#3dcbe5] bg-[#edfcfe]/90 p-5"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
            >
              <h3 className="text-lg font-semibold text-[#0e336b]">{program.title}</h3>
              <p className="mt-2 text-sm text-[#0e336b]/70">{program.summary}</p>
              <ul className="mt-4 space-y-2">
                {program.items.map((item) => (
                  <li key={item} className="text-sm text-[#0e336b]/70">
                    {item}
                  </li>
                ))}
              </ul>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CarePrograms

