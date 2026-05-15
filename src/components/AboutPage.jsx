import { useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSeedling, FaLeaf, FaHandshake, FaUsers, FaBrain,
  FaChartLine, FaCloudSun, FaShieldAlt, FaStore,
  FaCamera, FaRobot, FaSatellite, FaLanguage,
  FaMobileAlt, FaTint, FaChartBar, FaDrumstickBite,
  FaGraduationCap, FaLightbulb, FaCode, FaRocket,
  FaArrowRight, FaCheckCircle, FaExclamationTriangle,
  FaStethoscope, FaIndustry, FaUniversity, FaMedkit,
} from 'react-icons/fa';
import { GiWheat, GiFarmer, GiPlantRoots, GiDeliveryDrone } from 'react-icons/gi';
import { MdAgriculture, MdOutlinePrecisionManufacturing } from 'react-icons/md';
import Navbar from './Navbar';
import Footer from './Footer';
import farmerImg    from '../assets/farmer.jpg';
import agronomistImg from '../assets/agronomist.jpg';
import buyerImg     from '../assets/buyer.jpg';
import gogLogo      from '../assets/gog-logo.png';

// ─── Animation helpers ────────────────────────────────────────────────────────
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeLeft = (delay = 0) => ({
  initial: { opacity: 0, x: -32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

const fadeRight = (delay = 0) => ({
  initial: { opacity: 0, x: 32 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] },
});

// ─── Counter component ────────────────────────────────────────────────────────
function AnimCounter({ target, suffix = '', duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView || !ref.current) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      if (ref.current) ref.current.textContent = Math.round(start) + suffix;
      if (start >= target) clearInterval(timer);
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, target, suffix, duration]);

  return <span ref={ref}>0{suffix}</span>;
}

// ─── Section badge ────────────────────────────────────────────────────────────
function SectionBadge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-4">
      <span className="w-2 h-2 bg-green-500 rounded-full" />
      {children}
    </span>
  );
}

