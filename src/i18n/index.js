import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import en from './locales/en.json';
import hi from './locales/hi.json';
import gu from './locales/gu.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English',  nativeLabel: 'English',  flag: 'EN' },
  { code: 'hi', label: 'Hindi',    nativeLabel: 'हिन्दी',    flag: 'HI' },
  { code: 'gu', label: 'Gujarati', nativeLabel: 'ગુજરાતી', flag: 'GU' },
  // Future — add JSON files and uncomment:
  // { code: 'mr', label: 'Marathi',  nativeLabel: 'मराठी',    flag: '🇮🇳' },
  // { code: 'pa', label: 'Punjabi',  nativeLabel: 'ਪੰਜਾਬੀ',  flag: '🇮🇳' },
  // { code: 'ta', label: 'Tamil',    nativeLabel: 'தமிழ்',   flag: '🇮🇳' },
  // { code: 'te', label: 'Telugu',   nativeLabel: 'తెలుగు',  flag: '🇮🇳' },
  // { code: 'bn', label: 'Bengali',  nativeLabel: 'বাংলা',   flag: '🇮🇳' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      gu: { translation: gu },
    },
    fallbackLng: 'en',
    lng: localStorage.getItem('agri_lang') || 'en',
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'agri_lang',
      cacheUserLanguage: true,
    },
  });

// Persist language change to localStorage
i18n.on('languageChanged', (lang) => {
  localStorage.setItem('agri_lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir = 'ltr'; // all supported languages are LTR
});

export default i18n;
