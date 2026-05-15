import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaUpload, FaCheckCircle, FaBolt, FaLeaf,
  FaRedo, FaTimes, FaCamera, FaSeedling,
  FaExclamationTriangle, FaFlask,
} from 'react-icons/fa';
import { MdOutlineDocumentScanner } from 'react-icons/md';
import { TbScan } from 'react-icons/tb';
import { GiMicroscope } from 'react-icons/gi';
import heroAIBg  from '../assets/ai_hero_bg.png';
import aiCapture from '../assets/ai_capture.png';
import aiNetwork from '../assets/ai_network.png';
import aiFarmers from '../assets/ai_farmers.png';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';

// ── Mock disease database ──────────────────────────────────────────────────
const MOCK_RESULTS = [
  { disease:'Yellow Rust (Stripe Rust)', confidence:91, pathogen:'Puccinia striiformis',
    severity:'High', crop:'Wheat',
    treatments:['Propiconazole 0.1% spray — 2 applications, 14 days apart','Tebuconazole 250 EC @ 1 ml/L as foliar spray','Remove and destroy infected leaves immediately to halt spread'],
    prevention:['Use resistant varieties like HD-2967 or PBW-550','Sow early — before peak disease season (Oct–Nov)','Avoid excess nitrogen which promotes lush growth susceptible to rust'],
    affected:'35–60% yield loss if untreated in susceptible varieties' },
  { disease:'Tomato Early Blight', confidence:87, pathogen:'Alternaria solani',
    severity:'Medium', crop:'Tomato',
    treatments:['Mancozeb 2.5 g/L every 10 days as protective spray','Chlorothalonil 2 g/L — alternate with Mancozeb to prevent resistance','Remove lower infected leaves; bag and destroy, do not compost'],
    prevention:['Avoid overhead irrigation — drip irrigation recommended','Crop rotation with non-solanaceous crops (minimum 3 years)','Mulching prevents soil splash which spreads spores to lower leaves'],
    affected:'15–30% yield and quality loss if untreated at flowering stage' },
  { disease:'Powdery Mildew', confidence:78, pathogen:'Erysiphe cichoracearum',
    severity:'Low', crop:'General',
    treatments:['Sulphur 80WP @ 3 g/L spray — apply in cooler hours (morning/evening)','Hexaconazole 0.1% for moderate to severe infections','Potassium bicarbonate 5 g/L as an organic alternative'],
    prevention:['Improve air circulation by wider plant spacing','Avoid dense planting and excessive canopy development','Select resistant varieties — check ICAR-recommended list for your crop'],
    affected:'10–20% in severe cases; higher in dense plantings' },
  { disease:'Bacterial Leaf Blight', confidence:83, pathogen:'Xanthomonas oryzae',
    severity:'High', crop:'Rice',
    treatments:['Copper oxychloride 3 g/L spray at first symptom','Streptocycline 200 ppm + Copper oxychloride 0.3% combination spray','Drain water from field to reduce humidity and slow spread'],
    prevention:['Use certified disease-free seed','Balanced fertilisation — avoid excess nitrogen after transplanting','Field sanitation: remove and burn stubble after harvest'],
    affected:'40–60% in susceptible varieties under humid conditions' },
];

const SEV = {
  High:   { col:'#dc2626', bg:'#fef2f2', border:'#fecaca' },
  Medium: { col:'#d97706', bg:'#fffbeb', border:'#fde68a' },
  Low:    { col:'#16a34a', bg:'#f0fdf4', border:'#bbf7d0' },
};

const PHASES = {
  uploading:  'Uploading image to secure server...',
  processing: 'AI analysing 50+ disease patterns...',
  matching:   'Matching pathogen signatures...',
  done:       'Analysis complete',
};

