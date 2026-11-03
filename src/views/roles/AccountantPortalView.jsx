import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  Download,
  CheckCircle,
  Building,
  Printer,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';
import { Modal } from '../../components/common/Modal';

export const AccountantPortalView = () => {
  const {
    farmers,
    customers,
    sales,
    expenses,
    settleFarmerPayment,
    showToast,
    currentUser
  } = useDairy();

  const [activeTab, setActiveTab] = useState('payouts');
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer (NEFT)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const pendingFarmers = farmers.filter(f => (f.pendingDue || 0) > 0);
  const totalPendingDue = pendingFarmers.reduce((acc, f) => acc + (f.pendingDue || 0), 0);
  const totalCustomerReceivables = customers.reduce((acc, c) => acc + (c.balance || 0), 0);
  const totalRevenue = sales.reduce((acc, s) => acc + (s.total || 0), 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  const handleDisburse = (e) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter payout amount', 'warning');
      return;
    }
    settleFarmerPayment(selectedFarmer.id, amt, payoutMethod, `NEFT-${Date.now().toString().slice(-6)}`);
    setIsModalOpen(false);
  };

  const handleBatchPayout = () => {
    pendingFarmers.forEach(f => {
      settleFarmerPayment(f.id, f.pendingDue, 'Bank Transfer (NEFT Batch)', `BATCH-OCT-${Date.now().toString().slice(-4)}`);
    });
    showToast(`Batch NEFT payout executed for ${pendingFarmers.length} farmers!`, 'success');
  };

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-7 mb-7 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-700 text-white text-2xl font-extrabold flex items-center justify-center shadow-lg shrink-0">
            {currentUser?.avatar || 'NK'}
          </div>
          <div>
            <div className="text-xs opacity-80 uppercase tracking-wider font-semibold">
              Finance & Accounts Controller
            </div>
            <h1 className="text-3xl font-extrabold text-white my-0.5 tracking-tight">
              {currentUser?.fullName || 'Neha Kulkarni'} (Accountant)
            </h1>
            <div className="text-sm opacity-85">
              Cooperative Accounts Division &bull; Audit & Ledger Compliance
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            className="btn-dairy btn-primary-dairy"
            disabled={pendingFarmers.length === 0}
            onClick={handleBatchPayout}
          >
            <CreditCard size={16} /> Batch Disburse All Farmer Dues
          </button>
        </div>
      </div>

      {/* Financial KPIs */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card danger">
            <div className="stat-info">
              <span className="stat-label">Pending Farmer Dues</span>
              <span className="stat-value text-danger">₹{totalPendingDue.toLocaleString()}</span>
              <span className="stat-subtext text-danger">{pendingFarmers.length} Accounts Awaiting NEFT</span>
            </div>
            <div className="stat-icon-wrapper danger">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Customer Receivables</span>
              <span className="stat-value text-warning">₹{totalCustomerReceivables.toLocaleString()}</span>
              <span className="stat-subtext text-warning">Active subscription dues</span>
            </div>
            <div className="stat-icon-wrapper warning">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Monthly Gross Revenue</span>
              <span className="stat-value text-success">₹{(totalRevenue + 85400).toLocaleString()}</span>
              <span className="stat-subtext text-success">Retail + Bulk Hotel Sales</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Operating Expenses</span>
              <span className="stat-value">₹{totalExpenses.toLocaleString()}</span>
              <span className="stat-subtext text-muted">Cleared Vouchers</span>
            </div>
            <div className="stat-icon-wrapper info">
              <Receipt size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Pending Farmer Dues Clearance Table */}
      <div className="card-dairy">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <CreditCard size={18} className="text-primary" />
            <span>Farmer Payout Cycle (11th - 20th Oct) - Bank NEFT Clearance</span>
          </div>
          <button className="btn-dairy btn-secondary-dairy btn-sm-dairy" onClick={() => window.print()}>
            <Printer size={14} /> Print NEFT Bank Advice
          </button>
        </div>
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Farmer ID</th>
                <th>Farmer Name</th>
                <th>Bank & IFSC</th>
                <th>Account Number</th>
                <th>Total Milk</th>
                <th>Net Payable (₹)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingFarmers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-slate-400">
                    All farmer payouts cleared. No pending bank dues for this cycle.
                  </td>
                </tr>
              ) : (
                pendingFarmers.map(farmer => (
                  <tr key={farmer.id}>
                    <td className="mono-font font-bold text-primary">{farmer.id}</td>
                    <td className="font-bold">{farmer.name}</td>
                    <td>
                      <div className="font-semibold">{farmer.bankName}</div>
                      <div className="mono-font text-[11px] text-slate-400">{farmer.ifsc}</div>
                    </td>
                    <td className="mono-font font-semibold">{farmer.accountNumber}</td>
                    <td className="font-bold">{farmer.totalMilk} L</td>
                    <td className="font-bold text-danger text-base">
                      ₹{farmer.pendingDue.toLocaleString()}
                    </td>
                    <td>
                      <button
                        className="btn-dairy btn-primary-dairy btn-sm-dairy"
                        onClick={() => {
                          setSelectedFarmer(farmer);
                          setPayoutAmount(farmer.pendingDue.toString());
                          setIsModalOpen(true);
                        }}
                      >
                        Disburse NEFT
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Disburse Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Disburse Bank Payout: ${selectedFarmer?.name}`}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1.5" onClick={handleDisburse}>
              <CheckCircle size={16} /> Execute Bank Transfer
            </button>
          </div>
        }
      >
        <form onSubmit={handleDisburse} className="space-y-3">
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Beneficiary Account</label>
            <div className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 space-y-0.5">
              <div><strong>{selectedFarmer?.bankName}</strong></div>
              <div>A/C: {selectedFarmer?.accountNumber} | IFSC: {selectedFarmer?.ifsc}</div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Net Payable Amount (₹)</label>
            <input
              type="number"
              className="form-control-dairy"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Payment Channel</label>
            <select
              className="form-control-dairy"
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
            >
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT / RTGS)</option>
              <option value="UPI / PhonePe">Direct Mobile UPI</option>
              <option value="Cash Voucher">Cash Voucher</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
