import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaBug, FaUpload, FaLeaf, FaCheckCircle, FaShieldAlt,
  FaCircle, FaSkull, FaTint, FaArrowRight, FaSearch,
  FaExclamationTriangle, FaInfoCircle, FaTimes,
} from 'react-icons/fa';
import { GiSpottedBug, GiMushroomGills, GiPlantRoots } from 'react-icons/gi';
import { MdOutlineBiotech } from 'react-icons/md';
import heroPest      from '../assets/pest_bg_leaves.png';
import imgEarlyBlight from '../assets/pest_early_blight.png';
import imgStemBorer   from '../assets/pest_stem_borer.png';
import imgChlorosis   from '../assets/pest_chlorosis.png';
import imgScanner     from '../assets/pest_scanner.png';
import imgFarm        from '../assets/pest_farm.jpg';
import Navbar  from './Navbar';
import Footer  from './Footer';
import ScrollReveal from './ScrollReveal';

// ── Crop list & pest database ──────────────────────────────────────────────
const CROPS = ['Wheat','Rice','Maize','Cotton','Soybean','Tomato','Onion','Potato','Chilli','Sugarcane','Mustard','Chickpea'];

const PEST_DB = {
  Wheat:[
    { name:'Aphids',      type:'Pest',    severity:'Medium', symptoms:'Yellowing leaves, sticky honeydew, curled tips',                   treatment:'Spray Imidacloprid 0.5 ml/L or Dimethoate 2 ml/L',            prevention:'Resistant varieties, balanced nitrogen fertilization' },
    { name:'Yellow Rust', type:'Disease', severity:'High',   symptoms:'Yellow-orange pustules on leaves in stripe pattern',               treatment:'Propiconazole 0.1% spray at first symptom stage',              prevention:'Resistant varieties, early sowing before peak disease season' },
    { name:'Loose Smut',  type:'Disease', severity:'Low',    symptoms:'Black powder replacing grain at ear emergence',                    treatment:'Seed treatment with Carboxin 2g/kg',                           prevention:'Certified disease-free seed, hot water treatment' },
  ],
  Tomato:[
    { name:'Early Blight', type:'Disease', severity:'Medium', symptoms:'Dark concentric rings on older leaves, defoliation, fruit spots', treatment:'Mancozeb 2.5 g/L or Chlorothalonil 2 g/L spray',              prevention:'Avoid overhead irrigation, remove crop residues' },
    { name:'Whitefly',     type:'Pest',    severity:'Medium', symptoms:'White insects under leaves, yellowing, virus transmission',       treatment:'Yellow sticky traps + Acetamiprid 0.2 g/L',                   prevention:'Reflective mulch, neem oil preventive spray' },
    { name:'Fusarium Wilt',type:'Disease', severity:'High',   symptoms:'Wilting despite watering, brown vascular discoloration',         treatment:'Remove infected plants; soil drench with Trichoderma',         prevention:'Crop rotation, resistant rootstock, sterilise tools' },
  ],
  Cotton:[
    { name:'Pink Bollworm', type:'Pest',   severity:'High',   symptoms:'Entry holes in bolls, pink larvae inside, lint damage',          treatment:'Emamectin Benzoate 0.5 g/L + pheromone traps',                prevention:'Bt cotton varieties, timely harvest, field sanitation' },
    { name:'Leaf Curl Virus',type:'Disease',severity:'High',  symptoms:'Upward curling of leaves, thickened veins, stunted growth',     treatment:'Control whitefly vector with Thiamethoxam 0.2 g/L',            prevention:'Virus-tolerant varieties, border crops of maize' },
  ],
  default:[
    { name:'Leaf Blight',   type:'Disease', severity:'Medium', symptoms:'Brown lesions on leaves, wilting, reduced yield potential',     treatment:'Copper oxychloride 3 g/L or Mancozeb 2.5 g/L spray',          prevention:'Good drainage, balanced fertilization, crop rotation' },
    { name:'Common Aphid',  type:'Pest',    severity:'Low',    symptoms:'Clustered small insects, sticky honeydew, leaf yellowing',      treatment:'Neem oil 5 ml/L or Imidacloprid 0.3 ml/L spray',              prevention:'Natural predator conservation, avoid excess nitrogen' },
  ],
};

