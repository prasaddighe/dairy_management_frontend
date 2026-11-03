import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  Printer,
  Calendar,
  CheckCircle
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const ExpensesView = () => {
  const { expenses, addExpense, showToast } = useDairy();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Chilling Plant Electricity',
    description: '',
    amount: '',
    paidTo: '',
    paymentMethod: 'Net Banking'
  });

  const categories = ['All', ...new Set(expenses.map(e => e.category))];

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.description) {
      showToast('Please enter amount and description', 'warning');
      return;
    }
    addExpense({
      ...formData,
      amount: parseFloat(formData.amount) || 0
    });
    setIsAddModalOpen(false);
    setFormData({
      category: 'Chilling Plant Electricity',
      description: '',
      amount: '',
      paidTo: '',
      paymentMethod: 'Net Banking'
    });
  };

  const filteredExpenses = expenses.filter(e => {
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    const matchesSearch = !searchTerm ||
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.paidTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalExpenseAmount = filteredExpenses.reduce((acc, e) => acc + (e.amount || 0), 0);

  return (
    <div>
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dairy Plant Expenses</h1>
          <p className="text-sm text-slate-500">
            Track power utilities, cold chain fuel, feed subsidies, and operating overheads.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus size={18} /> Record New Expense Voucher
        </button>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="stat-card danger">
            <div className="stat-info">
              <span className="stat-label">Total Filtered Expenses</span>
              <span className="stat-value text-danger">₹{totalExpenseAmount.toLocaleString()}</span>
              <span className="stat-subtext text-muted">{filteredExpenses.length} payment vouchers cleared</span>
            </div>
            <div className="stat-icon-wrapper danger">
              <TrendingDown size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Major Expense Category</span>
              <span className="stat-value text-xl">Cattle Feed & Chilling Energy</span>
              <span className="stat-subtext text-muted">78% of monthly operating budget</span>
            </div>
            <div className="stat-icon-wrapper info">
              <Receipt size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-body p-4 sm:p-5">
          <div className="row g-3 align-items-center">
            <div className="col-12 col-md-6">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  className="form-control-dairy pl-9"
                  placeholder="Search expense by description, payee or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="col-6 col-md-3">
              <select
                className="form-control-dairy"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>Category: {c}</option>
                ))}
              </select>
            </div>

            <div className="col-6 col-md-3 text-right">
              <button className="btn-dairy btn-secondary-dairy flex items-center gap-1.5 ml-auto cursor-pointer" onClick={() => window.print()}>
                <Printer size={16} /> Print Vouchers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card-dairy">
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Voucher #</th>
                <th>Date</th>
                <th>Expense Category</th>
                <th>Expense Description</th>
                <th>Paid To / Vendor</th>
                <th>Payment Mode</th>
                <th>Amount (₹)</th>
                <th>Approved By</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-slate-400">
                    No expense vouchers matching current filter.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id}>
                    <td className="mono-font font-bold text-danger">#{exp.id}</td>
                    <td>{exp.date}</td>
                    <td>
                      <span className="badge-dairy warning text-xs">
                        {exp.category}
                      </span>
                    </td>
                    <td className="max-w-xs">
                      <div className="font-semibold">{exp.description}</div>
                    </td>
                    <td className="font-semibold">{exp.paidTo}</td>
                    <td>{exp.paymentMethod}</td>
                    <td className="font-bold text-danger text-base">
                      ₹{exp.amount.toLocaleString()}
                    </td>
                    <td className="text-xs text-slate-500">
                      {exp.approvedBy}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Operating Expense Voucher"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1.5" onClick={handleAddSubmit}>
              <CheckCircle size={16} /> Save Expense Voucher
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Expense Category *</label>
            <select
              className="form-control-dairy"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="Chilling Plant Electricity">Chilling Plant Electricity & Power</option>
              <option value="Cold Chain Diesel">Refrigerated Van Diesel & Fuel</option>
              <option value="Cattle Feed Subsidy">Cattle Feed Subsidies & Bulk Bags</option>
              <option value="Plant Maintenance">Plant Equipment Spares & Maintenance</option>
              <option value="Laboratory Reagents">Quality Testing Chemicals & Lacto Spares</option>
              <option value="Administrative">Administrative Office Supplies & Telephony</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Description *</label>
            <input
              type="text"
              className="form-control-dairy"
              placeholder="e.g. October monthly HT electricity bill payment"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Payee / Vendor Name *</label>
            <input
              type="text"
              className="form-control-dairy"
              placeholder="e.g. MSEDCL Shirwal / Indian Oil"
              value={formData.paidTo}
              onChange={(e) => setFormData({ ...formData, paidTo: e.target.value })}
              required
            />
          </div>

          <div className="row g-2">
            <div className="col-6">
              <label className="form-label text-xs font-semibold text-slate-700">Amount (₹) *</label>
              <input
                type="number"
                step="0.01"
                className="form-control-dairy"
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </div>
            <div className="col-6">
              <label className="form-label text-xs font-semibold text-slate-700">Payment Channel</label>
              <select
                className="form-control-dairy"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <option value="Net Banking">Net Banking / RTGS</option>
                <option value="Company UPI">Company UPI</option>
                <option value="Cheque">Bank Cheque</option>
                <option value="Petty Cash">Petty Cash</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
