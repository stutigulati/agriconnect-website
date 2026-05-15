/**
 * weatherApi.js — AgriConnect Weather & Crop Advisory Service
 *
 * Uses Open-Meteo (free, no API key) for live weather data.
 * Architecture ready for:
 *   - satellite weather data (ISRO Mosdac)
 *   - NDVI monitoring
 *   - AI crop advisory (via /api/advisory endpoint)
 *   - disease forecasting models
 */

// ─── WMO weather code → description + icon name ───────────────────────────────
export const WMO_CODES = {
  0:  { label: 'Clear Sky',          icon: 'sun'             },
  1:  { label: 'Mainly Clear',       icon: 'sun'             },
  2:  { label: 'Partly Cloudy',      icon: 'cloud-sun'       },
  3:  { label: 'Overcast',           icon: 'cloud'           },
  45: { label: 'Foggy',              icon: 'fog'             },
  48: { label: 'Icy Fog',            icon: 'fog'             },
  51: { label: 'Light Drizzle',      icon: 'cloud-drizzle'   },
  53: { label: 'Drizzle',            icon: 'cloud-drizzle'   },
  55: { label: 'Heavy Drizzle',      icon: 'cloud-drizzle'   },
  61: { label: 'Light Rain',         icon: 'cloud-rain'      },
  63: { label: 'Rain',               icon: 'cloud-rain'      },
  65: { label: 'Heavy Rain',         icon: 'cloud-showers-heavy' },
  71: { label: 'Light Snow',         icon: 'snowflake'       },
  73: { label: 'Snow',               icon: 'snowflake'       },
  75: { label: 'Heavy Snow',         icon: 'snowflake'       },
  80: { label: 'Light Showers',      icon: 'cloud-rain'      },
  81: { label: 'Showers',            icon: 'cloud-rain'      },
  82: { label: 'Violent Showers',    icon: 'cloud-showers-heavy' },
  95: { label: 'Thunderstorm',       icon: 'bolt'            },
  96: { label: 'Thunderstorm w/ Hail', icon: 'bolt'          },
  99: { label: 'Heavy Thunderstorm', icon: 'bolt'            },
};

// ─── Reverse geocode using Open-Meteo's geocoding ─────────────────────────────
export async function reverseGeocode(lat, lon) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
    );
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
    const state = data.address?.state || '';
    return { city, state };
  } catch {
    return { city: 'Your Location', state: '' };
  }
}

// ─── Fetch weather from Open-Meteo ────────────────────────────────────────────
export async function fetchWeather(lat, lon) {
  const url = new URL('https://api.open-meteo.com/v1/forecast');
  url.searchParams.set('latitude', lat);
  url.searchParams.set('longitude', lon);
  url.searchParams.set('current', [
    'temperature_2m', 'relative_humidity_2m', 'apparent_temperature',
    'weather_code', 'wind_speed_10m', 'uv_index', 'precipitation',
  ].join(','));
  url.searchParams.set('daily', [
    'weather_code', 'temperature_2m_max', 'temperature_2m_min',
    'precipitation_probability_max', 'sunrise', 'sunset', 'uv_index_max',
  ].join(','));
  url.searchParams.set('timezone', 'Asia/Kolkata');
  url.searchParams.set('forecast_days', '7');

  const res = await fetch(url.toString());
  if (!res.ok) throw new Error('Weather API failed');
  return res.json();
}

// ─── Geolocation wrapper ─────────────────────────────────────────────────────
export function getUserLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      err => reject(err),
      { timeout: 10000 }
    );
  });
}

// ─── Default fallback: Bhopal, MP ────────────────────────────────────────────
export const DEFAULT_LOCATION = { lat: 23.2599, lon: 77.4126, city: 'Bhopal', state: 'Madhya Pradesh' };

