import React, { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, Check, Info, X } from 'lucide-react';
import { useToast } from '../../hooks/useToast';

const TOAST_STYLES = {
  success: 'bg-[#107c41] text-white border-transparent shadow-emerald-900/20',
  error:   'bg-[#dc2626] text-white border-[#b91c1c] shadow-red-900/20',
  info:    'bg-blue-600 text-white border-transparent shadow-blue-900/20',
  warning: 'bg-amber-600 text-white border-transparent shadow-amber-900/20',
};

const ICONS = {
  success: (
    <div
      className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-white text-[#107c41]"
    >
      <Check size={14} strokeWidth={3} className="text-[#107c41]" />
    </div>
  ),
  error:   <AlertCircle size={20} className="shrink-0 text-white" />,
  info:    <Info size={20} className="shrink-0 text-white" />,
  warning: <AlertTriangle size={20} className="shrink-0 text-white" />,
};

function ToastItem({ toast, onClose }) {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (isHovered) return;
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 4500);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onClose, isHovered]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm shadow-xl transition-all duration-300 transform translate-y-0 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 ${TOAST_STYLES[toast.type] || TOAST_STYLES.info}`}
      role="alert"
    >
      {ICONS[toast.type] || ICONS.info}
      <span className="flex-1 font-medium leading-tight">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        aria-label="Close"
        className="opacity-80 hover:opacity-100 transition-opacity bg-transparent border-none cursor-pointer p-1 flex items-center justify-center text-white"
      >
        <X size={17} />
      </button>
    </div>
  );
}

export function ToastContainer({ toasts, onClose }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[999999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  );
}

/**
 * Global Toast component rendered in App.
 * Uses useToast() to automatically listen to app:toast events.
 */
export const Toast = () => {
  const { toasts, closeToast } = useToast();
  return <ToastContainer toasts={toasts} onClose={closeToast} />;
};