// ── Timeline steps for "Multi-Layered Neural Synthesis" section ────────────
const STEPS = [
  {
    num: '01',
    title: 'Capture Details',
    desc: 'Our scanner breaks down crop imagery into multispectral bands, detecting cellular stress invisible to the human eye long before symptoms manifest.',
    img: aiCapture,
    side: 'left',
  },
  {
    num: '02',
    title: 'AI Analysis',
    desc: 'Advanced algorithms compare your sample against 4.2 million known pathology markers, identifying rust, blight, or nutrient deficiencies with 99.8% precision.',
    img: aiNetwork,
    side: 'right',
  },
  {
    num: '03',
    title: 'Get Solutions',
    desc: "We don't just find the problem; we solve it. Receive a custom biological treatment roadmap calibrated for your specific soil composition and microclimate.",
    img: aiFarmers,
    side: 'left',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function AIScannerPage({ onLoginOpen, onSignupOpen }) {
  const [preview,   setPreview]   = useState(null);
  const [cropVar,   setCropVar]   = useState('');
  const [locRef,    setLocRef]    = useState('');
  const [scanning,  setScanning]  = useState(false);
  const [phase,     setPhase]     = useState('');
  const [result,    setResult]    = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [drag,      setDrag]      = useState(false);
  const fileRef = useRef();

  const CROP_VARIETIES = [
    'Wheat (Winter)','Wheat (Spring)','Rice (Kharif)','Rice (Rabi)',
    'Maize','Cotton','Soybean','Tomato','Potato','Onion',
    'Chilli','Sugarcane','Mustard','Chickpea',
  ];

  const loadFile = (f) => {
    if (!f || !f.type.startsWith('image/')) return;
    setPreview(URL.createObjectURL(f));
    setResult(null); setPhase('');
  };

  const scan = () => {
    if (!preview) return;
    setScanning(true); setPhase('uploading'); setResult(null); setShowModal(true);
    setTimeout(() => setPhase('processing'), 900);
    setTimeout(() => setPhase('matching'),   2000);
    setTimeout(() => {
      setResult(MOCK_RESULTS[Math.floor(Math.random() * MOCK_RESULTS.length)]);
      setScanning(false); setPhase('done');
    }, 3200);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ══════════════════════════════════════════════════════════════
          HERO — full-bleed bg + centred glassmorphism form card
          Matches reference screenshot exactly
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ paddingTop: 64, minHeight: 700 }}>
        {/* Background Ken Burns */}
        <motion.img
          src={heroAIBg}
          alt="Smart farming"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 14, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

{/* Left dark overlay for text readability */}
<div
  className="absolute left-0 top-0 h-full w-[55%]"
  style={{
    background:
      'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0.18) 75%, transparent 100%)',
  }}
/>

        {/* Centred glassmorphism card */}
    <div className="relative z-10 min-h-[calc(92vh-64px)] flex items-center">
  <div className="max-w-7xl mx-auto w-full px-6 lg:px-10">

    <div className="grid lg:grid-cols-2 gap-16 items-center">

      {/* LEFT CONTENT */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-white"
      >

        {/* TOP LABEL */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.9)]" /> 

          <span className="uppercase tracking-[0.25em] text-sm font-bold text-violet-200">
            AI Disease Intelligence
          </span>

          <div className="px-4 py-1 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-xs font-black tracking-wide shadow-lg shadow-yellow-500/30">
  AI POWERED
</div>
        </div>

        {/* HEADING */}
        <h1 className="text-5xl md:text-7xl font-black leading-[0.95] mb-8">
          <span className="text-white">
            AI Crop Disease
          </span>

          <br />

          <span className="bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 bg-clip-text text-transparent">
  Scanner
</span>
        </h1>

        {/* DESCRIPTION */}
        <p className="text-lg md:text-xl leading-relaxed text-white/80 max-w-xl">
          Upload a photo of your crop and get an AI-powered disease
          diagnosis with confidence score, treatment plan and prevention
          tips in seconds.
        </p>

        {/* STATS */}
        <div className="flex flex-wrap gap-8 mt-10">

          <div>
            <h3 className="text-3xl font-black text-white">
              4.2M+
            </h3>

            <p className="text-white/60 text-sm mt-1">
              Disease Markers
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black text-white">
              99.8%
            </h3>

            <p className="text-white/60 text-sm mt-1">
              Detection Accuracy
            </p>
          </div>

          <div>
            <h3 className="text-3xl font-black text-white">
              24/7
            </h3>

            <p className="text-white/60 text-sm mt-1">
              AI Monitoring
            </p>
          </div>

        </div>
      </motion.div>

      {/* RIGHT FORM */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex justify-center lg:justify-end"
      >

        <div
          className="w-full max-w-xl rounded-[32px] p-10 md:p-12 shadow-2xl"
          style={{
            background: 'rgba(255, 248, 235, 0.90)',
            backdropFilter: 'blur(28px)',
            border: '1px solid rgba(255,255,255,0.7)',
          }}
        >

          <h2 className="text-3xl font-black text-amber-800 text-center mb-1">
            Crop Intelligence
          </h2>

          <p className="text-center text-gray-400 text-sm mb-7">
            Precision AI Diagnostic Scanner
          </p>

          {/* Upload area */}
          <div className="mb-5">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
              Upload Crop Imagery
            </p>

            <div
              onClick={() => !preview && fileRef.current?.click()}
              onDragOver={e => {
                e.preventDefault();
                setDrag(true);
              }}
              onDragLeave={() => setDrag(false)}
              onDrop={e => {
                e.preventDefault();
                setDrag(false);
                loadFile(e.dataTransfer.files[0]);
              }}
              className={`border-2 border-dashed rounded-2xl transition-all duration-200 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden ${
                drag
                  ? 'border-agri-primary bg-green-50'
                  : preview
                  ? 'border-transparent'
                  : 'border-amber-200 hover:border-yellow-500 hover:bg-yellow-50/40'
              }`}
              style={{ minHeight: 190 }}
            >

              {preview ? (
                <div className="relative w-full">
                  <img
                    src={preview}
                    alt="crop"
                    className="w-full max-h-48 object-cover"
                  />

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setPreview(null);
                      setResult(null);
                      setPhase('');
                    }}
                    className="absolute top-2 right-2 w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                  >
                    <FaTimes className="text-xs" />
                  </button>
                </div>
              ) : (
                <div className="py-10 px-4">

                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUpload className="text-amber-700 text-2xl" />
                  </div>

                  <p className="text-base text-gray-600 font-medium">
                    Drag and drop leaf samples or{' '}
                    <span className="text-agri-primary font-bold">
                      browse files
                    </span>
                  </p>

                  <p className="text-sm text-gray-400 mt-2">
                    Supported: RAW, JPG, PNG (Max 50MB)
                  </p>

                </div>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              onChange={e => loadFile(e.target.files[0])}
              className="hidden"
            />
          </div>

          {/* Crop Variety + Location Ref */}
          <div className="grid grid-cols-2 gap-3 mb-5">

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Crop Variety
              </label>

              <div className="relative">
                <select
                  value={cropVar}
                  onChange={e => setCropVar(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 pr-8"
                >
                  <option value="">Wheat (Winter)</option>

                  {CROP_VARIETIES.map(c => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>

                <svg
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                Location Ref
              </label>

              <input
                type="text"
                value={locRef}
                onChange={e => setLocRef(e.target.value)}
                placeholder="Plot A-42"
                className="w-full px-3 py-3 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 placeholder:text-gray-300"
              />
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={scan}
            disabled={!preview || scanning}
            className="w-full py-4 rounded-2xl font-bold text-base flex items-center justify-center gap-2 transition-all duration-300 bg-gradient-to-r from-yellow-500 to-amber-600 text-black shadow-xl shadow-yellow-500/20 hover:shadow-yellow-500/40 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
          >
            <TbScan className="text-xl" />

            {scanning
              ? 'Running Diagnostics...'
              : 'Run Enhanced Diagnostics'}
          </button>
        </div>
      </motion.div>
    </div>
  </div>
</div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
    MULTI-LAYERED NEURAL SYNTHESIS — NEW PREMIUM VERSION
══════════════════════════════════════════════════════════════ */}
<section className="py-24 bg-[#f7faf7] overflow-hidden">
  <div className="max-w-7xl mx-auto px-6 lg:px-10">

    {/* Heading */}
    <ScrollReveal>
      <div className="text-center mb-20">
        <h2 className="text-4xl md:text-5xl font-black text-[#0c3b2e] mb-4">
          Multi-Layered Neural Synthesis
        </h2>

        <p className="text-gray-500 text-lg max-w-2xl mx-auto">
          The path from raw image to actionable precision data.
        </p>

        <div className="w-28 h-1 bg-gradient-to-r from-green-700 to-emerald-400 rounded-full mx-auto mt-6" />
      </div>
    </ScrollReveal>

    <div className="relative">

      {/* CENTER TIMELINE */}
      <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-[3px] bg-gradient-to-b from-green-700 via-green-500 to-green-300 -translate-x-1/2 rounded-full" />

      <div className="space-y-24">

        {STEPS.map((step, i) => (
          <ScrollReveal
            key={step.num}
            delay={i * 0.1}
            direction="up"
          >

            <div className="relative grid lg:grid-cols-2 gap-16 items-center">

              {/* TIMELINE NUMBER */}
              <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-700 to-green-500 shadow-2xl border-[6px] border-white flex items-center justify-center">
                  <span className="text-white font-black text-lg">
                    {i + 1}
                  </span>
                </div>
              </div>

              {/* LEFT SIDE */}
              {i % 2 === 0 ? (
                <>
                  {/* TEXT CARD */}
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-10 relative"
                  >

                    {/* TOP BORDER */}
                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-[28px] bg-gradient-to-r from-green-700 to-emerald-400" />

                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-green-700 text-3xl font-black">
                        {step.num}
                      </span>

                      <h3 className="text-3xl font-black text-[#0d2f24]">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.desc}
                    </p>
                  </motion.div>

                  {/* IMAGE */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-[30px] overflow-hidden shadow-2xl"
                  >
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-[340px] object-cover"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* CORNER ACCENTS */}
                    <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-green-400 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-green-400 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-green-400 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-green-400 rounded-br-lg" />
                  </motion.div>
                </>
              ) : (
                <>
                  {/* IMAGE */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.35 }}
                    className="relative rounded-[30px] overflow-hidden shadow-2xl lg:order-1"
                  >
                    <img
                      src={step.img}
                      alt={step.title}
                      className="w-full h-[340px] object-cover"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-green-400 rounded-tl-lg" />
                    <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-green-400 rounded-tr-lg" />
                    <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-green-400 rounded-bl-lg" />
                    <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-green-400 rounded-br-lg" />
                  </motion.div>

                  {/* TEXT CARD */}
                  <motion.div
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[28px] shadow-xl border border-gray-100 p-10 relative lg:order-2"
                  >

                    <div className="absolute top-0 left-0 w-full h-1 rounded-t-[28px] bg-gradient-to-r from-[#4b2e2a] to-[#7d5a50]" />

                    <div className="flex items-center gap-3 mb-5">
                      <span className="text-[#234b2e] text-3xl font-black">
                        {step.num}
                      </span>

                      <h3 className="text-3xl font-black text-[#0d2f24]">
                        {step.title}
                      </h3>
                    </div>

                    <p className="text-gray-600 leading-relaxed text-lg">
                      {step.desc}
                    </p>
                  </motion.div>
                </>
              )}
            </div>

          </ScrollReveal>
        ))}

      </div>
    </div>
  </div>
</section>
      {/* ══════════════════════════════════════════════════════════════
          RESULTS MODAL — same split-card pattern as Soil & Pest pages
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          >
            <div className="absolute inset-0" onClick={() => !scanning && setShowModal(false)} />

            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex"
              style={{ minHeight: 540, maxHeight: '92vh' }}
            >

              {/* LEFT PANEL */}
              <div className="hidden md:flex md:w-5/12 relative flex-col justify-end overflow-hidden flex-shrink-0">
                <img
                  src={preview || heroAIBg}
                  alt="Scanned crop"
                  className="absolute inset-0 w-full h-full object-cover scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-violet-950/95 via-violet-900/60 to-transparent" />

                {/* Scanning animation overlay */}
                {scanning && (
                  <div className="absolute inset-0 overflow-hidden">
                    <motion.div
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5"
                      style={{ background: 'linear-gradient(90deg,transparent,#a78bfa,transparent)', boxShadow: '0 0 20px #8b5cf6' }}
                    />
                  </div>
                )}

                <div className="relative z-10 p-8 pb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <GiMicroscope className="text-violet-300 text-2xl" />
                    <span className="text-white font-bold text-lg">AI Scanner</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
                    Diagnostic<br />Intelligence
                  </h2>
                  <p className="text-violet-200 text-sm font-medium mb-6">
                    {scanning ? PHASES[phase] || 'Processing...' : result ? `${result.disease} detected` : 'Upload complete'}
                  </p>

                  {/* Progress dots */}
                  {scanning && (
                    <div className="flex gap-2 items-center">
                      {['uploading','processing','matching'].map((p, i) => (
                        <div key={p} className="flex items-center gap-2">
                          <div className={`w-2.5 h-2.5 rounded-full transition-all ${
                            phase === p ? 'bg-violet-300 scale-125' :
                            ['uploading','processing','matching'].indexOf(phase) > i ? 'bg-green-400' : 'bg-white/20'
                          }`} />
                          {i < 2 && <div className="w-6 h-px bg-white/20" />}
                        </div>
                      ))}
                    </div>
                  )}

                  {result && !scanning && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-violet-300/70">Confidence</span>
                        <span className="text-lg font-black text-white">{result.confidence}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${result.confidence}%` }}
                          transition={{ duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: result.confidence > 85 ? '#86efac' : '#fde68a' }} />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-violet-300/70">Severity</span>
                        <span className="text-sm font-bold px-2.5 py-0.5 rounded-full"
                          style={{ background: SEV[result.severity].bg, color: SEV[result.severity].col }}>
                          {result.severity}
                        </span>
                      </div>
                      {locRef && (
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-violet-300/70">Location</span>
                          <span className="text-xs text-white font-semibold">{locRef}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL */}
              <div className="flex-1 bg-white overflow-y-auto flex flex-col">
                <button
                  onClick={() => !scanning && setShowModal(false)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>

                <div className="flex-1 flex flex-col p-8">

                  {/* Loading */}
                  {scanning && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-5 py-12">
                      <div className="relative">
                        <div className="w-20 h-20 border-4 border-violet-100 rounded-full" />
                        <div className="absolute inset-0 w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                        <GiMicroscope className="absolute inset-0 m-auto text-violet-400 text-2xl" />
                      </div>
                      <div className="text-center">
                        <p className="text-gray-700 font-bold text-lg mb-1">
                          {PHASES[phase] || 'Processing...'}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Analysing against 4.2M pathology markers
                        </p>
                      </div>
                      {/* Phase progress */}
                      <div className="w-full max-w-xs space-y-2">
                        {['uploading','processing','matching'].map((p, i) => (
                          <div key={p} className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0 transition-all ${
                              ['uploading','processing','matching'].indexOf(phase) > i ? 'bg-green-500 text-white' :
                              phase === p ? 'bg-violet-500 text-white' : 'bg-gray-100 text-gray-400'
                            }`}>
                              {['uploading','processing','matching'].indexOf(phase) > i ? '✓' : i+1}
                            </div>
                            <div className="flex-1">
                              <div className={`h-1.5 rounded-full transition-all duration-700 ${
                                phase === p ? 'bg-violet-500 w-3/4' :
                                ['uploading','processing','matching'].indexOf(phase) > i ? 'bg-green-500 w-full' : 'bg-gray-100 w-full'
                              }`} />
                            </div>
                            <span className="text-xs text-gray-400 capitalize w-20">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {result && !scanning && (
                    <>
                      <div className="mb-5">
                        <p className="text-[10px] font-bold text-violet-500 uppercase tracking-widest mb-1">
                          AI Detection Result
                        </p>
                        <h3 className="text-2xl font-black text-gray-900 mb-0.5">{result.disease}</h3>
                        <p className="text-gray-400 text-sm italic">Pathogen: {result.pathogen}</p>
                      </div>

                      {/* Meta chips */}
                      <div className="flex flex-wrap gap-2 mb-5">
                        <span className="px-3 py-1 rounded-full text-xs font-bold"
                          style={{ background: SEV[result.severity].bg, color: SEV[result.severity].col, border: `1px solid ${SEV[result.severity].border}` }}>
                          {result.severity} Severity
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-50 text-violet-700 border border-violet-100">
                          Crop: {cropVar || result.crop}
                        </span>
                        {locRef && (
                          <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-50 text-gray-600 border border-gray-100">
                            📍 {locRef}
                          </span>
                        )}
                      </div>

                      {/* Confidence bar */}
                      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                          <span className="font-semibold">Confidence Score</span>
                          <span className="font-black text-gray-800 text-base">{result.confidence}%</span>
                        </div>
                        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${result.confidence}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full rounded-full"
                            style={{ background: result.confidence > 85 ? '#16a34a' : result.confidence > 70 ? '#d97706' : '#dc2626' }}
                          />
                        </div>
                      </div>

                      {/* Treatment plan */}
                      <div className="bg-violet-50 rounded-2xl border border-violet-100 p-4 mb-3">
                        <h4 className="font-bold text-violet-900 text-sm mb-3 flex items-center gap-2">
                          <FaFlask className="text-violet-500" /> Treatment Plan
                        </h4>
                        {result.treatments.map((t, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                            className="flex gap-2.5 mb-2.5 items-start">
                            <FaCheckCircle className="text-violet-500 text-xs flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">{t}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Prevention */}
                      <div className="bg-green-50 rounded-2xl border border-green-100 p-4 mb-3">
                        <h4 className="font-bold text-green-800 text-sm mb-3 flex items-center gap-2">
                          <FaLeaf className="text-green-600" /> Prevention Tips
                        </h4>
                        {result.prevention.map((p, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 + 0.2 }}
                            className="flex gap-2.5 mb-2 items-start">
                            <FaCheckCircle className="text-green-500 text-xs flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-gray-700 leading-relaxed">{p}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Yield impact */}
                      <div className="bg-red-50 rounded-2xl border border-red-100 p-3.5 mb-4">
                        <p className="text-xs font-bold text-red-600 flex items-center gap-2">
                          <FaExclamationTriangle /> If untreated: {result.affected}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-400">Consult an agronomist for confirmed field diagnosis</p>
                        <button onClick={() => setShowModal(false)}
                          className="px-5 py-2 rounded-xl bg-agri-primary text-white text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all">
                          Close Report
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
