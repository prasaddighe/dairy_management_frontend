import React from 'react';
import { CheckCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useDairy } from '../context/DairyContext';

export const NotificationsView = () => {
  const { notifications, markNotificationRead, clearAllNotifications } = useDairy();

  const getIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={20} className="text-amber-500" />;
      case 'success': return <CheckCircle size={20} className="text-emerald-600" />;
      default: return <Info size={20} className="text-sky-600" />;
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">System Notifications & Alerts</h1>
          <p className="text-sm text-slate-500">
            Real-time automated alerts for milk intake thresholds, inventory shortages, and payouts.
          </p>
        </div>

        <button className="btn-dairy btn-secondary-dairy flex items-center gap-2 cursor-pointer" onClick={clearAllNotifications}>
          <CheckCheck size={16} /> Mark All as Read
        </button>
      </div>

      <div className="card-dairy">
        <div className="card-dairy-body p-0">
          <div className="flex flex-col divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-sm">
                No notifications right now. Everything is running smoothly!
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`flex items-start gap-4 p-5 cursor-pointer transition ${
                    notif.read ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/70 hover:bg-slate-100'
                  }`}
                >
                  <div className="shrink-0 mt-0.5">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-0.5">
                      <div className="font-bold text-sm text-slate-900">
                        {notif.title}
                      </div>
                      <span className="text-xs text-slate-400">{notif.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 m-0 leading-relaxed">
                      {notif.message}
                    </p>
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-2" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
