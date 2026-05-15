import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, LANGUAGES } from '../context/LanguageContext.jsx';

import {
  FaGlobe,
  FaChevronDown,
  FaTimes,
  FaBars,
  FaCheck,
  FaSignOutAlt,
  FaStore,
  FaTag,
  FaCloudSun,
  FaSeedling,
  FaBug,
  FaCamera,
  FaMicrophone,
  FaPlayCircle,
  FaLock,
  FaSignInAlt,
  FaUserPlus,
  FaCheckCircle,
} from 'react-icons/fa';

import { MdVerified } from 'react-icons/md';
import { GiWheat, GiFarmer } from 'react-icons/gi';

import logoIcon from '../assets/logo-icon.png';

import iconWeather from '../assets/icon_weather.jpeg';
import iconSoil from '../assets/icon_soil_health.png';
import iconPest from '../assets/icon_pest_disease.jpeg';
import iconAI from '../assets/icon_ai_scanner.jpeg';
import iconVoice from '../assets/icon_voice_assistant.jpeg';
import iconVideo from '../assets/icon_video_hub.jpeg';
import iconMandi from '../assets/icon_mandi_prices.png';
import iconMarket from '../assets/icon_marketplace.jpeg';
import iconSellCrop from '../assets/icon_sell_crop.jpeg';

import { getCurrentUser, clearSession } from '../lib/communityApi';

const SERVICES = [
  {
    label: 'Weather & Crop Advisory',
    sub: 'Hyperlocal forecasts + crop advice',
    href: '/services/weather',
    icon: 'FaCloudSun',
    color: 'from-teal-500 to-cyan-600',
    badge: 'Live',
    img: iconWeather,
  },
  {
    label: 'Soil Health Advisory',
    sub: 'pH, nutrients & fertilizer tips',
    href: '/services/soil',
    icon: 'FaSeedling',
    color: 'from-emerald-500 to-green-700',
    badge: null,
    img: iconSoil,
  },
  {
    label: 'Pest & Disease Detection',
    sub: 'Identify pests, get treatment plans',
    href: '/services/pest',
    icon: 'FaBug',
    color: 'from-orange-500 to-red-600',
    badge: null,
    img: iconPest,
  },
  {
    label: 'AI Crop Disease Scanner',
    sub: 'Upload image → instant AI diagnosis',
    href: '/services/scanner',
    icon: 'FaCamera',
    color: 'from-violet-500 to-purple-700',
    badge: 'AI',
    img: iconAI,
  },
  {
    label: 'Voice Assistant',
    sub: 'Ask questions by voice in any language',
    href: '/services/voice',
    icon: 'FaMicrophone',
    color: 'from-pink-500 to-rose-600',
    badge: null,
    img: iconVoice,
  },
  {
    label: 'Video Advisory & Learning Hub',
    sub: 'Tutorials, schemes & crop care videos',
    href: '/services/videos',
    icon: 'FaPlayCircle',
    color: 'from-amber-500 to-yellow-600',
    badge: 'New',
    img: iconVideo,
  },
];

const ICON_MAP = {
  FaCloudSun,
  FaSeedling,
  FaBug,
  FaCamera,
  FaMicrophone,
  FaPlayCircle,
};

const MARKET_ITEMS = [
  {
    label: 'Mandi Prices',
    sub: 'Live crop rates across India',
    href: '/mandi-prices',
    Icon: FaStore,
    iconClass: 'text-green-600',
    img: iconMandi,
  },
  {
    label: 'Sell Your Crop',
    sub: 'Best mandi & buyer finder',
    href: '/mandi-prices?tab=sell',
    Icon: GiWheat,
    iconClass: 'text-amber-600',
    img: iconSellCrop,
  },
  {
    label: 'Marketplace',
    sub: 'Browse crop listings from farmers',
    href: '/marketplace',
    Icon: FaTag,
    iconClass: 'text-purple-500',
    img: iconMarket,
  },
];

