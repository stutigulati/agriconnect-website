import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  WiDaySunny,
  WiCloud,
  WiCloudy,
  WiDayCloudy,
  WiRain,
  WiShowers,
  WiThunderstorm,
  WiSnow,
  WiFog,
  WiHumidity,
  WiStrongWind,
  WiSunrise,
  WiSunset,
  WiUmbrella,
} from 'react-icons/wi';

import {
  FaLocationArrow,
  FaSync,
  FaMapMarkerAlt,
  FaCalendarCheck,
  FaTint,
  FaBug,
  FaSeedling,
  FaShieldAlt,
  FaWater,
  FaLightbulb,
  FaArrowRight,
  FaCloudSun,
  FaBrain,
  FaCheckCircle,
} from 'react-icons/fa';

import { MdOutlineWarningAmber } from 'react-icons/md';
import { TbUvIndex } from 'react-icons/tb';

import ScrollReveal from './ScrollReveal';
import { useLanguage } from '../context/LanguageContext.jsx';
import farmLandscape from '../assets/farm-landscape.png';

import {
  fetchWeather,
  getUserLocation,
  reverseGeocode,
  DEFAULT_LOCATION,
  WMO_CODES,
  getDayName,
} from '../services/weatherApi';

// ─── WMO code → react-icons/wi ───────────────────────────────────────────────
function WeatherIcon({ code, className = 'text-4xl' }) {
  const map = {
    0: WiDaySunny,
    1: WiDaySunny,
    2: WiDayCloudy,
    3: WiCloudy,
    45: WiFog,
    48: WiFog,
    51: WiShowers,
    53: WiShowers,
    55: WiShowers,
    61: WiRain,
    63: WiRain,
    65: WiRain,
    71: WiSnow,
    73: WiSnow,
    75: WiSnow,
    80: WiShowers,
    81: WiShowers,
    82: WiRain,
    95: WiThunderstorm,
    96: WiThunderstorm,
    99: WiThunderstorm,
  };

  const Icon = map[code] ?? WiCloud;
  return <Icon className={className} />;
}

// ─── Forecast Icon using React Icons ─────────────────────────────────────────
function ForecastIcon({ code, isToday = false }) {
  const commonClass = isToday ? 'text-4xl' : 'text-3xl';

  if ([0, 1].includes(code)) {
    return <WiDaySunny className={`${commonClass} text-yellow-400`} />;
  }

  if ([2].includes(code)) {
    return <WiDayCloudy className={`${commonClass} text-yellow-400`} />;
  }

  if ([3].includes(code)) {
    return <WiCloudy className={`${commonClass} text-slate-400`} />;
  }

  if ([45, 48].includes(code)) {
    return <WiFog className={`${commonClass} text-slate-400`} />;
  }

  if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
    return <WiRain className={`${commonClass} text-blue-400`} />;
  }

  if ([71, 73, 75].includes(code)) {
    return <WiSnow className={`${commonClass} text-sky-300`} />;
  }

  if ([95, 96, 99].includes(code)) {
    return <WiThunderstorm className={`${commonClass} text-yellow-400`} />;
  }

  return <WiCloud className={`${commonClass} text-slate-400`} />;
}

function Skeleton({ className }) {
  return <div className={`animate-pulse rounded-xl bg-white/20 ${className}`} />;
}

