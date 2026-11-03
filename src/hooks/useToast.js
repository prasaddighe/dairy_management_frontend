import { useCallback, useEffect, useState } from 'react';

let toastId = 0;

/**
 * Dispatch a toast notification globally across the application.
 */
export function dispatchToast(message, type = 'info', duration) {
  const normalizedMessage = (message || '')?.trim?.();
  if (!normalizedMessage) return;
  window?.dispatchEvent?.(
    new CustomEvent('app:toast', {
      detail: { message: normalizedMessage, type, duration },
    })
  );
}

export function dispatchToastSuccess(message, duration) {
  dispatchToast(message, 'success', duration);
}

export function dispatchToastError(message, duration) {
  dispatchToast(message, 'error', duration);
}

export function dispatchToastWarning(message, duration) {
  dispatchToast(message, 'warning', duration);
}

export function clearAllToasts() {
  window?.dispatchEvent?.(new CustomEvent('app:toast:clear'));
}

/**
 * Toast hook for components
 */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration) => {
    const normalizedMessage = (message || '')?.trim?.();
    if (!normalizedMessage) return '';

    const id = `toast-${++toastId}`;
    const toastDuration = duration ?? 4200;
    const newToast = { id, message: normalizedMessage, type, duration: toastDuration };

    setToasts((prev) => {
      const lastToast = prev?.[prev?.length - 1];
      if (lastToast && lastToast?.message === newToast?.message && lastToast?.type === newToast?.type) {
        return prev;
      }
      return [...prev.slice(-2), newToast]; // Keep at most 3 active toasts
    });

    return id;
  }, []);

  useEffect(() => {
    const handleToastEvent = (e) => {
      const detail = e?.detail;
      if (detail?.message) {
        showToast(detail?.message, detail?.type || 'info', detail?.duration);
      }
    };
    const handleClearEvent = () => {
      setToasts([]);
    };

    window?.addEventListener?.('app:toast', handleToastEvent);
    window?.addEventListener?.('app:toast:clear', handleClearEvent);
    return () => {
      window?.removeEventListener?.('app:toast', handleToastEvent);
      window?.removeEventListener?.('app:toast:clear', handleClearEvent);
    };
  }, [showToast]);

  const closeToast = useCallback((id) => {
    setToasts((prev) => prev?.filter?.((t) => t?.id !== id) || []);
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const success = useCallback((message, duration) => {
    return showToast(message, 'success', duration);
  }, [showToast]);

  const error = useCallback((message, duration) => {
    return showToast(message, 'error', duration);
  }, [showToast]);

  const info = useCallback((message, duration) => {
    return showToast(message, 'info', duration);
  }, [showToast]);

  const warning = useCallback((message, duration) => {
    return showToast(message, 'warning', duration);
  }, [showToast]);

  return {
    toasts,
    showToast,
    closeToast,
    clearToasts,
    success,
    error,
    info,
    warning,
  };
}