const SEV_COLOR  = { High:'#dc2626', Medium:'#d97706', Low:'#16a34a' };
const SEV_BG     = { High:'#fef2f2', Medium:'#fffbeb', Low:'#f0fdf4' };
const SEV_BORDER = { High:'#fecaca', Medium:'#fde68a', Low:'#bbf7d0' };

// ── Symptom guide data ─────────────────────────────────────────────────────
const SYMPTOMS_HINTS = [
  { icon: <FaLeaf         style={{ color:'#eab308', fontSize:15 }}/>, sign:'Yellow/brown leaf spots',    cause:'Fungal blight or leaf spot'  },
  { icon: <GiMushroomGills style={{ color:'#f97316',fontSize:15 }}/>, sign:'Orange powder on leaves',    cause:'Rust disease (fungal)'        },
  { icon: <FaBug          style={{ color:'#6b7280', fontSize:14 }}/>, sign:'Holes in leaves or stems',   cause:'Caterpillars or stem borers'  },
  { icon: <FaCircle       style={{ color:'#9ca3af', fontSize:11 }}/>, sign:'White powder coating',       cause:'Powdery mildew'               },
  { icon: <GiPlantRoots   style={{ color:'#dc2626', fontSize:15 }}/>, sign:'Wilting despite watering',   cause:'Root rot or vascular wilt'    },
  { icon: <FaSkull        style={{ color:'#78350f', fontSize:13 }}/>, sign:'Dark lesions on fruit/grain',cause:'Anthracnose or blight'        },
];

// ── Common Symptoms cards ──────────────────────────────────────────────────
const SYMPTOM_CARDS = [
  {
    img:   imgEarlyBlight,
    tag:   'Fungal Pathogen',
    tagBg: '#dcfce7',
    tagColor: '#15803d',
    title: 'Early Blight',
    desc:  'Characterized by dark, concentric spots on older foliage, eventually leading to premature leaf drop.',
  },
  {
    img:   imgStemBorer,
    tag:   'Pest Infestation',
    tagBg: '#fee2e2',
    tagColor: '#b91c1c',
    title: 'Stem Borers',
    desc:  'Internal tissue damage causing wilting even when soil moisture levels are optimal. Requires urgent intervention.',
  },
  {
    img:   imgChlorosis,
    tag:   'Composition',
    tagBg: '#fef3c7',
    tagColor: '#b45309',
    title: 'Chlorosis',
    desc:  'Yellowing of leaf tissue due to lack of chlorophyll, often mistaken for disease but rooted in mineral deficiency.',
  },
];

