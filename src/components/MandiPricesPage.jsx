import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Legend,
} from 'recharts';
import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext.jsx';
import {
  FaSeedling, FaLeaf, FaCarrot, FaAppleAlt, FaSun,
  FaArrowUp, FaArrowDown, FaArrowsAltV, FaSearch,
  FaFilter, FaTimes, FaStore, FaMapMarkerAlt, FaChartLine,
  FaChartBar, FaClock, FaBell, FaExclamationTriangle,
  FaLightbulb, FaCloudRain, FaGlobe, FaThumbsUp,
  FaTruck, FaMicrophone, FaMicrophoneSlash, FaStar,
  FaCheckCircle, FaRupeeSign, FaTag, FaLeaf as FaLeafIcon,
} from 'react-icons/fa';
import { GiWheat, GiCorn } from 'react-icons/gi';
import { MdTrendingUp, MdTrendingDown, MdOutlineGrain } from 'react-icons/md';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  MANDI_DATA, ALL_STATES, ALL_CATEGORIES, ALL_MANDIS,
  getAnalytics, getPriceTrend,
} from '../services/marketApi';
import { BEST_MANDI_DATA, BEST_MANDI_CROPS, BEST_MANDI_STATES } from '../data/marketplaceData';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) => `₹${n.toLocaleString('en-IN')}`;
const now = new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

const categoryIcon = {
  Grain:      <GiWheat className="text-amber-600" />,
  Pulse:      <MdOutlineGrain className="text-green-700" />,
  Vegetable:  <FaCarrot className="text-orange-500" />,
  Fruit:      <FaAppleAlt className="text-red-500" />,
  'Cash Crop':<FaSeedling className="text-emerald-600" />,
};

// ─── Sub-components ───────────────────────────────────────────────────────────
function AnalyticsCard({ label, value, sub, icon, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-5 border border-green-100 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
    >
      <div className={`absolute top-0 left-5 right-5 h-0.5 rounded-b-full ${accent}`} />
      <div className="flex items-start gap-3 flex-1">
        <span className="text-2xl text-gray-600 flex-shrink-0">{icon}</span>
        <div className="min-w-0">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">{label}</p>
          <p className="text-base font-bold text-gray-900 leading-tight">{value}</p>
          {sub && <p className="text-xs text-gray-500 mt-1 leading-snug">{sub}</p>}
        </div>
      </div>
    </motion.div>
  );
}

function TrendBadge({ change, trend }) {
  const up = trend === 'up';
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
      up ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
    }`}>
      {up ? <FaArrowUp className="text-[10px]" /> : <FaArrowDown className="text-[10px]" />}
      {up ? '+' : ''}{fmt(change)}
    </span>
  );
}

function TrendDot({ trend }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${
      trend === 'up' ? 'bg-green-500 animate-pulse' : 'bg-red-400'
    }`} />
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-green-100 rounded-xl shadow-lg px-4 py-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: {fmt(p.value)}</p>
      ))}
    </div>
  );
};

// ─── Hexagon Stat ─────────────────────────────────────────────────────────────
function HexStat({ value, label, icon, delay = 0, filled = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div className="relative">
        <svg width="130" height="150" viewBox="0 0 140 160">
          <polygon points="70,5 135,40 135,120 70,155 5,120 5,40"
            fill={filled ? '#dcfce7' : '#f3f4f6'}
            stroke={filled ? '#16a34a' : '#d1d5db'} strokeWidth="2" />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <span className="text-green-600 text-lg">{icon}</span>
          <span className="text-xl font-extrabold text-gray-900 leading-none">{value}</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-600 text-center mt-0.5 max-w-[90px] leading-tight">{label}</p>
    </motion.div>
  );
}