// ─── Smart Crop Advisory Engine ───────────────────────────────────────────────
export function generateAdvisory(weather) {
  const { temperature_2m: temp, relative_humidity_2m: humidity,
          wind_speed_10m: wind, weather_code: code, uv_index: uv,
          precipitation: precip } = weather.current;

  const advisories = [];

  // ── Heavy rain / storm ───────────────────────────────────────────────────
  if ([65, 82, 95, 96, 99].includes(code)) {
    advisories.push({ type: 'alert',   text: 'Heavy rain / thunderstorm alert — halt all field operations immediately and move workers and equipment to shelter.' });
    advisories.push({ type: 'warning', text: 'Do NOT spray pesticides, fungicides or fertilizers — rain will wash chemicals into waterways, causing crop damage and pollution.' });
    advisories.push({ type: 'warning', text: 'High risk of flooding in low-lying fields — open drainage channels and bunds to divert runoff.' });
    advisories.push({ type: 'info',    text: 'After rain stops, inspect wheat, paddy and pulse crops for lodging (plants falling over) and stake them if needed.' });
    advisories.push({ type: 'warning', text: 'Fungal disease risk is very high — schedule a protective fungicide spray (mancozeb or copper oxychloride) within 24 hours of dry weather.' });
  } else if ([61, 63, 80, 81].includes(code)) {
    advisories.push({ type: 'warning', text: 'Moderate rain expected — postpone harvesting of mature crops (wheat, maize, soybean) as moisture will reduce grain quality.' });
    advisories.push({ type: 'warning', text: 'Avoid pesticide spraying today — wait for at least 4–6 dry hours after rain for chemical to adhere to leaf surface.' });
    advisories.push({ type: 'info',    text: 'Check field drainage: clear any blocked furrows to prevent waterlogging, which can cause root rot in vegetables and pulses.' });
    advisories.push({ type: 'info',    text: "Rain-fed irrigation crops: skip today's watering cycle — soil moisture is sufficient." });
  }

  // ── Drizzle ──────────────────────────────────────────────────────────────
  if ([51, 53, 55].includes(code)) {
    advisories.push({ type: 'info',    text: 'Light drizzle forecast — delay harvesting of mature crops to prevent spoilage and post-harvest losses.' });
    advisories.push({ type: 'warning', text: 'Drizzle creates ideal conditions for grey mould (Botrytis) in grapes and vegetables — inspect closely.' });
    advisories.push({ type: 'good',    text: 'Good day for transplanting vegetable seedlings — drizzle reduces transplant shock.' });
  }

  // ── High humidity ────────────────────────────────────────────────────────
  if (humidity > 85) {
    advisories.push({ type: 'alert',  text: `Very high humidity (${humidity}%) — immediate risk of downy mildew, late blight and powdery mildew in potato, tomato, onion and cucurbits.` });
    advisories.push({ type: 'warning', text: 'Increase ventilation in poly-houses and greenhouses; open vents and side curtains to lower internal humidity.' });
    advisories.push({ type: 'info',   text: 'Apply a preventive fungicide spray (Ridomil Gold or Dithane M-45) if no rain is expected in the next 2 hours.' });
  } else if (humidity > 70) {
    advisories.push({ type: 'warning', text: `Elevated humidity (${humidity}%) — monitor leafy vegetables and fruit crops for early signs of fungal infection (yellowing, water-soaked spots).` });
  }

  // ── Extreme heat ─────────────────────────────────────────────────────────
  if (temp > 42) {
    advisories.push({ type: 'alert',   text: `Extreme heat warning: ${Math.round(temp)}°C — vegetable nurseries, fruit crops and flowering plants face severe heat stress and flower drop.` });
    advisories.push({ type: 'alert',   text: 'Irrigate immediately — soil moisture is critical to prevent wilting. Use drip or sprinkler irrigation in early morning before 6 AM.' });
    advisories.push({ type: 'warning', text: 'Provide 30–50% shade net over nursery beds, seedlings and recently transplanted crops.' });
    advisories.push({ type: 'info',    text: 'Apply mulching (dry straw, sugarcane trash) around crop base to conserve soil moisture and lower root zone temperature by 4–6°C.' });
    advisories.push({ type: 'info',    text: 'Avoid any field operations between 10 AM and 4 PM; schedule all work in early morning or after sunset.' });
  } else if (temp > 38) {
    advisories.push({ type: 'warning', text: `High heat (${Math.round(temp)}°C) — risk of heat stress in standing crops, especially wheat, tomato and chilli during flowering stage.` });
    advisories.push({ type: 'warning', text: 'Ensure adequate soil moisture — irrigate every alternate day and check for moisture stress symptoms (leaf curl, wilting).' });
    advisories.push({ type: 'info',    text: 'Apply foliar spray of Potassium Nitrate (KNO₃ 0.5%) to reduce heat stress and improve fruit setting.' });
    advisories.push({ type: 'info',    text: 'Avoid field operations between 11 AM and 3 PM to protect worker health.' });
  } else if (temp > 35) {
    advisories.push({ type: 'warning', text: `Warm conditions (${Math.round(temp)}°C) — maintain good soil moisture; water stress combined with heat can reduce yields significantly.` });
    advisories.push({ type: 'good',    text: 'Ideal conditions for summer crops like okra, cowpea and groundnut. Ensure timely weeding to reduce crop competition.' });
  }

  // ── Cold / frost ─────────────────────────────────────────────────────────
  if (temp < 5) {
    advisories.push({ type: 'alert',   text: `Frost risk: temperature at ${Math.round(temp)}°C — cover sensitive crops (tomato, chilli, brinjal, potato) with straw, plastic sheets or frost cloth tonight.` });
    advisories.push({ type: 'alert',   text: 'Light evening irrigation on crop canopy can provide 1–2°C protection against frost damage (latent heat release).' });
    advisories.push({ type: 'info',    text: 'Apply potassium-rich fertilizer (Muriate of Potash) to improve cold hardiness of crops over the next 48 hours.' });
  } else if (temp < 12) {
    advisories.push({ type: 'warning', text: `Cool temperatures (${Math.round(temp)}°C) — growth of most crops will slow. Delay fertilizer application until temperatures improve.` });
    advisories.push({ type: 'info',    text: 'Good conditions for rabi crops (wheat, mustard, gram) — ensure adequate moisture for tillering and branching.' });
    advisories.push({ type: 'info',    text: 'Watch for aphid and whitefly build-up in vegetables — cool weather increases their populations rapidly.' });
  }

  // ── Wind ─────────────────────────────────────────────────────────────────
  if (wind > 40) {
    advisories.push({ type: 'alert',   text: `Very strong winds (${Math.round(wind)} km/h) — risk of crop lodging in tall crops like maize, sugarcane and sunflower. Postpone all spray operations.` });
    advisories.push({ type: 'warning', text: 'Secure polytunnels, shade nets, irrigation pipes and other field infrastructure against wind damage.' });
  } else if (wind > 25) {
    advisories.push({ type: 'warning', text: `Moderate wind (${Math.round(wind)} km/h) — avoid spraying pesticides or herbicides; drift will reduce efficacy and may damage adjacent crops.` });
    advisories.push({ type: 'info',    text: 'Check and secure drip irrigation laterals and sprinkler heads that may be displaced by wind.' });
  }

  // ── UV advisory ──────────────────────────────────────────────────────────
  if (uv && uv > 9) {
    advisories.push({ type: 'info', text: `UV index is very high (${Math.round(uv)}) — excellent day for solar drying of harvested grains, spices and chillies. Spread in single layer for maximum efficiency.` });
    advisories.push({ type: 'info', text: 'Workers in the field must use sun protection (hats, full-sleeve clothing) and take shade breaks every 45 minutes.' });
  } else if (uv && uv > 6) {
    advisories.push({ type: 'info', text: `Moderate-high UV (${Math.round(uv)}) — good conditions for solar drying. Ensure adequate hydration for field workers.` });
  }

  // ── Clear, ideal day ─────────────────────────────────────────────────────
  if ([0, 1].includes(code) && temp >= 20 && temp <= 35) {
    advisories.push({ type: 'good', text: 'Clear sky and optimal temperature — ideal day for all field operations: planting, transplanting, weeding and pesticide spraying.' });
    advisories.push({ type: 'good', text: 'Good conditions for harvesting dry crops (wheat, soybean, sorghum) — grain moisture will be within safe storage limits.' });
    advisories.push({ type: 'good', text: 'Scout fields for early pest and disease detection: check undersides of leaves for eggs, mites and sucking pests.' });
    advisories.push({ type: 'info', text: 'Best window for foliar nutrient sprays (zinc, boron, micronutrients) — dry conditions ensure good leaf absorption.' });
  } else if ([2].includes(code) && temp >= 18 && temp <= 36) {
    advisories.push({ type: 'good', text: 'Partly cloudy conditions — comfortable working day with reduced heat stress. Good for transplanting and field scouting.' });
    advisories.push({ type: 'good', text: 'Moderate conditions suitable for pesticide and fertilizer application; apply before wind picks up.' });
  }

  // ── Foggy ────────────────────────────────────────────────────────────────
  if ([45, 48].includes(code)) {
    advisories.push({ type: 'warning', text: 'Dense fog conditions — visibility is low. Delay transportation of harvested produce until fog clears.' });
    advisories.push({ type: 'info',    text: 'Foggy mornings increase disease spread — monitor wheat for yellow rust and vegetables for grey mould.' });
    advisories.push({ type: 'info',    text: 'Delay morning spraying until fog lifts (usually by 9–10 AM) to ensure proper coverage and chemical efficacy.' });
  }

  // ── Default fallback ─────────────────────────────────────────────────────
  if (advisories.length === 0) {
    advisories.push({ type: 'info', text: 'Monitor crops regularly and maintain irrigation schedule based on soil moisture.' });
    advisories.push({ type: 'good', text: 'Conditions are generally favourable for most farm activities today.' });
    advisories.push({ type: 'info', text: 'Check for pest and disease pressure — early detection saves 20–30% of potential yield loss.' });
  }

  return advisories;
}

