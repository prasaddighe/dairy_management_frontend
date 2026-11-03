import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n, {
  SUPPORTED_LANGUAGES,
  getAppLanguage,
  setAppLanguage,
  preloadLanguage,
} from '../i18n';

const LanguageContext = createContext({
  language: 'english',
  setLanguage: setAppLanguage,
  t: (key, fallback) => (typeof fallback === 'string' ? fallback : key),
  supportedLanguages: SUPPORTED_LANGUAGES,
  currentLanguage: SUPPORTED_LANGUAGES[0],
});

function humanizeKey(key) {
  if (!key || typeof key !== 'string') return '';
  if (/\s/.test(key)) return key;
  return key
    .replace(/^([A-Za-z]+_)/, '')
    .split(/[_\s]+/)
    .filter(Boolean)
    .join(' ')
    .replace(/\b\w/g, (c) => c.toUpperCase()) || key;
}

export function LanguageProvider({ children }) {
  const { t: i18nT, i18n: i18nInstance } = useTranslation();

  const language = useMemo(() => {
    return getAppLanguage();
  }, [i18nInstance.language]);

  const setLanguage = useCallback((code) => {
    setAppLanguage(code);
  }, []);

  const t = useCallback(
    (key, fallback, options) => {
      if (!key) return typeof fallback === 'string' ? fallback : '';
      if (typeof key !== 'string') return String(key);

      let finalOptions = undefined;
      if (typeof fallback === 'string') {
        finalOptions = { defaultValue: fallback, ...options };
      } else if (fallback && typeof fallback === 'object') {
        finalOptions = fallback;
      } else if (options) {
        finalOptions = options;
      }

      const result = i18nT(key, finalOptions);

      if (result === key && !(finalOptions && 'defaultValue' in finalOptions)) {
        return humanizeKey(key);
      }
      return result;
    },
    [i18nT]
  );

  const currentLanguage = useMemo(() => {
    return (
      SUPPORTED_LANGUAGES.find((l) => l.code === language) ||
      SUPPORTED_LANGUAGES[0]
    );
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
      currentLanguage,
      preloadLanguage,
    }),
    [language, setLanguage, t, currentLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  return context;
}

export default LanguageContext;
