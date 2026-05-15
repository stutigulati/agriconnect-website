import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlayCircle, FaSearch, FaFire, FaStar, FaClock, FaEye, FaTimes, FaYoutube } from 'react-icons/fa';
import { MdOndemandVideo } from 'react-icons/md';
import Navbar from './Navbar';
import vidRice from '../assets/videos/vid_rice.webp';
import vidTomato from '../assets/videos/vid_tomato.jpg';
import vidCotton from '../assets/videos/vid_cotton.avif';
import vidDripIrrigation from '../assets/videos/vid_drip_irrigation.jpg';
import vidSprinkler from '../assets/videos/vid_sprinkler.jpg';
import vidOrganicPest from '../assets/videos/vid_organic_pest.jpg';
import vidPinkBollworm from '../assets/videos/vid_pink_bollworm.jpeg';
import vidOrganicCert from '../assets/videos/vid_organic_cert.png';
import vidVermicompost from '../assets/videos/vid_vermicompost.jpg';
import vidPmKisan from '../assets/videos/vid_pm_kisan.jpg';
import vidPmfby from '../assets/videos/vid_pmfby.jpeg';
import vidBetterPrices from '../assets/videos/vid_better_prices.png';
import vidEnamTutorial from '../assets/videos/vid_enam_tutorial.jpg';
import vidFasalBima from '../assets/videos/vid_fasal_bima.jpg';
import Footer from './Footer';

const CATEGORIES = ['All', 'Crop Care', 'Irrigation', 'Pest Control', 'Organic Farming', 'Govt. Schemes', 'Market Tips'];

// Real YouTube video IDs and crop-relevant thumbnails
const VIDEOS = [
  // Crop Care
  {
    id: 1, cat: 'Crop Care',
    title: 'Wheat Cultivation Complete Guide 2024',
    channel: 'Krishi Jagran', duration: '18:45', views: '2.4M', rating: 4.8, trending: true,
    youtubeId: 'WLYqbC6NGMQ',
    thumb: vidPmfby,
    desc: 'Complete guide on wheat cultivation from land preparation to harvesting. Best varieties, fertilizer schedule and yield optimization.',
  },
  {
    id: 2, cat: 'Crop Care',
    title: 'Rice Paddy Farming — Modern Techniques',
    channel: 'Kisan TV', duration: '22:10', views: '1.8M', rating: 4.7, trending: true,
    youtubeId: 'dZGsSB5WVHM',
    thumb: vidRice,
    desc: 'Modern paddy farming using SRI method. Save water and increase yield up to 40% with proper spacing and crop management.',
  },
  {
    id: 3, cat: 'Crop Care',
    title: 'Tomato Farming: High Yield Secrets',
    channel: 'AgriConnect', duration: '15:30', views: '980K', rating: 4.9, trending: false,
    youtubeId: 'kVTtzZPzXiI',
    thumb: vidTomato,
    desc: 'Expert tips on tomato cultivation from nursery preparation to staking, pruning and harvesting for maximum yield.',
  },
  {
    id: 4, cat: 'Crop Care',
    title: 'Cotton Farming Best Practices',
    channel: 'Krishi Jagran', duration: '20:15', views: '750K', rating: 4.6, trending: false,
    youtubeId: 'vCO5hkAiOoI',
    thumb: vidCotton,
    desc: 'Complete cotton farming guide covering Bt variety selection, fertilizer management and bollworm control strategies.',
  },
  // Irrigation
  {
    id: 5, cat: 'Irrigation',
    title: 'Drip Irrigation Setup — Step by Step',
    channel: 'Jal Shakti', duration: '25:00', views: '3.1M', rating: 4.9, trending: true,
    youtubeId: '4PGAEJdNQPk',
    thumb: vidDripIrrigation,
    desc: 'Install drip irrigation yourself and save 60% water vs flood irrigation. Government subsidies available up to 80%.',
  },
  {
    id: 6, cat: 'Irrigation',
    title: 'Sprinkler System for Small Farmers',
    channel: 'AgriConnect', duration: '14:20', views: '540K', rating: 4.5, trending: false,
    youtubeId: 'JLGXNrMuqTo',
    thumb: vidSprinkler,
    desc: 'Affordable sprinkler systems for 1-5 acre holdings. Setup cost, maintenance and crop suitability guide.',
  },
  // Pest Control
  {
    id: 7, cat: 'Pest Control',
    title: 'Organic Pest Management — No Chemicals',
    channel: 'Krishi Vigyan', duration: '19:45', views: '1.2M', rating: 4.7, trending: true,
    youtubeId: 'YGKzCmulkjY',
    thumb: vidOrganicPest,
    desc: 'Natural pest management using neem, garlic extract and bio-pesticides. Safe for crops, soil and humans.',
  },
  {
    id: 8, cat: 'Pest Control',
    title: 'Pink Bollworm Control in Cotton',
    channel: 'Kisan TV', duration: '12:30', views: '890K', rating: 4.8, trending: false,
    youtubeId: 'u1Np83M7Hjc',
    thumb: vidPinkBollworm,
    desc: 'Integrated pest management for pink bollworm. Pheromone traps, Bt spray timing and field sanitation guide.',
  },
  // Organic Farming
  {
    id: 9, cat: 'Organic Farming',
    title: 'Organic Certification Process India',
    channel: 'APEDA', duration: '28:00', views: '420K', rating: 4.6, trending: false,
    youtubeId: 'dBFqHd7TGQU',
    thumb: vidOrganicCert,
    desc: 'How to get PGS-India organic certification. Benefits, cost and market premium for certified organic produce.',
  },
  {
    id: 10, cat: 'Organic Farming',
    title: 'Vermicompost Making at Home',
    channel: 'AgriConnect', duration: '16:45', views: '1.5M', rating: 4.9, trending: true,
    youtubeId: 'K73rKQO0euo',
    thumb: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=480&q=75',
    desc: 'DIY vermicompost setup using earthworms. Reduce fertilizer cost by 40% and improve soil health naturally.',
  },
  // Govt. Schemes
  {
    id: 11, cat: 'Govt. Schemes',
    title: 'PM-KISAN — How to Apply & Check Status',
    channel: 'PIB India', duration: '10:15', views: '5.2M', rating: 4.8, trending: true,
    youtubeId: 'nj6j-Gczb4M',
    thumb: vidPmKisan,
    desc: 'Complete guide on PM-KISAN scheme. Eligibility, registration, Rs.6000 annual benefit and payment status check.',
  },
  {
    id: 12, cat: 'Govt. Schemes',
    title: 'Pradhan Mantri Fasal Bima Yojana Guide',
    channel: 'Ministry of Agri', duration: '13:40', views: '2.8M', rating: 4.7, trending: false,
    youtubeId: 'rRDNHwCK5S8',
    thumb: vidFasalBima,
    desc: 'Crop insurance for all farmers. How to claim, premium rates and coverage for natural disasters.',
  },
  // Market Tips
  {
    id: 13, cat: 'Market Tips',
    title: 'How to Get Better Prices for Your Crop',
    channel: 'AgriConnect', duration: '17:30', views: '1.9M', rating: 4.8, trending: true,
    youtubeId: 'Q7ePdl7g_t0',
    thumb: vidBetterPrices,
    desc: 'Direct selling strategies — e-NAM platform, FPO benefits and how to negotiate with buyers directly.',
  },
  {
    id: 14, cat: 'Market Tips',
    title: 'eNAM Online Crop Selling Tutorial',
    channel: 'SFAC India', duration: '20:00', views: '680K', rating: 4.5, trending: false,
    youtubeId: '3JZ_D3ELwOQ',
    thumb: vidEnamTutorial,
    desc: 'Register and sell on e-NAM. Upload quality reports and get best bids from traders across India.',
  },
];