// ─── Risk Assessment ──────────────────────────────────────────────────────────
export function getCropRisk(weather) {
  const { temperature_2m: temp, relative_humidity_2m: humidity, weather_code: code } = weather.current;

  let riskLevel = 'Low';
  let riskScore = 0;
  const factors = [];

  if (humidity > 80) { riskScore += 2; factors.push(`High humidity (${humidity}%) increases fungal disease risk`); }
  if (humidity > 90) { riskScore += 1; factors.push('Extremely high humidity — immediate disease monitoring required'); }
  if (temp > 40) { riskScore += 3; factors.push(`Extreme heat (${Math.round(temp)}°C) causes heat stress and flower drop`); }
  else if (temp > 37) { riskScore += 1; factors.push(`High temperature (${Math.round(temp)}°C) may stress crops in flowering stage`); }
  if (temp < 5) { riskScore += 3; factors.push(`Frost risk at ${Math.round(temp)}°C — protect sensitive crops`); }
  else if (temp < 10) { riskScore += 1; factors.push(`Cool temperatures (${Math.round(temp)}°C) slow crop growth`); }
  if ([65,80,81,82,95,96,99].includes(code)) { riskScore += 2; factors.push('Heavy rain/storm increases waterlogging and lodging risk'); }
  else if ([61,63,51,53].includes(code)) { riskScore += 1; factors.push('Light rain may delay field operations'); }

  if (riskScore >= 4) riskLevel = 'High';
  else if (riskScore >= 2) riskLevel = 'Medium';

  if (factors.length === 0) factors.push('Weather conditions are favourable for most crops');

  return { level: riskLevel, detail: factors.join('. '), factors };
}

