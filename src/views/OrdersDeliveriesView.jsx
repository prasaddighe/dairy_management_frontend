import React, { useState } from 'react';
import {
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Plus
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const OrdersDeliveriesView = () => {
  const { deliveries, updateDeliveryStatus, showToast } = useDairy();

  const [shiftFilter, setShiftFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New Order / Delivery Form
  const [formData, setFormData] = useState({
    customerName: '',
    phone: '',
    address: '',
    items: '2L Cow Milk (A2)',
    shift: 'Morning',
    timeSlot: '06:30 - 07:30 AM',
    staffName: 'Santosh Gaikwad'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.customerName || !formData.address) {
      showToast('Please fill customer name and address', 'warning');
      return;
    }
    // We can add to deliveries
    const newDel = {
      ...formData,
      id: `DEL-${Date.now().toString().slice(-3)}`,
      customerId: `CUST-WALK`,
      status: 'Pending',
      completedAt: null
    };
    deliveries.unshift(newDel);
    showToast(`Delivery #${newDel.id} scheduled for ${newDel.customerName}`, 'success');
    setIsAddModalOpen(false);
  };

  const filteredDeliveries = deliveries.filter(d => {
    const matchesShift = shiftFilter === 'All' || d.shift === shiftFilter;
    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesShift && matchesStatus;
  });

  const deliveredCount = deliveries.filter(d => d.status === 'Delivered').length;
  const pendingCount = deliveries.filter(d => d.status === 'Pending').length;

  return (
    <div>
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Orders & Delivery Logistics</h1>
          <p className="text-sm text-slate-500">
            Daily milk morning & evening dispatch routes, customer doorstep drops, and live driver tracking.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} /> Schedule Delivery
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Total Route Deliveries</span>
              <span className="stat-value">{deliveries.length}</span>
              <span className="stat-subtext text-muted">Across Pune City Suburbs</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Truck size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Successfully Delivered</span>
              <span className="stat-value text-success">{deliveredCount}</span>
              <span className="stat-subtext text-success">
                {Math.round((deliveredCount / deliveries.length) * 100)}% route completed
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
              <span className="stat-label">Pending In-Transit</span>
              <span className="stat-value text-warning">{pendingCount}</span>
              <span className="stat-subtext text-warning">
                Awaiting driver confirmation
              </span>
            </div>
            <div className="stat-icon-wrapper warning">
              <Clock size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-body p-3.5 sm:p-5">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2 flex-wrap items-center">
              <div className="tab-pills">
                <button
                  className={`tab-pill-btn ${shiftFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('All')}
                >
                  All Shifts
                </button>
                <button
                  className={`tab-pill-btn ${shiftFilter === 'Morning' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('Morning')}
                >
                  Morning Route
                </button>
                <button
                  className={`tab-pill-btn ${shiftFilter === 'Evening' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('Evening')}
                >
                  Evening Route
                </button>
              </div>

              <select
                className="form-control-dairy w-auto text-xs"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Delivery Statuses</option>
                <option value="Pending">Pending / In Transit</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <span className="text-xs text-slate-500 font-semibold">
              Showing {filteredDeliveries.length} Route Stops
            </span>
          </div>
        </div>
      </div>

      {/* Deliveries Grid */}
      <div className="row g-3">
        {filteredDeliveries.map(del => {
          const isDelivered = del.status === 'Delivered';
          return (
            <div key={del.id} className="col-12 col-md-6 col-xl-4">
              <div className={`card-dairy h-100 border-l-4 ${isDelivered ? 'border-l-emerald-500' : 'border-l-amber-500'}`}>
                <div className="card-dairy-body">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-mono font-bold text-emerald-700 text-xs">
                      #{del.id}
                    </span>
                    <span className={`badge-dairy ${isDelivered ? 'success' : 'warning'}`}>
                      {del.status}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-800 mb-1">
                    {del.customerName}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                    <Phone size={13} className="text-slate-400" />
                    <span>{del.phone}</span>
                  </div>

                  <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-3 min-h-[38px]">
                    <MapPin size={14} className="text-slate-400 shrink-0 mt-0.5" />
                    <span>{del.address}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-50 mb-3 text-xs border border-slate-100">
                    <div className="flex justify-between">
                      <span className="font-semibold text-slate-600">Package:</span>
                      <strong className="text-emerald-700">{del.items}</strong>
                    </div>
                    <div className="flex justify-between mt-0.5 text-slate-500">
                      <span>Slot:</span>
                      <span>{del.timeSlot} ({del.shift})</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center border-t border-slate-100 pt-2.5">
                    <div className="text-xs text-slate-500">
                      <div>Executive: <strong className="text-slate-700">{del.staffName}</strong></div>
                      {del.completedAt && (
                        <div className="text-emerald-600 font-medium">Delivered at {del.completedAt}</div>
                      )}
                    </div>

                    <div className="flex gap-1.5">
                      {!isDelivered ? (
                        <button
                          className="btn-dairy btn-primary-dairy btn-sm-dairy"
                          onClick={() => updateDeliveryStatus(del.id, 'Delivered')}
                        >
                          <CheckCircle size={14} /> Mark Done
                        </button>
                      ) : (
                        <button
                          className="btn-dairy btn-secondary-dairy btn-sm-dairy"
                          onClick={() => updateDeliveryStatus(del.id, 'Pending')}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Schedule Delivery Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Customer Delivery"
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleAddSubmit}>
              Schedule Delivery
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Customer Name *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Anand Kulkarni"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-control-dairy"
                placeholder="+91 98..."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Delivery Address *</label>
              <textarea
                className="form-control-dairy"
                rows={2}
                placeholder="Flat / Building, Landmark, City Area"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Items / Products to Deliver</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. 2L Cow Milk + 500g Ghee"
                value={formData.items}
                onChange={(e) => setFormData({ ...formData, items: e.target.value })}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Shift</label>
              <select
                className="form-control-dairy"
                value={formData.shift}
                onChange={(e) => setFormData({ ...formData, shift: e.target.value })}
              >
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
              </select>
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Time Slot</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.timeSlot}
                onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Assigned Delivery Staff</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.staffName}
                onChange={(e) => setFormData({ ...formData, staffName: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
