import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination } from "swiper/modules";
import { FaChartBar, FaUsers, FaSeedling } from "react-icons/fa";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";

import heroBg from "../assets/hero-bg.png";

const heroSlides = [
  {
    image: heroBg,
    alt: "AgriConnect landing hero",
    firstSlide: true,
  },
  {
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&auto=format&fit=crop",
    alt: "Farmer working in field",
  },
  {
    image:
      "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=1600&auto=format&fit=crop",
    alt: "Fresh vegetables",
  },
  {
    image:
      "https://images.unsplash.com/photo-1518843875459-f738682238a6?w=1600&auto=format&fit=crop",
    alt: "Vegetable harvest",
  },
  {
    image:
      "https://images.unsplash.com/photo-1582515073490-39981397c445?w=1600&auto=format&fit=crop",
    alt: "Tomato crop",
  },
  {
    image:
      "https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=1600&auto=format&fit=crop",
    alt: "Agriculture field",
  },
];

const stats = [
  {
    value: "10K+",
    label: "Farmers Connected",
  },
  {
    value: "500+",
    label: "Verified Buyers",
  },
  {
    value: "200+",
    label: "Cities Covered",
  },
  {
    value: "24/7",
    label: "Smart Agri Support",
  },
];

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isFirstSlide = activeSlide === 0;

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Background Swiper */}
      <div className="absolute inset-0 z-0">
        <Swiper
          modules={[Autoplay, EffectFade, Pagination]}
          effect="fade"
          loop={true}
          speed={1000}
          autoplay={{
            delay: 2200,
            disableOnInteraction: false,
          }}
          onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
          pagination={{
            clickable: true,
          }}
          allowTouchMove={false}
          className="w-full h-full
            [&_.swiper-pagination]:!bottom-6
            [&_.swiper-pagination-bullet]:!w-2
            [&_.swiper-pagination-bullet]:!h-2
            [&_.swiper-pagination-bullet]:!bg-white
            [&_.swiper-pagination-bullet]:!opacity-80
            [&_.swiper-pagination-bullet-active]:!w-8
            [&_.swiper-pagination-bullet-active]:!rounded-full
            [&_.swiper-pagination-bullet-active]:!bg-green-500
            [&_.swiper-pagination-bullet-active]:!opacity-100"
        >
          {heroSlides.map((slide, index) => (
            <SwiperSlide
              key={index}
              className="overflow-hidden"
              data-swiper-autoplay={index === 0 ? 2900 : 2200}
            >
              {({ isActive }) => (
                <motion.img
                  src={slide.image}
                  alt={slide.alt}
                  loading={index === 0 ? "eager" : "lazy"}
                  className="w-full h-full object-cover"
                  initial={{ scale: 1.03 }}
                  animate={
                    isActive
                      ? slide.firstSlide
                        ? { scale: [1.03, 1.14, 1.06] }
                        : { scale: [1.04, 1.1] }
                      : { scale: 1.03 }
                  }
                  transition={
                    slide.firstSlide
                      ? {
                          duration: 2.5,
                          ease: "easeInOut",
                        }
                      : {
                          duration: 2.2,
                          ease: "easeOut",
                        }
                  }
                />
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-black/75 via-black/35 to-black/30" />

      {/* Content */}
      <div className="relative z-10 w-full px-5 pt-24">
        <AnimatePresence mode="wait">
          {isFirstSlide ? (
            /* First Image Content - As It Is */
            <motion.div
              key="first-slide-content"
              initial={{ opacity: 0, y: 35 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-6xl text-center"
            >
              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="mb-5 inline-flex items-center rounded-full border border-white/50 bg-white/20 px-5 py-2 text-sm font-bold uppercase tracking-[0.25em] text-white backdrop-blur-md shadow-[0_10px_35px_rgba(0,0,0,0.25)]"
                style={{
                  textShadow: "0 3px 12px rgba(0,0,0,0.9)",
                }}
              >
                Welcome to AgriConnect
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.9, delay: 0.25 }}
                className="text-5xl font-black leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                style={{
                  textShadow:
                    "0 8px 30px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,1)",
                }}
              >
                One Stop Solution
                <span className="block text-green-300">For All</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.45 }}
                className="mx-auto mt-6 max-w-3xl text-base font-semibold leading-relaxed text-white sm:text-lg md:text-xl"
                style={{
                  textShadow:
                    "0 5px 18px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,1)",
                }}
              >
                Connecting farmers, buyers and agronomists with smart crop
                support, market access, mandi updates and expert guidance.
              </motion.p>

              {/* Professional Stats */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.65 }}
                className="mx-auto mt-12 grid max-w-5xl grid-cols-2 gap-4 md:grid-cols-4"
              >
                {stats.map((item, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ y: -6, scale: 1.03 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-3xl border border-white/40 bg-white/20 px-4 py-6 text-center backdrop-blur-md shadow-[0_15px_45px_rgba(0,0,0,0.28)]"
                  >
                    <h3
                      className="text-3xl font-black text-white sm:text-4xl"
                      style={{
                        textShadow: "0 4px 14px rgba(0,0,0,0.95)",
                      }}
                    >
                      {item.value}
                    </h3>

                    <p
                      className="mt-2 text-xs font-bold uppercase tracking-wide text-white sm:text-sm"
                      style={{
                        textShadow: "0 3px 10px rgba(0,0,0,0.9)",
                      }}
                    >
                      {item.label}
                    </p>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          ) : (
            /* Second To Last Image Content */
            <motion.div
              key="other-slide-content"
              initial={{ opacity: 0, x: -35 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 25 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto max-w-7xl"
            >
              <div className="max-w-3xl text-left">
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="mb-7 inline-flex items-center gap-2 rounded-full border border-green-200 bg-white/95 px-5 py-2 text-xs font-black uppercase tracking-wider text-green-800 shadow-lg"
                >
                  <FaSeedling className="text-green-600" />
                  The Future of Farming
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.18 }}
                  className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl"
                  style={{
                    textShadow:
                      "0 8px 28px rgba(0,0,0,0.95), 0 3px 10px rgba(0,0,0,1)",
                  }}
                >
                  Connect Farmers,
                  <span className="block text-green-300">
                    Buyers &amp; Experts
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.32 }}
                  className="mt-6 max-w-2xl text-base font-extrabold leading-7 text-white sm:text-lg"
                  style={{
                    textShadow:
                      "0 5px 16px rgba(0,0,0,0.95), 0 2px 8px rgba(0,0,0,1)",
                  }}
                >
                  Real-time mandi prices, hyper-local weather alerts, and direct
                  marketplace access — all in one place to empower your harvest.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.46 }}
                  className="mt-9 flex flex-wrap items-center gap-4"
                >
                  <button className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-7 py-4 text-sm font-black text-white shadow-xl shadow-green-900/30 transition-all duration-300 hover:-translate-y-1 hover:bg-green-700 hover:shadow-2xl">
                    <FaChartBar />
                    Check Mandi Prices
                  </button>

                  <button className="inline-flex items-center gap-2 rounded-xl bg-white px-7 py-4 text-sm font-black text-green-900 shadow-xl shadow-black/20 transition-all duration-300 hover:-translate-y-1 hover:bg-green-50 hover:shadow-2xl">
                    <FaUsers />
                    Join now
                  </button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default Hero;