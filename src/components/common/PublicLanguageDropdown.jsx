import React, { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Globe } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { SUPPORTED_LANGUAGES, preloadLanguage } from '../../i18n';

export function PublicLanguageDropdown({ className = '' }) {
  const { t, language, setLanguage, currentLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const current = currentLanguage || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  return (
    <div ref={ref} className={`relative inline-block ${className || 'w-44'}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="w-full h-10 px-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm inline-flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm transition-all hover:border-emerald-400 dark:hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
      >
        <span className="inline-flex items-center gap-2 truncate">
          <Globe size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
          <span className="truncate">{current.nativeLabel}</span>
          <span className="text-xs text-gray-400">
            ({t(`lang_${current.label.toLowerCase()}`, current.label)})
          </span>
        </span>
        <ChevronDown
          size={15}
          className={`text-gray-400 shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-emerald-600' : ''
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 top-[calc(100%+6px)] w-full min-w-[190px] z-50 rounded-xl border border-gray-100 dark:border-gray-700/80 bg-white dark:bg-gray-800 shadow-xl py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
            {t('SelectLanguage', 'Select Language')}
          </div>
          {SUPPORTED_LANGUAGES.map((l) => {
            const active = l.code === language;
            return (
              <button
                key={l.code}
                role="option"
                aria-selected={active}
                type="button"
                onMouseEnter={() => preloadLanguage(l.code)}
                onFocus={() => preloadLanguage(l.code)}
                onClick={() => {
                  setLanguage(l.code);
                  setOpen(false);
                }}
                className={`w-full inline-flex items-center gap-2.5 px-3 py-2 text-sm text-left transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/30 ${
                  active
                    ? 'text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50/70 dark:bg-emerald-950/20'
                    : 'text-gray-700 dark:text-gray-200'
                }`}
              >
                <span className="w-4 inline-flex justify-center shrink-0 text-emerald-600 dark:text-emerald-400">
                  {active ? <Check size={14} className="stroke-[2.5]" /> : null}
                </span>
                <span className="flex-1 truncate">{l.nativeLabel}</span>
                <span className="text-xs text-gray-400 shrink-0">
                  {t(`lang_${l.label.toLowerCase()}`, l.label)}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default PublicLanguageDropdown;
