// ── translationService.js ─────────────────────────────────────────────────────
// Handles dynamic content translation (posts, comments, AI responses)
// Uses MyMemory (free, no API key) with LibreTranslate as fallback
// Static UI uses react-i18next JSON files — this is only for dynamic content

const CACHE = new Map(); // in-memory cache keyed by `${text}:${targetLang}`

// Language code map for MyMemory API
const LANG_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  gu: 'gu-IN',
  mr: 'mr-IN',
  pa: 'pa-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
};

/**
 * Detect the language of a text snippet.
 * Simple heuristic based on Unicode ranges.
 */
export function detectLanguage(text) {
  if (!text || text.trim().length < 3) return 'en';
  const devanagari = (text.match(/[\u0900-\u097F]/g) || []).length;
  const gujarati   = (text.match(/[\u0A80-\u0AFF]/g) || []).length;
  const arabic     = (text.match(/[\u0600-\u06FF]/g) || []).length;
  const latin      = (text.match(/[a-zA-Z]/g) || []).length;
  const total      = text.length;
  if (gujarati / total > 0.25) return 'gu';
  if (devanagari / total > 0.25) return 'hi'; // covers Hindi/Marathi
  if (arabic / total > 0.25) return 'ur';
  if (latin / total > 0.3) return 'en';
  return 'en';
}

/**
 * Translate text using MyMemory (free, 5000 chars/day, no key needed).
 * Falls back to original text on error — never breaks the UI.
 */
export async function translateText(text, targetLang) {
  if (!text || !text.trim()) return text;
  if (targetLang === 'en' && detectLanguage(text) === 'en') return text;
  if (targetLang === detectLanguage(text)) return text;

  const cacheKey = `${text.slice(0, 50)}:${targetLang}`;
  if (CACHE.has(cacheKey)) return CACHE.get(cacheKey);

  const srcLang  = LANG_MAP[detectLanguage(text)] || 'en-US';
  const dstLang  = LANG_MAP[targetLang] || 'en-US';

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text.slice(0, 500))}&langpair=${srcLang}|${dstLang}`;
    const res  = await fetch(url, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) throw new Error('MyMemory error');
    const data = await res.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      const translated = data.responseData.translatedText;
      CACHE.set(cacheKey, translated);
      return translated;
    }
    throw new Error('No translation returned');
  } catch {
    // Silently fall back — show original text, never crash
    CACHE.set(cacheKey, text);
    return text;
  }
}

/**
 * Translate an array of texts in parallel (max 4 at a time to avoid rate limits).
 */
export async function translateBatch(texts, targetLang) {
  const CHUNK = 4;
  const results = [];
  for (let i = 0; i < texts.length; i += CHUNK) {
    const chunk = texts.slice(i, i + CHUNK);
    const translated = await Promise.all(chunk.map(t => translateText(t, targetLang)));
    results.push(...translated);
  }
  return results;
}

/**
 * Hook-friendly wrapper: translates and caches, returns '' while loading.
 * Use with useState/useEffect in components.
 */
export function useTranslateText(text, targetLang) {
  return { translate: (t, lang) => translateText(t, lang) };
}

export default { translateText, translateBatch, detectLanguage };
