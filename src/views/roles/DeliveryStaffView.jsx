import React, { useState } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  CheckCheck,
  AlertTriangle,
  Sun,
  Moon,
  Navigation
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';

export const DeliveryStaffView = () => {
  const { deliveries, updateDeliveryStatus, showToast, currentUser } = useDairy();
  const [shiftFilter, setShiftFilter] = useState('Morning');

  const filteredDeliveries = deliveries.filter(d => d.shift === shiftFilter);
  const deliveredCount = filteredDeliveries.filter(d => d.status === 'Delivered').length;
  const pendingCount = filteredDeliveries.filter(d => d.status === 'Pending').length;

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-amber-600 to-amber-800 text-white rounded-2xl p-7 mb-7 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-amber-700 text-2xl font-extrabold flex items-center justify-center shadow-lg shrink-0">
            {currentUser?.avatar || 'SG'}
          </div>
          <div>
            <div className="text-xs opacity-90 uppercase tracking-wider font-semibold">
              Route Driver Delivery App
            </div>
            <h1 className="text-3xl font-extrabold text-white my-0.5 tracking-tight">
              {currentUser?.fullName || 'Santosh Gaikwad'}
            </h1>
            <div className="text-sm opacity-90">
              Assigned Route: <strong>{currentUser?.branch || 'Route #3 - Kothrud, Baner & Aundh'}</strong>
            </div>
          </div>
        </div>

        <div className="tab-pills bg-white/20 p-1 rounded-xl">
          <button
            className={`tab-pill-btn px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              shiftFilter === 'Morning' ? 'bg-white text-amber-800 shadow' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setShiftFilter('Morning')}
          >
            <Sun size={15} className="inline mr-1" /> Morning Shift
          </button>
          <button
            className={`tab-pill-btn px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
              shiftFilter === 'Evening' ? 'bg-white text-amber-800 shadow' : 'text-white hover:bg-white/10'
            }`}
            onClick={() => setShiftFilter('Evening')}
          >
            <Moon size={15} className="inline mr-1" /> Evening Shift
          </button>
        </div>
      </div>

      {/* Progress Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Total Assigned Deliveries</span>
              <span className="stat-value">{filteredDeliveries.length} Stops</span>
              <span className="stat-subtext text-muted">{shiftFilter} Schedule</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Truck size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Delivered Doorstep</span>
              <span className="stat-value text-success">{deliveredCount}</span>
              <span className="stat-subtext text-success">
                {filteredDeliveries.length > 0 ? Math.round((deliveredCount / filteredDeliveries.length) * 100) : 0}% Completed
              </span>
            </div>
            <div className="stat-icon-wrapper primary">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Remaining Stops</span>
              <span className="stat-value text-warning">{pendingCount}</span>
              <span className="stat-subtext text-warning">In route vehicle</span>
            </div>
            <div className="stat-icon-wrapper warning">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Route Stops List */}
      <div className="card-dairy">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <Navigation size={18} className="text-primary" />
            <span>Today's {shiftFilter} Route Delivery Checklist</span>
          </div>
        </div>

        <div className="card-dairy-body p-0">
          <div className="flex flex-col divide-y divide-slate-100">
            {filteredDeliveries.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                No deliveries scheduled for this shift.
              </div>
            ) : (
              filteredDeliveries.map((del, idx) => {
                const isDelivered = del.status === 'Delivered';
                return (
                  <div
                    key={del.id}
                    className={`p-5 flex flex-wrap items-center justify-between gap-4 transition ${
                      isDelivered ? 'bg-slate-50/60' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-8 h-8 rounded-full font-extrabold flex items-center justify-center text-xs shrink-0 ${
                        isDelivered ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{del.customerName}</h3>
                          <span className={`badge-dairy ${isDelivered ? 'success' : 'warning'}`}>
                            {del.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500 my-1">
                          <MapPin size={14} className="text-slate-400 shrink-0" />
                          <span>{del.address}</span>
                        </div>

                        <div className="text-xs font-bold text-emerald-700">
                          Package: {del.items}
                        </div>

                        {del.completedAt && (
                          <div className="text-xs text-emerald-600 mt-0.5">
                            Delivered at {del.completedAt}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <a
                        href={`tel:${del.phone}`}
                        className="btn-dairy btn-secondary-dairy text-xs"
                      >
                        <Phone size={14} /> Call Customer
                      </a>

                      {!isDelivered ? (
                        <button
                          className="btn-dairy btn-primary-dairy text-xs"
                          onClick={() => updateDeliveryStatus(del.id, 'Delivered')}
                        >
                          <CheckCheck size={16} /> Mark as Delivered
                        </button>
                      ) : (
                        <button
                          className="btn-dairy btn-secondary-dairy btn-sm-dairy text-xs"
                          onClick={() => updateDeliveryStatus(del.id, 'Pending')}
                        >
                          Undo
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