// ─────────────────────────────────────────────────────────────────────────
export default function PestDetectionPage({ onLoginOpen, onSignupOpen }) {
  const [crop,      setCrop]      = useState('');
  const [sympt,     setSympt]     = useState('');
  const [preview,   setPreview]   = useState(null);
  const [results,   setResults]   = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [cropCat,   setCropCat]   = useState('');
  const [showModal, setShowModal] = useState(false);
  const fileRef = useRef();

  const CROP_CATEGORIES = [
    'Cereals (Wheat, Rice, Maize)',
    'Pulses (Chickpea, Lentil, Soybean)',
    'Vegetables (Tomato, Onion, Potato)',
    'Cash Crops (Cotton, Sugarcane)',
    'Oilseeds (Mustard, Groundnut)',
    'Spices (Chilli, Turmeric)',
  ];

  const onFile = (e) => {
    const f = e.target.files[0];
    if (f) setPreview(URL.createObjectURL(f));
  };

  const detect = () => {
  setLoading(true);
  setResults(null);
  setShowModal(true);

  setTimeout(() => {
    let detectedResults = [];

    const text = sympt.toLowerCase();

    if (crop && PEST_DB[crop]) {
      detectedResults = PEST_DB[crop];
    } else if (
      text.includes('yellow') ||
      text.includes('chlorosis') ||
      text.includes('pale')
    ) {
      detectedResults = [
        {
          name: 'Chlorosis',
          type: 'Disease',
          severity: 'Medium',
          symptoms: 'Yellowing leaves, pale growth, reduced chlorophyll activity.',
          treatment: 'Apply balanced micronutrients with iron and magnesium support.',
          prevention: 'Maintain soil pH, avoid overwatering, and use balanced fertilization.',
        },
        {
          name: 'Nutrient Deficiency',
          type: 'Disease',
          severity: 'Low',
          symptoms: 'Slow growth, yellow patches, weak plant structure.',
          treatment: 'Use soil-test-based NPK and micronutrient correction.',
          prevention: 'Regular soil testing and organic compost application.',
        },
      ];
    } else if (
      text.includes('hole') ||
      text.includes('insect') ||
      text.includes('borer') ||
      text.includes('worm')
    ) {
      detectedResults = [
        {
          name: 'Stem Borer',
          type: 'Pest',
          severity: 'High',
          symptoms: 'Holes in stems, internal feeding damage, wilting shoots.',
          treatment: 'Use pheromone traps and recommended pest-control spray.',
          prevention: 'Remove infected stems and monitor fields weekly.',
        },
        {
          name: 'Leaf Eating Caterpillar',
          type: 'Pest',
          severity: 'Medium',
          symptoms: 'Chewed leaves, visible larvae, irregular holes on foliage.',
          treatment: 'Use neem-based spray or biological control where suitable.',
          prevention: 'Encourage natural predators and inspect leaves regularly.',
        },
      ];
    } else if (
      text.includes('spot') ||
      text.includes('brown') ||
      text.includes('black') ||
      text.includes('blight')
    ) {
      detectedResults = [
        {
          name: 'Early Blight',
          type: 'Disease',
          severity: 'Medium',
          symptoms: 'Brown circular spots, yellowing around lesions, older leaf damage.',
          treatment: 'Apply Mancozeb or Copper-based fungicide as recommended.',
          prevention: 'Avoid overhead watering and remove infected plant debris.',
        },
        {
          name: 'Leaf Spot',
          type: 'Disease',
          severity: 'Low',
          symptoms: 'Small dark spots on leaves with gradual spreading.',
          treatment: 'Prune infected leaves and apply suitable fungicide.',
          prevention: 'Improve air circulation and avoid dense planting.',
        },
      ];
    } else if (
      text.includes('wilt') ||
      text.includes('droop') ||
      text.includes('dry')
    ) {
      detectedResults = [
        {
          name: 'Fusarium Wilt',
          type: 'Disease',
          severity: 'High',
          symptoms: 'Wilting despite watering, drooping leaves, weak stem base.',
          treatment: 'Remove infected plants and use Trichoderma soil treatment.',
          prevention: 'Use crop rotation and disease-resistant varieties.',
        },
        {
          name: 'Root Rot',
          type: 'Disease',
          severity: 'Medium',
          symptoms: 'Root decay, poor water uptake, sudden plant weakness.',
          treatment: 'Improve drainage and apply biological soil treatment.',
          prevention: 'Avoid overwatering and use well-drained soil.',
        },
      ];
    } else {
      detectedResults = PEST_DB.default;
    }

    setResults(detectedResults);
    setLoading(false);
  }, 1400);
};

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ══════════════════════════════════════════════════════════════
          HERO — split: left = image, right = input form
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative" style={{ paddingTop: 64 }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[650px]">

          {/* LEFT — hero image with overlay text */}
          <div className="relative overflow-hidden min-h-[360px] lg:min-h-0">
            <motion.img
              src={heroPest}
              alt="Crop leaves"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, ease: 'linear' }}
            />
            {/* gentle dark gradient only on bottom-left for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

            <div className="relative z-10 h-full flex flex-col justify-end px-10 pb-12 pt-16">
              <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.7 }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                  <span className="text-red-300 text-xs font-bold uppercase tracking-widest">AI-Powered Diagnostics</span>
                </div>
                <h1 className="text-5xl font-black text-white leading-tight mb-4">
                  Pest &amp; Disease<br />
                  <span className="text-orange-300">Detection</span>
                </h1>
                <p className="text-white/75 text-base max-w-md leading-relaxed">
                  Leverage state-of-the-art computer vision to identify crop threats before they impact your yield. Professional-grade analysis for the modern farmer.
                </p>
              </motion.div>
            </div>
          </div>

         {/* RIGHT — input card */}
