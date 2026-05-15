import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  WiDaySunny, WiCloud, WiCloudy, WiDayCloudy,
  WiRain, WiShowers, WiThunderstorm, WiSnow, WiFog,
  WiHumidity, WiStrongWind, WiSunrise, WiSunset, WiRaindrop,
} from 'react-icons/wi';
import {
  FaLocationArrow, FaExclamationTriangle, FaCheckCircle,
  FaInfoCircle, FaBell, FaLeaf, FaTint, FaThermometerHalf,
  FaSync, FaMapMarkerAlt, FaShieldAlt, FaCalendarCheck,
  FaHandHoldingWater, FaCloudSun, FaSun,
} from 'react-icons/fa';
import { MdWbSunny, MdOutlineWarningAmber } from 'react-icons/md';
import { GiPlantRoots, GiMushroomGills, GiSpottedBug } from 'react-icons/gi';
import { useLanguage } from '../context/LanguageContext.jsx';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollReveal from './ScrollReveal';

import {
  fetchWeather, getUserLocation, reverseGeocode,
  DEFAULT_LOCATION, WMO_CODES, generateAdvisory,
  getCropRisk, getHarvestWindow, getIrrigationTip,
  getDiseaseAlerts, getDayName,
} from '../services/weatherApi';

// ─── Weather icon mapper ───────────────────────────────────────────────────────
function WeatherIcon({ code, className = 'text-4xl' }) {
  const map = {
    0: WiDaySunny, 1: WiDaySunny, 2: WiDayCloudy, 3: WiCloudy,
    45: WiFog, 48: WiFog,
    51: WiShowers, 53: WiShowers, 55: WiShowers,
    61: WiRain, 63: WiRain, 65: WiRain,
    71: WiSnow, 73: WiSnow, 75: WiSnow,
    80: WiShowers, 81: WiShowers, 82: WiRain,
    95: WiThunderstorm, 96: WiThunderstorm, 99: WiThunderstorm,
  };
  const Icon = map[code] ?? WiCloud;
  return <Icon className={className} />;
}

function ForecastIcon({ code, isToday = false }) {
  const size = isToday ? 48 : 36;
  if ([0,1].includes(code)) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><radialGradient id="sunA" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF176"/><stop offset="100%" stopColor="#FFB300"/></radialGradient></defs>
      <circle cx="24" cy="24" r="11" fill="url(#sunA)"/>
      {[0,45,90,135,180,225,270,315].map(deg=>(
        <line key={deg} x1={24+14*Math.cos(deg*Math.PI/180)} y1={24+14*Math.sin(deg*Math.PI/180)} x2={24+19*Math.cos(deg*Math.PI/180)} y2={24+19*Math.sin(deg*Math.PI/180)} stroke="#FFB300" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
    </svg>
  );
  if ([2].includes(code)) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><radialGradient id="sunB" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#FFF176"/><stop offset="100%" stopColor="#FFB300"/></radialGradient><linearGradient id="clB" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#E3F2FD"/><stop offset="100%" stopColor="#90CAF9"/></linearGradient></defs>
      <circle cx="20" cy="20" r="9" fill="url(#sunB)"/>
      <ellipse cx="26" cy="31" rx="13" ry="8" fill="url(#clB)"/>
      <ellipse cx="18" cy="33" rx="9" ry="6" fill="url(#clB)"/>
    </svg>
  );
  if ([3].includes(code)) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="clC" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#CFD8DC"/><stop offset="100%" stopColor="#90A4AE"/></linearGradient></defs>
      <ellipse cx="28" cy="26" rx="14" ry="9" fill="url(#clC)"/>
      <ellipse cx="18" cy="30" rx="10" ry="7" fill="url(#clC)"/>
      <ellipse cx="22" cy="22" rx="8" ry="7" fill="#B0BEC5"/>
    </svg>
  );
  if ([51,53,55,61,63,65,80,81,82].includes(code)) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="clR" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#90CAF9"/><stop offset="100%" stopColor="#42A5F5"/></linearGradient></defs>
      <ellipse cx="26" cy="20" rx="14" ry="9" fill="url(#clR)"/>
      <ellipse cx="16" cy="23" rx="9" ry="7" fill="url(#clR)"/>
      {[[18,34],[24,38],[30,34],[36,38]].map(([x,y],i)=>(
        <line key={i} x1={x} y1={y-5} x2={x-2} y2={y+1} stroke="#1976D2" strokeWidth="2" strokeLinecap="round"/>
      ))}
    </svg>
  );
  if ([95,96,99].includes(code)) return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="clT" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#78909C"/><stop offset="100%" stopColor="#37474F"/></linearGradient></defs>
      <ellipse cx="26" cy="18" rx="14" ry="9" fill="url(#clT)"/>
      <ellipse cx="16" cy="21" rx="9" ry="7" fill="url(#clT)"/>
      <polygon points="26,29 20,38 25,36 22,46 30,33 25,35" fill="#FFD600"/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none">
      <defs><linearGradient id="clD" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#CFD8DC"/><stop offset="100%" stopColor="#90A4AE"/></linearGradient></defs>
      {[16,24,32].map((y,i)=><rect key={i} x="8" y={y} width={32-i*4} height="4" rx="2" fill="url(#clD)" opacity={1-i*0.2}/>)}
    </svg>
  );
}

