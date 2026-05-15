/**
 * marketApi.js — AgriConnect Market Price Service
 *
 * Currently uses local dummy data.
 * Architecture ready for:
 *   - Agmarknet API  (https://agmarknet.gov.in/)
 *   - eNAM API       (https://enam.gov.in/web/)
 *
 * To switch to live data, replace the `fetchPrices` function with
 * real HTTP calls and adjust the data-normalisation helpers below.
 */

// ─── Dummy dataset ────────────────────────────────────────────────────────────
export const MANDI_DATA = [
  // ── Grains ─────────────────────────────────────────────────────────────────
  { id: 1,  crop: 'Wheat',      hindi: 'गेहूं',     category: 'Grain',     price: 2180, change: +45,  mandi: 'Bhopal',      state: 'Madhya Pradesh', trend: 'up'   },
  { id: 2,  crop: 'Rice',       hindi: 'चावल',      category: 'Grain',     price: 3250, change: -60,  mandi: 'Amritsar',    state: 'Punjab',         trend: 'down' },
  { id: 3,  crop: 'Maize',      hindi: 'मक्का',     category: 'Grain',     price: 1890, change: +30,  mandi: 'Indore',      state: 'Madhya Pradesh', trend: 'up'   },
  { id: 4,  crop: 'Sorghum',    hindi: 'ज्वार',     category: 'Grain',     price: 2900, change: +15,  mandi: 'Nagpur',      state: 'Maharashtra',    trend: 'up'   },
  { id: 5,  crop: 'Barley',     hindi: 'जौ',        category: 'Grain',     price: 1750, change: -20,  mandi: 'Jaipur',      state: 'Rajasthan',      trend: 'down' },
  { id: 6,  crop: 'Bajra',      hindi: 'बाजरा',     category: 'Grain',     price: 2050, change: +55,  mandi: 'Jodhpur',     state: 'Rajasthan',      trend: 'up'   },

  // ── Pulses ──────────────────────────────────────────────────────────────────
  { id: 7,  crop: 'Soybean',    hindi: 'सोयाबीन',   category: 'Pulse',     price: 4200, change: +120, mandi: 'Ujjain',      state: 'Madhya Pradesh', trend: 'up'   },
  { id: 8,  crop: 'Chickpea',   hindi: 'चना',       category: 'Pulse',     price: 5600, change: -75,  mandi: 'Kota',        state: 'Rajasthan',      trend: 'down' },
  { id: 9,  crop: 'Lentil',     hindi: 'मसूर',      category: 'Pulse',     price: 6400, change: +90,  mandi: 'Sagar',       state: 'Madhya Pradesh', trend: 'up'   },
  { id: 10, crop: 'Pigeon Pea', hindi: 'अरहर',      category: 'Pulse',     price: 7200, change: +200, mandi: 'Akola',       state: 'Maharashtra',    trend: 'up'   },
  { id: 11, crop: 'Black Gram', hindi: 'उड़द',       category: 'Pulse',     price: 7800, change: -130, mandi: 'Gwalior',     state: 'Madhya Pradesh', trend: 'down' },
  { id: 12, crop: 'Green Gram', hindi: 'मूंग',      category: 'Pulse',     price: 8100, change: +160, mandi: 'Ludhiana',    state: 'Punjab',         trend: 'up'   },

  // ── Vegetables ──────────────────────────────────────────────────────────────
  { id: 13, crop: 'Tomato',     hindi: 'टमाटर',     category: 'Vegetable', price: 1800, change: -250, mandi: 'Nasik',       state: 'Maharashtra',    trend: 'down' },
  { id: 14, crop: 'Potato',     hindi: 'आलू',        category: 'Vegetable', price: 1200, change: +80,  mandi: 'Agra',        state: 'Uttar Pradesh',  trend: 'up'   },
  { id: 15, crop: 'Onion',      hindi: 'प्याज',     category: 'Vegetable', price: 2200, change: +340, mandi: 'Lasalgaon',   state: 'Maharashtra',    trend: 'up'   },
  { id: 16, crop: 'Cauliflower',hindi: 'फूलगोभी',   category: 'Vegetable', price: 900,  change: -100, mandi: 'Lucknow',     state: 'Uttar Pradesh',  trend: 'down' },
  { id: 17, crop: 'Cabbage',    hindi: 'पत्तागोभी', category: 'Vegetable', price: 750,  change: +60,  mandi: 'Raipur',      state: 'Chhattisgarh',   trend: 'up'   },
  { id: 18, crop: 'Garlic',     hindi: 'लहसुन',     category: 'Vegetable', price: 12000,change: +800, mandi: 'Mandsaur',    state: 'Madhya Pradesh', trend: 'up'   },
  { id: 19, crop: 'Ginger',     hindi: 'अदरक',      category: 'Vegetable', price: 8500, change: -400, mandi: 'Surat',       state: 'Gujarat',        trend: 'down' },
  { id: 20, crop: 'Capsicum',   hindi: 'शिमला मिर्च',category: 'Vegetable', price: 3200, change: +150, mandi: 'Pune',        state: 'Maharashtra',    trend: 'up'   },

  // ── Fruits ──────────────────────────────────────────────────────────────────
  { id: 21, crop: 'Mango',      hindi: 'आम',         category: 'Fruit',     price: 5500, change: +300, mandi: 'Ratnagiri',   state: 'Maharashtra',    trend: 'up'   },
  { id: 22, crop: 'Banana',     hindi: 'केला',       category: 'Fruit',     price: 1600, change: -90,  mandi: 'Anand',       state: 'Gujarat',        trend: 'down' },
  { id: 23, crop: 'Grapes',     hindi: 'अंगूर',     category: 'Fruit',     price: 6800, change: +420, mandi: 'Sangli',      state: 'Maharashtra',    trend: 'up'   },
  { id: 24, crop: 'Pomegranate',hindi: 'अनार',       category: 'Fruit',     price: 9200, change: -200, mandi: 'Solapur',     state: 'Maharashtra',    trend: 'down' },
  { id: 25, crop: 'Papaya',     hindi: 'पपीता',     category: 'Fruit',     price: 1400, change: +70,  mandi: 'Vadodara',    state: 'Gujarat',        trend: 'up'   },
  { id: 26, crop: 'Watermelon', hindi: 'तरबूज',     category: 'Fruit',     price: 800,  change: -50,  mandi: 'Bilaspur',    state: 'Chhattisgarh',   trend: 'down' },

  // ── Cash Crops ──────────────────────────────────────────────────────────────
  { id: 27, crop: 'Cotton',     hindi: 'कपास',       category: 'Cash Crop', price: 6800, change: +180, mandi: 'Rajkot',      state: 'Gujarat',        trend: 'up'   },
  { id: 28, crop: 'Mustard',    hindi: 'सरसों',      category: 'Cash Crop', price: 5100, change: +95,  mandi: 'Alwar',       state: 'Rajasthan',      trend: 'up'   },
  { id: 29, crop: 'Sugarcane',  hindi: 'गन्ना',     category: 'Cash Crop', price: 330,  change: +10,  mandi: 'Meerut',      state: 'Uttar Pradesh',  trend: 'up'   },
  { id: 30, crop: 'Turmeric',   hindi: 'हल्दी',     category: 'Cash Crop', price: 14500,change: +650, mandi: 'Erode',       state: 'Maharashtra',    trend: 'up'   },
  { id: 31, crop: 'Groundnut',  hindi: 'मूंगफली',   category: 'Cash Crop', price: 5800, change: -120, mandi: 'Junagadh',    state: 'Gujarat',        trend: 'down' },
  { id: 32, crop: 'Sunflower',  hindi: 'सूरजमुखी',  category: 'Cash Crop', price: 5200, change: +75,  mandi: 'Dharwad',     state: 'Maharashtra',    trend: 'up'   },
  { id: 33, crop: 'Sesame',     hindi: 'तिल',        category: 'Cash Crop', price: 11200,change: +400, mandi: 'Bhavnagar',   state: 'Gujarat',        trend: 'up'   },
  { id: 34, crop: 'Linseed',    hindi: 'अलसी',      category: 'Cash Crop', price: 6100, change: -80,  mandi: 'Jabalpur',    state: 'Madhya Pradesh', trend: 'down' },
];

