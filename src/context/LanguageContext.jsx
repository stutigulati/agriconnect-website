/**
 * LanguageContext.jsx
 * Static multilingual system — no external API, no flashing, no blank screens.
 * Reads from JSON files at build time. Language stored in localStorage.
 */
import { createContext, useContext, useState, useCallback } from 'react';
import en from '../i18n/locales/en.json';
import hi from '../i18n/locales/hi.json';
import gu from '../i18n/locales/gu.json';

// ─── All translations bundled at build time ────────────────────────────────────
const TRANSLATIONS = { en, hi, gu };

export const LANGUAGES = [
  { code: 'en', label: 'English',  nativeLabel: 'English',  abbr: 'EN' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिन्दी',    abbr: 'HI' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', abbr: 'GU' },
];

// ─── Read from localStorage, fall back to 'en' ────────────────────────────────
function getInitialLang() {
  try {
    const stored = localStorage.getItem('agri_lang');
    if (stored && TRANSLATIONS[stored]) return stored;
  } catch {}
  return 'en';
}

// ─── Deep-get a nested key like 'nav.home' or 'trust.testimonials.0.quote' ───
function getNestedValue(obj, keyPath) {
  if (!obj || !keyPath) return null;
  const parts = keyPath.split('.');
  let current = obj;
  for (const part of parts) {
    if (current == null) return null;
    if (Array.isArray(current)) {
      const idx = parseInt(part, 10);
      if (isNaN(idx)) return null;
      current = current[idx];
    } else if (typeof current === 'object') {
      current = current[part];
    } else {
      return null;
    }
  }
  return typeof current === 'string' ? current : null;
}

// ─── Context ──────────────────────────────────────────────────────────────────
export const LanguageContext = createContext({
  lang: 'en',
  t: (key) => key,
  setLang: () => {},
  currentLang: LANGUAGES[0],
});

// ─── Provider — wrap App with this ───────────────────────────────────────────
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang);

  const setLang = useCallback((code) => {
    if (!TRANSLATIONS[code]) return;
    try { localStorage.setItem('agri_lang', code); } catch {}
    setLangState(code);
  }, []);

  // t('nav.home') → looks up in current language, falls back to EN, then key itself
  const t = useCallback((key) => {
    if (!key || typeof key !== 'string') return '';
    const val =
      getNestedValue(TRANSLATIONS[lang], key) ||
      getNestedValue(TRANSLATIONS['en'], key) ||
      key;
    return val;
  }, [lang]);

  const currentLang = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

  return (
    <LanguageContext.Provider value={{ lang, t, setLang, currentLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLanguage() {
  return useContext(LanguageContext);
}
