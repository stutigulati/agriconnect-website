import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FaSearch, FaFilter, FaTimes, FaMapMarkerAlt, FaPhone,
  FaLeaf, FaCheckCircle, FaStar, FaTag, FaBoxOpen,
  FaShieldAlt, FaWhatsapp, FaSortAmountDown, FaChevronDown,
  FaFire, FaArrowRight, FaStore, FaTruck, FaUsers, FaRupeeSign,
} from 'react-icons/fa';
import { GiWheat, GiFarmer } from 'react-icons/gi';
import { MdVerified, MdGrain, MdNaturePeople } from 'react-icons/md';
import Navbar from './Navbar';
import Footer from './Footer';
import {
  CROP_LISTINGS, CATEGORIES, QUALITIES, ALL_STATES_MKT, FEATURED_IDS,
} from '../data/marketplaceData';

// ─── Quality badge colours ─────────────────────────────────────────────────────
const QUALITY_STYLE = {
  'Premium':        'bg-purple-600 text-white',
  'A Grade':        'bg-green-700 text-white',
  'Export Quality': 'bg-blue-600 text-white',
  'Organic':        'bg-emerald-500 text-white',
  'Fresh':          'bg-lime-500 text-white',
  'Fresh Cut':      'bg-teal-500 text-white',
  'Good':           'bg-amber-500 text-white',
};

const CATEGORY_ICON = {
  Grain:        <GiWheat className="text-amber-500" />,
  Vegetable:    <FaLeaf className="text-green-500" />,
  Fruit:        <FaStar className="text-orange-400" />,
  Pulse:        <MdGrain className="text-green-700" />,
  'Cash Crop':  <FaTag className="text-rose-500" />,
};

const fmt = n => `\u20b9${n.toLocaleString('en-IN')}`;

