import React from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '../../utils/cn';

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria at this moment.',
  action,
  className = '',
}) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 py-12 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-center text-slate-400 mb-3">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
