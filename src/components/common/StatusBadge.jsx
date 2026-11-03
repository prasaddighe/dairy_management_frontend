import React from 'react';
import { cn } from '../../utils/cn';

export const STATUS_TONE_CLASSES = {
  success: { badge: 'bg-emerald-100 text-emerald-800', dot: 'bg-emerald-500' },
  danger:  { badge: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  warning: { badge: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  info:    { badge: 'bg-sky-100 text-sky-800', dot: 'bg-sky-500' },
  neutral: { badge: 'bg-slate-100 text-slate-700', dot: 'bg-slate-400' },
};

// Kept for backward compatibility if imported elsewhere
export const STATUS_TONES = {
  success: { bg: '#dcfce7', text: '#166534', dot: '#22c55e' },
  danger:  { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444' },
  warning: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b' },
  info:    { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6' },
  neutral: { bg: '#f1f5f9', text: '#475569', dot: '#94a3b8' },
};

export function getStatusTone(status) {
  if (!status) return 'neutral';
  const lower = String(status).toLowerCase().trim();
  if (['active', 'paid', 'approved', 'delivered', 'completed', 'success', 'on duty'].includes(lower)) {
    return 'success';
  }
  if (['rejected', 'cancelled', 'inactive', 'overdue', 'failed', 'due'].includes(lower)) {
    return 'danger';
  }
  if (['pending', 'in progress', 'waiting', 'partial', 'partially paid'].includes(lower)) {
    return 'warning';
  }
  if (['new', 'draft', 'morning', 'evening'].includes(lower)) {
    return 'info';
  }
  return 'neutral';
}

export const StatusBadge = ({
  status,
  tone,
  label,
  showDot = true,
  className = '',
}) => {
  const resolvedTone = tone || getStatusTone(status);
  const classes = STATUS_TONE_CLASSES[resolvedTone] || STATUS_TONE_CLASSES.neutral;
  const displayLabel = label || status || '-';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap capitalize tracking-wide',
        classes.badge,
        className
      )}
    >
      {showDot && (
        <span
          className={cn('h-1.5 w-1.5 rounded-full shrink-0', classes.dot)}
        />
      )}
      {displayLabel}
    </span>
  );
};

export default StatusBadge;
