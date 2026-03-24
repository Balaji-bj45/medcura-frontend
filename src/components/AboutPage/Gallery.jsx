import React from 'react';
import { motion } from 'framer-motion';

const otherGalleryModules = import.meta.glob(
  '../../assets/GalleryImage/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);
const founderGalleryModules = import.meta.glob(
  '../../assets/founder/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true, import: 'default' }
);

// Customizable Content Configuration
const GALLERY_CONFIG = {
  header: {
    main: "Visual",
    emphasized: "Excellence.",
  },
  sections: {
    founder: "Meet the Founder",
    others: "Achievement Gallery"
  },
  emptyState: "No images available at the moment."
};

const sortGallery = (modules) =>
  Object.entries(modules)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);

const founderImages = sortGallery(founderGalleryModules);
const otherImages = sortGallery(otherGalleryModules);

// Helper function to generate better alt text
const getImageAlt = (src, title, index) => {
  const filename = src.split('/').pop().split('.')[0];
  const cleanName = filename.replace(/[-_]/g, ' ').replace(/\d+/g, '').trim();
  return cleanName ? `${title} - ${cleanName}` : `${title} image ${index + 1}`;
};

const gallerySections = [
  { key: 'founder', title: GALLERY_CONFIG.sections.founder, images: founderImages },
  { key: 'others', title: GALLERY_CONFIG.sections.others, images: otherImages },
].filter((section) => section.images.length > 0);

const GalleryItem = ({ src, index, title }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 1.2,
        delay: index * 0.15,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="relative mb-6 break-inside-avoid"
    >
      <motion.div
        whileHover={{ scale: 1.015 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="relative overflow-hidden rounded-2xl bg-slate-100 group shadow-sm hover:shadow-2xl transition-shadow duration-700"
      >
        <img
          src={src}
          alt={getImageAlt(src, title, index)}
          loading="lazy"
          className="w-full h-auto block object-cover transition duration-1000 group-hover:brightness-110"
        />

        {/* Subtle Interactive Border */}
        <div className="absolute inset-0 border border-black/5 rounded-2xl group-hover:border-[#3dcbe5]/40 transition-colors duration-700" />

        {/* Soft Highlight Shine */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
      </motion.div>
    </motion.div>
  );
};

const GallerySection = ({ title, images, sectionIndex, delayOffset }) => (
  <div className={sectionIndex > 0 ? 'mt-16' : ''}>
    <h3 className="text-2xl md:text-3xl font-semibold text-[#0e336b] mb-8">{title}</h3>
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6">
      {images.map((src, i) => (
        <GalleryItem 
          key={`${title}-${i}`} 
          src={src} 
          index={i + delayOffset}
          title={title}
        />
      ))}
    </div>
  </div>
);

const OriginalMasonryGallery = () => {
  return (
    <section className="bg-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Modern Minimalist Header */}
        <div className="mb-20 space-y-4">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: 40 }}
            transition={{ duration: 1 }}
            className="h-1.5 bg-[#3dcbe5] rounded-full"
          />
          <h2 className="text-4xl md:text-5xl font-light text-[#0e336b] tracking-tight">
            {GALLERY_CONFIG.header.main} <span className="font-bold">{GALLERY_CONFIG.header.emphasized}</span>
          </h2>
        </div>

        {/* The Masonry Container */}
        {gallerySections.length > 0 ? (
          gallerySections.map((section, sectionIndex) => {
            const delayOffset = gallerySections
              .slice(0, sectionIndex)
              .reduce((total, current) => total + current.images.length, 0);

            return (
              <GallerySection
                key={section.key}
                title={section.title}
                images={section.images}
                sectionIndex={sectionIndex}
                delayOffset={delayOffset}
              />
            );
          })
        ) : (
          <div className="text-slate-500 text-center py-12">
            {GALLERY_CONFIG.emptyState}
          </div>
        )}

        {/* Bottom Decorative Element */}
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="mt-20 flex justify-center"
        >
          <div className="flex gap-1.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OriginalMasonryGallery;