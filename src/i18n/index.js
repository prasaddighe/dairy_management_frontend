import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enLocale from './locales/en.json';
import mrLocale from './locales/mr.json';
import hiLocale from './locales/hi.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'english', file: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'marathi', file: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
  { code: 'hindi', file: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
];

export const LANGUAGE_STORAGE_KEY = 'app_language';
const DEFAULT_LANGUAGE = 'english';

const resources = {
  english: { translation: enLocale },
  en: { translation: enLocale },
  marathi: { translation: mrLocale },
  mr: { translation: mrLocale },
  hindi: { translation: hiLocale },
  hi: { translation: hiLocale },
};

function normalizeLanguage(code) {
  if (!code) return DEFAULT_LANGUAGE;
  const match = SUPPORTED_LANGUAGES.find(
    (l) => l.code === code || l.file === code || l.label.toLowerCase() === String(code).toLowerCase()
  );
  return match ? match.code : DEFAULT_LANGUAGE;
}

function getInitialLanguage() {
  try {
    const params = new URLSearchParams(window.location.search);
    const urlLng = params.get('lng') || params.get('lang');
    if (urlLng) {
      const normalized = normalizeLanguage(urlLng);
      localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
      return normalized;
    }
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved) return normalizeLanguage(saved);
  } catch {}
  return DEFAULT_LANGUAGE;
}

const initialLanguage = getInitialLanguage();

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  supportedLngs: ['english', 'marathi', 'hindi', 'en', 'mr', 'hi'],
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  returnNull: false,
  returnEmptyString: false,
  react: { useSuspense: false },
});

export function preloadLanguage(_code) {
  return Promise.resolve();
}

export function setAppLanguage(code) {
  const normalized = normalizeLanguage(code);
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, normalized);
  } catch {}
  i18n.changeLanguage(normalized);
  syncDocumentLanguage(normalized);
}

export function getAppLanguage() {
  return normalizeLanguage(i18n.language);
}

function syncDocumentLanguage(code) {
  if (typeof document === 'undefined') return;
  const match = SUPPORTED_LANGUAGES.find((l) => l.code === code);
  document.documentElement.lang = match ? match.file : 'en';
  document.documentElement.dir = 'ltr';
}

syncDocumentLanguage(initialLanguage);
i18n.on('languageChanged', (lng) => syncDocumentLanguage(normalizeLanguage(lng)));

export default i18n;
