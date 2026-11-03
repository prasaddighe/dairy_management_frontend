import React from 'react';
import { cn } from '../../utils/cn';

export const KPICard = ({
  title,
  value,
  subtext,
  icon: Icon,
  trend,
  trendPositive,
  color = 'primary',
  className = '',
}) => {
  const colorMap = {
    primary: 'text-primary bg-primary-light border-primary/20',
    gold:    'text-amber-600 bg-amber-50 border-amber-200',
    blue:    'text-blue-600 bg-blue-50 border-blue-200',
    emerald: 'text-emerald-700 bg-emerald-50 border-emerald-200',
    danger:  'text-red-600 bg-red-50 border-red-200'
  };

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between gap-3',
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border', colorMap[color] || colorMap.primary)}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div>
        <div className="text-2xl font-extrabold text-slate-900 tracking-tight font-outfit">
          {value}
        </div>
        {(subtext || trend) && (
          <div className="flex items-center gap-1.5 mt-1 text-xs">
            {trend && (
              <span
                className={cn(
                  'font-bold',
                  trendPositive ? 'text-emerald-600' : 'text-red-500'
                )}
              >
                {trend}
              </span>
            )}
            {subtext && <span className="text-slate-500">{subtext}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPICard;