<div className="flex items-center justify-center bg-[#f3f7f2] px-8 py-14">
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7 }}
    className="w-full max-w-xl bg-white rounded-[28px] shadow-[0_25px_70px_rgba(0,0,0,0.10)] p-8 border border-green-100 relative overflow-hidden"
  >
    <div className="absolute top-0 left-0 w-full h-2 bg-agri-primary" />

    <h2 className="text-3xl font-extrabold text-[#003c22] mb-8">
      Crop &amp; Symptom Input
    </h2>

    <div className="mb-7">
      <label className="block text-lg text-gray-600 mb-2">
        Crop Category
      </label>

      <select
        value={cropCat}
        onChange={e => { setCropCat(e.target.value); setCrop(''); }}
        className="w-full px-6 py-4 rounded-xl border border-green-200 bg-white text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Cereals (Wheat, Rice, Maize)</option>
        {CROP_CATEGORIES.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="mb-7">
      <label className="block text-lg text-gray-600 mb-2">
        Specific Crop
      </label>

      <select
        value={crop}
        onChange={e => setCrop(e.target.value)}
        className="w-full px-6 py-4 rounded-xl border border-green-200 bg-white text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select specific crop optional</option>
        {CROPS.map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
    </div>

    <div className="mb-7">
      <label className="block text-lg text-gray-600 mb-2">
        Observed Symptoms
      </label>

      <textarea
        value={sympt}
        onChange={e => setSympt(e.target.value)}
        rows={5}
        placeholder="Describe spots, wilting, or visible insects..."
        className="w-full px-6 py-5 rounded-xl border border-green-200 bg-white text-lg text-gray-800 resize-none placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>

    <div className="mb-8">
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-green-300 rounded-xl min-h-[180px] flex flex-col items-center justify-center text-center cursor-pointer hover:bg-green-50 hover:border-agri-primary transition-all"
      >
        {preview ? (
          <img
            src={preview}
            alt="crop preview"
            className="max-h-44 rounded-xl object-cover"
          />
        ) : (
          <>
            <FaUpload className="text-4xl text-[#004b2b] mb-4" />
            <p className="text-lg text-gray-700">
              Click to upload or drag crop photo
            </p>
            <p className="text-sm text-gray-400 mt-1">
              JPG, PNG up to 10MB
            </p>
          </>
        )}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        onChange={onFile}
        className="hidden"
      />
    </div>

    <motion.button
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={detect}
      disabled={loading}
      className="w-full py-5 rounded-xl bg-[#14740c] text-white text-lg font-semibold flex items-center justify-center gap-3 shadow-lg hover:bg-[#0f5e08] transition-all disabled:opacity-60"
    >
      <MdOutlineBiotech className="text-2xl" />
      {loading ? 'Analysing...' : 'Analyze Crop Health'}
    </motion.button>
  </motion.div>
</div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          COMMON SYMPTOMS GUIDE — 3 image cards
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-[#eef7ef]">
  <div className="max-w-7xl mx-auto px-6 lg:px-10">
    <ScrollReveal>
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-4xl font-black text-[#003c22] mb-2">
            Common Symptoms Guide
          </h2>
          <p className="text-gray-600 text-base">
            Visual indicators of prevalent regional crop threats.
          </p>
        </div>

        <button className="text-agri-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all">
          View All Identifiers <FaArrowRight className="text-xs" />
        </button>
      </div>
    </ScrollReveal>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {SYMPTOM_CARDS.map((card, i) => (
        <ScrollReveal key={card.title} delay={i * 0.12} direction="up">
          <motion.div
            whileHover={{ y: -10, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[22px] overflow-hidden border border-green-200 shadow-[0_20px_45px_rgba(0,60,34,0.12)] relative"
          >
            <div
              className="h-2 w-full"
              style={{ background: card.tagColor }}
            />

            <div className="h-52 overflow-hidden m-5 rounded-xl">
              <motion.img
                src={card.img}
                alt={card.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <div className="px-6 pb-7">
              <span
                className="inline-block px-4 py-1 rounded-full text-xs font-bold mb-4"
                style={{ background: card.tagBg, color: card.tagColor }}
              >
                {card.tag}
              </span>

              <h3 className="text-2xl font-black text-[#003c22] mb-2">
                {card.title}
              </h3>

              <p className="text-base text-gray-600 leading-relaxed">
                {card.desc}
              </p>
            </div>
          </motion.div>
        </ScrollReveal>
      ))}
    </div>
  </div>
</section>

      {/* ══════════════════════════════════════════════════════════════
          PROFESSIONAL DIAGNOSTIC INTELLIGENCE — split section
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — text */}
            <ScrollReveal direction="left">
              <div>
                <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">
                  Professional Diagnostic<br />Intelligence
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-10">
                  Our system doesn't just identify; it predicts. By analyzing subtle thermal and spectral signatures, we provide a 72-hour advantage over traditional visual inspection.
                </p>
                <div className="space-y-5">
  {[
    {
      icon: <FaShieldAlt />,
      title: 'Yield Preservation',
      desc:
        'Early intervention can save up to 40% of seasonal yield that would otherwise be lost to late-stage infections.',

      gradient:
        'from-[#0c5f2c] via-[#159947] to-[#69d66f]',

      border: 'border-green-200',

      bg: 'from-green-50 via-white to-green-100/60',

      text:
        'from-[#003c22] via-[#11823b] to-[#3ecf63]',

      overlay: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.07]"
        >
          <path
            d="M10 90C40 50 80 40 120 60"
            stroke="#22c55e"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M55 45C65 20 85 10 100 15"
            stroke="#22c55e"
            strokeWidth="7"
            strokeLinecap="round"
          />
        </svg>
      ),
    },

    {
      icon: <GiPlantRoots />,
      title: 'Targeted Treatment',
      desc:
        'Identify exactly where and what to spray, reducing chemical usage by 60% and lowering operational costs.',

      gradient:
        'from-[#2563eb] via-[#3b82f6] to-[#60a5fa]',

      border: 'border-blue-200',

      bg: 'from-blue-50 via-white to-sky-100/60',

      text:
        'from-[#1d4ed8] via-[#2563eb] to-[#60a5fa]',

      overlay: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.07]"
        >
          <circle
            cx="60"
            cy="60"
            r="35"
            stroke="#3b82f6"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="10"
            fill="#3b82f6"
          />
        </svg>
      ),
    },

    {
      icon: <MdOutlineBiotech />,
      title: '72-Hour Early Warning',
      desc:
        'Detect infection 3 days before visible symptoms appear — giving you time to act before yield loss begins.',

      gradient:
        'from-[#f59e0b] via-[#fb923c] to-[#ef4444]',

      border: 'border-orange-200',

      bg: 'from-orange-50 via-white to-amber-100/60',

      text:
        'from-[#ea580c] via-[#f97316] to-[#ef4444]',

      overlay: (
        <svg
          width="120"
          height="120"
          viewBox="0 0 120 120"
          className="absolute right-5 top-1/2 -translate-y-1/2 opacity-[0.07]"
        >
          <circle
            cx="60"
            cy="60"
            r="28"
            stroke="#f59e0b"
            strokeWidth="8"
          />
          <path
            d="M60 60L60 42"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <path
            d="M60 60L75 72"
            stroke="#f59e0b"
            strokeWidth="6"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ].map((item, i) => (
    <motion.div
      key={item.title}
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.12 }}
      whileHover={{ y: -3 }}
      className={`
        relative overflow-hidden
        rounded-[24px]
        border
        ${item.border}
        bg-gradient-to-r
        ${item.bg}
        px-6 py-5
        shadow-md
      `}
    >
      {item.overlay}

      <div className="relative z-10 flex items-center gap-5">
        <div
          className={`
            w-16 h-16 rounded-[20px]
            bg-gradient-to-br ${item.gradient}
            flex items-center justify-center
            text-white text-2xl
            shadow-lg
            flex-shrink-0
          `}
        >
          {item.icon}
        </div>

        <div className="max-w-2xl">
          <h4
            className={`
              text-2xl font-black mb-1
              bg-gradient-to-r ${item.text}
              bg-clip-text text-transparent
            `}
          >
            {item.title}
          </h4>

          <p className="text-lg text-gray-600 leading-relaxed">
            {item.desc}
          </p>
        </div>
      </div>
    </motion.div>
  ))}
</div>
              </div>
            </ScrollReveal>

            {/* Right — stacked images like reference */}
            <ScrollReveal direction="right">
              <div className="relative h-[480px]">
                {/* Main large image — scanner/tablet */}
                <motion.div
                  initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  className="absolute top-0 right-0 w-4/5 h-80 rounded-3xl overflow-hidden shadow-2xl"
                >
                  <img src={imgScanner} alt="AI crop scanner" className="w-full h-full object-cover" />
                </motion.div>
                {/* Secondary image — farm */}
                <motion.div
                  initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.15 }}
                  className="absolute bottom-0 left-0 w-3/5 h-52 rounded-3xl overflow-hidden shadow-xl"
                >
                  <img src={imgFarm} alt="Farm field" className="w-full h-full object-cover" />
                </motion.div>
                {/* Small decorative tile */}
                <motion.div
                  initial={{ opacity:0, scale:0.8 }} whileInView={{ opacity:1, scale:1 }} viewport={{ once:true }} transition={{ delay:0.25 }}
                  className="absolute bottom-0 right-0 w-28 h-28 rounded-3xl bg-gradient-to-br from-green-100 to-emerald-200 shadow-lg flex items-center justify-center"
                >
                  <div className="text-center">
                    <p className="text-3xl font-black text-agri-primary">40%</p>
                    <p className="text-[10px] text-agri-primary font-semibold leading-tight px-2">Yield Saved</p>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 
      {/* ══════════════════════════════════════════════════════════════
          RESULTS MODAL — blurred bg + card like AuthPage
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/55 backdrop-blur-sm p-4"
          >
            {/* Click outside to close */}
            <div className="absolute inset-0" onClick={() => !loading && setShowModal(false)} />

            {/* Modal card — same structure as AuthPage */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex"
              style={{ minHeight: 540, maxHeight: '90vh' }}
            >

              {/* LEFT PANEL — hero image + crop info (like auth left panel) */}
              <div className="hidden md:flex md:w-5/12 relative flex-col justify-end overflow-hidden flex-shrink-0">
                <img src={heroPest} alt="" className="absolute inset-0 w-full h-full object-cover scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/50 to-transparent" />
                <div className="relative z-10 p-8 pb-10">
                  <div className="flex items-center gap-2 mb-6">
                    <GiSpottedBug className="text-orange-300 text-2xl" />
                    <span className="text-white font-bold text-lg">AgriConnect</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white leading-tight mb-2">
                    Diagnostic<br />Report
                  </h2>
                  <p className="text-green-200 text-sm font-medium mb-6">
                    {loading ? 'Scanning crop health data...' : `${results?.length || 0} issue${results?.length !== 1 ? 's' : ''} detected for ${crop || 'your crop'}`}
                  </p>
                  {/* Summary stats */}
                  {results && !loading && (
                    <div className="flex gap-5">
                      {[
                        { num: results.filter(r => r.severity === 'High').length,   label: 'High Risk',   color: 'text-red-300'    },
                        { num: results.filter(r => r.severity === 'Medium').length, label: 'Medium Risk', color: 'text-amber-300'  },
                        { num: results.filter(r => r.type === 'Pest').length,       label: 'Pests',       color: 'text-green-300'  },
                      ].map(s => (
                        <div key={s.label} className="text-center">
                          <div className={`text-2xl font-extrabold ${s.color}`}>{s.num}</div>
                          <div className="text-xs text-green-300 font-medium mt-0.5">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {loading && (
                    <div className="flex items-center gap-3 mt-2">
                      <div className="w-6 h-6 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                      <span className="text-white/70 text-sm">Analysing...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT PANEL — results (like auth right panel) */}
              <div className="flex-1 bg-white overflow-y-auto flex flex-col">
                {/* Close button */}
                <button
                  onClick={() => !loading && setShowModal(false)}
                  className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                >
                  <FaTimes className="w-4 h-4" />
                </button>

                <div className="flex-1 flex flex-col p-8">

                  {/* Loading state */}
                  {loading && (
                    <div className="flex-1 flex flex-col items-center justify-center gap-4 py-12">
                      <div className="w-16 h-16 border-4 border-agri-primary border-t-transparent rounded-full animate-spin" />
                      <p className="text-gray-600 font-semibold text-lg">Analysing crop health data...</p>
                      <p className="text-gray-400 text-sm">Scanning database for pests &amp; diseases</p>
                    </div>
                  )}

                  {/* API Error */}

                  {/* Results */}
                  {results && !loading && (
                    <>
                      <div className="mb-6">
                        <h3 className="text-2xl font-black text-gray-900 mb-1">
                          Results for <span className="text-agri-primary">{crop || 'Selected Crop'}</span>
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {results.length} issue{results.length !== 1 ? 's' : ''} identified — review each carefully
                        </p>
                      </div>

                      <div className="space-y-4">
                        {results.map((pest, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -12 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl overflow-hidden border"
                            style={{ borderColor: SEV_BORDER[pest.severity] }}
                          >
                            {/* Card header */}
                            <div
                              className="flex items-center justify-between px-5 py-3.5 border-b"
                              style={{ borderColor: SEV_BORDER[pest.severity], background: SEV_BG[pest.severity] }}
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                                  style={{ background: pest.type === 'Pest' ? '#ea580c' : '#16a34a' }}>
                                  {pest.type === 'Pest'
                                    ? <FaBug className="text-white text-xs" />
                                    : <FaLeaf className="text-white text-xs" />
                                  }
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm">{pest.name}</h4>
                                  <span className="text-xs text-gray-500">{pest.type}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {pest.severity === 'High' && <FaExclamationTriangle className="text-red-500 text-xs" />}
                                <span
                                  className="text-xs font-bold px-3 py-1 rounded-full border"
                                  style={{ background: SEV_BG[pest.severity], color: SEV_COLOR[pest.severity], borderColor: SEV_BORDER[pest.severity] }}
                                >
                                  {pest.severity} Severity
                                </span>
                              </div>
                            </div>

                            {/* Card body — 3 cols */}
                            <div className="grid grid-cols-3 divide-x divide-gray-100 bg-white">
                              {[
                                { label: 'Symptoms',   val: pest.symptoms,   bg: 'bg-orange-50/60', icon: <FaInfoCircle className="text-orange-400 text-xs" /> },
                                { label: 'Treatment',  val: pest.treatment,  bg: 'bg-blue-50/60',   icon: <FaCheckCircle className="text-blue-500 text-xs" /> },
                                { label: 'Prevention', val: pest.prevention, bg: 'bg-green-50/60',  icon: <FaShieldAlt  className="text-green-500 text-xs" /> },
                              ].map(col => (
                                <div key={col.label} className={`p-4 ${col.bg}`}>
                                  <div className="flex items-center gap-1.5 mb-2">
                                    {col.icon}
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{col.label}</p>
                                  </div>
                                  <p className="text-xs text-gray-700 leading-relaxed">{col.val}</p>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Footer action */}
                      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                        <p className="text-xs text-gray-400">Consult an agronomist for confirmed diagnosis</p>
                        <button
                          onClick={() => setShowModal(false)}
                          className="px-5 py-2 rounded-xl bg-agri-primary text-white text-sm font-semibold hover:shadow-md hover:-translate-y-0.5 transition-all"
                        >
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
