import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, X, Check } from 'lucide-react';

/**
 * CustomDropdown Component
 * Ported & adapted directly from board.exchange StatusDropdown.tsx
 *
 * Features:
 * - Clean button trigger with customizable icon and chevron
 * - Rotating chevron on open
 * - 1-Click 'X' clear button when filtered / non-default value is selected
 * - Popover menu with active item checkmark & emerald background
 * - Upward auto-positioning when near bottom of viewport
 * - Click outside listener & keyboard accessibility
 *
 * @param {Array<string | { label: string, value: string, icon?: React.ReactNode }>} options
 * @param {string} value - Selected value
 * @param {Function} onChange - (value) => void
 * @param {string} placeholder - Display text when nothing or default is selected
 * @param {string} defaultValue - Value considered as 'cleared' (default: 'All')
 * @param {string} prefix - Optional label prefix (e.g. 'Village: ')
 * @param {React.ReactNode} icon - Optional icon to render inside trigger button
 * @param {boolean} clearable - Whether to show clear 'X' button (default: true)
 * @param {string} className - Container className
 * @param {string} buttonClassName - Button className
 * @param {string} menuClassName - Menu dropdown className
 */
export const CustomDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  defaultValue = 'All',
  prefix = '',
  icon,
  clearable = true,
  className = '',
  buttonClassName = '',
  menuClassName = '',
  id = 'custom-dropdown'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(false);
  const ref = useRef(null);

  // Normalize options to [{ label, value, icon }]
  const normalizedOptions = options.map((opt) => {
    if (typeof opt === 'string' || typeof opt === 'number') {
      return {
        label: prefix ? `${prefix}${opt}` : String(opt),
        value: String(opt)
      };
    }
    return {
      label: opt.label || String(opt.value),
      value: String(opt.value),
      icon: opt.icon
    };
  });

  const defaultVal = String(defaultValue);
  const isFiltered = clearable && value && String(value) !== defaultVal && String(value).toLowerCase() !== 'all';

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        closeDropdown();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isOpen && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 220);
    }
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (val) => {
    if (onChange) {
      onChange(val);
    }
    setIsOpen(false);
  };

  const handleClear = (e) => {
    e.stopPropagation();
    if (onChange) {
      onChange(defaultVal);
    }
    setIsOpen(false);
  };

  const selectedOption = normalizedOptions.find(
    (opt) => String(opt.value) === String(value)
  );

  const displayLabel = selectedOption
    ? selectedOption.label
    : (prefix ? `${prefix}${placeholder}` : placeholder);

  return (
    <div
      ref={ref}
      id={id}
      className={`relative inline-block ${isOpen ? 'z-[9999]' : 'z-10'} ${className}`}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={handleToggle}
        className={`flex items-center justify-between gap-2 px-3 h-9 bg-white border ${
          isOpen
            ? 'border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs'
            : isFiltered
            ? 'border-emerald-500/80 bg-emerald-50/20 text-slate-900 font-semibold shadow-2xs'
            : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/70 shadow-2xs'
        } rounded-lg text-xs font-medium transition-all outline-none cursor-pointer min-w-[135px] max-w-[260px] ${buttonClassName}`}
      >
        <div className="flex items-center gap-1.5 truncate">
          {icon && <span className="text-slate-400 shrink-0">{icon}</span>}
          <span className="truncate">{displayLabel}</span>
        </div>

        <div className="flex items-center shrink-0 ml-1">
          {isFiltered ? (
            <span
              onClick={handleClear}
              className="w-4 h-4 rounded-full bg-slate-200/80 hover:bg-rose-100 hover:text-rose-600 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
              title="Reset filter"
            >
              <X size={11} strokeWidth={2.5} />
            </span>
          ) : (
            <ChevronDown
              size={13}
              className={`text-slate-400 transition-transform duration-200 ${
                isOpen ? 'rotate-180 text-emerald-600' : ''
              }`}
            />
          )}
        </div>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } left-0 min-w-full w-max max-w-[280px] z-[99999] bg-white border border-slate-200 rounded-xl shadow-2xl py-1 max-h-[260px] overflow-y-auto animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          {normalizedOptions.map((opt) => {
            const isSelected = String(opt.value) === String(value);
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(opt.value);
                }}
                className={`w-full px-3 py-2 text-left text-xs transition-colors flex items-center justify-between gap-2 border-none cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-transparent text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                  <span className="truncate">{opt.label}</span>
                </div>
                {isSelected && (
                  <Check size={13} strokeWidth={3} className="shrink-0 text-white ml-2" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const StatusDropdown = CustomDropdown;
export default CustomDropdown;
