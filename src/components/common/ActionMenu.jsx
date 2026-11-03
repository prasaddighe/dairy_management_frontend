import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MoreVertical } from 'lucide-react';

export const ActionMenu = ({
  items = [],
  align = 'right',
  isNearBottom: forcedNearBottom = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  isOpen: controlledOpen,
  onOpenChange,
  preventCloseOnOutsideClick = false
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const [openUpward, setOpenUpward] = useState(forcedNearBottom);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;
  const ref = useRef(null);

  const setOpen = useCallback((newVal) => {
    if (!isControlled) {
      setInternalOpen(newVal);
    }
    if (onOpenChange) {
      onOpenChange(typeof newVal === 'function' ? newVal(open) : newVal);
    }
  }, [isControlled, onOpenChange, open]);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!open && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(forcedNearBottom || spaceBelow < 220);
    }
    setOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (preventCloseOnOutsideClick) return;
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, preventCloseOnOutsideClick, setOpen]);

  if (!items || items.length === 0) return null;

  return (
    <div
      ref={ref}
      onClick={(e) => e.stopPropagation()}
      className={`relative inline-block ${open ? 'z-[9999]' : 'z-10'} ${className}`}
    >
      <button
        type="button"
        aria-label="Actions"
        title="More actions"
        onClick={handleToggle}
        className={`w-8 h-8 rounded-lg border border-slate-200/90 bg-white text-slate-500 hover:text-slate-900 hover:border-emerald-500 hover:bg-slate-50 transition-all cursor-pointer flex items-center justify-center shadow-2xs focus:outline-none ${
          open ? 'text-slate-900 border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500/20' : ''
        } ${triggerClassName}`}
      >
        <MoreVertical size={16} />
      </button>

      {open && (
        <div
          className={`absolute ${align === 'left' ? 'left-0' : 'right-0'} ${
            openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-[99999] min-w-[170px] w-max max-w-[240px] bg-white border border-slate-200 rounded-xl shadow-2xl py-1.5 flex flex-col gap-0.5 text-left animate-in fade-in zoom-in-95 duration-100 ${menuClassName}`}
        >
          {items.map((item, idx) => {
            if (!item) return null;
            if (item.divider) {
              return <div key={`div-${idx}`} className="h-px bg-slate-100 my-1 mx-2" />;
            }
            return (
              <button
                key={idx}
                type="button"
                disabled={item.disabled}
                onClick={(e) => {
                  e.stopPropagation();
                  if (item.disabled) return;
                  if (!item.keepOpenOnClick) {
                    setOpen(false);
                  }
                  if (item.onClick) {
                    item.onClick(e);
                  }
                }}
                className={`w-full text-left px-3 py-2 text-xs border-none bg-transparent flex items-center gap-2.5 transition-colors font-semibold ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'cursor-pointer'
                } ${
                  item.danger
                    ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
                    : 'text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                }`}
              >
                {item.icon && (
                  <span className={`shrink-0 ${item.danger ? 'text-rose-500' : 'text-slate-400 group-hover:text-emerald-600'}`}>
                    {item.icon}
                  </span>
                )}
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActionMenu;