// Fallback thumb if YouTube CDN fails
const FALLBACK = {
  'Crop Care':      'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=480&q=70',
  'Irrigation':     'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=480&q=70',
  'Pest Control':   'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=480&q=70',
  'Organic Farming':'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=480&q=70',
  'Govt. Schemes':  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=480&q=70',
  'Market Tips':    'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=480&q=70',
};

// ─── Video Card ───────────────────────────────────────────────────────────────
function VideoCard({ video, onPlay, index = 0 }) {
  const [thumbErr, setThumbErr] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.3), duration: 0.4 }}
      onClick={() => onPlay(video)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 cursor-pointer group"
      style={{
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.12)' : '0 2px 8px rgba(0,0,0,0.06)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        transition: 'all 0.25s ease',
      }}
    >
      {/* Thumbnail */}
      <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
        <img
          src={thumbErr ? FALLBACK[video.cat] : video.thumb}
          alt={video.title}
          onError={() => setThumbErr(true)}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center"
          style={{ background: hovered ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)', transition: 'background 0.2s' }}>
          <motion.div animate={{ scale: hovered ? 1 : 0.7, opacity: hovered ? 1 : 0 }} transition={{ duration: 0.2 }}>
            <FaPlayCircle className="text-white text-5xl drop-shadow-lg" />
          </motion.div>
        </div>
        {/* Duration badge */}
        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
          {video.duration}
        </div>
        {/* Trending badge */}
        {video.trending && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
            <FaFire className="text-[9px]" /> Trending
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3.5">
        <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug line-clamp-2">{video.title}</h3>
        <p className="text-xs font-semibold text-red-500 mb-2">{video.channel}</p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1"><FaEye className="text-[10px]" /> {video.views}</span>
          <span className="flex items-center gap-1"><FaStar className="text-amber-400 text-[10px]" /> {video.rating}</span>
          <span className="flex items-center gap-1"><FaClock className="text-[10px]" /> {video.duration}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Video Modal ──────────────────────────────────────────────────────────────
function VideoModal({ video, onClose }) {
  if (!video) return null;
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.85)' }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9 }}
          className="bg-white rounded-3xl overflow-hidden w-full max-w-3xl"
          style={{ maxHeight: '90vh', overflowY: 'auto' }}
          onClick={e => e.stopPropagation()}
        >
          {/* Embed */}
          <div style={{ position: 'relative', paddingBottom: '56.25%', background: '#000' }}>
            <iframe
              src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0`}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none' }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen title={video.title}
            />
          </div>
          {/* Info */}
          <div className="p-5">
            <div className="flex items-start justify-between gap-3 mb-3">
              <h3 className="text-lg font-bold text-gray-900 leading-tight">{video.title}</h3>
              <button onClick={onClose}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors flex-shrink-0">
                <FaTimes className="text-gray-500 text-sm" />
              </button>
            </div>
            <div className="flex items-center gap-4 mb-3 text-sm text-gray-500">
              <span className="font-semibold text-red-500">{video.channel}</span>
              <span className="flex items-center gap-1"><FaEye className="text-xs" /> {video.views}</span>
              <span className="flex items-center gap-1"><FaStar className="text-amber-400 text-xs" /> {video.rating}</span>
              <span className="flex items-center gap-1"><FaClock className="text-xs" /> {video.duration}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{video.desc}</p>
            <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2">
              <FaYoutube className="text-red-500 text-lg flex-shrink-0" />
              <p className="text-xs text-gray-500">Video streams from YouTube. Ensure internet connection for playback.</p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function VideoHubPage({ onLoginOpen, onSignupOpen }) {
  const [category, setCategory] = useState('All');
  const [search,   setSearch]   = useState('');
  const [playing,  setPlaying]  = useState(null);

  const filtered = VIDEOS.filter(v => {
    const matchCat = category === 'All' || v.cat === category;
    const matchQ   = !search || v.title.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQ;
  });

  const trending = VIDEOS.filter(v => v.trending).slice(0, 4);

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── Cinematic hero — full-bleed image, search overlays on top ─────── */}
      <div className="relative overflow-hidden" style={{ height: 580, paddingTop: 64 }}>
        {/* Full-bleed background image */}
        <motion.div
          initial={{ scale: 1.06 }} animate={{ scale: 1 }}
          transition={{ duration: 12, ease: 'linear' }}
          className="absolute inset-0"
        >
          <img
            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80"
            alt="Farm learning"
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.60) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.50) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)' }} />

        {/* Subtle warm glow */}
        <motion.div
          animate={{ opacity: [0.15, 0.3, 0.15] }} transition={{ duration: 6, repeat: Infinity }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(253,230,138,0.12)', transform: 'translate(20%,-20%)' }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
              <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">Agricultural Learning Hub</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white mb-3 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              Learn. Grow.<br /><span className="text-amber-300">Prosper from Your Farm.</span>
            </h1>

            <p className="text-white/90 text-lg max-w-lg mb-7" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Expert video tutorials on crop care, irrigation, pest management, government schemes and market strategies.
            </p>

            {/* Search — overlays on the hero image */}
            <div className="relative max-w-xl">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm z-10" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search videos, topics, crops..."
                className="w-full pl-11 pr-5 py-4 rounded-2xl text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                style={{
                  background: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(12px)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom fade into page */}
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        {/* Category filter pills */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
                category === cat
                  ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-amber-400 hover:text-amber-700'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {/* Trending section — only when no filter/search */}
        {category === 'All' && !search && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
              <FaFire className="text-red-500" /> Trending This Week
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {trending.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} onPlay={setPlaying} />
              ))}
            </div>
          </div>
        )}

        {/* All videos */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <MdOndemandVideo className="text-amber-600 text-xl" />
              {category === 'All' ? 'All Videos' : category}
              <span className="text-sm font-normal text-gray-400 ml-1">({filtered.length})</span>
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FaPlayCircle className="text-5xl mx-auto mb-4 text-gray-200" />
              <p className="font-semibold text-lg">No videos found</p>
              <p className="text-sm mt-1">Try different keywords or category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-12">
              {filtered.map((v, i) => (
                <VideoCard key={v.id} video={v} index={i} onPlay={setPlaying} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Video Modal */}
      {playing && <VideoModal video={playing} onClose={() => setPlaying(null)} />}

      <Footer />
    </div>
  );
}