// ─── Harvest Window Estimate ──────────────────────────────────────────────────
export function getHarvestWindow(daily) {
  // Count consecutive days with good harvest conditions
  let goodDays = 0;
  const good = (code, rain) =>
    [0,1,2,3].includes(code) && rain < 20;

  for (let i = 0; i < Math.min(7, daily.weather_code.length); i++) {
    if (good(daily.weather_code[i], daily.precipitation_probability_max[i])) goodDays++;
    else break;
  }

  let window, detail;
  if (goodDays >= 5) {
    window = `${goodDays} days window`;
    detail = `Excellent harvesting conditions for the next ${goodDays} consecutive days — low precipitation probability and clear skies expected.`;
  } else if (goodDays >= 3) {
    window = `${goodDays} days window`;
    detail = `Good ${goodDays}-day window for harvesting. Plan harvest operations within this period before weather changes.`;
  } else if (goodDays === 2) {
    window = '2 days';
    detail = 'Short 2-day harvest window available. Prioritize mature crops and schedule operations early morning.';
  } else if (goodDays === 1) {
    window = 'Today only';
    detail = 'Only today is suitable for harvesting. Weather deteriorates from tomorrow — act quickly on mature crops.';
  } else {
    window = 'Unfavourable';
    detail = 'No favourable harvest days in the coming week. Delay harvest if possible or use covered drying facilities.';
  }

  return { window, detail, goodDays };
}

