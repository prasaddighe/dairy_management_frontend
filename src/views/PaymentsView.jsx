import React, { useState } from 'react';
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Receipt,
  CheckCircle,
  Search,
  Printer
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const PaymentsView = () => {
  const {
    farmers,
    customers,
    sales,
    expenses,
    settleFarmerPayment,
    recordCustomerPayment,
    showToast
  } = useDairy();

  const [activeSubTab, setActiveSubTab] = useState('farmers'); // 'farmers' | 'customers' | 'expenses'
  const [searchTerm, setSearchTerm] = useState('');

  // Settle Farmer Modal
  const [selectedFarmer, setSelectedFarmer] = useState(null);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer (NEFT)');
  const [payoutRef, setPayoutRef] = useState('');
  const [isFarmerModalOpen, setIsFarmerModalOpen] = useState(false);

  // Collect Customer Modal
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [collectAmount, setCollectAmount] = useState('');
  const [collectMethod, setCollectMethod] = useState('UPI / GPay');
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  // Computed Financials
  const totalFarmerPending = farmers.reduce((acc, f) => acc + (f.pendingDue || 0), 0);
  const totalCustomerReceivables = customers.reduce((acc, c) => acc + (c.balance || 0), 0);
  const totalRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);

  const handleSettleFarmer = (e) => {
    e.preventDefault();
    const amt = parseFloat(payoutAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid payout amount', 'warning');
      return;
    }
    settleFarmerPayment(selectedFarmer.id, amt, payoutMethod, payoutRef);
    setIsFarmerModalOpen(false);
  };

  const handleCollectCustomer = (e) => {
    e.preventDefault();
    const amt = parseFloat(collectAmount);
    if (!amt || amt <= 0) {
      showToast('Please enter a valid amount', 'warning');
      return;
    }
    recordCustomerPayment(selectedCustomer.id, amt, collectMethod);
    setIsCustomerModalOpen(false);
  };

  return (
    <div>
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Payments & Accounting Ledger</h1>
          <p className="text-sm text-slate-500">
            Bi-monthly farmer payout settlements, customer dues collection, and complete financial vouchers.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className="btn-dairy btn-secondary-dairy"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Financial Statement
          </button>
        </div>
      </div>

      {/* KPI Financial Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card danger">
            <div className="stat-info">
              <span className="stat-label">Pending Farmer Dues</span>
              <span className="stat-value text-danger">₹{totalFarmerPending.toLocaleString()}</span>
              <span className="stat-subtext text-danger">11-20 Oct Cycle Payout</span>
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
              <span className="stat-subtext text-warning">Pending subscription bills</span>
            </div>
            <div className="stat-icon-wrapper warning">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Product Sales Revenue</span>
              <span className="stat-value text-success">₹{totalRevenue.toLocaleString()}</span>
              <span className="stat-subtext text-success">Retail & Wholesales</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Total Operational Costs</span>
              <span className="stat-value">₹{totalExpenses.toLocaleString()}</span>
              <span className="stat-subtext text-muted">Plant power & feed stock</span>
            </div>
            <div className="stat-icon-wrapper info">
              <Receipt size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-body p-3.5 sm:p-5">
          <div className="flex gap-3 flex-wrap items-center justify-between">
            <div className="tab-pills">
              <button
                className={`tab-pill-btn ${activeSubTab === 'farmers' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('farmers')}
              >
                Farmer Milk Settlements ({farmers.length})
              </button>
              <button
                className={`tab-pill-btn ${activeSubTab === 'customers' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('customers')}
              >
                Customer Outstanding Ledger ({customers.length})
              </button>
              <button
                className={`tab-pill-btn ${activeSubTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setActiveSubTab('expenses')}
              >
                Dairy Operating Expenses ({expenses.length})
              </button>
            </div>

            <div className="relative w-64">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                className="form-control-dairy pl-8 text-xs"
                placeholder="Search ledger..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: Farmer Settlements */}
      {activeSubTab === 'farmers' && (
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <CreditCard size={18} className="text-primary" />
              <span>Farmer Milk Supply Payout Register (Cycle 11th - 20th Oct)</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table-dairy">
              <thead>
                <tr>
                  <th>Farmer ID</th>
                  <th>Farmer Name</th>
                  <th>Bank Details</th>
                  <th>Total Milk (L)</th>
                  <th>Pending Amount</th>
                  <th>Status</th>
                  <th className="text-center">Payout Action</th>
                </tr>
              </thead>
              <tbody>
                {farmers
                  .filter(f => !searchTerm || f.name.toLowerCase().includes(searchTerm.toLowerCase()) || f.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(farmer => (
                    <tr key={farmer.id}>
                      <td className="mono-font fw-bold text-primary">{farmer.id}</td>
                      <td>
                        <div className="fw-bold">{farmer.name}</div>
                        <div className="text-[11px] text-slate-400">{farmer.village}</div>
                      </td>
                      <td>
                        <div className="text-xs">
                          <strong>{farmer.bankName}</strong>
                        </div>
                        <div className="font-mono text-[11px] text-slate-400">
                          A/C: {farmer.accountNumber} ({farmer.ifsc})
                        </div>
                      </td>
                      <td className="fw-bold">{farmer.totalMilk} L</td>
                      <td>
                        {farmer.pendingDue > 0 ? (
                          <span className="font-bold text-rose-600 text-sm">
                            ₹{farmer.pendingDue.toLocaleString()}
                          </span>
                        ) : (
                          <span className="badge-dairy success text-[11px]">Paid Clear</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-dairy ${farmer.paymentStatus === 'Paid' ? 'success' : (farmer.paymentStatus === 'Pending' ? 'danger' : 'warning')}`}>
                          {farmer.paymentStatus}
                        </span>
                      </td>
                      <td className="text-center">
                        {farmer.pendingDue > 0 ? (
                          <button
                            className="btn-dairy btn-primary-dairy btn-sm-dairy"
                            onClick={() => {
                              setSelectedFarmer(farmer);
                              setPayoutAmount(farmer.pendingDue.toString());
                              setPayoutRef(`NEFT-PUN-${Date.now().toString().slice(-6)}`);
                              setIsFarmerModalOpen(true);
                            }}
                          >
                            <CreditCard size={13} /> Settle Payout
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">No Due</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Customer Outstanding Ledger */}
      {activeSubTab === 'customers' && (
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <DollarSign size={18} className="text-primary" />
              <span>Customer Billing Receivables Ledger</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table-dairy">
              <thead>
                <tr>
                  <th>Customer ID</th>
                  <th>Customer Name</th>
                  <th>Subscription</th>
                  <th>Phone Number</th>
                  <th>Daily Qty</th>
                  <th>Outstanding Balance</th>
                  <th>Status</th>
                  <th className="text-center">Collect Action</th>
                </tr>
              </thead>
              <tbody>
                {customers
                  .filter(c => !searchTerm || c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(cust => (
                    <tr key={cust.id}>
                      <td className="mono-font fw-bold text-primary">{cust.id}</td>
                      <td>
                        <div className="fw-bold">{cust.name}</div>
                        <div className="text-[11px] text-slate-400">{cust.address}</div>
                      </td>
                      <td>
                        <span className="badge-dairy info text-[11px]">{cust.subscriptionType}</span>
                      </td>
                      <td>{cust.phone}</td>
                      <td className="fw-bold">{cust.dailyRequirement} L</td>
                      <td>
                        {cust.balance > 0 ? (
                          <span className="font-bold text-rose-600 text-sm">
                            ₹{cust.balance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="badge-dairy success text-[11px]">All Clear</span>
                        )}
                      </td>
                      <td>
                        <span className={`badge-dairy ${cust.status === 'Active' ? 'success' : 'warning'}`}>
                          {cust.status}
                        </span>
                      </td>
                      <td className="text-center">
                        {cust.balance > 0 ? (
                          <button
                            className="btn-dairy btn-primary-dairy btn-sm-dairy"
                            onClick={() => {
                              setSelectedCustomer(cust);
                              setCollectAmount(cust.balance.toString());
                              setIsCustomerModalOpen(true);
                            }}
                          >
                            <DollarSign size={13} /> Collect Payment
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">Nil Due</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Operating Expenses */}
      {activeSubTab === 'expenses' && (
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <Receipt size={18} className="text-primary" />
              <span>Dairy Plant & Distribution Expense Vouchers</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table-dairy">
              <thead>
                <tr>
                  <th>Voucher ID</th>
                  <th>Date</th>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Paid To</th>
                  <th>Mode</th>
                  <th>Amount</th>
                  <th>Approved By</th>
                </tr>
              </thead>
              <tbody>
                {expenses
                  .filter(e => !searchTerm || e.category.toLowerCase().includes(searchTerm.toLowerCase()) || e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map(exp => (
                    <tr key={exp.id}>
                      <td className="mono-font fw-bold text-danger">#{exp.id}</td>
                      <td>{exp.date}</td>
                      <td>
                        <span className="badge-dairy warning text-[11px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="max-w-[280px] text-xs">{exp.description}</td>
                      <td className="fw-semibold">{exp.paidTo}</td>
                      <td>{exp.paymentMethod}</td>
                      <td className="font-bold text-rose-600 text-sm">
                        ₹{exp.amount.toLocaleString()}
                      </td>
                      <td className="text-xs">{exp.approvedBy}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Farmer Settle Modal */}
      <Modal
        isOpen={isFarmerModalOpen}
        onClose={() => setIsFarmerModalOpen(false)}
        title={`Farmer Bank Payout: ${selectedFarmer?.name}`}
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsFarmerModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleSettleFarmer}>
              <CheckCircle size={16} /> Disburse Bank Transfer
            </button>
          </>
        }
      >
        <form onSubmit={handleSettleFarmer}>
          <div className="form-group">
            <label className="form-label">Farmer Bank Account</label>
            <div className="p-3 bg-slate-50 rounded-lg text-xs border border-slate-200">
              <div><strong>{selectedFarmer?.bankName}</strong></div>
              <div>A/C: {selectedFarmer?.accountNumber} | IFSC: {selectedFarmer?.ifsc}</div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Disbursement Amount (₹) *</label>
            <input
              type="number"
              className="form-control-dairy"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Channel</label>
            <select
              className="form-control-dairy"
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
            >
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT / RTGS Direct Credit)</option>
              <option value="UPI / PhonePe">Direct Mobile UPI (PhonePe / GPay)</option>
              <option value="Cash Voucher">Cash Voucher from Dairy Counter</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Bank Reference / UTR Number</label>
            <input
              type="text"
              className="form-control-dairy"
              value={payoutRef}
              onChange={(e) => setPayoutRef(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* Customer Collect Modal */}
      <Modal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        title={`Receive Due: ${selectedCustomer?.name}`}
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsCustomerModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleCollectCustomer}>
              <CheckCircle size={16} /> Confirm Receipt
            </button>
          </>
        }
      >
        <form onSubmit={handleCollectCustomer}>
          <div className="form-group">
            <label className="form-label">Outstanding Balance</label>
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
            <label className="form-label">Payment Mode</label>
            <select
              className="form-control-dairy"
              value={collectMethod}
              onChange={(e) => setCollectMethod(e.target.value)}
            >
              <option value="UPI / GPay">UPI (Google Pay / PhonePe / QR)</option>
              <option value="Cash">Cash Collected by Route Boy</option>
              <option value="Bank Transfer">Direct Bank Transfer</option>
            </select>
          </div>
        </form>
      </Modal>
    </div>
  );
};