function YellowIconBox({ icon, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500 text-white shadow-lg shadow-yellow-600/25 ${className}`}
    >
      {icon}
    </div>
  );
}

function StatPill({ icon, label, value }) {
  return (
    <div className="group flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md transition-all duration-300 hover:bg-white/15">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-400/15 text-3xl text-yellow-300">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-bold uppercase tracking-wide text-white/55">
          {label}
        </p>
        <p className="text-sm font-bold text-white">{value}</p>
      </div>
    </div>
  );
}

function AdvisoryCard({ icon, title, text, badge }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="relative overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50/80 to-emerald-50 p-5 shadow-md shadow-green-900/5"
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-yellow-300/20 blur-2xl" />

      <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
        <YellowIconBox icon={icon} className="h-12 w-12 text-lg" />

        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-yellow-700">
          {badge}
        </span>
      </div>

      <h4 className="relative z-10 text-base font-black text-gray-900">
        {title}
      </h4>

      <p className="relative z-10 mt-2 text-sm leading-6 text-gray-600">
        {text}
      </p>
    </motion.div>
  );
}

function SmartInsightCard({ humidity, rainChance, wind, temp }) {
  const fungalRisk = humidity >= 75 || rainChance >= 50;
  const heatRisk = temp >= 38;
  const windRisk = wind >= 25;

  let riskLabel = 'Low';
  let riskColor = 'from-green-500 to-emerald-500';
  let tip =
    'Weather looks stable. Continue regular crop monitoring and check soil moisture before irrigation.';

  if (fungalRisk) {
    riskLabel = 'Moderate';
    riskColor = 'from-yellow-400 to-orange-500';
    tip =
      'Humidity or rain chance is high. Monitor leafy crops for fungal infection and avoid unnecessary overhead watering.';
  }

  if (heatRisk || windRisk) {
    riskLabel = 'High';
    riskColor = 'from-red-500 to-orange-600';
    tip =
      'Crop stress risk is high today. Avoid spraying during peak heat or strong wind and irrigate during cooler hours.';
  }

  return (
    <div className="relative h-full overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-white via-green-50 to-emerald-50 p-6 shadow-xl shadow-green-900/10">
      <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-yellow-300/20 blur-3xl" />
      <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-green-300/20 blur-3xl" />

      <div className="relative z-10 mb-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-wider text-green-600">
            AI Recommendation
          </p>

          <h3 className="mt-1 text-2xl font-black text-gray-950">
            Smart Farming Tip
          </h3>
        </div>

        <YellowIconBox icon={<FaLightbulb />} className="h-12 w-12 text-lg" />
      </div>

      <p className="relative z-10 text-sm leading-6 text-gray-600">{tip}</p>

      <div className="relative z-10 mt-6 rounded-2xl border border-green-100 bg-white/80 p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold text-gray-800">
            <FaShieldAlt className="text-yellow-500" />
            Crop Risk Meter
          </span>

          <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700 ring-1 ring-yellow-200">
            {riskLabel}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-green-50">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${riskColor}`}
            style={{
              width:
                riskLabel === 'Low'
                  ? '35%'
                  : riskLabel === 'Moderate'
                    ? '65%'
                    : '90%',
            }}
          />
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-xl bg-gradient-to-br from-white to-green-50 px-2 py-2">
            <p className="text-[10px] font-bold text-gray-400">Rain</p>
            <p className="text-xs font-black text-gray-800">{rainChance}%</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white to-green-50 px-2 py-2">
            <p className="text-[10px] font-bold text-gray-400">Humidity</p>
            <p className="text-xs font-black text-gray-800">{humidity}%</p>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-white to-green-50 px-2 py-2">
            <p className="text-[10px] font-bold text-gray-400">Wind</p>
            <p className="text-xs font-black text-gray-800">{wind} km/h</p>
          </div>
        </div>
      </div>

      <button className="relative z-10 mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-green-700/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        View Crop Plan
        <FaArrowRight className="text-xs text-yellow-200" />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function WeatherAdvisory() {
  const { t } = useLanguage();

  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [time, setTime] = useState(new Date());
  const [locating, setLocating] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (hasFetched.current) return;

    hasFetched.current = true;

    doFetchWeather(
      DEFAULT_LOCATION.lat,
      DEFAULT_LOCATION.lon,
      DEFAULT_LOCATION.city,
      DEFAULT_LOCATION.state
    );
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function doFetchWeather(lat, lon, city, state) {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setLocation({ lat, lon, city, state });
    } catch {
      setError('Unable to load live weather. Retrying with default location…');

      try {
        const fallback = await fetchWeather(
          DEFAULT_LOCATION.lat,
          DEFAULT_LOCATION.lon
        );

        setWeather(fallback);
        setLocation(DEFAULT_LOCATION);
      } catch {
        setError('Weather service unavailable. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  }

  const handleUseLocation = async () => {
    setLocating(true);

    try {
      const pos = await getUserLocation();
      const place = await reverseGeocode(pos.lat, pos.lon);

      await doFetchWeather(pos.lat, pos.lon, place.city, place.state);
    } catch {
      setError('Location access denied. Showing Bhopal weather.');
    } finally {
      setLocating(false);
    }
  };

  const cur = weather?.current;
  const daily = weather?.daily;

  const codeInfo = WMO_CODES[cur?.weather_code] ?? { label: 'Clear Sky' };

  const temp = Math.round(cur?.temperature_2m ?? 0);
  const feelsLike = Math.round(cur?.apparent_temperature ?? 0);
  const humidity = Math.round(cur?.relative_humidity_2m ?? 0);
  const wind = Math.round(cur?.wind_speed_10m ?? 0);
  const uvIndex = cur?.uv_index?.toFixed(1) ?? '—';
  const precipitation = cur?.precipitation ?? 0;
  const rainChance = daily?.precipitation_probability_max?.[0] ?? 0;

  return (
    <section id="weather" className="relative overflow-hidden py-24">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={farmLandscape}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-green-50/60 to-emerald-100/70" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(22,163,74,0.10)_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-green-50/85 via-transparent to-white/40" />
      </div>

      {/* Floating React icons */}
      <motion.div
        animate={{ y: [0, -18, 0], rotate: [0, 4, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute left-[8%] top-28 hidden h-16 w-16 items-center justify-center rounded-3xl border border-white/50 bg-white/35 text-4xl text-yellow-400 shadow-lg backdrop-blur-md lg:flex"
      >
        <WiDaySunny />
      </motion.div>

      <motion.div
        animate={{ y: [0, 16, 0], rotate: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut' }}
        className="absolute right-[8%] top-40 hidden h-16 w-16 items-center justify-center rounded-3xl border border-white/50 bg-white/35 text-3xl text-yellow-400 shadow-lg backdrop-blur-md lg:flex"
      >
        <FaCloudSun />
      </motion.div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Title */}
        <ScrollReveal>
          <div className="mx-auto mb-12 max-w-4xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-700 to-emerald-600 px-4 py-1.5 text-sm font-bold text-white shadow-lg shadow-green-900/15">
              <FaBrain className="text-yellow-300" />
              {t('weather.sectionBadge')}
            </span>

            <h2 className="text-4xl font-black tracking-tight text-gray-950 drop-shadow-sm lg:text-6xl">
              {t('weather.title')}
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base font-semibold leading-7 text-gray-700 lg:text-lg">
              {t('weather.subtitle')}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-2xl border border-green-100 bg-white px-4 py-2 text-sm text-gray-700 shadow-md shadow-green-900/5">
                <FaMapMarkerAlt className="text-yellow-500" />
                <span className="font-bold">
                  {location.city}
                  {location.state ? `, ${location.state}` : ''}
                </span>
              </div>

              <button
                onClick={handleUseLocation}
                disabled={locating}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-green-700 via-emerald-600 to-lime-600 px-5 py-2.5 text-sm font-black text-white shadow-lg shadow-green-800/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {locating ? (
                  <FaSync className="animate-spin text-xs text-yellow-200" />
                ) : (
                  <FaLocationArrow className="text-xs text-yellow-200" />
                )}
                {locating ? t('weather.locating') : t('weather.useMyLocation')}
              </button>
            </div>
          </div>
        </ScrollReveal>

        {error && (
          <div className="mx-auto mb-6 flex max-w-2xl items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-700 shadow-sm">
            <MdOutlineWarningAmber className="flex-shrink-0" />
            {error}
          </div>
        )}

        {/* Dashboard Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.55fr_0.95fr]">
          {/* Current Weather Card */}
          <ScrollReveal direction="up">
            <div className="relative h-full overflow-hidden rounded-[2rem] border border-white/20 bg-gradient-to-br from-green-950 via-green-800 to-emerald-700 shadow-2xl shadow-green-900/25">
              <div className="absolute right-0 top-0 h-80 w-80 translate-x-1/3 -translate-y-1/3 rounded-full bg-yellow-300/20 blur-3xl" />
              <div className="absolute bottom-0 left-0 h-72 w-72 -translate-x-1/3 translate-y-1/3 rounded-full bg-emerald-300/15 blur-3xl" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.12)_1px,transparent_0)] [background-size:28px_28px]" />

              <div className="relative z-10 p-6 sm:p-8">
                {/* Header */}
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-300" />
                      <span className="text-xs font-bold text-white/90">Live</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                      <FaMapMarkerAlt className="text-xs text-yellow-300" />
                      <span className="text-xs font-bold text-white/90">
                        {location.city}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs font-medium text-white/60">
                    {time.toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                {/* Temperature */}
                {loading ? (
                  <div className="mb-8 flex items-center gap-6">
                    <Skeleton className="h-24 w-24" />
                    <div className="space-y-3">
                      <Skeleton className="h-9 w-44" />
                      <Skeleton className="h-5 w-28" />
                      <Skeleton className="h-4 w-36" />
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] border border-yellow-300/20 bg-yellow-300/10 text-yellow-300 shadow-xl backdrop-blur-md">
                      <WeatherIcon
                        code={cur?.weather_code}
                        className="text-8xl text-yellow-300"
                      />
                    </div>

                    <div>
                      <p className="text-6xl font-black leading-none tracking-tight text-white lg:text-7xl">
                        {temp}°C
                      </p>

                      <p className="mt-2 text-xl font-bold text-yellow-200">
                        {codeInfo.label}
                      </p>

                      <p className="mt-1 text-sm font-medium text-white/60">
                        Feels like {feelsLike}°C
                      </p>
                    </div>
                  </div>
                )}

                {/* Stat Pills */}
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {loading ? (
                    Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-16 bg-white/10" />
                      ))
                  ) : (
                    <>
                      <StatPill
                        icon={<WiHumidity />}
                        label="Humidity"
                        value={`${humidity}%`}
                      />
                      <StatPill
                        icon={<WiStrongWind />}
                        label="Wind"
                        value={`${wind} km/h`}
                      />
                      <StatPill
                        icon={<TbUvIndex />}
                        label="UV Index"
                        value={uvIndex}
                      />
                      <StatPill
                        icon={<FaTint />}
                        label="Rainfall"
                        value={`${precipitation} mm`}
                      />
                    </>
                  )}
                </div>

                {/* Sunrise / Sunset */}
                {!loading && daily && (
                  <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-white/10 pt-5">
                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                      <WiSunrise className="text-3xl text-yellow-300" />
                      <span className="font-bold">
                        {daily.sunrise?.[0]?.split('T')[1]?.slice(0, 5) ?? '—'}
                      </span>
                      <span className="text-xs text-white/45">Sunrise</span>
                    </div>

                    <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm text-white/80">
                      <WiSunset className="text-3xl text-yellow-300" />
                      <span className="font-bold">
                        {daily.sunset?.[0]?.split('T')[1]?.slice(0, 5) ?? '—'}
                      </span>
                      <span className="text-xs text-white/45">Sunset</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Smart Insight Card */}
          <ScrollReveal direction="up" delay={0.08}>
            {loading ? (
              <div className="h-full rounded-3xl border border-white/30 bg-white/60 p-6 backdrop-blur-xl">
                <Skeleton className="h-full min-h-[360px] bg-gray-100" />
              </div>
            ) : (
              <SmartInsightCard
                humidity={humidity}
                rainChance={rainChance}
                wind={wind}
                temp={temp}
              />
            )}
          </ScrollReveal>
        </div>

        {/* 7-Day Forecast */}
        <ScrollReveal direction="up" delay={0.1}>
          <div className="mt-7 rounded-[2rem] border border-green-100 bg-gradient-to-br from-white via-green-50/70 to-emerald-50 p-6 shadow-xl shadow-green-900/5">
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="flex items-center gap-2 text-xl font-black text-gray-950">
                <FaCalendarCheck className="text-yellow-500" />
                7-Day Forecast
              </h3>

              <span className="hidden rounded-full bg-yellow-50 px-3 py-1 text-xs font-black text-yellow-700 ring-1 ring-yellow-200 sm:inline-flex">
                Updated Live
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
              {loading
                ? Array(7)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-36 bg-gray-100" />
                    ))
                : daily?.time.slice(0, 7).map((date, i) => (
                    <motion.div
                      key={date}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{
                        y: -5,
                        boxShadow: '0 16px 34px rgba(22, 101, 52, 0.14)',
                      }}
                      className={`flex cursor-default flex-col items-center gap-1 rounded-2xl border p-3 text-center transition-all duration-300 ${
                        i === 0
                          ? 'border-green-700 bg-gradient-to-br from-green-800 via-emerald-700 to-lime-700 text-white shadow-lg shadow-green-700/20'
                          : 'border-green-100 bg-white hover:border-yellow-300 hover:bg-yellow-50/50'
                      }`}
                    >
                      <p
                        className={`text-[11px] font-black tracking-wide ${
                          i === 0 ? 'text-yellow-100' : 'text-gray-500'
                        }`}
                      >
                        {getDayName(date, i)}
                      </p>

                      <div className="my-1 flex items-center justify-center">
                        <ForecastIcon
                          code={daily.weather_code[i]}
                          isToday={i === 0}
                        />
                      </div>

                      <p
                        className={`text-lg font-black leading-none ${
                          i === 0 ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {Math.round(daily.temperature_2m_max[i])}°
                      </p>

                      <p
                        className={`text-xs font-semibold leading-none ${
                          i === 0 ? 'text-yellow-100' : 'text-gray-400'
                        }`}
                      >
                        {Math.round(daily.temperature_2m_min[i])}°
                      </p>

                      {daily.precipitation_probability_max[i] > 0 && (
                        <div
                          className={`mt-1 flex items-center justify-center gap-1 ${
                            i === 0 ? 'text-blue-100' : 'text-blue-500'
                          }`}
                        >
                          <WiUmbrella className="text-base" />
                          <span className="text-[10px] font-black">
                            {daily.precipitation_probability_max[i]}%
                          </span>
                        </div>
                      )}
                    </motion.div>
                  ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Crop Advisory Cards */}
        <ScrollReveal direction="up" delay={0.16}>
          <div className="mt-7 rounded-[2rem] border border-green-100 bg-gradient-to-br from-white/90 via-green-50/80 to-emerald-50 p-6 shadow-xl shadow-green-900/5">
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-green-700">
                  <FaBrain className="text-yellow-500" />
                  Crop Intelligence
                </p>

                <h3 className="mt-1 text-2xl font-black text-gray-950">
                  Today’s Crop Advisory
                </h3>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-xs font-black text-yellow-700">
                <FaCheckCircle />
                Field-ready suggestions
              </span>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
              <AdvisoryCard
                icon={<FaWater />}
                title="Irrigation Advice"
                badge={rainChance > 50 ? 'Delay' : 'Recommended'}
                text={
                  rainChance > 50
                    ? 'Rain chances are high. Avoid heavy irrigation today and check soil moisture before watering.'
                    : 'Rain chances are low. Light irrigation during morning or evening can help reduce crop stress.'
                }
              />

              <AdvisoryCard
                icon={<FaBug />}
                title="Pest & Disease Risk"
                badge={humidity > 75 ? 'Moderate' : 'Safe'}
                text={
                  humidity > 75
                    ? 'Humidity is high. Monitor crops for fungal infection, leaf spots and pest activity.'
                    : 'Current humidity is manageable. Continue regular crop inspection and avoid overwatering.'
                }
              />

              <AdvisoryCard
                icon={<FaSeedling />}
                title="Fertilizer Suggestion"
                badge="Smart Tip"
                text="Apply fertilizer only after checking soil moisture. Avoid spraying nutrients during peak afternoon heat."
              />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}