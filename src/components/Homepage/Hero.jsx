import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  ShieldCheck,
  Truck,
  Headset,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import showcaseOne from "../../assets/GalleryImage/IMG_0059.JPG.jpeg";
import showcaseTwo from "../../assets/GalleryImage/IMG_0238.JPG.jpeg";
import showcaseThree from "../../assets/GalleryImage/IMG_1467.JPG.jpeg";
import showcaseFour from "../../assets/GalleryImage/IMG_1658.JPG.jpeg";
import showcaseFive from "../../assets/GalleryImage/IMG_1703.JPG.jpeg";
import showcaseSix from "../../assets/GalleryImage/IMG_2353.JPG.jpeg";

const trustBadges = [
  {
    title: "Certified",
    icon: ShieldCheck,
  },
  {
    title: "Fast Delivery",
    icon: Truck,
  },
  {
    title: "Support",
    icon: Headset,
  },
];

const CHANNEL_URL = "https://www.youtube.com/@medcubeequipments";
const SHORT_IDS = [
  "08mkfuKlhLk",
  "DhnlVgIuntA",
  "_oy8HXCHCbw",
  "PcOeWt5C4Ic",
  "M1ZkOsLPyMo",
  "U2UJY6wwUBg",
];
const showcaseImages = [
  showcaseOne,
  showcaseTwo,
  showcaseThree,
  showcaseFour,
  showcaseFive,
  showcaseSix,
];
const embedSrc = `https://www.youtube.com/embed/${SHORT_IDS[0]}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1&playlist=${SHORT_IDS.join(
  ","
)}&loop=1`;

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-gradient-to-br from-white via-[#f5fcff] to-[#ecf8ff]">
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-14 md:px-10 lg:px-12">
        <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          
          {/* LEFT SIDE (Unchanged) */}
          <div className="max-w-3xl">
            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0e336b]/10 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-[#0e336b] shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4 text-[#3dcbe5]" />
              Medical Commerce Platform
            </Motion.div>

            <Motion.h1
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl leading-[1.3] tracking-tight text-[#0e336b] sm:text-5xl lg:text-6xl"
            >
              <span className="font-medium"> Medical Equipment</span> <br />
              <span className="font-black">
                <span className="bg-gradient-to-r from-[#3dcbe5]/30 to-transparent px-2 decoration-clone leading-[1.3]">
                  for Hospitals, Clinics & Home
                </span>
              </span>
            </Motion.h1>

            <Motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="mt-8 max-w-lg text-lg text-[#0e336b]/70 md:text-xl"
            >
              Shop certified medical products with transparent pricing, rapid
              fulfillment, and guided care support from the{" "}
              <span className="font-bold text-[#0e336b] underline decoration-[#3dcbe5] decoration-2 underline-offset-2">
                MedCura team.
              </span>
            </Motion.p>

            <Motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-[#0e336b]/80"
            >
              {trustBadges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.title} className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-[#3dcbe5]" />
                    {badge.title}
                  </div>
                );
              })}
            </Motion.div>

            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-10 flex flex-wrap items-center gap-4"
            >
              <Link
                to="/products"
                className="flex h-14 items-center gap-2 rounded-full bg-[#0e336b] px-8 text-base font-bold text-white transition-transform hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="text-white">Shop Equipment</span>
                <ArrowRight className="h-5 w-5 text-white" />
              </Link>

              <Link
                to="/care"
                className="flex h-14 items-center gap-3 rounded-full bg-white px-8 text-base font-bold text-[#0e336b] shadow-sm ring-1 ring-[#0e336b]/10 transition-colors hover:bg-[#f0f9fa] hover:text-[#0e336b]"
              >
                Explore Care Services
              </Link>
            </Motion.div>
          </div>

          {/* RIGHT SIDE (Upgraded Bento Grid UI) */}
          <Motion.aside
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="relative mx-auto w-full max-w-[28rem] lg:ml-auto lg:w-[95%] lg:max-w-none"
          >
            {/* Floating Live Badge */}
            <div className="absolute -right-2 -top-4 z-20 flex items-center gap-2 rounded-full bg-gradient-to-r from-[#0e336b] to-[#144b9e] px-4 py-2 shadow-xl ring-2 ring-white">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#3dcbe5] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#3dcbe5]"></span>
              </span>
              <p className="text-[10px] font-bold uppercase tracking-widest text-white sm:text-xs">
                Live Showcase
              </p>
            </div>

            {/* Main Bento Card */}
            <div className="relative rounded-[2rem] border border-[#0e336b]/10 bg-white/60 p-3 shadow-2xl backdrop-blur-xl sm:rounded-[2.5rem] sm:p-4">
              
              <div className="grid h-[420px] grid-cols-12 grid-rows-6 gap-2 sm:h-[520px] sm:gap-3">
                
                {/* Main Video Segment (Left, takes up 7 columns and all 6 rows for perfect 9:16 aspect ratio) */}
                <div className="relative col-span-7 row-span-6 overflow-hidden rounded-[1.25rem] bg-black shadow-inner sm:rounded-[1.5rem]">
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-900 to-black" />
                  <iframe
                    src={embedSrc}
                    title="MedCube YouTube Shorts Playlist"
                    className="relative z-10 h-full w-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>

                {/* Right Gallery Segment */}
                {/* Top Image */}
                <div className="col-span-5 row-span-2 overflow-hidden rounded-[1rem] bg-gray-100 sm:rounded-[1.25rem]">
                  <img
                    src={showcaseImages[0]}
                    alt="MedCura Equipment 1"
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>

                {/* Middle Split Images */}
                <div className="col-span-5 row-span-2 grid grid-cols-2 gap-2 sm:gap-3">
                  <div className="overflow-hidden rounded-xl bg-gray-100 sm:rounded-[1rem]">
                    <img
                      src={showcaseImages[1]}
                      alt="MedCura Equipment 2"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                  <div className="overflow-hidden rounded-xl bg-gray-100 sm:rounded-[1rem]">
                    <img
                      src={showcaseImages[2]}
                      alt="MedCura Equipment 3"
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-110"
                      loading="lazy"
                    />
                  </div>
                </div>

                {/* Bottom Image */}
                <div className="col-span-5 row-span-2 overflow-hidden rounded-[1rem] bg-gray-100 sm:rounded-[1.25rem]">
                  <img
                    src={showcaseImages[3]}
                    alt="MedCura Equipment 4"
                    className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Bottom Action Bar */}
              <div className="mt-3 flex items-center justify-between rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-[#0e336b]/5 sm:mt-4 sm:px-4 sm:py-3">
                <div className="flex items-center gap-3">
                  {/* Avatar Stack for remaining images */}
                  <div className="flex -space-x-2.5">
                    <img
                      src={showcaseImages[4]}
                      alt="Gallery Teaser 1"
                      className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm sm:h-8 sm:w-8"
                      loading="lazy"
                    />
                    <img
                      src={showcaseImages[5]}
                      alt="Gallery Teaser 2"
                      className="h-7 w-7 rounded-full border-2 border-white object-cover shadow-sm sm:h-8 sm:w-8"
                      loading="lazy"
                    />
                    <div className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#f5fcff] text-[9px] font-bold text-[#0e336b] shadow-sm sm:h-8 sm:w-8 sm:text-[10px]">
                      +More
                    </div>
                  </div>
                  <span className="hidden text-xs font-semibold text-[#0e336b]/70 sm:block">
                    Explore Gallery
                  </span>
                </div>

                <a
                  href={CHANNEL_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-1.5 rounded-full bg-[#f5fcff] px-3 py-1.5 text-xs font-bold text-[#0e336b] transition-all hover:bg-[#0e336b] hover:text-white sm:px-4"
                >
                  <span>YouTube</span>
                  <ExternalLink className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </div>

            </div>
          </Motion.aside>
        </div>
      </div>
    </section>
  );
}