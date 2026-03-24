import { motion } from 'framer-motion'

const galleryModules = import.meta.glob(
  '../../assets/GalleryImage/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
)

const galleryImages = Object.entries(galleryModules)
  .sort(([a], [b]) => a.localeCompare(b))
  .map(([, src]) => src)

function getImageAlt(src, index) {
  const filename = src.split('/').pop().split('.')[0]
  const cleanName = filename.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim()
  return cleanName ? `MedCura gallery - ${cleanName}` : `MedCura gallery image ${index + 1}`
}

function GalleryItem({ src, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="mb-4 break-inside-avoid"
    >
      <img
        src={src}
        alt={getImageAlt(src, index)}
        loading="lazy"
        className="w-full rounded-[1.5rem] border border-[#d9eef4] bg-white object-cover shadow-[0_18px_45px_-34px_rgba(14,51,107,0.28)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-36px_rgba(14,51,107,0.4)]"
      />
    </motion.div>
  )
}

export default function AboutGallery() {
  if (galleryImages.length === 0) return null

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-10 lg:py-20">
      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#3f6e8a]">Life at MedCura</p>
          <h2 className="heading-font mt-3 text-3xl font-semibold text-[#0e336b] sm:text-4xl">Inside our journey</h2>
          <p className="mt-4 text-sm leading-7 text-[#0e336b]/68 sm:text-base">
            A quick look at the people, deliveries, equipment, and day-to-day moments that shape the MedCura story.
          </p>
        </div>

        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-3">
          {galleryImages.map((src, index) => (
            <GalleryItem key={src} src={src} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