function ServiceLockModal({ service, onClose, onLoginOpen, onSignupOpen }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  if (typeof document === 'undefined') return null;

  const modalNode = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        zIndex: 2147483647,
        background:
          'linear-gradient(135deg, rgba(15,23,42,0.78) 0%, rgba(22,101,52,0.78) 50%, rgba(21,128,61,0.72) 100%)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.4,
          width: 400,
          height: 400,
          top: '15%',
          left: '10%',
          background: 'radial-gradient(circle, #22c55e 0%, transparent 70%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          borderRadius: '50%',
          filter: 'blur(80px)',
          opacity: 0.35,
          width: 500,
          height: 500,
          bottom: '10%',
          right: '5%',
          background: 'radial-gradient(circle, #facc15 0%, transparent 70%)',
        }}
      />

      <motion.div
        initial={{ scale: 0.9, y: 30, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.9, y: 30, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
        style={{
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow:
            '0 25px 80px rgba(22,101,52,0.45), 0 8px 30px rgba(0,0,0,0.25)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-100 bg-white/95 text-gray-500 shadow-sm transition-all hover:bg-gray-100 hover:text-gray-800"
          aria-label="Close"
        >
          <FaTimes className="text-sm" />
        </button>

        <div
          className="relative overflow-hidden px-6 pb-6 pt-8 text-center text-white"
          style={{
            background:
              'linear-gradient(135deg,#1b5e20 0%,#2e7d32 50%,#43a047 100%)',
          }}
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-40 w-40 rounded-full opacity-25 blur-3xl"
            style={{
              background: '#86efac',
              transform: 'translate(40%,-40%)',
            }}
          />

          <div
            className="pointer-events-none absolute bottom-0 left-0 h-32 w-32 rounded-full opacity-25 blur-2xl"
            style={{
              background: '#fef08a',
              transform: 'translate(-40%,40%)',
            }}
          />

          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: 'spring',
              stiffness: 200,
              damping: 14,
            }}
            className="relative mb-3 inline-flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-white/30 bg-white/20 shadow-lg backdrop-blur-sm"
          >
            {service?.img ? (
              <img
                src={service.img}
                alt={service.label}
                className="h-12 w-12 object-contain"
              />
            ) : (
              <FaLock className="text-2xl" />
            )}

            <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-amber-400 shadow-md">
              <FaLock className="text-xs text-white" />
            </div>
          </motion.div>

          <p className="relative mb-1 text-[10px] font-bold uppercase tracking-widest text-green-200/90">
            Login First
          </p>

          <h2 className="relative mb-1 text-2xl font-extrabold tracking-tight">
            {service?.label || 'This Service'}
          </h2>

          <p className="relative mx-auto max-w-sm text-sm leading-relaxed text-green-100/90">
            {service?.sub ||
              'Log in or create a free account to access this feature.'}
          </p>
        </div>

        <div className="px-6 py-6">
          <p className="mb-4 text-center text-sm leading-relaxed text-gray-700">
            Please{' '}
            <span className="font-bold text-agri-primary">login first</span> to
            use this service.
          </p>

          <ul className="mb-5 space-y-2 rounded-2xl border border-green-100 bg-green-50/60 p-4">
            {[
              {
                icon: <FaCheckCircle className="text-green-600" />,
                text: 'Personalized advice for your farm and region',
              },
              {
                icon: <MdVerified className="text-base text-emerald-600" />,
                text: 'Save reports, scans and weather alerts',
              },
              {
                icon: <GiFarmer className="text-base text-amber-600" />,
                text: 'Join farmers, buyers and agronomists',
              },
            ].map((b, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                className="flex items-center gap-2.5 text-xs text-gray-700"
              >
                <span className="flex-shrink-0">{b.icon}</span>
                <span className="font-medium">{b.text}</span>
              </motion.li>
            ))}
          </ul>

          <div className="flex flex-col gap-2.5">
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                onLoginOpen?.();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-sm font-bold text-white shadow-lg transition-all hover:shadow-xl"
              style={{
                background: 'linear-gradient(135deg,#1b5e20,#2e7d32)',
              }}
            >
              <FaSignInAlt />
              Log In
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                onClose();
                onSignupOpen?.();
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-green-500 bg-white py-3 text-sm font-bold text-agri-primary transition-all hover:bg-green-50"
            >
              <FaUserPlus />
              Create Free Account
            </motion.button>

            <button
              onClick={onClose}
              className="w-full py-2 text-xs font-medium text-gray-400 transition-colors hover:text-gray-600"
            >
              Maybe later
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalNode, document.body);
}