// ─── Irrigation Tip ───────────────────────────────────────────────────────────
export function getIrrigationTip(weather) {
  const { temperature_2m: temp, relative_humidity_2m: humidity, weather_code: code, precipitation: precip } = weather.current;

  if ([61,63,65,80,81,82].includes(code)) {
    return {
      recommendation: 'Skip irrigation — rain expected',
      detail: `Current precipitation: ${precip ?? 0} mm. Rain is providing natural irrigation. Save water and skip today's cycle. Resume irrigation 24 hours after rain stops.`,
      type: 'skip',
    };
  }
  if (temp > 38) {
    return {
      recommendation: 'Early morning watering critical',
      detail: `Temperature is ${Math.round(temp)}°C — crops are under severe heat stress. Irrigate before 6 AM using drip or sprinkler to minimize evaporation losses. Apply mulch to conserve moisture.`,
      type: 'critical',
    };
  }
  if (humidity > 75) {
    return {
      recommendation: 'Reduce irrigation frequency',
      detail: `Humidity is ${humidity}% — soil moisture loss through evapotranspiration is reduced. Cut irrigation frequency by 30–40%. Over-watering in high humidity can trigger root rot.`,
      type: 'reduce',
    };
  }
  return {
    recommendation: 'Morning watering recommended',
    detail: `Conditions are normal (${Math.round(temp)}°C, ${humidity}% humidity). Water crops in early morning for best absorption. Maintain regular irrigation schedule based on crop stage.`,
    type: 'normal',
  };
}

// ─── Sidebar Disease Alerts ───────────────────────────────────────────────────
export function getDiseaseAlerts(weather) {
  const { temperature_2m: temp, relative_humidity_2m: humidity, weather_code: code } = weather.current;
  const alerts = [];
  if (humidity > 75 && temp > 20) alerts.push({ tag: 'Fungal Risk', severity: 'high', advice: 'High humidity with warm temperatures — apply preventive fungicide spray on susceptible crops' });
  if ([61,63,65].includes(code))  alerts.push({ tag: 'Blight Alert', severity: 'high', advice: 'Rain conditions favour late blight in potato and tomato — inspect and spray Mancozeb' });
  if (temp > 35)                   alerts.push({ tag: 'Heat Stress', severity: 'medium', advice: 'Crops may wilt under heat — irrigate early morning and apply mulch for soil moisture' });
  if (humidity > 80)               alerts.push({ tag: 'Downy Mildew', severity: 'medium', advice: 'Watch for yellowing on leaf undersides in cucurbits and grapes — improve ventilation' });
  if (temp < 15)                   alerts.push({ tag: 'Cold Stress', severity: 'low', advice: 'Growth may slow — delay fertilizer application until temperatures warm up' });
  alerts.push({ tag: 'Soil Moisture Check', severity: 'info', advice: 'Regular soil moisture monitoring ensures optimal irrigation timing' });
  alerts.push({ tag: 'Seasonal Sowing Window', severity: 'info', advice: 'Check region-specific crop calendar for upcoming sowing opportunities' });
  return alerts.slice(0, 6);
}

// ─── Day names ────────────────────────────────────────────────────────────────
export function getDayName(dateStr, index) {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  return new Date(dateStr).toLocaleDateString('en-IN', { weekday: 'short' });
}
