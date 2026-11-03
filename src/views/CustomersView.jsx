import React, { useState } from 'react';
import {
  Plus,
  Search,
  Phone,
  MapPin,
  CreditCard,
  Pause,
  Play,
  CheckCircle,
  Eye
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const CustomersView = () => {
  const {
    customers,
    addCustomer,
    toggleCustomerStatus,
    recordCustomerPayment,
    showToast
  } = useDairy();

  const [searchTerm, setSearchTerm] = useState('');
  const [subscriptionFilter, setSubscriptionFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    subscriptionType: 'Daily Morning',
    dailyRequirement: 2.0,
    milkType: 'Cow Milk',
    deliverySlot: 'Morning (6:30 AM - 7:30 AM)'
  });

  // Payment State
  const [collectAmount, setCollectAmount] = useState('');
  const [payMethod, setPayMethod] = useState('UPI / GPay');

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address) {
      showToast('Please fill all mandatory fields', 'warning');
      return;
    }
    addCustomer({
      ...formData,
      dailyRequirement: parseFloat(formData.dailyRequirement) || 1.0
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  const handlePaySubmit = (e) => {
    e.preventDefault();
    const amt = parseFloat(collectAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid payment amount', 'warning');
      return;
    }
    recordCustomerPayment(selectedCustomer.id, amt, payMethod);
    setIsPayModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      subscriptionType: 'Daily Morning',
      dailyRequirement: 2.0,
      milkType: 'Cow Milk',
      deliverySlot: 'Morning (6:30 AM - 7:30 AM)'
    });
  };

  const filteredCustomers = customers.filter(c => {
    const matchesSub = subscriptionFilter === 'All' || c.subscriptionType.includes(subscriptionFilter);
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch = !searchTerm ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm) ||
      c.address.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSub && matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Title & Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Customers & Subscriptions</h1>
          <p className="text-sm text-slate-500">
            Manage daily home delivery subscriptions, routes, monthly balances, and digital payments.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} /> Add New Customer
        </button>
      </div>

      {/* Filter Bar */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-body p-4 sm:p-5">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-5">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="form-control-dairy pl-9"
                  placeholder="Search customer by name, phone, address, ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-control-dairy"
                value={subscriptionFilter}
                onChange={(e) => setSubscriptionFilter(e.target.value)}
              >
                <option value="All">All Subscriptions</option>
                <option value="Daily Morning">Daily Morning</option>
                <option value="Both">Daily Both Shifts</option>
                <option value="Alternate">Alternate Days</option>
              </select>
            </div>

            <div className="col-6 col-md-2">
              <select
                className="form-control-dairy"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Paused">Paused</option>
              </select>
            </div>

            <div className="col-12 col-md-2 text-right">
              <span className="text-xs text-slate-500 font-semibold">
                {filteredCustomers.length} Subscribers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <div className="card-dairy">
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Customer Name</th>
                <th>Mobile Number</th>
                <th>Delivery Address</th>
                <th>Subscription Plan</th>
                <th>Daily Requirement</th>
                <th>Due Balance</th>
                <th>Status</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td className="mono-font fw-bold text-primary">
                      {cust.id}
                    </td>
                    <td>
                      <div className="fw-bold">{cust.name}</div>
                      <div className="text-[11px] text-slate-400">Since {cust.startDate}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-1 text-xs text-slate-600 font-medium">
                        <Phone size={13} className="text-slate-400" /> {cust.phone}
                      </div>
                    </td>
                    <td>
                      <div className="flex items-start gap-1 max-w-[240px] text-xs text-slate-700">
                        <MapPin size={13} className="text-slate-400 shrink-0 mt-0.5" />
                        <span>{cust.address}</span>
                      </div>
                    </td>
                    <td>
                      <span className="badge-dairy info text-xs">
                        {cust.subscriptionType}
                      </span>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {cust.deliverySlot}
                      </div>
                    </td>
                    <td className="fw-bold">
                      {cust.dailyRequirement} L / day
                      <div className="text-[11px] text-emerald-600 font-semibold">
                        {cust.milkType}
                      </div>
                    </td>
                    <td>
                      {cust.balance > 0 ? (
                        <span className="fw-bold text-danger">₹{cust.balance.toLocaleString()}</span>
                      ) : (
                        <span className="badge-dairy success text-xs">Paid Clear</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge-dairy ${cust.status === 'Active' ? 'success' : 'warning'}`}>
                        {cust.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          className="btn-icon"
                          title="View Ledger & Orders"
                          onClick={() => {
                            setSelectedCustomer(cust);
                            setIsViewModalOpen(true);
                          }}
                        >
                          <Eye size={15} />
                        </button>
                        <button
                          className="btn-icon"
                          title={cust.status === 'Active' ? 'Pause Delivery' : 'Resume Delivery'}
                          onClick={() => toggleCustomerStatus(cust.id)}
                        >
                          {cust.status === 'Active' ? <Pause size={15} className="text-warning" /> : <Play size={15} className="text-success" />}
                        </button>
                        {cust.balance > 0 && (
                          <button
                            className="btn-dairy btn-primary-dairy btn-sm-dairy"
                            title="Collect Payment"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setCollectAmount(cust.balance.toString());
                              setIsPayModalOpen(true);
                            }}
                          >
                            <CreditCard size={13} /> Collect
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-slate-400">
                    No customer subscriptions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Customer & Daily Subscription"
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleAddSubmit}>
              <CheckCircle size={16} /> Save Customer
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Customer Full Name *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Priya Sharma"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Mobile Number *</label>
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
              <label className="form-label">Delivery Address (Apartment, Street, Landmark) *</label>
              <textarea
                className="form-control-dairy"
                rows={2}
                placeholder="e.g. Flat 402, Green Valley Apartments, Aundh, Pune 411007"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Subscription Frequency</label>
              <select
                className="form-control-dairy"
                value={formData.subscriptionType}
                onChange={(e) => setFormData({ ...formData, subscriptionType: e.target.value })}
              >
                <option value="Daily Morning">Daily Morning</option>
                <option value="Daily Both (M+E)">Daily Both Shifts (Morning & Evening)</option>
                <option value="Alternate Days">Alternate Days</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Milk Variety</label>
              <select
                className="form-control-dairy"
                value={formData.milkType}
                onChange={(e) => setFormData({ ...formData, milkType: e.target.value })}
              >
                <option value="Cow Milk">Farm Fresh Cow Milk (A2)</option>
                <option value="Buffalo Milk">Creamy Buffalo Milk</option>
              </select>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Daily Requirement (Liters) *</label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                className="form-control-dairy"
                value={formData.dailyRequirement}
                onChange={(e) => setFormData({ ...formData, dailyRequirement: e.target.value })}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Preferred Delivery Time Slot</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Morning (6:30 AM - 7:30 AM)"
                value={formData.deliverySlot}
                onChange={(e) => setFormData({ ...formData, deliverySlot: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Collect Payment Modal */}
      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title={`Receive Payment from ${selectedCustomer?.name}`}
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handlePaySubmit}>
              <CheckCircle size={16} /> Record Payment
            </button>
          </>
        }
      >
        <form onSubmit={handlePaySubmit}>
          <div className="form-group">
            <label className="form-label">Customer Outstanding Balance</label>
            <div className="text-2xl font-extrabold text-rose-600 font-mono">
              ₹{selectedCustomer?.balance.toLocaleString()}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Payment Received (₹) *</label>
            <input
              type="number"
              className="form-control-dairy"
              value={collectAmount}
              onChange={(e) => setCollectAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Mode *</label>
            <select
              className="form-control-dairy"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <option value="UPI / GPay">UPI (Google Pay / PhonePe / Paytm)</option>
              <option value="Cash">Cash Collected by Delivery Executive</option>
              <option value="Bank Transfer">Direct Bank Transfer</option>
            </select>
          </div>
        </form>
      </Modal>

      {/* View Customer Ledger Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Customer Subscription Details"
        size="lg"
        footer={
          <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsViewModalOpen(false)}>
            Close
          </button>
        }
      >
        {selectedCustomer && (
          <div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                {selectedCustomer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-extrabold text-slate-800 truncate">{selectedCustomer.name}</div>
                <div className="text-xs text-slate-500">
                  ID: <strong className="text-emerald-600">{selectedCustomer.id}</strong> • {selectedCustomer.phone}
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedCustomer.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {selectedCustomer.status}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
                <div className="text-xs text-slate-500">Daily Requirement</div>
                <div className="font-bold text-base text-slate-800">
                  {selectedCustomer.dailyRequirement} Liters / day ({selectedCustomer.milkType})
                </div>
                <div className="text-xs text-slate-400">
                  Slot: {selectedCustomer.deliverySlot}
                </div>
              </div>

              <div className="p-3.5 border border-slate-200 rounded-lg bg-white">
                <div className="text-xs text-slate-500">Outstanding Due Balance</div>
                <div className="font-bold text-rose-600 text-base">
                  ₹{selectedCustomer.balance.toLocaleString()}
                </div>
                <div className="text-xs text-slate-400">
                  Billing Cycle: 1st of every month
                </div>
              </div>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg mb-4 bg-white">
              <div className="text-xs text-slate-500 mb-1">Delivery Address</div>
              <div className="text-sm font-semibold text-slate-800">{selectedCustomer.address}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