const Navbar = ({ onLoginOpen, onSignupOpen }) => {
  const { t, setLang, currentLang } = useLanguage();

  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [marketOpen, setMarketOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSvcOpen, setMobileSvcOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(() => getCurrentUser());
  const [lockedService, setLockedService] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  const changeLang = (code) => {
    setLang(code);
    setLangOpen(false);
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    setMobileOpen(false);
    window.dispatchEvent(new Event('agriUserUpdated'));
  };

  const firstName = currentUser?.name?.split(' ')[0] || currentUser?.name || '';

  useEffect(() => {
    const sync = () => setCurrentUser(getCurrentUser());
    window.addEventListener('agriUserUpdated', sync);
    return () => window.removeEventListener('agriUserUpdated', sync);
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', h);
    h();

    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest('#lang-wrapper')) setLangOpen(false);
      if (!e.target.closest('#market-wrapper')) setMarketOpen(false);
      if (!e.target.closest('#services-wrapper')) setServicesOpen(false);
    };

    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleServiceClick = (e, service) => {
    e.preventDefault();

    setServicesOpen(false);
    setMobileSvcOpen(false);
    setMobileOpen(false);

    if (currentUser) {
      navigate(service.href);
    } else {
      setLockedService(service);
    }
  };

  const isServicesActive = location.pathname.startsWith('/services');
  const isMarketActive = ['/mandi-prices', '/marketplace'].includes(
    location.pathname
  );
  const isHome = location.pathname === '/';
  const isTransparent = isHome && !scrolled;

  const navCls = (active) =>
    `relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${
      active
        ? isTransparent
          ? 'text-white font-semibold'
          : 'text-agri-primary font-semibold'
        : isTransparent
          ? 'text-white font-semibold hover:text-white hover:bg-white/10'
          : 'text-gray-600 hover:text-agri-primary hover:bg-green-50/70'
    }`;

  const underline = (active) =>
    `absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
      isTransparent ? 'bg-white' : 'bg-agri-accent'
    } ${active ? 'w-5' : 'w-0 group-hover:w-5'}`;

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isTransparent
            ? 'bg-transparent shadow-none'
            : scrolled
              ? 'bg-white/95 shadow-md shadow-black/5 backdrop-blur-md'
              : 'bg-white/80 backdrop-blur-sm'
        }`}
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="group flex flex-shrink-0 items-center gap-2.5">
              <div className="h-9 w-9 flex-shrink-0 overflow-hidden rounded-xl transition-transform group-hover:scale-110">
                <img
                  src={logoIcon}
                  alt="AgriConnect"
                  className="h-full w-full object-contain"
                />
              </div>

              <span className="text-xl font-bold tracking-tight">
                <span
                  className={isTransparent ? 'text-white' : 'text-agri-primary'}
                >
                  Agri
                </span>
                <span
                  className={
                    isTransparent ? 'text-green-300' : 'text-agri-accent'
                  }
                >
                  Connect
                </span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden items-center gap-0.5 md:flex">
              <Link to="/" className={navCls(location.pathname === '/')}>
                {t('nav.home')}
                <span className={underline(location.pathname === '/')} />
              </Link>

              <Link
                to="/community"
                className={navCls(location.pathname === '/community')}
              >
                {t('nav.community')}
                <span
                  className={underline(location.pathname === '/community')}
                />
              </Link>

              {/* Services dropdown */}
              <div className="relative" id="services-wrapper">
                <button
                  onClick={() => {
                    setServicesOpen((o) => !o);
                    setMarketOpen(false);
                  }}
                  className={`relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isServicesActive
                      ? isTransparent
                        ? 'text-white font-semibold'
                        : 'text-agri-primary font-semibold'
                      : isTransparent
                        ? 'text-white font-semibold hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-green-50/70 hover:text-agri-primary'
                  }`}
                >
                  Services
                  <FaChevronDown
                    className={`text-xs transition-transform duration-300 ${
                      servicesOpen ? 'rotate-180' : ''
                    }`}
                  />

                  {isServicesActive && (
                    <span className="absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full bg-agri-accent" />
                  )}
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{
                        duration: 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: '100%',
                        marginTop: 12,
                        width: 540,
                        zIndex: 60,
                      }}
                    >
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(34,197,94,0.16)',
                          borderRadius: 20,
                          boxShadow:
                            '0 24px 64px rgba(0,0,0,0.13), 0 4px 20px rgba(22,163,74,0.09)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            background: 'linear-gradient(135deg,#f0fdf4,#ecfdf5)',
                            padding: '12px 20px',
                            borderBottom: '1px solid rgba(34,197,94,0.08)',
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="m-0 text-[10px] font-extrabold uppercase tracking-[2px] text-green-600">
                                Smart Agricultural Services
                              </p>
                              <p className="m-0 mt-0.5 text-[10px] text-gray-400">
                                Intelligent tools for every Indian farmer
                              </p>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-green-500" />
                              <span className="text-[10px] font-bold text-green-600">
                                6 Services Active
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 p-3.5">
                          {SERVICES.map((svc) => {
                            const SvcIcon = ICON_MAP[svc.icon];
                            const hasSvcImg = !!svc.img;

                            return (
                              <a
                                key={svc.href}
                                href={svc.href}
                                onClick={(e) => handleServiceClick(e, svc)}
                                className="relative flex items-start gap-2.5 rounded-xl border border-transparent px-3 py-2.5 no-underline transition-all duration-150 hover:border-green-200 hover:bg-green-50"
                              >
                                <div className="relative flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-transparent text-sm">
                                  {hasSvcImg ? (
                                    <img
                                      src={svc.img}
                                      alt={svc.label}
                                      className={`h-full w-full object-contain ${
                                        svc.label === 'Weather & Crop Advisory'
                                          ? 'scale-150'
                                          : svc.label === 'Soil Health Advisory'
                                            ? 'scale-140'
                                            : svc.label ===
                                                'Pest & Disease Detection'
                                              ? 'scale-145'
                                              : svc.label ===
                                                  'AI Crop Disease Scanner'
                                                ? 'scale-160'
                                                : svc.label === 'Voice Assistant'
                                                  ? 'scale-150'
                                                  : svc.label ===
                                                      'Video Advisory & Learning Hub'
                                                    ? 'scale-185'
                                                    : ''
                                      }`}
                                    />
                                  ) : (
                                    SvcIcon && (
                                      <SvcIcon className="text-green-600" />
                                    )
                                  )}

                                  {!currentUser && (
                                    <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-500 text-white shadow-sm">
                                      <FaLock className="text-[7px]" />
                                    </span>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="mb-0.5 flex items-center gap-1.5">
                                    <p className="m-0 text-[13px] font-bold leading-snug text-gray-900">
                                      {svc.label}
                                    </p>

                                    {svc.badge && (
                                      <span className="flex-shrink-0 rounded-full bg-green-100 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wide text-green-700">
                                        {svc.badge}
                                      </span>
                                    )}
                                  </div>

                                  <p className="m-0 text-[11px] leading-snug text-gray-400">
                                    {svc.sub}
                                  </p>
                                </div>
                              </a>
                            );
                          })}
                        </div>

                        <div className="flex items-center justify-between border-t border-green-100 bg-green-50/60 px-5 py-2.5">
                          <p className="m-0 text-[10px] text-gray-400">
                            {currentUser
                              ? 'Powered by AI · Web Speech · OpenWeather'
                              : 'Login required for full access'}
                          </p>

                          <a
                            href="/services/weather"
                            onClick={(e) => handleServiceClick(e, SERVICES[0])}
                            className="text-[11px] font-bold text-green-600 no-underline"
                          >
                            View all →
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mandi & Trading dropdown */}
              <div className="relative" id="market-wrapper">
                <button
                  onClick={() => {
                    setMarketOpen((o) => !o);
                    setServicesOpen(false);
                  }}
                  className={`relative flex items-center gap-1 rounded-lg px-3.5 py-2 text-sm font-medium transition-all duration-200 ${
                    isMarketActive
                      ? isTransparent
                        ? 'text-white font-semibold'
                        : 'text-agri-primary font-semibold'
                      : isTransparent
                        ? 'text-white font-semibold hover:bg-white/10 hover:text-white'
                        : 'text-gray-600 hover:bg-green-50/70 hover:text-agri-primary'
                  }`}
                >
                  Mandi & Trading
                  <FaChevronDown
                    className={`text-xs transition-transform duration-200 ${
                      marketOpen ? 'rotate-180' : ''
                    }`}
                  />

                  {isMarketActive && (
                    <span
                      className={`absolute bottom-0 left-1/2 h-0.5 w-5 -translate-x-1/2 rounded-full ${
                        isTransparent ? 'bg-white' : 'bg-agri-accent'
                      }`}
                    />
                  )}
                </button>

                <AnimatePresence>
                  {marketOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-gray-100 bg-white py-2 shadow-xl shadow-black/10"
                    >
                      <div className="mb-1 border-b border-gray-50 px-3 py-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Mandi & Trading
                        </p>
                      </div>

                      {MARKET_ITEMS.map((item) => (
                        <Link
                          key={item.label}
                          to={item.href}
                          onClick={() => setMarketOpen(false)}
                          className="flex items-start gap-3 px-4 py-3 transition-colors hover:bg-green-50"
                        >
                          {item.img ? (
                            <img
                              src={item.img}
                              alt={item.label}
                              className="h-12 w-12 flex-shrink-0 object-contain"
                            />
                          ) : (
                            <item.Icon
                              className={`mt-0.5 flex-shrink-0 text-lg ${item.iconClass}`}
                            />
                          )}

                          <div>
                            <p className="text-sm font-semibold text-gray-800">
                              {item.label}
                            </p>
                            <p className="mt-0.5 text-[11px] text-gray-400">
                              {item.sub}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/about"
                className={navCls(location.pathname === '/about')}
              >
                {t('nav.aboutUs')}
                <span className={underline(location.pathname === '/about')} />
              </Link>

              <Link
                to="/contact"
                className={navCls(location.pathname === '/contact')}
              >
                {t('nav.contact')}
                <span className={underline(location.pathname === '/contact')} />
              </Link>
            </div>

            {/* Right desktop */}
            <div className="hidden items-center gap-2 md:flex">
              <div className="relative" id="lang-wrapper">
                <button
                  onClick={() => setLangOpen(!langOpen)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-green-50/70 hover:text-agri-primary"
                >
                  <FaGlobe className="text-sm text-green-600" />

                  <span
                    className={`hidden text-sm font-bold lg:inline ${
                      isTransparent ? 'text-green-200' : 'text-gray-700'
                    }`}
                  >
                    {currentLang.nativeLabel}
                  </span>

                  <FaChevronDown
                    className={`text-xs transition-transform ${
                      langOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {langOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full z-50 mt-2 w-48 rounded-2xl border border-gray-100 bg-white py-2 shadow-xl"
                    >
                      <div className="mb-1 border-b border-gray-50 px-3 py-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Select Language
                        </p>
                      </div>

                      {LANGUAGES.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => changeLang(lang.code)}
                          className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                            currentLang.code === lang.code
                              ? 'bg-green-50 text-agri-primary'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="rounded bg-green-600 px-1.5 py-0.5 text-[9px] font-extrabold tracking-wide text-white">
                            {lang.flag}
                          </span>

                          <div className="flex-1">
                            <span className="block text-sm font-semibold">
                              {lang.nativeLabel}
                            </span>

                            {lang.nativeLabel !== lang.label && (
                              <span className="text-[10px] text-gray-400">
                                {lang.label}
                              </span>
                            )}
                          </div>

                          {currentLang.code === lang.code && (
                            <FaCheck className="text-xs text-green-500" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {currentUser ? (
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-1.5">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-[10px] font-bold text-white">
                      {currentUser.name?.slice(0, 2).toUpperCase()}
                    </div>

                    <span className="text-sm font-semibold text-agri-primary">
                      Welcome, {firstName}!
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-500 transition-all hover:bg-red-50"
                  >
                    <FaSignOutAlt className="text-xs" />
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLoginOpen}
                    className={`rounded-lg border-2 px-4 py-2 text-sm font-semibold transition-all ${
                      isTransparent
                        ? 'border-white/60 text-white hover:bg-white/10'
                        : 'border-agri-accent text-agri-primary hover:bg-green-50'
                    }`}
                  >
                    {t('nav.login')}
                  </button>

                  <button
                    onClick={onSignupOpen}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md ${
                      isTransparent
                        ? 'border border-white/30 bg-white/20 backdrop-blur-sm hover:bg-white/30'
                        : 'bg-gradient-to-r from-green-600 to-emerald-600'
                    }`}
                  >
                    {t('nav.signUp')}
                  </button>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <FaTimes className="h-5 w-5" />
              ) : (
                <FaBars className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden border-t border-gray-100 pb-4 md:hidden"
              >
                <div className="space-y-0.5 pt-3">
                  {[
                    { label: 'Home', href: '/' },
                    { label: 'Community', href: '/community' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'bg-green-50 text-agri-primary'
                          : 'text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}

                  <button
                    onClick={() => setMobileSvcOpen(!mobileSvcOpen)}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-green-50"
                  >
                    <span>Services</span>
                    <FaChevronDown
                      className={`text-xs transition-transform ${
                        mobileSvcOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {mobileSvcOpen && (
                    <div className="ml-4 space-y-0.5 border-l-2 border-green-100 pl-3">
                      {SERVICES.map((svc) => {
                        const SvcIcon = ICON_MAP[svc.icon];
                        const hasMobileSvcImg = !!svc.img;

                        return (
                          <a
                            key={svc.href}
                            href={svc.href}
                            onClick={(e) => handleServiceClick(e, svc)}
                            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-gray-600 no-underline transition-colors hover:bg-green-50 hover:text-agri-primary"
                          >
                            <div className="relative flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-lg bg-transparent text-[11px]">
                              {hasMobileSvcImg ? (
                                <img
                                  src={svc.img}
                                  alt={svc.label}
                                  className={`h-full w-full object-contain ${
                                    svc.label === 'Soil Health Advisory' ||
                                    svc.label === 'AI Crop Disease Scanner' ||
                                    svc.label === 'Video Advisory & Learning Hub'
                                      ? 'scale-125'
                                      : ''
                                  }`}
                                />
                              ) : (
                                SvcIcon && <SvcIcon />
                              )}
                            </div>

                            <span className="flex-1 truncate">{svc.label}</span>

                            {!currentUser && (
                              <FaLock
                                className="flex-shrink-0 text-[9px] text-amber-500"
                                aria-label="Login required"
                              />
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {[
                    { label: 'Mandi Prices', href: '/mandi-prices' },
                    { label: 'Sell Your Crop', href: '/mandi-prices?tab=sell' },
                    { label: 'Marketplace', href: '/marketplace' },
                    { label: 'About Us', href: '/about' },
                    { label: 'Contact', href: '/contact' },
                  ].map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      className={`block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                        location.pathname === link.href
                          ? 'bg-green-50 text-agri-primary'
                          : 'text-gray-600 hover:bg-green-50'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="mt-2 border-t border-gray-100 px-4 pb-1 pt-3">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Language
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          changeLang(lang.code);
                          setMobileOpen(false);
                        }}
                        className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
                          currentLang.code === lang.code
                            ? 'border-agri-primary bg-agri-primary text-white'
                            : 'border-gray-200 bg-gray-50 text-gray-600'
                        }`}
                      >
                        {lang.flag} {lang.nativeLabel}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-3 border-t border-gray-100 px-4 pt-3">
                  {currentUser ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-bold text-white">
                          {currentUser.name?.slice(0, 2).toUpperCase()}
                        </div>

                        <span className="text-sm font-semibold text-agri-primary">
                          Welcome, {firstName}!
                        </span>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                      >
                        <FaSignOutAlt className="text-xs" />
                        Logout
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          onLoginOpen?.();
                          setMobileOpen(false);
                        }}
                        className="flex-1 rounded-xl border-2 border-agri-accent py-2.5 text-sm font-semibold text-agri-primary hover:bg-green-50"
                      >
                        {t('nav.login')}
                      </button>

                      <button
                        onClick={() => {
                          onSignupOpen?.();
                          setMobileOpen(false);
                        }}
                        className="flex-1 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 py-2.5 text-sm font-semibold text-white"
                      >
                        {t('nav.signUp')}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      <AnimatePresence>
        {lockedService && (
          <ServiceLockModal
            service={lockedService}
            onClose={() => setLockedService(null)}
            onLoginOpen={onLoginOpen}
            onSignupOpen={onSignupOpen}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;