function AdvisoryIcon({ type }) {
  const map = {
    alert:   <FaExclamationTriangle className="text-red-500 text-sm flex-shrink-0 mt-0.5" />,
    warning: <MdOutlineWarningAmber className="text-amber-500 text-base flex-shrink-0 mt-0.5" />,
    info:    <FaInfoCircle          className="text-blue-500 text-sm flex-shrink-0 mt-0.5" />,
    good:    <FaCheckCircle         className="text-green-500 text-sm flex-shrink-0 mt-0.5" />,
  };
  return map[type] ?? map.info;
}

const advisoryBg = {
  alert:   'bg-red-50 border-red-100',
  warning: 'bg-amber-50 border-amber-100',
  info:    'bg-blue-50 border-blue-100',
  good:    'bg-green-50 border-green-100',
};

function StatPill({ icon, label, value }) {
  return (
    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/15">
      <span className="text-white/70 text-xl">{icon}</span>
      <div>
        <p className="text-white/60 text-[10px] uppercase tracking-wide">{label}</p>
        <p className="text-white font-semibold text-sm">{value}</p>
      </div>
    </div>
  );
}

function RiskBadge({ risk }) {
  const styles = {
    Low:    'bg-green-100 text-green-700 border-green-200',
    Medium: 'bg-amber-100 text-amber-700 border-amber-200',
    High:   'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${styles[risk] || styles.Low}`}>
      <FaShieldAlt className="text-[10px]" /> {risk} Risk
    </span>
  );
}