// ─── Derived Analytics ────────────────────────────────────────────────────────
export function getAnalytics(data = MANDI_DATA) {
  const sorted = [...data].sort((a, b) => b.change - a.change);
  const highestRising = sorted[0];
  const biggestDrop   = sorted[sorted.length - 1];

  // Most active mandi = mandi appearing most often
  const mandiCount = {};
  data.forEach(d => { mandiCount[d.mandi] = (mandiCount[d.mandi] || 0) + 1; });
  const mostActiveMandi = Object.entries(mandiCount).sort((a, b) => b[1] - a[1])[0][0];

  // State-wise average price
  const stateMap = {};
  data.forEach(d => {
    if (!stateMap[d.state]) stateMap[d.state] = [];
    stateMap[d.state].push(d.price);
  });
  const stateAvg = Object.entries(stateMap).map(([state, prices]) => ({
    state,
    avg: Math.round(prices.reduce((s, p) => s + p, 0) / prices.length),
  })).sort((a, b) => b.avg - a.avg);

  return { highestRising, biggestDrop, mostActiveMandi, stateAvg };
}

// 7-day historical trend for a given crop (synthesised)
export function getPriceTrend(cropName) {
  const crop = MANDI_DATA.find(d => d.crop === cropName);
  if (!crop) return [];
  const base = crop.price;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day, i) => ({
    day,
    price: Math.round(base + (Math.sin(i) * base * 0.04) + (Math.random() - 0.5) * base * 0.03),
  }));
}

// ─── API-ready stubs (replace bodies for live integration) ────────────────────
const API_BASE = import.meta.env.VITE_AGMARKNET_URL || '';

export async function fetchPrices({ state, category, mandi } = {}) {
  if (API_BASE) {
    // Live Agmarknet / eNAM integration goes here
    const params = new URLSearchParams({ state, category, mandi }).toString();
    const res = await fetch(`${API_BASE}/prices?${params}`);
    if (!res.ok) throw new Error('Failed to fetch market prices');
    return res.json();
  }
  // Fallback: local dummy data with optional filtering
  let result = [...MANDI_DATA];
  if (state)    result = result.filter(d => d.state === state);
  if (category) result = result.filter(d => d.category === category);
  if (mandi)    result = result.filter(d => d.mandi === mandi);
  return result;
}

export const ALL_STATES     = [...new Set(MANDI_DATA.map(d => d.state))].sort();
export const ALL_CATEGORIES = [...new Set(MANDI_DATA.map(d => d.category))].sort();
export const ALL_MANDIS     = [...new Set(MANDI_DATA.map(d => d.mandi))].sort();
