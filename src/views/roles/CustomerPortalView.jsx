import React, { useState } from 'react';
import {
  CreditCard,
  CheckCircle,
  Pause,
  Play,
  Truck,
  Clock,
  Plus,
  Sparkles
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';
import { Modal } from '../../components/common/Modal';

export const CustomerPortalView = () => {
  const { customers, products, addSale, toggleCustomerStatus, recordCustomerPayment, showToast, currentUser } = useDairy();

  const customer = customers.find(c =>
    c.id === currentUser?.customerId ||
    (currentUser?.phone && c.phone === currentUser.phone) ||
    (currentUser?.fullName && c.name?.toLowerCase() === currentUser.fullName.toLowerCase())
  ) || {
    id: currentUser?.customerId || 'CUST-801',
    name: currentUser?.fullName || 'Valued Subscriber',
    phone: currentUser?.phone || '',
    balance: 0,
    address: currentUser?.branch || 'Pune City Delivery Hub',
    status: 'Active',
    subscription: 'Fresh Cow Milk 1L Daily',
    subscriptionType: 'Monthly Pre-Paid',
    dailyRequirement: 2,
    milkType: 'Cow Milk',
    deliverySlot: '6:00 AM - 7:00 AM'
  };

  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState((customer.balance || 0).toString());
  const [payMethod, setPayMethod] = useState('UPI / GPay');

  const handleQuickOrder = (product) => {
    addSale({
      customerName: customer.name,
      phone: customer.phone,
      items: [{ productId: product.id, name: product.name, qty: 1, price: product.price, total: product.price }],
      subtotal: product.price,
      discount: 0,
      tax: 0,
      total: product.price,
      paymentMethod: 'Added to Monthly Bill'
    });
    showToast(`Order placed for 1x ${product.name}! It will be delivered with tomorrow's milk.`, 'success');
  };

  const handlePay = (e) => {
    e.preventDefault();
    const amt = parseFloat(payAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }
    recordCustomerPayment(customer.id, amt, payMethod);
    setIsPayModalOpen(false);
  };

  return (
    <div>
      <div className="bg-gradient-to-br from-sky-600 to-sky-800 text-white rounded-2xl p-7 mb-7 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-sky-600 text-2xl font-extrabold flex items-center justify-center shadow-lg shrink-0">
            {currentUser?.avatar || customer.name?.slice(0, 2).toUpperCase() || 'PS'}
          </div>
          <div>
            <div className="text-xs opacity-90 uppercase tracking-wider font-semibold">
              Residential Milk Subscriber
            </div>
            <h1 className="text-3xl font-extrabold text-white my-0.5 tracking-tight">
              {customer.name}
            </h1>
            <div className="text-sm opacity-90">
              ID: <strong>{customer.id}</strong> &bull; {customer.address}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 cursor-pointer shadow-sm ${
              customer.status === 'Active'
                ? 'bg-white text-red-700 hover:bg-red-50'
                : 'bg-white text-emerald-700 hover:bg-emerald-50'
            }`}
            onClick={() => toggleCustomerStatus(customer.id)}
          >
            {customer.status === 'Active' ? <><Pause size={16} /> Pause Deliveries</> : <><Play size={16} /> Resume Deliveries</>}
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Daily Milk Supply</span>
              <span className="stat-value">{customer.dailyRequirement || 2} <span className="text-base font-normal">Liters</span></span>
              <span className="stat-subtext text-success">
                {customer.milkType || 'Cow Milk'} &bull; {customer.subscriptionType || 'Daily Plan'}
              </span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Truck size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Delivery Slot</span>
              <span className="stat-value text-xl">{customer.deliverySlot || '6:30 AM'}</span>
              <span className="stat-subtext text-info">Assigned Route Delivery</span>
            </div>
            <div className="stat-icon-wrapper info">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Monthly Bill Due</span>
              <span className={`stat-value ${(customer.balance || 0) > 0 ? 'text-danger' : 'text-success'}`}>
                ₹{(customer.balance || 0).toLocaleString()}
              </span>
              <div className="mt-1">
                {(customer.balance || 0) > 0 ? (
                  <button
                    className="btn-dairy btn-primary-dairy btn-sm-dairy"
                    onClick={() => setIsPayModalOpen(true)}
                  >
                    Pay Balance Online
                  </button>
                ) : (
                  <span className="badge-dairy success">All Bills Settled</span>
                )}
              </div>
            </div>
            <div className="stat-icon-wrapper warning">
              <CreditCard size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className="card-dairy mb-4">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <Sparkles size={18} className="text-primary" />
            <span>Order Farm Fresh Products with Next Morning's Milk</span>
          </div>
          <span className="badge-dairy success">Doorstep Delivery</span>
        </div>
        <div className="card-dairy-body">
          <div className="row g-3">
            {products.slice(0, 4).map(prod => (
              <div key={prod.id} className="col-12 col-sm-6 col-lg-3">
                <div className="p-4 border border-slate-200 rounded-xl bg-white flex flex-col h-full shadow-sm hover:border-emerald-300 transition">
                  <span className="badge-dairy info self-start text-[10px] mb-1.5">
                    {prod.category}
                  </span>
                  <div className="font-bold text-sm text-slate-800">{prod.name}</div>
                  <div className="text-xs text-slate-400 mb-2.5">
                    {prod.unit}
                  </div>
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <span className="font-bold text-success text-base font-outfit">
                      ₹{prod.price}
                    </span>
                    <button
                      className="btn-dairy btn-primary-dairy btn-sm-dairy"
                      onClick={() => handleQuickOrder(prod)}
                    >
                      <Plus size={14} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPayModalOpen}
        onClose={() => setIsPayModalOpen(false)}
        title="Pay Milk Subscription Bill"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsPayModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1.5" onClick={handlePay}>
              <CheckCircle size={16} /> Pay via UPI / Card
            </button>
          </div>
        }
      >
        <form onSubmit={handlePay} className="space-y-3">
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Total Outstanding Amount</label>
            <div className="text-2xl font-extrabold text-red-600">
              ₹{(customer.balance || 0).toLocaleString()}
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Payment Amount (₹)</label>
            <input
              type="number"
              className="form-control-dairy"
              value={payAmount}
              onChange={(e) => setPayAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Payment Gateway</label>
            <select
              className="form-control-dairy"
              value={payMethod}
              onChange={(e) => setPayMethod(e.target.value)}
            >
              <option value="UPI / GPay">UPI (Google Pay / PhonePe / QR)</option>
              <option value="Debit Card">Debit / Credit Card</option>
              <option value="Net Banking">Net Banking</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
