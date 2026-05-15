import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FaSeedling, FaLeaf, FaFlask, FaTint,
  FaCheckCircle, FaArrowRight, FaChartLine,
} from 'react-icons/fa';
import { GiMineralHeart, GiPlantRoots, GiEarthAmerica } from 'react-icons/gi';
import { TbDropletFilled } from 'react-icons/tb';
import { MdOutlineBiotech } from 'react-icons/md';
import Navbar       from './Navbar';
import Footer       from './Footer';
import ScrollReveal from './ScrollReveal';
import soilHeroBg   from '../assets/soil_hero_bg.png';
import soilFormBg   from '../assets/soil_main.png';
import soilWheat    from '../assets/soil_wheat.png';
import soilHands    from '../assets/soil_hands.png';
import soilAerial   from '../assets/soil_aerial.png';

// ── Data ────────────────────────────────────────────────────────────────────
const CROPS      = ['Wheat','Rice','Maize','Cotton','Soybean','Tomato','Onion','Potato','Chilli','Sugarcane','Mustard','Chickpea'];
const SOIL_TYPES = ['Sandy','Loamy','Clay','Silty','Black Cotton','Red Laterite','Alluvial'];
const STATES     = ['Madhya Pradesh','Punjab','Maharashtra','Uttar Pradesh','Rajasthan','Gujarat','Haryana','Bihar','West Bengal','Karnataka'];

const SOIL_DB = {
  Wheat:   { ph:'6.0-7.5', moisture:'50-60%', risk:'low',
    macro:{ N:{high:3,med:24,low:73}, P:{high:37,med:48,low:15}, K:{high:33,med:56,low:11} },
    micro:{ Zn:{high:20,med:45,low:35}, Fe:{high:30,med:50,low:20}, Mn:{high:25,med:55,low:20}, B:{high:15,med:40,low:45} },
    advice:['Apply urea in 3 equal splits for maximum uptake','Pre-sowing phosphate application strongly recommended','Zinc sulphate 25 kg/ha if pH exceeds 7.5'] },
  Rice:    { ph:'5.5-6.5', moisture:'70-80%', risk:'medium',
    macro:{ N:{high:5,med:30,low:65}, P:{high:28,med:42,low:30}, K:{high:40,med:45,low:15} },
    micro:{ Zn:{high:10,med:35,low:55}, Fe:{high:45,med:40,low:15}, Mn:{high:30,med:50,low:20}, B:{high:10,med:35,low:55} },
    advice:['Maintain 2-5 cm standing water during tillering','Green manure (Dhaincha) improves yield by 15%','Silica application prevents lodging in heavy rains'] },
  Tomato:  { ph:'6.0-7.0', moisture:'60-70%', risk:'high',
    macro:{ N:{high:8,med:42,low:50}, P:{high:45,med:35,low:20}, K:{high:50,med:38,low:12} },
    micro:{ Zn:{high:25,med:50,low:25}, Fe:{high:35,med:45,low:20}, Mn:{high:20,med:55,low:25}, B:{high:30,med:45,low:25} },
    advice:['Calcium spray every 2 weeks prevents blossom-end rot','Plastic mulching reduces moisture loss by 40%','Avoid water-logging — ensure proper field drainage'] },
  Cotton:  { ph:'6.0-8.0', moisture:'55-65%', risk:'medium',
    macro:{ N:{high:6,med:38,low:56}, P:{high:32,med:46,low:22}, K:{high:42,med:44,low:14} },
    micro:{ Zn:{high:18,med:48,low:34}, Fe:{high:28,med:52,low:20}, Mn:{high:22,med:58,low:20}, B:{high:35,med:42,low:23} },
    advice:['Deep ploughing (30 cm) before sowing essential','Boron foliar spray at flowering improves boll set','Apply FYM 10 t/ha for water-holding capacity'] },
  Soybean: { ph:'6.0-7.0', moisture:'55-65%', risk:'low',
    macro:{ N:{high:2,med:18,low:80}, P:{high:48,med:38,low:14}, K:{high:30,med:52,low:18} },
    micro:{ Zn:{high:22,med:50,low:28}, Fe:{high:32,med:48,low:20}, Mn:{high:28,med:52,low:20}, B:{high:12,med:38,low:50} },
    advice:['Rhizobium inoculation essential for N-fixation','Seed treatment with Thiram 3g/kg recommended','Apply lime if soil pH drops below 6.0'] },
  default: { ph:'6.0-7.0', moisture:'55-65%', risk:'low',
    macro:{ N:{high:4,med:26,low:70}, P:{high:34,med:44,low:22}, K:{high:35,med:50,low:15} },
    micro:{ Zn:{high:20,med:45,low:35}, Fe:{high:30,med:50,low:20}, Mn:{high:25,med:52,low:23}, B:{high:18,med:42,low:40} },
    advice:['Regular soil testing every 2 years recommended','Organic matter improves water retention in all soils','Monitor soil moisture weekly during critical growth stages'] },
};