// ─── Page image with hover zoom ───────────────────────────────────────────────
function FeatureImage({ src, alt, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-3xl shadow-2xl ${className}`}>
      <img
        src={src} alt={alt}
        className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  );
}

export default function AboutPage({ onLoginOpen, onSignupOpen } = {}) {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const problems = [
    { icon: <FaHandshake className="text-red-500 text-2xl" />, stat: '30%', label: 'Profit lost to intermediaries', desc: 'Farmers earn far less than market price due to layers of middlemen' },
    { icon: <FaGraduationCap className="text-amber-500 text-2xl" />, stat: '68%', label: 'Rural areas lack expert access', desc: 'Qualified agronomists are concentrated in cities, unreachable for rural farmers' },
    { icon: <FaChartLine className="text-blue-500 text-2xl" />, stat: '5x', label: 'Price variance across states', desc: 'Same crop fetches vastly different prices just 200km apart due to information gap' },
    { icon: <FaExclamationTriangle className="text-rose-500 text-2xl" />, stat: '40%', label: 'Crop loss from late disease detection', desc: 'Farmers can\'t identify crop diseases early, leading to preventable losses' },
  ];

  const features = [
    { icon: <FaCamera className="text-green-600" />, label: 'Image-based Crop Diagnosis' },
    { icon: <FaChartLine className="text-green-600" />, label: 'Mandi Price Analytics' },
    { icon: <FaCloudSun className="text-green-600" />, label: 'Weather Forecasting' },
    { icon: <FaBrain className="text-green-600" />, label: 'AI Crop Advisory' },
    { icon: <FaUsers className="text-green-600" />, label: 'Farmer Community' },
    { icon: <FaStore className="text-green-600" />, label: 'Direct Buyer Marketplace' },
    { icon: <FaShieldAlt className="text-green-600" />, label: 'Verified Expert Network' },
    { icon: <MdAgriculture className="text-green-600" />, label: 'Crop Management Tools' },
  ];

  const workflow = [
    {
      img: farmerImg,
      title: 'Farmers',
      subtitle: 'The Heart of AgriConnect',
      icon: <GiFarmer className="text-3xl text-white" />,
      color: 'from-green-600 to-emerald-700',
      border: 'border-green-200',
      bg: 'from-green-50 to-emerald-50',
      points: [
        'Upload crop images for instant disease diagnosis',
        'Post farming questions to get expert responses',
        'Access live mandi prices before selling',
        'Receive AI-driven crop advisory reports',
        'Connect directly with buyers — no middlemen',
      ],
    },
    {
      img: agronomistImg,
      title: 'Agronomists',
      subtitle: 'Verified Agricultural Experts',
      icon: <GiPlantRoots className="text-3xl text-white" />,
      color: 'from-teal-600 to-green-700',
      border: 'border-teal-200',
      bg: 'from-teal-50 to-green-50',
      points: [
        'Provide verified advice to farmer queries',
        'Analyse crop condition photos remotely',
        'Support agricultural decision-making at scale',
        'Build a verified expert profile on the platform',
        'Contribute to community crop knowledge base',
      ],
    },
    {
      img: buyerImg,
      title: 'Buyers',
      subtitle: 'Direct Farm-to-Market Access',
      icon: <FaStore className="text-3xl text-white" />,
      color: 'from-amber-600 to-orange-600',
      border: 'border-amber-200',
      bg: 'from-amber-50 to-orange-50',
      points: [
        'Connect directly with verified farmers',
        'Monitor crop quality through real-time updates',
        'Reduce dependency on middlemen',
        'Access transparent pricing data',
        'Interact within the farmer community ecosystem',
      ],
    },
  ];

  const futureFeatures = [
    { icon: <FaBrain />,          label: 'AI Disease Detection',      desc: 'Deep-learning models that identify 200+ crop diseases from a single photo' },
    { icon: <FaSatellite />,      label: 'Satellite Monitoring',      desc: 'NDVI crop analysis and field health scoring via satellite imagery' },
    { icon: <FaLanguage />,       label: 'Multilingual AI Support',   desc: 'Voice-first AI assistant available in 12 Indian regional languages' },
    { icon: <FaMobileAlt />,      label: 'AR/VR Agriculture',         desc: 'Augmented reality overlays for field scouting and virtual farm tours' },
    { icon: <FaTint />,           label: 'Smart Irrigation',          desc: 'IoT-connected moisture sensors with automated irrigation triggers' },
    { icon: <FaChartBar />,       label: 'Yield Prediction',          desc: 'Machine learning models to forecast crop yield 60 days in advance' },
    { icon: <GiDeliveryDrone />,      label: 'Drone Integration',         desc: 'Partner drone fleet for aerial field surveying and precision spraying' },
    { icon: <MdOutlinePrecisionManufacturing />, label: 'Precision Agri', desc: 'Variable-rate fertilizer and seed application based on soil analytics' },
  ];

  // ── Only the 4 boxes changed — everything else is identical ─────────────────
  const gogPillars = [
    {
      icon: <FaUniversity className="text-green-600" />,
      title: 'Integrated Degree Programs (UG/PG)',
      desc: 'University + industry curriculum taught offline by IIT alumni. 100% internship from 4th sem, jobs from 7th sem.',
    },
    {
      icon: <FaIndustry className="text-green-600" />,
      title: 'Co-Branded Degree Programs (UG/PG)',
      desc: 'Industrial curriculum integrated with university syllabus. End-to-end placement prep with project-based learning.',
    },
    {
      icon: <FaRocket className="text-green-600" />,
      title: 'Industrial Placement Training',
      desc: 'Technical skills, aptitude & communication training. 100% internship & placement from 4th sem by IIT & MAANG experts.',
    },
    {
      icon: <FaMedkit className="text-green-600" />,
      title: 'Medical Technical Training',
      desc: 'AI in medical science, clinical research & healthcare management. Faculty from AIIMS & top government medical colleges.',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, #0d3320 0%, #1a4d2e 40%, #1b5e20 70%, #2e7d32 100%)' }} />
        {/* Blobs */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #86efac, transparent)' }} />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '36px 36px' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <motion.div {...fadeUp(0.1)}>
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-white/90 font-medium">AgriConnect — Our Story</span>
              </div>
            </motion.div>

            <motion.h1 {...fadeUp(0.2)} className="text-4xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
              Connecting Farmers, Buyers &amp;{' '}
              <span className="text-green-300">Agronomists</span>{' '}
              Through Technology
            </motion.h1>

            <motion.p {...fadeUp(0.3)} className="text-green-100 text-lg mt-6 leading-relaxed max-w-xl">
              AgriConnect is a smart agricultural platform designed to bridge the gap between farmers,
              agricultural experts, and buyers using AI, community collaboration, and real-time agricultural insights.
            </motion.p>

            <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-4 mt-8">
              <Link to="/"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white text-agri-primary font-semibold rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                <FaRocket className="text-sm" /> Explore Platform
              </Link>
              <Link to="/community"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white/10 text-white font-semibold rounded-2xl border border-white/25 backdrop-blur-sm hover:bg-white/20 transition-all duration-200">
                <FaUsers className="text-sm" /> Join Community
              </Link>
            </motion.div>
          </div>

          {/* Hero image */}
          <motion.div {...fadeRight(0.3)} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-black/40">
              <img src={farmerImg} alt="Indian farmer in field" className="w-full h-[520px] object-cover" />
              {/* Gradient overlay at bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-green-900/60 via-transparent to-transparent" />
              {/* Floating badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                      <GiWheat className="text-white text-xl" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Built for India's Farmers</p>
                      <p className="text-green-200 text-xs">Empowering 140M+ agricultural households</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Stats floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-6 -right-6 bg-white rounded-2xl shadow-xl border border-green-100 px-5 py-4 hidden lg:block"
            >
              <p className="text-3xl font-extrabold text-agri-primary">3+</p>
              <p className="text-xs text-gray-500 mt-0.5">User Types Supported</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── WHAT IS AGRICONNECT ──────────────────────────────────────────── */}
      <section className="py-24 bg-white/80">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div {...fadeLeft(0.1)}>
              <FeatureImage src={agronomistImg} alt="Agricultural expert advising farmer" className="h-[480px]" />
            </motion.div>

            {/* Content */}
            <div>
              <motion.div {...fadeUp(0.1)}>
                <SectionBadge>What is AgriConnect</SectionBadge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  One Platform for the Entire Agricultural Value Chain
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                  AgriConnect brings together farmers, verified agronomists, and direct buyers
                  onto a single smart platform — eliminating information gaps, reducing exploitation,
                  and making expert agricultural knowledge accessible to every farmer in India.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <motion.div key={f.label} {...fadeUp(0.1 + i * 0.05)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-green-50/60 border border-green-100 hover:border-green-300 hover:shadow-sm transition-all duration-200"
                  >
                    <span className="text-lg flex-shrink-0">{f.icon}</span>
                    <span className="text-sm font-medium text-gray-700">{f.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY AGRICONNECT EXISTS ───────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#f5faf6' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <SectionBadge>The Problem We Solve</SectionBadge>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
              Why AgriConnect Exists
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
              Indian agriculture is riddled with systemic challenges that technology can solve.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {problems.map((p, i) => (
              <motion.div key={p.label} {...fadeUp(0.1 + i * 0.08)}
                className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="absolute top-0 left-6 right-6 h-0.5 rounded-b-full bg-gradient-to-r from-red-400 to-rose-500" />
                <div className="flex items-start gap-5">
                  <div className="p-3 bg-gray-50 rounded-xl flex-shrink-0">{p.icon}</div>
                  <div>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-4xl font-extrabold text-gray-900">{p.stat}</span>
                      <span className="text-sm font-semibold text-gray-600">{p.label}</span>
                    </div>
                    <p className="text-sm text-gray-500 leading-relaxed">{p.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Stats strip */}
          <motion.div {...fadeUp(0.3)}
            className="rounded-3xl p-10 text-white text-center"
            style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
          >
            <p className="text-lg font-medium text-green-200 mb-8">AgriConnect's Impact Roadmap</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { target: 50000, suffix: '+', label: 'Farmers Empowered' },
                { target: 200,   suffix: '+', label: 'Expert Agronomists' },
                { target: 34,    suffix: '',  label: 'States Covered' },
                { target: 500,   suffix: '+', label: 'Crop Issues Solved' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-5xl font-extrabold text-white">
                    <AnimCounter target={s.target} suffix={s.suffix} />
                  </p>
                  <p className="text-green-200 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WORKFLOW CARDS ────────────────────────────────────────────────── */}
     {/* ── WORKFLOW CARDS ────────────────────────────────────────────────── */}
<section className="py-24 bg-white/80">
  <div className="max-w-7xl mx-auto px-6 lg:px-8">
    <motion.div {...fadeUp(0)} className="text-center mb-16">
      <SectionBadge>Platform Workflow</SectionBadge>
      <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
        Who Uses AgriConnect &amp; How
      </h2>
      <p className="text-gray-500 mt-4 text-lg max-w-2xl mx-auto">
        Three distinct user types, one unified agricultural ecosystem.
      </p>
    </motion.div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {workflow.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            delay: i * 0.12,
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className={`group relative rounded-3xl border overflow-hidden bg-gradient-to-br ${card.bg} ${card.border} shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2`}
        >
          {/* Top image */}
          <div className="relative h-52 overflow-hidden">
            <img
              src={card.img}
              alt={card.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Natural image overlay only for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-5 text-center">
              <div
                className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg mb-3`}
              >
                {card.icon}
              </div>

              <h3 className="text-2xl font-extrabold text-white drop-shadow-md">
                {card.title}
              </h3>

              <p className="text-white/90 text-sm font-medium drop-shadow-sm">
                {card.subtitle}
              </p>
            </div>
          </div>

          {/* Points */}
          <div className="p-6 space-y-3">
            {card.points.map((pt, j) => (
              <div key={j} className="flex items-start gap-2.5">
                <FaCheckCircle className="text-green-500 text-sm flex-shrink-0 mt-0.5" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {pt}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>

    {/* Connector arrows */}
    <motion.div
      {...fadeUp(0.4)}
      className="flex items-center justify-center gap-4 mt-10 flex-wrap"
    >
      {['Farmer posts issue', 'Agronomist advises', 'Buyer connects directly'].map(
        (step, i) => (
          <div key={step} className="flex items-center gap-4">
            <span className="px-4 py-2 bg-green-50 text-agri-primary text-sm font-medium rounded-full border border-green-100">
              {step}
            </span>

            {i < 2 && (
              <FaArrowRight className="text-green-400 flex-shrink-0" />
            )}
          </div>
        )
      )}
    </motion.div>
  </div>
</section>

      {/* ── GEEKS OF GURUKUL ─────────────────────────────────────────────── */}
      <section className="py-24" style={{ background: '#f5faf6' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Content */}
            <div>
              <motion.div {...fadeUp(0.1)}>
                <SectionBadge>Developed Under</SectionBadge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">
                  Geeks of Gurukul
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-4">
                  AgriConnect is being developed under{' '}
                  <span className="font-semibold text-agri-primary">Geeks of Gurukul</span> —
                  an EdTech and technology initiative focused on practical learning and real-world product development.
                </p>
                <p className="text-gray-600 leading-relaxed mb-8">
                  Rather than building toy projects, students at Geeks of Gurukul ship production-grade
                  applications that solve genuine problems — and AgriConnect is the flagship example of
                  innovation-driven, agriculture-focused technical education.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {gogPillars.map((p, i) => (
                  <motion.div key={p.title} {...fadeUp(0.15 + i * 0.07)}
                    className="bg-white/80 rounded-2xl border border-green-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        {p.icon}
                      </div>
                      <h4 className="font-bold text-gray-900 text-sm">{p.title}</h4>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* GoG Logo Card */}
            <motion.div {...fadeRight(0.2)} className="flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Main logo card */}
                <div className="bg-white rounded-3xl shadow-2xl border border-green-100 p-12 flex flex-col items-center text-center">
                  <div className="w-48 h-48 flex items-center justify-center mb-6">
                    <img src={gogLogo} alt="Geeks of Gurukul" className="w-full h-full object-contain" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-2">Geeks of Gurukul</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">
                    EdTech · Innovation · AgriTech · Full-Stack Development
                  </p>
                  <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-200">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-sm font-semibold text-agri-primary">Active Development</span>
                  </div>
                </div>
                {/* Decorative blobs */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-green-100 rounded-full blur-2xl opacity-60" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-emerald-100 rounded-full blur-2xl opacity-60" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FUTURE VISION ────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        {/* Dark futuristic bg */}
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(160deg, #0a1f0f 0%, #0d2f18 50%, #0a1a0c 100%)' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)', backgroundSize: '48px 48px' }} />
        {/* Glow blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl opacity-20"
          style={{ background: 'radial-gradient(circle, #22c55e, transparent)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-15"
          style={{ background: 'radial-gradient(circle, #4ade80, transparent)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div {...fadeUp(0)} className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold rounded-full mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Future Roadmap
            </span>
            <h2 className="text-4xl lg:text-5xl font-bold text-white tracking-tight">
              The Future of AgriConnect
            </h2>
            <p className="text-green-300/70 mt-4 text-lg max-w-2xl mx-auto">
              From AI disease detection to satellite monitoring — here's where we're headed.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {futureFeatures.map((f, i) => (
              <motion.div key={f.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.55 }}
                className="group bg-white/5 backdrop-blur-sm border border-green-500/20 rounded-2xl p-5 hover:bg-white/10 hover:border-green-400/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-11 h-11 bg-green-500/10 border border-green-500/20 rounded-xl flex items-center justify-center text-green-400 text-xl mb-4 group-hover:bg-green-500/20 transition-colors duration-200">
                  {f.icon}
                </div>
                <h4 className="font-bold text-white mb-2 text-sm">{f.label}</h4>
                <p className="text-xs text-green-300/60 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 bg-white/80">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div {...fadeUp(0)}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Ready to Transform Indian Agriculture?
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Join thousands of farmers, experts and buyers who are already building a better agricultural future.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-agri-primary to-agri-secondary text-white font-semibold rounded-2xl shadow-lg shadow-green-800/20 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                Get In Touch <FaArrowRight />
              </Link>
              <Link to="/community"
                className="inline-flex items-center gap-2 px-8 py-4 border-2 border-agri-accent text-agri-primary font-semibold rounded-2xl hover:bg-green-50 transition-all duration-200">
                Join Community
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