// ─── Best Mandi Finder ────────────────────────────────────────────────────────
function BestMandiFinder({ onSelectCrop }) {
  const [crop,     setCrop]     = useState('');
  const [loc,      setLoc]      = useState('');
  const [sortBy,   setSortBy]   = useState('price-desc');
  const [qty,      setQty]      = useState('');
  const [result,   setResult]   = useState(null);
  const [searched, setSearched] = useState(false);
  const [error,    setError]    = useState('');

  const fmtN = n => '\u20b9' + Number(n).toLocaleString('en-IN');

  const handleFind = () => {
    try {
      setError('');
      if (!crop) { setError('Please select a crop first.'); return; }

      let matches = (BEST_MANDI_DATA || []).filter(d => d.crop === crop);
      if (!matches.length) { setError('No mandi data found for this crop.'); return; }

      matches = [...matches].sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'change')    return b.change - a.change;
        return b.price - a.price;
      });

      const best       = matches[0];
      const local      = loc ? (matches.find(d => d.state === loc) || null) : null;
      const priceDiff  = (local && local.id !== best.id) ? (best.price - local.price) : 0;
      const estProfit  = qty ? Math.round(best.price * Number(qty)) : 0;
      const localProfit = (qty && local) ? Math.round(local.price * Number(qty)) : 0;

      setResult({ best, local, priceDiff, all: matches, estProfit, localProfit });
      setSearched(true);
      if (onSelectCrop) onSelectCrop(best);
    } catch (e) {
      setError('Something went wrong: ' + e.message);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 16, border: '1px solid #d1fae5', padding: 24, boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <div style={{ width: 40, height: 40, background: '#d1fae5', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaStar style={{ color: '#16a34a', fontSize: 16 }} />
        </div>
        <div>
          <p style={{ fontWeight: 700, color: '#111', margin: 0, fontSize: 15 }}>Best Market to Sell</p>
          <p style={{ color: '#6b7280', margin: 0, fontSize: 12 }}>Compare mandis · Highest price · Skip middlemen</p>
        </div>
      </div>

      {/* Inputs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
        <select value={crop} onChange={e => { setCrop(e.target.value); setResult(null); setSearched(false); setError(''); }}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #a7f3d0', background: '#f0fdf4', fontSize: 13, color: '#374151', outline: 'none' }}>
          <option value="">Select your crop</option>
          {(BEST_MANDI_CROPS || []).map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select value={loc} onChange={e => setLoc(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #a7f3d0', background: '#f0fdf4', fontSize: 13, color: '#374151', outline: 'none' }}>
          <option value="">Your state (optional)</option>
          {(BEST_MANDI_STATES || []).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #a7f3d0', background: '#f0fdf4', fontSize: 13, color: '#374151', outline: 'none' }}>
          <option value="price-desc">Highest Price First</option>
          <option value="price-asc">Lowest Price First</option>
          <option value="change">Biggest Gainers First</option>
        </select>

        <input type="number" value={qty} onChange={e => setQty(e.target.value)}
          placeholder="Quantity in quintal (optional)"
          style={{ padding: '10px 12px', borderRadius: 10, border: '1px solid #a7f3d0', background: '#f0fdf4', fontSize: 13, color: '#374151', outline: 'none' }}
        />
      </div>

      <button onClick={handleFind}
        style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg,#16a34a,#059669)', color: 'white', fontWeight: 700, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
        <FaSearch style={{ fontSize: 12 }} /> Find Best Mandi
      </button>

      {/* Error */}
      {error && (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 10, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {/* Empty state */}
      {!searched && !result && !error && (
        <div style={{ textAlign: 'center', padding: '24px 0', color: '#9ca3af' }}>
          <FaMapMarkerAlt style={{ fontSize: 32, marginBottom: 8, color: '#d1d5db', display: 'block', margin: '0 auto 8px' }} />
          <p style={{ fontSize: 13, margin: 0 }}>Select a crop and click <strong style={{ color: '#374151' }}>Find Best Mandi</strong></p>
          <p style={{ fontSize: 12, marginTop: 4, color: '#d1d5db' }}>We'll compare {(BEST_MANDI_DATA || []).length} mandis across India</p>
        </div>
      )}

      {/* Results */}
      {result && result.best && (
        <div>
          {/* Top result card */}
          <div style={{ background: 'linear-gradient(135deg,#16a34a,#059669)', borderRadius: 14, padding: 16, color: 'white', marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#bbf7d0', textTransform: 'uppercase', letterSpacing: 1, margin: '0 0 4px' }}>
                  Best Mandi for {result.best.crop}
                </p>
                <p style={{ fontSize: 22, fontWeight: 900, margin: '0 0 2px' }}>{result.best.mandi}</p>
                <p style={{ fontSize: 13, color: '#86efac', margin: 0 }}>{result.best.state}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px 16px', textAlign: 'center', flexShrink: 0 }}>
                <p style={{ fontSize: 11, color: '#bbf7d0', margin: '0 0 2px' }}>Today's Rate</p>
                <p style={{ fontSize: 24, fontWeight: 900, margin: '0 0 2px' }}>{fmtN(result.best.price)}</p>
                <p style={{ fontSize: 11, color: '#bbf7d0', margin: 0 }}>/quintal</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>
                {result.best.trend === 'up' ? '▲ +' : '▼ -'}{fmtN(Math.abs(result.best.change))} today
              </span>
              {result.priceDiff > 0 && (
                <span style={{ fontSize: 13, fontWeight: 600 }}>
                  🚛 +{fmtN(result.priceDiff)}/qtl vs your state
                </span>
              )}
            </div>

            {result.estProfit > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                <span style={{ fontSize: 13, color: '#bbf7d0' }}>Est. earnings ({qty} qtl):</span>
                <span style={{ fontSize: 20, fontWeight: 900 }}>{fmtN(result.estProfit)}</span>
              </div>
            )}
          </div>

          {/* Local mandi */}
          {result.local && result.local.id !== result.best.id && (
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 12, padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', margin: '0 0 2px' }}>Your Local Mandi</p>
                <p style={{ fontSize: 13, fontWeight: 700, color: '#1f2937', margin: '0 0 2px' }}>{result.local.mandi}, {result.local.state}</p>
                {result.localProfit > 0 && <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>Est. earnings: {fmtN(result.localProfit)}</p>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: '#1f2937', margin: '0 0 2px' }}>{fmtN(result.local.price)}/qtl</p>
                {result.priceDiff > 0 && <p style={{ fontSize: 12, fontWeight: 700, color: '#ef4444', margin: 0 }}>-{fmtN(result.priceDiff)} less</p>}
              </div>
            </div>
          )}

          {/* Ranked list */}
          <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            All {result.all.length} Mandis Ranked
          </p>
          <div style={{ maxHeight: 240, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {result.all.map((d, i) => (
              <div key={d.id + '-' + i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '10px 12px', borderRadius: 10,
                  border: i === 0 ? '1px solid #86efac' : (d.state === loc && loc ? '1px solid #fde68a' : '1px solid #f3f4f6'),
                  background: i === 0 ? '#f0fdf4' : (d.state === loc && loc ? '#fffbeb' : '#fafafa'),
                }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 26, height: 26, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 700, flexShrink: 0,
                    background: i === 0 ? '#16a34a' : '#e5e7eb',
                    color: i === 0 ? 'white' : '#374151',
                  }}>{i + 1}</span>
                  <div>
                    <p style={{ fontSize: 13, fontWeight: 600, color: '#111', margin: 0 }}>{d.mandi}</p>
                    <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>{d.state}</p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#111', margin: '0 0 2px' }}>{fmtN(d.price)}</p>
                  <span style={{ fontSize: 11, fontWeight: 700, color: d.trend === 'up' ? '#16a34a' : '#ef4444' }}>
                    {d.trend === 'up' ? '▲' : '▼'} {fmtN(Math.abs(d.change))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Voice Assistant ─────────────────────────────────────────────────────────
function VoiceAssistant() {
  const [listening, setListening]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [status, setStatus]         = useState('idle');
  const [response, setResponse]     = useState('');
  const recognitionRef              = useRef(null);
  const transcriptRef               = useRef('');
  const supported = typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window);

  const getResp = (t) => {
    const tl = t.toLowerCase();
    if (tl.includes('wheat') || tl.includes('gehu')) {
      const w = MANDI_DATA.find(d => d.crop === 'Wheat');
      return w ? `Wheat is at ${fmt(w.price)}/qtl in ${w.mandi}. Price ${w.trend === 'up' ? 'rising' : 'falling'} by ${fmt(Math.abs(w.change))} today.` : 'Wheat data not found.';
    }
    if (tl.includes('tomato') || tl.includes('tamatar')) {
      const tom = MANDI_DATA.find(d => d.crop === 'Tomato');
      return tom ? `Tomatoes are at ${fmt(tom.price)}/qtl in ${tom.mandi}. ${tom.trend === 'up' ? 'Prices rising' : 'Prices falling'}.` : 'Tomato data not available.';
    }
    if (tl.includes('rice') || tl.includes('chawal')) {
      const r = MANDI_DATA.find(d => d.crop === 'Rice');
      return r ? `Rice is at ${fmt(r.price)}/qtl in ${r.mandi}, ${r.state}.` : 'Rice data not found.';
    }
    if (tl.includes('best') || tl.includes('sell') || tl.includes('highest')) {
      const top = [...MANDI_DATA].sort((a,b) => b.price - a.price)[0];
      return `Highest priced today: ${top.crop} at ${fmt(top.price)}/qtl in ${top.mandi}.`;
    }
    const top3 = [...MANDI_DATA].sort((a,b) => b.change - a.change).slice(0,3);
    return `Today's top gainers: ${top3.map(d => `${d.crop} +${fmt(d.change)}`).join(', ')}.`;
  };

  const startListening = useCallback(() => {
    if (!supported) return;
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SR();
    recognition.lang = 'en-IN';
    recognition.interimResults = true;
    recognitionRef.current = recognition;
    recognition.onstart = () => { setListening(true); setStatus('listening'); setTranscript(''); setResponse(''); transcriptRef.current = ''; };
    recognition.onresult = (e) => { const t = Array.from(e.results).map(r => r[0].transcript).join(''); setTranscript(t); transcriptRef.current = t; };
    recognition.onend = () => {
      setListening(false); setStatus('processing');
      setTimeout(() => { setStatus('done'); setResponse(getResp(transcriptRef.current)); }, 1000);
    };
    recognition.onerror = () => { setListening(false); setStatus('idle'); };
    recognition.start();
  }, []);

  const stopListening = () => recognitionRef.current?.stop();

  return (
    <div className="bg-gradient-to-br from-green-700 to-emerald-800 rounded-2xl p-5 text-white">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
          <FaMicrophone className="text-white text-sm" />
        </div>
        <div>
          <h3 className="font-bold text-sm">Voice Assistant</h3>
          <p className="text-green-200 text-xs">Ask about crop prices by voice</p>
        </div>
      </div>
      {!supported ? (
        <p className="text-xs text-green-200">Voice not supported. Please use Chrome browser.</p>
      ) : (
        <>
          <button onClick={listening ? stopListening : startListening}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all duration-300 mb-3 ${listening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-white/20 hover:bg-white/30 border border-white/30'}`}>
            {listening ? <><FaMicrophoneSlash className="text-lg" /> Stop Listening</> : <><FaMicrophone className="text-lg" /> Tap to Ask by Voice</>}
          </button>
          {status === 'listening' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-3">
              <div className="flex items-center gap-2 mb-1">
                {[0,1,2].map(i => <span key={i} className="w-1 bg-green-300 rounded-full animate-bounce" style={{ height: `${12+i*4}px`, animationDelay: `${i*0.15}s` }} />)}
                <span className="text-xs text-green-200">Listening...</span>
              </div>
              {transcript && <p className="text-xs text-white bg-white/10 rounded-lg px-3 py-2 italic">"{transcript}"</p>}
            </motion.div>
          )}
          {status === 'processing' && <p className="text-xs text-green-200 mb-3 animate-pulse">Looking up prices...</p>}
          {status === 'done' && response && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="bg-white/15 rounded-xl p-3 mb-2">
              {transcript && <p className="text-xs text-green-200 mb-1 italic">"{transcript}"</p>}
              <p className="text-sm text-white leading-relaxed">{response}</p>
            </motion.div>
          )}
          <p className="text-[10px] text-green-300 text-center">Try: "Wheat price today" · "Best mandi for tomatoes"</p>
        </>
      )}
    </div>
  );
}

// ─── Ecosystem Stats (Hexagonal) ─────────────────────────────────────────────
function EcosystemStats() {
  const stats = [
    { value: '300+', label: 'Branding Campaigns',  icon: <FaTag className="text-green-600" />,      filled: true,  delay: 0    },
    { value: '2M+',  label: 'Leads Generated',     icon: <FaArrowUp className="text-green-600" />,  filled: true,  delay: 0.08 },
    { value: '25+',  label: 'Digital Communities', icon: <FaGlobe className="text-gray-500" />,     filled: false, delay: 0.04 },
    { value: '400+', label: 'Crop Varieties',      icon: <FaLeaf className="text-green-600" />,     filled: true,  delay: 0.12 },
    { value: '12M+', label: 'Farmers Network',     icon: <FaStore className="text-gray-500" />,     filled: false, delay: 0.16 },
    { value: '120+', label: 'Total Crops',         icon: <GiWheat className="text-green-600" />,    filled: true,  delay: 0.20 },
    { value: '5k+',  label: 'Smart Farms',         icon: <FaSeedling className="text-gray-500" />, filled: false, delay: 0.24 },
    { value: '1M+',  label: 'Advisory Given',      icon: <FaBell className="text-green-600" />,     filled: true,  delay: 0.28 },
  ];
  return (
    <section className="py-16" style={{ background: '#f9fdfb' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-50 text-agri-primary text-sm font-semibold rounded-full mb-3 border border-green-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            AgriConnect Ecosystem at a Glance
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">India's Agricultural Network</h2>
          <p className="text-gray-500 mt-2 max-w-xl mx-auto text-sm">Numbers that reflect the scale of Indian agriculture on our platform.</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {stats.map(s => <HexStat key={s.label} {...s} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MandiPricesPage({ onLoginOpen, onSignupOpen } = {}) {
  const { t } = useLanguage();
  const routerLocation = useLocation();
  const initTab = new URLSearchParams(routerLocation.search).get('tab') === 'sell' ? 'sell' : 'prices';
  const [activeTab, setActiveTab]     = useState(initTab);
  const [search, setSearch]           = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [catFilter, setCatFilter]     = useState('');
  const [mandiFilter, setMandiFilter] = useState('');
  const [trendFilter, setTrendFilter] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(MANDI_DATA[6]);
  const [sortField, setSortField]     = useState('crop');
  const [sortDir, setSortDir]         = useState('asc');

  const filtered = useMemo(() => {
    let d = [...MANDI_DATA];
    if (search)      d = d.filter(r =>
      r.crop.toLowerCase().includes(search.toLowerCase()) ||
      r.hindi.includes(search) ||
      r.mandi.toLowerCase().includes(search.toLowerCase())
    );
    if (stateFilter) d = d.filter(r => r.state === stateFilter);
    if (catFilter)   d = d.filter(r => r.category === catFilter);
    if (mandiFilter) d = d.filter(r => r.mandi === mandiFilter);
    if (trendFilter) d = d.filter(r => r.trend === trendFilter);
    d.sort((a, b) => {
      const av = a[sortField], bv = b[sortField];
      if (typeof av === 'number') return sortDir === 'asc' ? av - bv : bv - av;
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
    return d;
  }, [search, stateFilter, catFilter, mandiFilter, trendFilter, sortField, sortDir]);

  const analytics      = useMemo(() => getAnalytics(), []);
  const trendData      = useMemo(() => getPriceTrend(selectedCrop?.crop), [selectedCrop]);
  const comparisonData = useMemo(() =>
    [...MANDI_DATA].sort((a, b) => b.price - a.price).slice(0, 6)
      .map(d => ({ name: d.crop, price: d.price, change: Math.abs(d.change) })),
  []);

  const gainers = useMemo(() =>
    [...MANDI_DATA].filter(d => d.trend === 'up').sort((a, b) => b.change - a.change).slice(0, 5), []);
  const losers  = useMemo(() =>
    [...MANDI_DATA].filter(d => d.trend === 'down').sort((a, b) => a.change - b.change).slice(0, 5), []);

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  useEffect(() => { window.scrollTo(0, 0); }, []);
  useEffect(() => {
    const tab = new URLSearchParams(routerLocation.search).get('tab');
    setActiveTab(tab === 'sell' ? 'sell' : 'prices');
  }, [routerLocation.search]);

  const SortIcon = ({ field }) => (
    <span className="ml-1 text-xs opacity-50 inline-flex items-center">
      {sortField === field
        ? (sortDir === 'asc' ? <FaArrowUp className="text-[9px]" /> : <FaArrowDown className="text-[9px]" />)
        : <FaArrowsAltV className="text-[9px]" />}
    </span>
  );

  const analyticsCards = [
    {
      label: 'Highest Rising',
      value: analytics.highestRising.crop,
      sub: `+${fmt(analytics.highestRising.change)} · ${analytics.highestRising.mandi}`,
      icon: <MdTrendingUp className="text-green-600 text-2xl" />,
      accent: 'bg-gradient-to-r from-green-400 to-emerald-500',
    },
    {
      label: 'Biggest Drop',
      value: analytics.biggestDrop.crop,
      sub: `${fmt(analytics.biggestDrop.change)} · ${analytics.biggestDrop.mandi}`,
      icon: <MdTrendingDown className="text-red-500 text-2xl" />,
      accent: 'bg-gradient-to-r from-red-400 to-rose-500',
    },
    {
      label: 'Most Active Mandi',
      value: analytics.mostActiveMandi,
      sub: 'Highest crop listing volume',
      icon: <FaStore className="text-amber-500 text-xl" />,
      accent: 'bg-gradient-to-r from-amber-400 to-yellow-500',
    },
    {
      label: 'Top State (Avg)',
      value: analytics.stateAvg[0].state,
      sub: `Avg ${fmt(analytics.stateAvg[0].avg)}/qtl`,
      icon: <FaGlobe className="text-blue-500 text-xl" />,
      accent: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── Page Header ─────────────────────────────────────────────────── */}
      <div
        className="pt-28 pb-10 px-6 lg:px-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)' }}
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-3xl opacity-10"
          style={{ background: '#86efac', transform: 'translate(30%,-30%)' }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl opacity-10"
          style={{ background: '#4ade80', transform: 'translate(-30%,30%)' }} />

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <Link to="/" className="text-green-300 hover:text-white text-sm transition-colors">Home</Link>
            <span className="text-green-500 text-sm">›</span>
            <span className="text-white text-sm font-medium">Mandi Prices</span>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90 font-medium">Live Market Data</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                Mandi <span className="text-green-300">Prices</span>
              </h1>
              <p className="text-green-200 mt-2 text-lg">
                मंडी भाव — Real-time crop prices across India&apos;s major markets
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-green-300 mb-1">Last Updated</p>
              <p className="text-white font-semibold text-sm">{now}</p>
              <p className="text-green-400 text-xs mt-1">{MANDI_DATA.length} crops · {ALL_STATES.length} states</p>
            </div>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-2 mt-6">
            {[
              { key: 'prices', label: 'Mandi Prices' },
              { key: 'sell',   label: 'Sell Your Crop' },
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.key ? 'bg-white text-agri-primary shadow-md' : 'bg-white/15 text-white border border-white/25 hover:bg-white/25'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Analytics Cards ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" style={{ alignItems: 'stretch' }}>
          {analyticsCards.map(c => <AnalyticsCard key={c.label} {...c} />)}
        </div>
      </div>

      {/* ── Sell Your Crop Tab ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8 pb-4">
        {activeTab === 'sell' ? (
          <motion.div key="sell" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-6">
              <div className="flex items-center gap-3 mb-3">
                <GiWheat className="text-amber-600 text-2xl" />
                <div>
                  <h3 className="font-bold text-gray-900">Sell Your Crop Directly</h3>
                  <p className="text-sm text-gray-500">Find the best mandi, compare prices, skip the middleman</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { icon: <FaChartLine className="text-green-600" />, label: 'Compare Mandi Prices', desc: 'Real-time rates across India' },
                  { icon: <FaTruck className="text-blue-500" />, label: 'Transport Estimate', desc: 'Distance-based cost calc' },
                  { icon: <FaRupeeSign className="text-emerald-600" />, label: 'Profit Calculator', desc: 'Net earnings after transport' },
                ].map(f => (
                  <div key={f.label} className="bg-white/80 rounded-xl p-3 border border-amber-100">
                    <div className="text-lg mb-1">{f.icon}</div>
                    <p className="text-sm font-semibold text-gray-800">{f.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <BestMandiFinder onSelectCrop={setSelectedCrop} />
              <VoiceAssistant />
            </div>
          </motion.div>
        ) : (
          <motion.div key="prices" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {/* ── Search & Filters ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-5">
          <div className="relative mb-4">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search crop or mandi (e.g. Wheat, Bhopal, गेहूं)"
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-green-100 bg-green-50/50 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all text-sm"
            />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { value: stateFilter, setter: setStateFilter, options: ALL_STATES,     placeholder: 'State' },
              { value: catFilter,   setter: setCatFilter,   options: ALL_CATEGORIES, placeholder: 'Crop Type' },
              { value: mandiFilter, setter: setMandiFilter, options: ALL_MANDIS,     placeholder: 'Mandi' },
            ].map(({ value, setter, options, placeholder }) => (
              <select
                key={placeholder}
                value={value}
                onChange={e => setter(e.target.value)}
                className="flex-1 min-w-[140px] px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
              >
                <option value="">{placeholder}</option>
                {options.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            ))}

            <select
              value={trendFilter}
              onChange={e => setTrendFilter(e.target.value)}
              className="flex-1 min-w-[130px] px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer"
            >
              <option value="">All Trends</option>
              <option value="up">Rising</option>
              <option value="down">Falling</option>
            </select>

            {(search || stateFilter || catFilter || mandiFilter || trendFilter) && (
              <button
                onClick={() => { setSearch(''); setStateFilter(''); setCatFilter(''); setMandiFilter(''); setTrendFilter(''); }}
                className="px-4 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5"
              >
                <FaTimes className="text-xs" /> Clear
              </button>
            )}
          </div>

          <p className="text-xs text-gray-400 mt-3">
            Showing <strong className="text-gray-600">{filtered.length}</strong> of {MANDI_DATA.length} crops
          </p>
        </div>
      </div>

      {/* ── Table + Sidebar ──────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-6 pb-16">
        <div className="flex flex-col xl:flex-row gap-6">

          {/* Table */}
          <div className="flex-1 min-w-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100">
                      {[
                        { label: 'Crop',          field: 'crop'     },
                        { label: 'Type',          field: 'category' },
                        { label: 'State',         field: 'state'    },
                        { label: 'Mandi',         field: 'mandi'    },
                        { label: 'Price (₹/qtl)', field: 'price'    },
                        { label: 'Change',        field: 'change'   },
                        { label: 'Trend',         field: null        },
                      ].map(col => (
                        <th
                          key={col.label}
                          onClick={() => col.field && toggleSort(col.field)}
                          className={`px-4 py-3.5 text-left font-semibold text-gray-700 whitespace-nowrap sticky top-0 bg-green-50/90 backdrop-blur-sm ${col.field ? 'cursor-pointer hover:text-green-700 select-none' : ''}`}
                        >
                          <span className="inline-flex items-center">
                            {col.label}
                            {col.field && <SortIcon field={col.field} />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence>
                      {filtered.map((row, i) => (
                        <motion.tr
                          key={row.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ delay: i * 0.02, duration: 0.25 }}
                          onClick={() => setSelectedCrop(row)}
                          className={`border-b border-gray-50 cursor-pointer transition-colors duration-150 ${
                            selectedCrop?.id === row.id ? 'bg-green-50' : 'hover:bg-gray-50/80'
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-gray-900">{row.crop}</div>
                            <div className="text-xs text-gray-400 mt-0.5">{row.hindi}</div>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                              <span className="text-sm">{categoryIcon[row.category]}</span>
                              {row.category}
                            </span>
                          </td>
                          <td className="px-4 py-3.5 text-gray-600 text-xs">{row.state}</td>
                          <td className="px-4 py-3.5">
                            <span className="font-medium text-gray-800">{row.mandi}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <span className="font-bold text-gray-900">{fmt(row.price)}</span>
                          </td>
                          <td className="px-4 py-3.5">
                            <TrendBadge change={row.change} trend={row.trend} />
                          </td>
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5">
                              <TrendDot trend={row.trend} />
                              <span className={`text-xs font-medium ${row.trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
                                {row.trend === 'up' ? 'Rising' : 'Falling'}
                              </span>
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-gray-400">
                          <GiWheat className="text-5xl mx-auto mb-3 text-gray-300" />
                          <p className="font-medium">No crops found</p>
                          <p className="text-sm mt-1">Try adjusting your filters</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                      <FaChartLine className="text-green-600" /> 7-Day Price Trend
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">{selectedCrop?.crop} — {selectedCrop?.hindi}</p>
                  </div>
                  <span className="text-2xl">{categoryIcon[selectedCrop?.category]}</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={trendData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={v => `₹${(v/1000).toFixed(1)}k`} width={45} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="price" name="Price" stroke="#2e7d32" strokeWidth={2.5}
                      dot={{ fill: '#2e7d32', r: 3 }} activeDot={{ r: 5, fill: '#1b5e20' }} />
                  </LineChart>
                </ResponsiveContainer>
                <p className="text-xs text-gray-400 mt-2 text-center">Click any row to view its 7-day trend</p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <FaChartBar className="text-green-600" /> Top 6 Crops by Price
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">Current price (₹/qtl) comparison</p>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={comparisonData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#6b7280' }} />
                    <YAxis tick={{ fontSize: 11, fill: '#6b7280' }} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} width={38} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Bar dataKey="price" name="Price" fill="#4caf50" radius={[4,4,0,0]} />
                    <Bar dataKey="change" name="Change" fill="#a5d6a7" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="xl:w-72 flex-shrink-0 space-y-4">

            {/* Top Gainers */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MdTrendingUp className="text-green-600 text-lg" /> Top Gainers
              </h3>
              {gainers.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }} onClick={() => setSelectedCrop(d)}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-green-50/50 -mx-1 px-1 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{d.crop}</p>
                    <p className="text-xs text-gray-400">{d.mandi}</p>
                  </div>
                  <TrendBadge change={d.change} trend={d.trend} />
                </motion.div>
              ))}
            </div>

            {/* Top Losers */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-red-50 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <MdTrendingDown className="text-red-500 text-lg" /> Top Losers
              </h3>
              {losers.map((d, i) => (
                <motion.div key={d.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }} onClick={() => setSelectedCrop(d)}
                  className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-red-50/50 -mx-1 px-1 rounded-lg transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{d.crop}</p>
                    <p className="text-xs text-gray-400">{d.mandi}</p>
                  </div>
                  <TrendBadge change={d.change} trend={d.trend} />
                </motion.div>
              ))}
            </div>

            {/* Recent Updates */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaClock className="text-gray-500" /> Recent Updates
              </h3>
              {MANDI_DATA.slice(0, 5).map(d => (
                <div key={d.id} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
                  <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${d.trend === 'up' ? 'bg-green-500' : 'bg-red-400'}`} />
                  <p className="text-xs text-gray-600 leading-relaxed">
                    <span className="font-semibold">{d.crop}</span> in {d.mandi} updated to {fmt(d.price)}/qtl
                  </p>
                </div>
              ))}
            </div>

            {/* Farmer Alerts */}
            <div className="rounded-2xl p-4 text-white" style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}>
              <h3 className="font-bold mb-3 flex items-center gap-2">
                <FaBell className="text-yellow-300" /> Farmer Alerts
              </h3>
              {[
                { icon: <FaExclamationTriangle className="text-yellow-300" />, msg: 'Onion prices surging in Maharashtra — good time to sell' },
                { icon: <FaLightbulb className="text-yellow-200" />,           msg: 'Wheat MSP increased by ₹150 this season' },
                { icon: <FaCloudRain className="text-blue-300" />,             msg: 'Rain forecast may affect Tomato supply next week' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-2 mb-2.5 last:mb-0">
                  <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
                  <p className="text-xs text-green-100 leading-relaxed">{a.msg}</p>
                </div>
              ))}
            </div>

            {/* State-wise Avg */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
              <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-600" /> State-wise Avg
              </h3>
              {getAnalytics().stateAvg.slice(0, 6).map((s, i) => (
                <div key={s.state} className="flex items-center gap-2 py-1.5">
                  <span className="text-xs text-gray-400 w-4 flex-shrink-0">{i + 1}.</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-xs font-medium text-gray-700 truncate">{s.state}</span>
                      <span className="text-xs font-bold text-gray-900 ml-1">{fmt(s.avg)}</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: `${Math.round((s.avg / getAnalytics().stateAvg[0].avg) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>

          </motion.div>
        )}
      </div>

      {/* ── Ecosystem Stats ────────────────────────────────────────────── */}
      <EcosystemStats />

      <Footer />
    </div>
  );
}