// ─── Contact Modal ─────────────────────────────────────────────────────────────
function ContactModal({ crop, onClose }) {
  if (!crop) return null;
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-700 to-emerald-600 p-6 text-white relative">
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <FaTimes className="text-sm" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <GiFarmer className="text-2xl text-white" />
            </div>
            <div>
              <p className="text-green-200 text-xs font-semibold uppercase tracking-wider">Contact Farmer</p>
              <h3 className="text-xl font-bold">{crop.farmer}</h3>
              <p className="text-green-200 text-sm">{crop.state} &mdash; {crop.city}</p>
            </div>
          </div>
        </div>

        {/* Crop summary */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-4">
            <img src={crop.img} alt={crop.name} className="w-16 h-16 rounded-2xl object-cover flex-shrink-0" />
            <div>
              <h4 className="font-bold text-gray-900">{crop.name}</h4>
              <p className="text-2xl font-extrabold text-green-600">{fmt(crop.price)}<span className="text-sm font-normal text-gray-400">/{crop.unit}</span></p>
              <p className="text-xs text-gray-500 mt-0.5">Available: <strong>{crop.qty} quintal</strong></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-6 space-y-3">
          <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-green-600 text-white font-semibold rounded-2xl hover:bg-green-700 transition-all hover:shadow-md">
            <FaPhone className="text-sm" /> Call Farmer
          </button>
          <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-emerald-50 text-emerald-700 font-semibold rounded-2xl border-2 border-emerald-200 hover:bg-emerald-100 transition-all">
            <FaWhatsapp className="text-lg" /> WhatsApp Farmer
          </button>
          <p className="text-center text-xs text-gray-400 mt-2">Contact details shared after verification. Direct, commission-free.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Crop Card ─────────────────────────────────────────────────────────────────
function CropCard({ crop, onContact, featured = false, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.4), duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={`group relative bg-white rounded-3xl overflow-hidden border transition-all duration-400 hover:shadow-xl hover:-translate-y-1.5 flex flex-col ${
        featured ? 'border-green-300 shadow-md shadow-green-100' : 'border-gray-100 shadow-sm'
      }`}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        <img src={crop.img} alt={crop.name}
          className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110"
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=60'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Quality badge top-left */}
        <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-xl text-xs font-bold ${QUALITY_STYLE[crop.quality] || 'bg-gray-600 text-white'}`}>
          {crop.quality}
        </span>

        {/* Verified badge top-right */}
        {crop.verified && (
          <span className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-xl text-xs font-semibold text-green-700">
            <MdVerified className="text-sm" /> Verified
          </span>
        )}

        {/* Featured ribbon */}
        {featured && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2.5 py-1 bg-amber-400 rounded-xl text-xs font-bold text-amber-900">
            <FaFire className="text-[10px]" /> Featured
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        {/* Name + category */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-bold text-gray-900 text-base leading-tight">{crop.name}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{crop.hindi}</p>
          </div>
          <span className="text-lg flex-shrink-0 mt-0.5">{CATEGORY_ICON[crop.category]}</span>
        </div>

        {/* Price */}
        <p className="text-xl font-extrabold text-green-600 mt-1">
          {fmt(crop.price)}<span className="text-sm font-normal text-gray-400">/{crop.unit}</span>
        </p>

        {/* Location */}
        <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
          <FaMapMarkerAlt className="text-green-500 text-[10px] flex-shrink-0" />
          {crop.state} &mdash; {crop.city}
        </p>

        {/* Bio */}
        <p className="text-xs text-gray-400 mt-1.5 leading-relaxed line-clamp-1">{crop.bio}</p>

        {/* Qty + Farmer */}
        <div className="grid grid-cols-2 gap-3 mt-3 mb-4">
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Quantity</p>
            <p className="text-sm font-bold text-gray-800">{crop.qty} quintal</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Farmer</p>
            <p className="text-sm font-bold text-gray-800 truncate">{crop.farmer}</p>
          </div>
        </div>

        {/* Listed time */}
        <p className="text-[10px] text-gray-300 mb-3">{crop.listed}</p>

        {/* CTA — always at bottom */}
        <div className="mt-auto">
          <button
            onClick={() => onContact(crop)}
            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white text-sm font-semibold rounded-2xl hover:shadow-md hover:from-green-700 hover:to-emerald-700 transition-all duration-200"
          >
            <FaPhone className="text-xs" /> Contact Farmer
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MarketplacePage({ onLoginOpen, onSignupOpen } = {}) {
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState('All');
  const [quality,     setQuality]     = useState('All Quality');
  const [state,       setState]       = useState('All States');
  const [sort,        setSort]        = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  const [contacted,   setContacted]   = useState(null);
  const [view,        setView]        = useState('grid'); // grid | list

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const filtered = useMemo(() => {
    let d = [...CROP_LISTINGS];
    if (search)   d = d.filter(c =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.hindi.includes(search) ||
      c.farmer.toLowerCase().includes(search.toLowerCase()) ||
      c.city.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'All')          d = d.filter(c => c.category === category);
    if (quality  !== 'All Quality')  d = d.filter(c => c.quality  === quality);
    if (state    !== 'All States')   d = d.filter(c => c.state    === state);

    d.sort((a, b) => {
      if (sort === 'price-asc')  return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      if (sort === 'qty')        return b.qty - a.qty;
      // newest — featured first, then by id desc
      const fa = FEATURED_IDS.includes(a.id) ? 1 : 0;
      const fb = FEATURED_IDS.includes(b.id) ? 1 : 0;
      if (fa !== fb) return fb - fa;
      return b.id - a.id;
    });
    return d;
  }, [search, category, quality, state, sort]);

  const stats = [
    { icon: <FaBoxOpen />,   label: 'Active Listings', value: CROP_LISTINGS.length },
    { icon: <GiFarmer />,    label: 'Verified Farmers', value: CROP_LISTINGS.filter(c => c.verified).length },
    { icon: <FaMapMarkerAlt />, label: 'States Covered', value: ALL_STATES_MKT.length },
    { icon: <FaRupeeSign />, label: 'Zero Commission', value: '0%' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="pt-20" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)' }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 relative overflow-hidden">
          {/* Decorative shapes */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10 hidden lg:block">
            <GiWheat className="text-[220px] text-white" />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl opacity-10" style={{ background: '#a5d6a7' }} />

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Link to="/" className="text-green-300 hover:text-white text-sm transition-colors">Home</Link>
                <span className="text-green-500 text-sm">&rsaquo;</span>
                <span className="text-white text-sm font-medium">Marketplace</span>
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-3">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-white/90 font-semibold uppercase tracking-wider">AgriConnect Marketplace</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Explore Fresh<br />
                <span className="text-green-300">Crop Listings</span>
              </h1>
              <p className="text-green-100/80 mt-3 text-lg max-w-xl leading-relaxed">
                Browse crop listings from verified farmers. Buyers can check price, quantity, quality, and connect directly — zero commission.
              </p>
            </div>

            {/* Stat pill */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl px-8 py-6 text-white text-center flex-shrink-0">
              <p className="text-xs font-semibold text-green-300 uppercase tracking-widest mb-1">Showing Listings</p>
              <p className="text-6xl font-extrabold">{filtered.length}</p>
              <p className="text-green-200 text-sm mt-1">of {CROP_LISTINGS.length} total</p>
            </div>
          </div>

          {/* Quick stats strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-8 pb-6">
            {stats.map(s => (
              <div key={s.label} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/15">
                <span className="text-green-300 text-lg flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-white font-bold text-lg leading-none">{typeof s.value === 'number' ? s.value : s.value}</p>
                  <p className="text-green-200 text-xs mt-0.5">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search + Filters ─────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px]">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search crop, farmer, region or quality..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
            </div>

            {/* Category pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    category === cat
                      ? 'bg-green-600 text-white shadow-sm'
                      : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-700'
                  }`}>
                  {cat !== 'All' && <span className="text-sm">{CATEGORY_ICON[cat]}</span>}
                  {cat}
                </button>
              ))}
            </div>

            {/* Filter toggle */}
            <button onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                showFilters ? 'bg-green-600 text-white border-green-600' : 'bg-white text-gray-700 border-gray-200 hover:border-green-400'
              }`}>
              <FaFilter className="text-xs" /> Filter
              <FaChevronDown className={`text-xs transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Expanded filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                className="overflow-hidden">
                <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-gray-100">
                  <select value={quality} onChange={e => setQuality(e.target.value)}
                    className="flex-1 min-w-[160px] px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
                    {QUALITIES.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>

                  <select value={state} onChange={e => setState(e.target.value)}
                    className="flex-1 min-w-[160px] px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
                    <option value="All States">All States</option>
                    {ALL_STATES_MKT.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>

                  <select value={sort} onChange={e => setSort(e.target.value)}
                    className="flex-1 min-w-[180px] px-3 py-2.5 rounded-xl border border-green-100 bg-green-50/50 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400 cursor-pointer">
                    <option value="newest">Newest First</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="qty">Quantity: High to Low</option>
                  </select>

                  {(search || category !== 'All' || quality !== 'All Quality' || state !== 'All States') && (
                    <button onClick={() => { setSearch(''); setCategory('All'); setQuality('All Quality'); setState('All States'); }}
                      className="px-4 py-2.5 rounded-xl border border-red-100 bg-red-50 text-red-600 text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1.5">
                      <FaTimes className="text-xs" /> Clear Filters
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results count + sort bar */}
        <div className="flex items-center justify-between mt-4 mb-2 px-1">
          <p className="text-sm text-gray-500">
            Showing <strong className="text-gray-800">{filtered.length}</strong> crop listings
            {category !== 'All' && <span className="text-green-600"> in {category}</span>}
          </p>
          <div className="flex items-center gap-2">
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 text-gray-600 focus:outline-none focus:ring-1 focus:ring-green-400 cursor-pointer">
              <option value="newest">Newest</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="qty">Quantity ↓</option>
            </select>
          </div>
        </div>

        {/* ── Crop Grid ──────────────────────────────────────────────────── */}
        {filtered.length === 0 ? (
          <div className="py-24 text-center">
            <GiWheat className="text-6xl mx-auto mb-4 text-gray-200" />
            <p className="text-gray-400 font-medium text-lg">No listings match your search</p>
            <p className="text-gray-300 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-16">
            {filtered.map((crop, i) => (
              <CropCard
                key={crop.id}
                crop={crop}
                index={i}
                featured={FEATURED_IDS.includes(crop.id)}
                onContact={setContacted}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Why Sell Here ──────────────────────────────────────────────── */}
      <section className="py-16 bg-white/70 border-t border-green-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Why List on AgriConnect?</h2>
            <p className="text-gray-500 mt-2">Direct connections. Better prices. Zero commission.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <FaShieldAlt className="text-green-600 text-2xl" />, title: 'Verified Listings', desc: 'All farmers go through a verification process before their listings go live.' },
              { icon: <FaTruck className="text-blue-500 text-2xl" />,      title: 'Direct to Buyer',   desc: 'No middlemen. Buyers contact farmers directly through the platform.' },
              { icon: <FaRupeeSign className="text-amber-500 text-2xl" />, title: 'Zero Commission',   desc: 'AgriConnect charges 0% commission on any deal closed between farmer and buyer.' },
              { icon: <FaUsers className="text-purple-500 text-2xl" />,    title: 'Large Buyer Network', desc: 'Access to 500+ verified buyers across India actively looking for produce.' },
            ].map(f => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5 }}
                className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">{f.icon}</div>
                <h4 className="font-bold text-gray-900 mb-2">{f.title}</h4>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      <AnimatePresence>
        {contacted && <ContactModal crop={contacted} onClose={() => setContacted(null)} />}
      </AnimatePresence>

      <Footer />
    </div>
  );
}
