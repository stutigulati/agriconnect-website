import { useState, useEffect, useRef } from 'react';
import {
  FaUsers,
  FaStore,
  FaCity,
  FaRupeeSign,
  FaStar,
  FaQuoteLeft,
  FaQuoteRight,
  FaMapMarkerAlt,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';

import farmer1 from '../assets/indian-farmer-1.jpg';
import farmer2 from '../assets/indian-farmer-2.jpg';
import farmer3 from '../assets/indian-farmer-3.jpg';

/* -------------------------------------------------------------------------- */
/* Stats Icons                                                                */
/* -------------------------------------------------------------------------- */
const STAT_ICONS = [
  <FaUsers />,
  <FaStore />,
  <FaCity />,
  <FaRupeeSign />,
];

const STAT_KEYS = ['farmers', 'buyers', 'cities', 'tradeValue'];

const STAT_VALUES = [
  { value: 10000, suffix: '+' },
  { value: 500, suffix: '+' },
  { value: 200, suffix: '+' },
  { value: 50, suffix: 'Cr+' },
];

/* -------------------------------------------------------------------------- */
/* Testimonial Farmer Images                                                  */
/* -------------------------------------------------------------------------- */
const TESTIMONIAL_IMAGES = [farmer1, farmer2, farmer3];

/* -------------------------------------------------------------------------- */
/* Animated Counter                                                           */
/* -------------------------------------------------------------------------- */
const AnimatedCounter = ({ end, suffix, inView }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const duration = 2000;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;

      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [end, inView]);

  return (
    <span>
      {count.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};

/* -------------------------------------------------------------------------- */
/* Floating Particle                                                          */
/* -------------------------------------------------------------------------- */
const Particle = ({ style }) => (
  <motion.div
    className="absolute rounded-full bg-white/10 pointer-events-none"
    style={style}
    animate={{
      y: [0, -30, 0],
      opacity: [0.3, 0.7, 0.3],
    }}
    transition={{
      repeat: Infinity,
      duration: style.width ? style.width / 20 + 3 : 5,
      ease: 'easeInOut',
    }}
  />
);

/* -------------------------------------------------------------------------- */
/* Main Component                                                             */
/* -------------------------------------------------------------------------- */
const TrustSection = () => {
  const { t } = useLanguage();
  const [inView, setInView] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  const testimonials = [0, 1, 2].map((i) => ({
    quote:
      t(`trust.testimonials.${i}.quote`) ||
      [
        'AgriConnect helped me sell my crops directly to buyers and increased my profits significantly.',
        'The weather advisory and expert guidance helped me save my crop during unexpected rain.',
        'The farm dashboard makes it easy to track everything in one place.',
      ][i],
    name:
      t(`trust.testimonials.${i}.name`) ||
      ['Ramesh Patel', 'Sunita Devi', 'Mohan Singh'][i],
    role:
      t(`trust.testimonials.${i}.role`) ||
      ['Farmer, Gujarat', 'Farmer, Punjab', 'Farmer, Rajasthan'][i],
    image: TESTIMONIAL_IMAGES[i],
    stars: 5,
  }));

  const particles = [
    { width: 80, height: 80, top: '10%', left: '5%' },
    { width: 50, height: 50, top: '60%', left: '15%' },
    { width: 120, height: 120, top: '20%', right: '8%' },
    { width: 60, height: 60, bottom: '15%', right: '20%' },
    { width: 40, height: 40, top: '40%', left: '45%' },
  ];

  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Testimonials Section                                               */}
      {/* ------------------------------------------------------------------ */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-14">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-4 border border-green-100">
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                {t('trust.testimonialsBadge')}
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
                {t('trust.testimonialsTitle')}{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                  {t('trust.testimonialsHighlight')}
                </span>
              </h2>

              <div className="w-16 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {testimonials.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="group relative h-full min-h-[345px] bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500 p-8 pb-14 overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-3xl" />

                {/* Opening inverted comma */}
                <FaQuoteLeft className="relative z-10 text-green-100 text-4xl mb-4 group-hover:text-green-200 transition-colors duration-300" />

                <div className="relative z-10 flex gap-1 mb-4">
                  {Array.from({ length: item.stars }).map((_, j) => (
                    <FaStar key={j} className="text-amber-400 text-sm" />
                  ))}
                </div>

                {/* Fixed quote height so all farmer details align */}
                <p className="relative z-10 text-gray-700 text-sm leading-relaxed italic min-h-[90px] mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>

                {/* Farmer details aligned at same level */}
                <div className="relative z-10 flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-100 shadow-sm flex-shrink-0 bg-green-50">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm leading-tight">
                      {item.name}
                    </p>

                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                      <FaMapMarkerAlt className="text-green-500 text-[10px] flex-shrink-0" />
                      <span>{item.role}</span>
                    </p>
                  </div>
                </div>

                {/* Closing inverted comma at last/right-bottom */}
                <FaQuoteRight className="absolute bottom-5 right-7 text-green-100 text-5xl group-hover:text-green-200 transition-colors duration-300 pointer-events-none" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Stats Section                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section id="trust" className="py-24 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-agri-primary via-agri-secondary to-green-700" />

        {/* Background Image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: 0.45,
          }}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 via-green-800/50 to-green-900/60" />

        {/* Floating Blur Orbs */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

        {/* Particles */}
        {particles.map((particle, i) => (
          <Particle key={i} style={particle} />
        ))}

        <div
          className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10"
          ref={ref}
        >
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white/90 text-sm font-semibold rounded-full mb-4 border border-white/10">
                <span className="w-1.5 h-1.5 bg-green-300 rounded-full" />
                {t('trust.statsBadge')}
              </span>

              <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
                {t('trust.statsTitle')}
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STAT_KEYS.map((key, i) => (
              <ScrollReveal key={key} delay={i * 0.1} direction="up">
                <motion.div
                  whileHover={{ y: -6, scale: 1.03 }}
                  transition={{ duration: 0.25 }}
                  className="group bg-gradient-to-br from-green-700/40 to-emerald-800/40 backdrop-blur-md rounded-2xl p-8 border border-green-400/30 text-center transition-all duration-300 hover:from-green-600/50 hover:to-emerald-700/50 hover:border-green-300/50 hover:shadow-2xl hover:shadow-green-900/30"
                >
                  {/* Centered yellow icon */}
                  <motion.div
                    className="w-14 h-14 mx-auto mb-4 flex items-center justify-center text-yellow-400 text-4xl"
                    animate={
                      inView
                        ? {
                            scale: [1, 1.3, 1],
                            rotate: [0, -10, 10, 0],
                            color: ['#facc15', '#fde047', '#facc15'],
                          }
                        : {}
                    }
                    transition={{
                      delay: i * 0.15,
                      duration: 0.8,
                      ease: 'easeOut',
                    }}
                  >
                    {STAT_ICONS[i]}
                  </motion.div>

                  <p className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
                    <AnimatedCounter
                      end={STAT_VALUES[i].value}
                      suffix={STAT_VALUES[i].suffix}
                      inView={inView}
                    />
                  </p>

                  <p className="text-white/70 text-sm font-medium">
                    {t(`trust.stats.${key}`)}
                  </p>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default TrustSection;