const RISK_COLOR  = { low:'#16a34a', medium:'#d97706', high:'#dc2626' };
const RISK_BG     = { low:'#f0fdf4', medium:'#fffbeb', high:'#fef2f2' };
const RISK_BORDER = { low:'#bbf7d0', medium:'#fde68a', high:'#fecaca' };

// ── Donut chart (unchanged) ─────────────────────────────────────────────────
function DonutChart({ label, high, med, low }) {
  const r = 44, cx = 56, cy = 56, circ = 2 * Math.PI * r;
  const segs = [
    { pct: high, color: '#16a34a' },
    { pct: med,  color: '#eab308' },
    { pct: low,  color: '#ef4444' },
  ];
  let offset = 0;
  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: 112, height: 112 }}>
        <svg width="112" height="112" viewBox="0 0 112 112">
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f3f4f6" strokeWidth="14" />
          {segs.map((seg, i) => {
            const len = (seg.pct / 100) * circ;
            const dash = len + ' ' + (circ - len);
            const rot  = -90 + (offset / 100) * 360;
            offset += seg.pct;
            return (
              <motion.circle key={i} cx={cx} cy={cy} r={r}
                fill="none" stroke={seg.color} strokeWidth="14"
                strokeDashoffset={0}
                transform={'rotate(' + rot + ' ' + cx + ' ' + cy + ')'}
                initial={{ strokeDasharray: '0 ' + circ }}
                animate={{ strokeDasharray: dash }}
                transition={{ duration: 0.9, delay: i * 0.15, ease: 'easeOut' }}
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-black text-gray-800">{label}</span>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        {segs.map((s, i) => (
          <span key={i} className="text-xs font-bold" style={{ color: s.color }}>
            {[high, med, low][i]}%
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Science section data ───────────────────────────────────────────────────
const SCIENCE_SECTIONS = [
  {
    img:   soilWheat,
    side:  'right',
    iconBg:'#f0fdf4',
    iconColor:'#16a34a',
    icon:  <FaChartLine />,
    title: 'Maximizing Yield Potential',
    desc:  'Every acre holds untapped potential. Our analysis provides granular insights into nutrient deficiencies, allowing you to tailor fertilization specifically to your soil\'s unique chemical profile. On average, precision-managed fields see a 15–20% increase in crop density and overall harvest quality.',
  },
  {
    img:   soilHands,
    side:  'left',
    iconBg:'#fff7ed',
    iconColor:'#ea580c',
    icon:  <GiEarthAmerica />,
    title: 'Strategic Cost Management',
    desc:  'Fertilizer is one of the highest input costs in modern agriculture. By identifying exactly what your soil lacks, we eliminate wasteful "blanket" applications. Our users report significant reductions in input expenditure by applying only the specific nutrients required, exactly where they are needed most.',
  },
  {
    img:   soilAerial,
    side:  'right',
    iconBg:'#f0fdf4',
    iconColor:'#16a34a',
    icon:  <FaSeedling />,
    title: 'Long-Term Sustainability',
    desc:  'Sustainable farming is about preserving the land for the next generation. Proper pH balancing and nutrient management prevent soil degradation and chemical runoff. Our advisories help you build a resilient soil structure that retains moisture better and sequesters more carbon, ensuring the longevity of your farm\'s ecosystem.',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
export default function SoilHealthPage({ onLoginOpen, onSignupOpen }) {
  const [nitrogen,  setNitrogen]  = useState('');
  const [phosphorus,setPhosphorus]= useState('');
  const [potassium, setPotassium] = useState('');
  const [phVal,     setPhVal]     = useState('');
  const [soilType,  setSoilType]  = useState('');
  const [crop,      setCrop]      = useState('');
  const [state,     setState]     = useState('');
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [tab,       setTab]       = useState('macro');

  const analyse = () => {
    setLoading(true); setResult(null);
    setTimeout(() => {
      setResult({ ...(SOIL_DB[crop] || SOIL_DB.default), crop: crop || 'General', soilType, state, nitrogen, phosphorus, potassium, phVal });
      setLoading(false);
    }, 1400);
  };

  const MACRO_LABELS = { N:'Nitrogen', P:'Phosphorus', K:'Potassium' };
  const MICRO_LABELS = { Zn:'Zinc', Fe:'Iron', Mn:'Manganese', B:'Boron' };

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ══════════════════════════════════════════════════════════════
          HERO — farm field bg + centred glassmorphism form card
          (matches reference screenshot exactly)
      ══════════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden" style={{ paddingTop: 64, minHeight: 680 }}>
        {/* Background — slow Ken Burns */}
        <motion.img
          src={soilFormBg}
          alt="Farm field"
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'linear' }}
        />
        {/* Gradient overlay for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/40" />

        {/* Centred form card */}
        <div className="relative z-10 flex items-center justify-center min-h-[616px] px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="w-full max-w-xl rounded-3xl p-8 shadow-2xl"
            style={{
              background: 'rgba(255,255,255,0.82)',
              backdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <h2 className="text-3xl font-black text-agri-primary text-center mb-2">
              Precision Soil Analysis
            </h2>
            <p className="text-center text-gray-500 text-sm mb-7 leading-relaxed">
              Enter your soil metrics below. Our laboratory-grade algorithms will generate a<br />
              comprehensive health advisory to optimise your yield and sustainability.
            </p>

            {/* NPK + pH row */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label:'Nitrogen (N) — mg/kg',   val:nitrogen,   set:setNitrogen,   ph:'e.g. 140' },
                { label:'Phosphorus (P) — mg/kg', val:phosphorus, set:setPhosphorus, ph:'e.g. 45'  },
                { label:'Potassium (K) — mg/kg',  val:potassium,  set:setPotassium,  ph:'e.g. 210' },
                { label:'Soil pH Level',           val:phVal,      set:setPhVal,      ph:'e.g. 6.5' },
              ].map(({ label, val, set, ph }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
                  <input
                    type="number" value={val} onChange={e => set(e.target.value)}
                    placeholder={ph}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent placeholder:text-gray-300"
                  />
                </div>
              ))}
            </div>

            {/* Soil type */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Location / Soil Type</label>
              <div className="relative">
                <select
                  value={soilType} onChange={e => setSoilType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 pr-10"
                >
                  <option value="">Loamy Soil (Ideal for Cereal Crops)</option>
                  {SOIL_TYPES.map(s => <option key={s} value={s}>{s} Soil</option>)}
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Crop + State row */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Crop (optional)</label>
                <div className="relative">
                  <select value={crop} onChange={e => setCrop(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 pr-8">
                    <option value="">Select crop</option>
                    {CROPS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">State (optional)</label>
                <div className="relative">
                  <select value={state} onChange={e => setState(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:ring-2 focus:ring-green-400 pr-8">
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              onClick={analyse}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all duration-300 bg-agri-primary text-white hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:translate-y-0"
            >
              <MdOutlineBiotech className="text-lg" />
              {loading ? 'Analysing Soil...' : 'Generate Premium Advisory'}
            </button>
          </motion.div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          RESULTS — shown immediately below hero when ready
      ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {loading && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="text-center py-20 bg-white">
            <div className="w-14 h-14 border-4 border-agri-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 font-medium">Analysing soil profile...</p>
            <p className="text-xs text-gray-400 mt-1">Laboratory-grade algorithms running</p>
          </motion.div>
        )}

        {result && !loading && (
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }} className="bg-white">
            <div className="max-w-5xl mx-auto px-6 lg:px-8 py-12">

              {/* Section title */}
              <div className="text-center mb-10">
                <h2 className="text-3xl font-black text-gray-900 mb-2">Your Soil Analysis Report</h2>
                <div className="w-12 h-1 bg-agri-primary rounded-full mx-auto" />
              </div>

              {/* NPK values entered — summary banner */}
              {(result.nitrogen || result.phosphorus || result.potassium || result.phVal) && (
                <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                  {[
                    { label:'Nitrogen (N)', val: result.nitrogen  || '—', unit:'mg/kg', color:'#16a34a' },
                    { label:'Phosphorus (P)', val: result.phosphorus || '—', unit:'mg/kg', color:'#0284c7' },
                    { label:'Potassium (K)', val: result.potassium  || '—', unit:'mg/kg', color:'#7c3aed' },
                    { label:'Soil pH', val: result.phVal || '—', unit:'', color:'#ea580c' },
                  ].map((item, i) => (
                    <div key={i} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                      <p className="text-xs font-semibold text-gray-400 mb-1">{item.label}</p>
                      <p className="text-2xl font-black" style={{ color: item.color }}>{item.val}</p>
                      {item.unit && <p className="text-[10px] text-gray-400 mt-0.5">{item.unit}</p>}
                    </div>
                  ))}
                </motion.div>
              )}

              {/* Nutrient Charts */}
              <div className="bg-white rounded-3xl border border-green-100 shadow-lg p-6 mb-6">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <GiMineralHeart className="text-green-600" /> Nutrient Profile
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Soil nutrient concentrations for {result.crop}
                      {result.soilType ? ` · ${result.soilType} Soil` : ''}
                      {result.state    ? ` · ${result.state}` : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-black text-green-600">93.15L</p>
                    <p className="text-xs text-gray-400">Samples Analysed 2025-26</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-100 mb-6">
                  {['macro','micro'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className={'px-5 py-2.5 text-sm font-semibold relative transition-all ' + (tab === t ? 'text-green-700' : 'text-gray-400 hover:text-gray-600')}>
                      {t === 'macro' ? 'Macro-Nutrient' : 'Micro-Nutrient'}
                      {tab === t && <motion.div layoutId="tabline" className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-600 rounded-full" />}
                    </button>
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div key={tab} initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }} transition={{ duration:0.25 }}>
                    {tab === 'macro' ? (
                      <div className="flex flex-wrap justify-around gap-8 py-2">
                        {Object.entries(result.macro).map(([k, v]) => (
                          <div key={k} className="flex flex-col items-center">
                            <DonutChart label={k} high={v.high} med={v.med} low={v.low} />
                            <p className="text-xs font-semibold text-gray-500 mt-2">{MACRO_LABELS[k]}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-wrap justify-around gap-6 py-2">
                        {Object.entries(result.micro).map(([k, v]) => (
                          <div key={k} className="flex flex-col items-center">
                            <DonutChart label={k} high={v.high} med={v.med} low={v.low} />
                            <p className="text-xs font-semibold text-gray-500 mt-2">{MICRO_LABELS[k]}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-5 mt-6 pt-4 border-t border-gray-50">
                  {[{ c:'#16a34a', l:'High' }, { c:'#eab308', l:'Medium' }, { c:'#ef4444', l:'Low' }].map(s => (
                    <div key={s.l} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.c }} />
                      <span className="text-xs font-semibold text-gray-600">{s.l}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* pH + Moisture + Risk cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* pH */}
                <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FaFlask className="text-green-600 text-sm" />
                    <h4 className="font-bold text-gray-900 text-sm">pH Profile</h4>
                  </div>
                  <div className="bg-green-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Ideal Range</p>
                    <p className="text-2xl font-black text-green-700">{result.ph}</p>
                  </div>
                  {result.phVal && (
                    <div className={'rounded-xl p-2.5 mb-2 text-xs font-semibold ' + (parseFloat(result.phVal) < 6 ? 'bg-red-50 text-red-700 border border-red-100' : parseFloat(result.phVal) > 7.5 ? 'bg-amber-50 text-amber-700 border border-amber-100' : 'bg-green-50 text-green-700 border border-green-100')}>
                      pH {result.phVal} — {parseFloat(result.phVal) < 6 ? 'Too acidic: apply lime' : parseFloat(result.phVal) > 7.5 ? 'Alkaline: apply gypsum' : 'Within ideal range ✓'}
                    </div>
                  )}
                  <div className="rounded-xl p-2.5 text-xs font-bold uppercase border"
                    style={{ background: RISK_BG[result.risk], color: RISK_COLOR[result.risk], borderColor: RISK_BORDER[result.risk] }}>
                    Risk Level: {result.risk}
                  </div>
                </div>

                {/* Moisture */}
                <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <TbDropletFilled className="text-blue-500 text-sm" />
                    <h4 className="font-bold text-gray-900 text-sm">Moisture Target</h4>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">Optimal Range</p>
                    <p className="text-2xl font-black text-blue-700">{result.moisture}</p>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">Maintain consistent moisture throughout critical growth stages to maximise nutrient uptake efficiency.</p>
                </div>

                {/* Crop summary */}
                <div className="bg-white rounded-2xl border border-green-100 shadow-sm p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <FaLeaf className="text-green-600 text-sm" />
                    <h4 className="font-bold text-gray-900 text-sm">Analysis Summary</h4>
                  </div>
                  <p className="text-xl font-black text-gray-900 mb-1">{result.crop}</p>
                  {result.soilType && <p className="text-xs text-gray-400 mb-1">Soil Type: {result.soilType}</p>}
                  {result.state    && <p className="text-xs text-gray-400 mb-1">Region: {result.state}</p>}
                  <div className="mt-3 pt-3 border-t border-gray-50">
                    <p className="text-xs text-gray-400 mb-1">Fertiliser Inputs Entered</p>
                    <div className="flex gap-2 flex-wrap">
                      {result.nitrogen   && <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">N: {result.nitrogen} mg/kg</span>}
                      {result.phosphorus && <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold">P: {result.phosphorus} mg/kg</span>}
                      {result.potassium  && <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-semibold">K: {result.potassium} mg/kg</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expert recommendations */}
              <div className="rounded-3xl overflow-hidden shadow-lg" style={{ background: 'linear-gradient(135deg, #14532d, #166534)' }}>
                <div className="p-6">
                  <h3 className="font-bold text-white mb-1 flex items-center gap-2 text-sm">
                    <FaLeaf className="text-green-300" /> Expert Recommendations for {result.crop}
                  </h3>
                  <p className="text-green-300/60 text-xs mb-5">Based on soil type and regional agronomy data</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {result.advice.map((tip, i) => (
                      <motion.div key={i} initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.1 }}
                        className="bg-white/10 rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-colors">
                        <div className="flex items-start gap-2.5">
                          <FaCheckCircle className="text-green-400 text-xs flex-shrink-0 mt-0.5" />
                          <p className="text-white/85 text-sm leading-relaxed">{tip}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════
          SCIENCE OF SUSTAINABLE GROWTH — alternating image + text
          (matches reference screenshot exactly)
      ══════════════════════════════════════════════════════════════ */}
      <section className="py-20" style={{ background: !result ? '#fff' : '#f5faf6' }}>
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-gray-900 mb-3">The Science of Sustainable Growth</h2>
              <div className="w-10 h-1 bg-agri-primary rounded-full mx-auto" />
            </div>
          </ScrollReveal>

          <div className="space-y-20">
            {SCIENCE_SECTIONS.map((sec, i) => (
              <ScrollReveal key={sec.title} delay={0.05} direction={sec.side === 'right' ? 'up' : 'up'}>
                <div className={`flex flex-col ${sec.side === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>

                  {/* Text side */}
                  <div className="flex-1">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-lg"
                      style={{ background: sec.iconBg, color: sec.iconColor }}
                    >
                      {sec.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{sec.title}</h3>
                    <p className="text-gray-500 text-base leading-relaxed">{sec.desc}</p>
                  </div>

                  {/* Image side */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1 rounded-3xl overflow-hidden shadow-xl"
                    style={{ maxHeight: 280 }}
                  >
                    <img
                      src={sec.img}
                      alt={sec.title}
                      className="w-full h-72 object-cover"
                    />
                  </motion.div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