function DiseaseTag({ tag, severity }) {
  const cls = {
    high:   'bg-red-50 text-red-700 border border-red-200',
    medium: 'bg-amber-50 text-amber-700 border border-amber-200',
    low:    'bg-blue-50 text-blue-700 border border-blue-200',
    info:   'bg-green-50 text-green-700 border border-green-200',
  };
  const icons = {
    high:   <GiMushroomGills className="text-red-500 text-xs" />,
    medium: <GiSpottedBug className="text-amber-500 text-xs" />,
    low:    <FaThermometerHalf className="text-blue-500 text-xs" />,
    info:   <FaLeaf className="text-green-500 text-xs" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cls[severity]}`}>
      {icons[severity]} {tag}
    </span>
  );
}

function Skeleton({ className }) {
  return <div className={`animate-pulse bg-white/20 rounded-xl ${className}`} />;
}

export default function WeatherCropPage({ onLoginOpen, onSignupOpen }) {
  const { t } = useLanguage();
  const [weather,   setWeather]   = useState(null);
  const [location,  setLocation]  = useState(DEFAULT_LOCATION);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState(null);
  const [locating,  setLocating]  = useState(false);
  const load = async (loc) => {
    setLoading(true); setError(null);
    try {
      const data = await fetchWeather(loc.lat, loc.lon);
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(location); }, []);

  const handleLocate = async () => {
    setLocating(true);
    try {
      const coords = await getUserLocation();
      const city   = await reverseGeocode(coords.lat, coords.lon);
      const loc    = { ...coords, city };
      setLocation(loc);
      await load(loc);
    } catch { setError('Location access denied.'); }
    finally { setLocating(false); }
  };

  const advisory  = weather ? generateAdvisory(weather)       : [];
  const cropRisk  = weather ? getCropRisk(weather)            : null;
  const harvest   = weather?.daily ? getHarvestWindow(weather.daily) : null;
  const irrig     = weather ? getIrrigationTip(weather)       : null;
  const diseases  = weather ? getDiseaseAlerts(weather)       : [];
  const cur       = weather?.current;
  const daily     = weather?.daily;
  // Use raw API field names (same as WeatherAdvisory)
  const wmoLabel  = cur ? (WMO_CODES[cur.weather_code]?.label ?? 'Clear Sky') : '';
  const nowStr    = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  // Seasonal tips (static but region-relevant)
  const seasonalTips = [
    { icon: <GiPlantRoots className="text-green-500" />, tip: 'Sow Kharif crops before monsoon peaks' },
    { icon: <FaTint className="text-blue-500" />,        tip: 'Drip irrigation saves 40% water vs flood' },
    { icon: <MdWbSunny className="text-amber-500" />,    tip: 'Solar drying optimal in 30–35°C range' },
    { icon: <FaLeaf className="text-green-600" />,       tip: 'Apply neem-based pesticides at dusk' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#f5faf6' }}>
      <Navbar onLoginOpen={onLoginOpen} onSignupOpen={onSignupOpen} />

      {/* ── Cinematic Hero ─────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden" style={{ height: 560, paddingTop: 64 }}>
        {/* Parallax background */}
        <motion.div initial={{ scale: 1.04 }} animate={{ scale: 1 }} transition={{ duration: 12, ease: "linear" }} className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1600&q=80"
            alt="Farm landscape"
            className="w-full h-full object-cover"
            style={{ transform: 'scale(1.08)' }}
          />
        </motion.div>

        {/* Dark gradient overlay for text readability */}
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.55) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%)' }} />

        {/* Animated light leak */}
        <motion.div
          animate={{ opacity: [0.3, 0.5, 0.3], scale: [1, 1.05, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl"
          style={{ background: 'rgba(134,239,172,0.12)', transform: 'translate(20%,-30%)' }}
        />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 h-full flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-300 text-xs font-bold uppercase tracking-widest">Live Weather Intelligence</span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white mb-4 leading-tight" style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
              Weather &<br /><span className="text-green-300">Crop Advisory</span>
            </h1>
            <p className="text-white/90 text-lg max-w-xl leading-relaxed mb-6" style={{ textShadow: '0 1px 8px rgba(0,0,0,0.4)' }}>
              Hyperlocal weather intelligence with AI-powered crop advisory, disease alerts and irrigation recommendations for your farm.
            </p>

            {/* Location control */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
                <FaMapMarkerAlt className="text-green-400 text-sm" />
                <span className="text-white font-medium text-sm">{location.city || location.name || 'Bhopal'}</span>
              </div>
              <button onClick={handleLocate} disabled={locating}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-400 text-white rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-lg">
                <FaLocationArrow className="text-xs" />
                {locating ? 'Locating...' : 'Use My Location'}
              </button>
              <button onClick={() => load(location)} disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-white/15 backdrop-blur-md text-white rounded-xl text-sm border border-white/20 hover:bg-white/25 transition-all">
                <FaSync className={`text-xs ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
      </div>

      {/* ── Main Dashboard ─────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700 text-sm">
            <MdOutlineWarningAmber className="flex-shrink-0" /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_288px] gap-6 items-start">

          {/* ── LEFT column ──────────────────────────────────────────────── */}
          <div className="space-y-6">

            {/* Main weather card */}
            <div>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'linear-gradient(135deg, #1b5e20 0%, #2e7d32 50%, #1b5e20 100%)', minHeight: 280 }}>
                {/* Background farm image */}
                <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=60"
                    alt="" className="w-full h-full object-cover opacity-20" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-green-900/60 to-transparent" />

                <div className="relative z-10 p-6 lg:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/20">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-white/90 text-xs font-semibold">Live</span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 border border-white/15">
                        <FaMapMarkerAlt className="text-green-300 text-xs" />
                        <span className="text-white/80 text-xs">{location.city || location.name || 'Bhopal'}</span>
                      </div>
                    </div>
                    <span className="text-white/50 text-sm">{nowStr}</span>
                  </div>

                  {loading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-20 w-48" />
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3"><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /><Skeleton className="h-16" /></div>
                    </div>
                  ) : cur ? (
                    <>
                      <div className="flex items-center gap-6 mb-8">
                        <WeatherIcon code={cur?.weather_code} className="text-8xl text-white/90" />
                        <div>
                          <div className="text-7xl font-black text-white leading-none">{Math.round(cur?.temperature_2m)}°C</div>
                          <div className="text-white/80 text-xl mt-1">{wmoLabel}</div>
                          <div className="text-white/50 text-sm mt-0.5">{t('weather.feelsLike')} {Math.round(cur?.apparent_temperature)}°C</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatPill icon={<WiHumidity />}  label={t('weather.humidity')}      value={`${cur?.relative_humidity_2m}%`} />
                        <StatPill icon={<WiStrongWind />} label={t('weather.wind')}          value={`${cur?.wind_speed_10m} km/h`} />
                        <StatPill icon={<FaSun />}        label={t('weather.uvIndex')}       value={cur?.uv_index} />
                        <StatPill icon={<WiRaindrop />}   label={t('weather.precipitation')} value={`${cur?.precipitation} mm`} />
                      </div>
                      <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <WiSunrise className="text-2xl text-amber-300" />
                          <span>{cur?.sunrise?.slice(11,16)}</span>
                          <span className="text-white/30 text-xs">{t('weather.sunrise')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                          <WiSunset className="text-2xl text-orange-300" />
                          <span>{cur?.sunset?.slice(11,16)}</span>
                          <span className="text-white/30 text-xs">{t('weather.sunset')}</span>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>
            </div>

            {/* 7-Day Forecast */}
            <ScrollReveal direction="up">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <FaCalendarCheck className="text-green-600" /> {t('weather.forecast7Day')}
                </h3>
                {loading ? (
                  <div className="grid grid-cols-7 gap-3">
                    {Array(7).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}
                  </div>
                ) : daily ? (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
                    {daily.time?.slice(0, 7).map((date, i) => (
                      <motion.div key={i}
                        whileHover={{ y: -3, boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}
                        className={`rounded-xl p-3 text-center transition-all duration-200 cursor-default ${
                          i === 0
                            ? 'bg-gradient-to-b from-green-700 to-green-800 text-white shadow-md'
                            : 'bg-green-50/60 border border-green-100 text-gray-700 hover:bg-green-100/60'
                        }`}>
                        <p className={`text-xs font-bold mb-2 ${i === 0 ? 'text-green-200' : 'text-gray-400'}`}>
                          {i === 0 ? t('weather.today') : i === 1 ? t('weather.tomorrow') : getDayName(date, i)}
                        </p>
                        <ForecastIcon code={daily.weather_code?.[i] ?? 0} isToday={i === 0} />
                        <p className={`font-bold text-sm ${i === 0 ? 'text-white' : 'text-gray-800'}`}>{Math.round(daily.temperature_2m_max?.[i] ?? 0)}°</p>
                        <p className={`text-xs mt-0.5 ${i === 0 ? 'text-green-300' : 'text-gray-400'}`}>{Math.round(daily.temperature_2m_min?.[i] ?? 0)}°</p>
                        {(daily.precipitation_probability_max?.[i] ?? 0) > 10 && (
                          <p className={`text-[10px] mt-1 flex items-center justify-center gap-0.5 ${i === 0 ? 'text-blue-200' : 'text-blue-500'}`}>
                            <FaTint className="text-[8px]" /> {Math.round(daily.precipitation_probability_max?.[i])}%
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : null}
              </div>
            </ScrollReveal>

            {/* Smart Crop Advisory */}
            <ScrollReveal direction="up">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-green-100 shadow-sm p-5">
                <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                  <GiPlantRoots className="text-green-600" /> {t('weather.cropAdvisory')}
                </h3>
                <p className="text-xs text-gray-500 mb-4">{t('weather.advisorySubtitle')}</p>
                {loading ? (
                  <div className="space-y-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-14 bg-gray-100" />)}</div>
                ) : (
                  <div className="space-y-2.5">
                    {advisory.map((item, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${advisoryBg[item.type]}`}>
                        <AdvisoryIcon type={item.type} />
                        <span className="text-gray-700 leading-relaxed">{item.text}</span>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Bottom 3 metric cards */}
                {!loading && cropRisk && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-5">
                    {[
                      { icon: <FaShieldAlt className="text-green-600" />, label: t('weather.cropRisk'), value: cropRisk.level, sub: cropRisk.detail, badge: <RiskBadge risk={cropRisk.level} /> },
                      { icon: <FaCalendarCheck className="text-green-600" />, label: t('weather.harvestWindow'), value: harvest?.window, sub: harvest?.detail },
                      { icon: <FaHandHoldingWater className="text-green-600" />, label: t('weather.irrigationTip'), value: irrig?.recommendation, sub: irrig?.detail || `${t('weather.humidity')} ${cur?.relative_humidity_2m}% · ${t('weather.feelsLike')} ${Math.round(cur?.temperature_2m ?? 0)}°C`, highlight: true },
                    ].map((card, i) => (
                      <motion.div key={i} whileHover={{ y: -2 }}
                        className={`rounded-xl p-4 border ${card.highlight ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                          {card.icon} {card.label}
                        </p>
                        {card.badge
                          ? <>{card.badge}<p className="text-xs text-gray-600 mt-1.5 leading-relaxed">{card.sub}</p></>
                          : <><p className={`text-sm font-bold ${card.highlight ? 'text-blue-700' : 'text-gray-800'}`}>{card.value}</p><p className="text-xs text-gray-600 mt-0.5 leading-relaxed">{card.sub}</p></>
                        }
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>
          </div>

          {/* ── RIGHT sidebar ────────────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Risk Alerts */}
            <div>
              <div className="rounded-2xl p-5 text-white shadow-lg" style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}>
                <h4 className="font-bold mb-3 flex items-center gap-2 text-sm">
                  <FaBell className="text-yellow-300" /> {t('weather.riskAlerts')}
                </h4>
                {loading ? (
                  <div className="space-y-2">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-14 bg-white/10" />)}</div>
                ) : diseases.length > 0 ? (
                  <div className="space-y-2">
                    {diseases.slice(0, 4).map((d, i) => (
                      <div key={i} className="bg-white/10 rounded-xl p-3">
                        <p className="text-white font-semibold text-sm">{d.tag}</p>
                        <p className="text-white/70 text-xs mt-0.5">{d.advice || `${d.severity === 'high' ? 'Immediate attention required' : d.severity === 'medium' ? 'Monitor closely this week' : 'Keep under observation'}`}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-white/10 rounded-xl p-3">
                    <p className="text-green-200 font-semibold text-sm">{t('weather.allClear')}</p>
                    <p className="text-white/60 text-xs mt-0.5">{t('weather.noAlerts')}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Seasonal Tips */}
            <ScrollReveal direction="right" delay={0.05}>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-green-100/60 shadow-md shadow-black/5 p-5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none"><img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100&q=40" alt="" className="w-full h-full object-cover rounded-xl" /></div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm relative z-10">
                  <FaLeaf className="text-green-600" /> {t('weather.seasonalTips')}
                </h4>
                {loading ? (
                  <div className="space-y-2">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10 bg-gray-100" />)}</div>
                ) : (
                  <div className="space-y-2.5">
                    {seasonalTips.map((s, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.07 }}
                        className="flex items-start gap-2.5">
                        <span className="text-lg flex-shrink-0">{s.icon}</span>
                        <p className="text-xs text-gray-600 leading-relaxed">{s.tip}</p>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Field Health Alerts */}
            <ScrollReveal direction="right" delay={0.1}>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-green-100/60 shadow-md shadow-black/5 p-5">
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
                  <GiSpottedBug className="text-red-500" /> {t('weather.fieldHealth')}
                </h4>
                {loading ? (
                  <div className="space-y-2">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-7 bg-gray-100" />)}</div>
                ) : (
                  <div className="flex flex-wrap gap-1.5">
                    {diseases.length > 0
                      ? diseases.map((d, i) => <DiseaseTag key={i} tag={d.tag} severity={d.severity} />)
                      : (
                        <>
                          <DiseaseTag tag="Heat Stress" severity="medium" />
                          <DiseaseTag tag="Soil Moisture Check" severity="info" />
                          <DiseaseTag tag="Seasonal Sowing Window" severity="info" />
                        </>
                      )
                    }
                  </div>
                )}
              </div>
            </ScrollReveal>

            {/* Irrigation Advisory */}
            <ScrollReveal direction="right" delay={0.15}>
              <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-green-100/60 shadow-md shadow-black/5 p-5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-[0.06] pointer-events-none"><img src="https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100&q=40" alt="" className="w-full h-full object-cover rounded-xl" /></div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm relative z-10">
                  <FaHandHoldingWater className="text-blue-600" /> {t('weather.irrigationAdvisory')}
                </h4>
                {loading ? (
                  <Skeleton className="h-16 bg-gray-100" />
                ) : irrig ? (
                  <>
                    <p className="text-sm font-bold text-blue-700 mb-1">{irrig.recommendation}</p>
                    <p className="text-xs text-gray-500 leading-relaxed mb-2">{irrig.detail}</p>
                    <p className="text-xs text-gray-400">{t('weather.humidity')} {cur?.relative_humidity_2m}% · {t('weather.feelsLike')} {Math.round(cur?.temperature_2m ?? 0)}°C</p>
                  </>
                ) : null}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
