import React, { useState, useMemo } from 'react';
import {
  Milk,
  Plus,
  Calendar,
  Sun,
  Moon,
  Printer,
  Calculator,
  Download,
  CheckCircle,
  Coins,
  Search,
  Eye
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';
import { PrintReceiptModal } from '../components/common/PrintReceiptModal';
import { CommonTable } from '../components/common/CommonTable';
import { ActionMenu } from '../components/common/ActionMenu';
import { CustomDropdown } from '../components/common/CustomDropdown';

export const MilkCollectionView = () => {
  const {
    milkRecords,
    addMilkRecord,
    farmers,
    calculateRate,
    currentShift,
    showToast
  } = useDairy();

  // Filters
  const [shiftFilter, setShiftFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  // Selection for bulk actions
  const [selectedSlips, setSelectedSlips] = useState([]);

  // Modal & Form States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  // New Record Form State
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [milkType, setMilkType] = useState('Cow');
  const [shift, setShift] = useState(currentShift);
  const [quantity, setQuantity] = useState('');
  const [fat, setFat] = useState('4.2');
  const [snf, setSnf] = useState('8.6');

  // Auto calculate rate & total
  const calculatedRate = calculateRate(milkType, fat, snf);
  const calculatedTotal = (parseFloat(quantity) || 0) * calculatedRate;

  // Selected Farmer Object
  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId);

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) {
      showToast('Please enter a valid milk quantity in Liters', 'warning');
      return;
    }

    const newRecord = addMilkRecord({
      farmerId: selectedFarmerId,
      farmerName: selectedFarmer ? selectedFarmer.name : 'Unknown Farmer',
      shift,
      milkType,
      quantity: parseFloat(quantity),
      fat: parseFloat(fat),
      snf: parseFloat(snf),
      rate: calculatedRate,
      totalAmount: calculatedTotal
    });

    setIsAddModalOpen(false);
    // Reset form
    setQuantity('');
    // Offer to immediately print slip!
    setSelectedReceipt(newRecord);
  };

  // Filtered records
  const filteredRecords = useMemo(() => {
    return milkRecords.filter(r => {
      const matchesShift = shiftFilter === 'All' || r.shift === shiftFilter;
      const matchesType = typeFilter === 'All' || r.milkType === typeFilter;
      const matchesDate = !dateFilter || r.date === dateFilter;
      const matchesSearch = !searchTerm || 
        r.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.farmerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.slipNo.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesShift && matchesType && matchesDate && matchesSearch;
    });
  }, [milkRecords, shiftFilter, typeFilter, dateFilter, searchTerm]);

  const totalFilteredLiters = filteredRecords.reduce((acc, r) => acc + (parseFloat(r.quantity) || 0), 0);
  const totalFilteredAmount = filteredRecords.reduce((acc, r) => acc + (parseFloat(r.totalAmount) || 0), 0);

  // Export to CSV helper
  const handleExportCSV = (recordsToExport = filteredRecords) => {
    const list = Array.isArray(recordsToExport) && recordsToExport.length > 0 ? recordsToExport : filteredRecords;
    const headers = ['Slip No,Date,Time,Shift,Farmer ID,Farmer Name,Type,Quantity(L),Fat(%),SNF(%),Rate,Total Amount,Recorded By\n'];
    const rows = list.map(r => 
      `"${r.slipNo}","${r.date}","${r.time}","${r.shift}","${r.farmerId}","${r.farmerName}","${r.milkType}",${r.quantity},${r.fat},${r.snf},${r.rate},${r.totalAmount},"${r.recordedBy}"`
    );
    const blob = new Blob([headers.concat(rows).join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Milk_Collection_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${list.length} milk records to CSV`, 'success');
  };

  // Table Column Definitions
  const columns = useMemo(() => [
    {
      key: 'slipNo',
      label: 'Slip No',
      sortable: true,
      width: '160px',
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelectedReceipt(r)}
          className="font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 cursor-pointer inline-flex items-center gap-1.5 transition-colors"
          title="Click to print or view slip"
        >
          <span>{r.slipNo}</span>
        </button>
      )
    },
    {
      key: 'date',
      label: 'Date & Time',
      sortable: true,
      sortValue: (r) => `${r.date} ${r.time}`,
      width: '150px',
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-800">{r.date}</div>
          <div className="text-[11px] text-slate-400 font-mono">{r.time}</div>
        </div>
      )
    },
    {
      key: 'shift',
      label: 'Shift',
      sortable: true,
      width: '115px',
      render: (r) => (
        <span className={`badge-dairy ${r.shift?.toLowerCase()}`}>
          {r.shift === 'Morning' ? <Sun size={12} className="text-amber-600" /> : <Moon size={12} className="text-indigo-600" />} {r.shift}
        </span>
      )
    },
    {
      key: 'farmerName',
      label: 'Farmer Member',
      sortable: true,
      width: '210px',
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
            {r.farmerName?.slice(0, 2).toUpperCase() || 'FR'}
          </div>
          <div className="min-w-0">
            <div className="font-bold text-slate-800 truncate">{r.farmerName}</div>
            <div className="text-[11px] text-slate-400 font-mono">ID: {r.farmerId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'milkType',
      label: 'Type',
      sortable: true,
      width: '115px',
      render: (r) => (
        <span className={`badge-dairy ${r.milkType?.toLowerCase()}`}>
          {r.milkType === 'Cow' ? '🐄 Cow' : '🐃 Buffalo'}
        </span>
      )
    },
    {
      key: 'quantity',
      label: 'Qty (L)',
      sortable: true,
      align: 'right',
      width: '115px',
      render: (r) => (
        <span className="font-bold text-slate-900 text-[13.5px]">
          {Number(r.quantity).toFixed(1)} <span className="text-[11px] font-semibold text-slate-500">L</span>
        </span>
      )
    },
    {
      key: 'fat',
      label: 'Fat %',
      sortable: true,
      align: 'right',
      width: '95px',
      render: (r) => (
        <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 text-xs">
          {Number(r.fat).toFixed(1)}%
        </span>
      )
    },
    {
      key: 'snf',
      label: 'SNF %',
      sortable: true,
      align: 'right',
      width: '95px',
      render: (r) => (
        <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80 text-xs">
          {Number(r.snf).toFixed(1)}%
        </span>
      )
    },
    {
      key: 'rate',
      label: 'Rate / L',
      sortable: true,
      align: 'right',
      width: '105px',
      render: (r) => (
        <span className="font-semibold text-slate-700">
          ₹{Number(r.rate).toFixed(2)}
        </span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total (₹)',
      sortable: true,
      align: 'right',
      width: '135px',
      render: (r) => (
        <span className="font-extrabold text-emerald-700 font-mono text-[13.5px]">
          ₹{Number(r.totalAmount).toFixed(2)}
        </span>
      )
    },
    {
      key: 'recordedBy',
      label: 'Recorded By',
      sortable: true,
      width: '140px',
      render: (r) => (
        <span className="text-xs text-slate-600 font-medium truncate block max-w-[130px]">
          {r.recordedBy || 'Operator'}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      width: '85px',
      render: (r) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            align="right"
            items={[
              {
                label: 'Print Thermal Slip',
                icon: <Printer size={14} />,
                onClick: () => setSelectedReceipt(r)
              },
              {
                label: 'View Intake Slip',
                icon: <Eye size={14} />,
                onClick: () => setSelectedReceipt(r)
              }
            ]}
          />
        </div>
      )
    }
  ], []);

  return (
    <div>
      {/* 1. TOP HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="badge-dairy success text-[11px]">
              Collection Desk
            </span>
            <span className="text-xs text-slate-500">
              Real-time milk intake & ledger credits
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Milk Collection Register
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Daily automated farmer milk intake, fat & SNF testing, instant rate calculation, and thermal slip printing.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            className="btn-dairy btn-secondary-dairy"
            onClick={() => handleExportCSV()}
          >
            <Download size={15} /> Export CSV
          </button>
          <button
            type="button"
            className="btn-dairy btn-primary-dairy shadow-md shadow-emerald-700/20"
            onClick={() => setIsAddModalOpen(true)}
          >
            <Plus size={16} /> New Milk Intake Entry
          </button>
        </div>
      </div>

      {/* 2. SUMMARY KPI STRIP */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Total Volume (Filtered)</span>
              <span className="stat-value">
                {totalFilteredLiters.toFixed(1)} <span className="text-base font-semibold">Liters</span>
              </span>
              <span className="stat-subtext text-success font-semibold">
                {filteredRecords.length} intake entries recorded
              </span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Milk size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Total Amount Payable</span>
              <span className="stat-value">
                ₹{totalFilteredAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              <span className="stat-subtext text-muted">
                Direct farmer ledger credits
              </span>
            </div>
            <div className="stat-icon-wrapper warning">
              <Coins size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Active Shift</span>
              <span className="stat-value">{currentShift} Shift</span>
              <span className="stat-subtext text-info">
                {currentShift === 'Morning' ? '06:00 AM - 09:30 AM' : '05:00 PM - 08:30 PM'}
              </span>
            </div>
            <div className="stat-icon-wrapper info">
              {currentShift === 'Morning' ? <Sun size={24} /> : <Moon size={24} />}
            </div>
          </div>
        </div>
      </div>

      {/* 3. FILTER TOOLBAR RIBBON */}
      <div className="card-dairy mb-4 relative z-30 bg-white border border-slate-200 overflow-visible">
        <div className="card-dairy-body p-3.5 sm:p-5 overflow-visible">
          <div className="row g-3 align-items-center">
            {/* Shift Tabs */}
            <div className="col-12 col-md-auto">
              <div className="tab-pills p-1">
                <button
                  type="button"
                  className={`tab-pill-btn ${shiftFilter === 'All' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('All')}
                >
                  All Shifts
                </button>
                <button
                  type="button"
                  className={`tab-pill-btn ${shiftFilter === 'Morning' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('Morning')}
                >
                  <Sun size={12} className="inline mr-1 text-amber-500" /> Morning
                </button>
                <button
                  type="button"
                  className={`tab-pill-btn ${shiftFilter === 'Evening' ? 'active' : ''}`}
                  onClick={() => setShiftFilter('Evening')}
                >
                  <Moon size={12} className="inline mr-1 text-indigo-500" /> Evening
                </button>
              </div>
            </div>

            {/* Milk Type Filter */}
            <div className="col-6 col-md-auto">
              <CustomDropdown
                options={[
                  { label: 'All Milk Types', value: 'All' },
                  { label: '🐄 Cow Milk', value: 'Cow' },
                  { label: '🐃 Buffalo Milk', value: 'Buffalo' }
                ]}
                value={typeFilter}
                onChange={setTypeFilter}
                defaultValue="All"
                placeholder="All Milk Types"
              />
            </div>

            {/* Date Filter */}
            <div className="col-6 col-md-auto">
              <div className="flex items-center gap-1.5">
                <Calendar size={15} className="text-slate-400" />
                <input
                  type="date"
                  className="form-control-dairy w-auto text-xs"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>

            {/* Search Input */}
            <div className="col-12 col-md">
              <div className="relative">
                <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="form-control-dairy pl-9 text-xs"
                  placeholder="Search by Farmer name, ID, or Slip #"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-transparent border-0 text-slate-400 hover:text-slate-600 cursor-pointer text-sm font-bold"
                  >
                    ×
                  </button>
                )}
              </div>
            </div>

            {/* Reset Filters */}
            {(shiftFilter !== 'All' || typeFilter !== 'All' || dateFilter || searchTerm) && (
              <div className="col-auto">
                <button
                  type="button"
                  className="btn-dairy btn-secondary-dairy btn-sm-dairy"
                  onClick={() => {
                    setShiftFilter('All');
                    setTypeFilter('All');
                    setDateFilter('');
                    setSearchTerm('');
                  }}
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milk Intake Data Table */}
      <CommonTable
        columns={columns}
        data={filteredRecords}
        keyExtractor={(item) => item.id || item.slipNo}
        title="Milk Intake Records"
        subtitle="Sortable, selectable ledger with automated quality calculations and thermal print integration."
        showCheckbox={true}
        selectedItems={selectedSlips}
        onSelectionChange={setSelectedSlips}
        searchable={false} // Handled by top filter ribbon for synchronized KPIs
        densityToggle={true}
        exportFormats={['csv', 'excel', 'print']}
        onExport={() => handleExportCSV()}
        pagination={true}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyTitle="No Milk Intake Records Found"
        emptyMessage="Try adjusting the filter criteria or record a new milk intake above."
        onEmptyReset={() => {
          setShiftFilter('All');
          setTypeFilter('All');
          setDateFilter('');
          setSearchTerm('');
        }}
        bulkActionNode={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (selectedSlips.length > 0) {
                  setSelectedReceipt(selectedSlips[0]);
                  showToast(`Opening print dialog for selected slips`, 'info');
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition"
            >
              <Printer size={13} />
              <span>Print Slip ({selectedSlips.length})</span>
            </button>
            <button
              type="button"
              onClick={() => handleExportCSV(selectedSlips)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-white transition"
            >
              <Download size={13} />
              <span>Export Selected CSV</span>
            </button>
          </div>
        }
      />

      {/* 5. NEW MILK INTAKE ENTRY MODAL */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Record Daily Milk Collection Desk Entry"
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleSubmit}>
              <CheckCircle size={16} /> Save & Print Thermal Slip
            </button>
          </>
        }
      >
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            {/* Farmer Selector */}
            <div className="col-12 col-md-6">
              <label className="form-label">Select Registered Farmer *</label>
              <select
                className="form-control-dairy"
                value={selectedFarmerId}
                onChange={(e) => setSelectedFarmerId(e.target.value)}
                required
              >
                {farmers.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.id} - {f.village})
                  </option>
                ))}
              </select>
            </div>

            {/* Shift */}
            <div className="col-6 col-md-3">
              <label className="form-label">Shift *</label>
              <select
                className="form-control-dairy"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              >
                <option value="Morning">Morning Shift</option>
                <option value="Evening">Evening Shift</option>
              </select>
            </div>

            {/* Milk Type */}
            <div className="col-6 col-md-3">
              <label className="form-label">Milk Variety *</label>
              <select
                className="form-control-dairy"
                value={milkType}
                onChange={(e) => {
                  setMilkType(e.target.value);
                  if (e.target.value === 'Buffalo') {
                    setFat('6.8');
                    setSnf('9.0');
                  } else {
                    setFat('4.2');
                    setSnf('8.6');
                  }
                }}
              >
                <option value="Cow">Cow Milk</option>
                <option value="Buffalo">Buffalo Milk</option>
              </select>
            </div>

            {/* Quantity */}
            <div className="col-12 col-md-4">
              <label className="form-label">Milk Quantity (Liters) *</label>
              <div className="input-group-dairy">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="form-control-dairy"
                  placeholder="e.g. 25.5"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  autoFocus
                />
                <span className="input-addon">Liters</span>
              </div>
            </div>

            {/* Fat % */}
            <div className="col-6 col-md-4">
              <label className="form-label">Fat % (Lacto Reading) *</label>
              <div className="input-group-dairy">
                <input
                  type="number"
                  step="0.1"
                  min="2.5"
                  max="12.0"
                  className="form-control-dairy"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  required
                />
                <span className="input-addon">%</span>
              </div>
            </div>

            {/* SNF % */}
            <div className="col-6 col-md-4">
              <label className="form-label">SNF % (Solids-Not-Fat) *</label>
              <div className="input-group-dairy">
                <input
                  type="number"
                  step="0.1"
                  min="7.0"
                  max="11.0"
                  className="form-control-dairy"
                  value={snf}
                  onChange={(e) => setSnf(e.target.value)}
                  required
                />
                <span className="input-addon">%</span>
              </div>
            </div>
          </div>

          {/* Live Automatic Calculation Box */}
          <div className="mt-6 p-5 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 mb-3">
              <Calculator size={18} className="text-emerald-700" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Live Quality Rate Calculation
              </span>
            </div>

            <div className="row g-3 align-items-center">
              <div className="col-6 col-md-4">
                <div className="text-xs text-slate-500">Formula Rate / Liter</div>
                <div className="text-xl font-extrabold text-emerald-800 font-mono">
                  ₹{calculatedRate.toFixed(2)}
                </div>
              </div>

              <div className="col-6 col-md-4">
                <div className="text-xs text-slate-500">Intake Quantity</div>
                <div className="text-xl font-extrabold text-slate-800 font-mono">
                  {parseFloat(quantity) || 0} L
                </div>
              </div>

              <div className="col-12 col-md-4">
                <div className="text-xs text-slate-500">Total Payable to Farmer</div>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono">
                  ₹{calculatedTotal.toFixed(2)}
                </div>
              </div>
            </div>

            <div className="text-[11px] text-slate-400 mt-2">
              * Governed by AmritDhara Rate Chart: Base {milkType} rate + Fat & SNF incentive multiplier.
            </div>
          </div>
        </form>
      </Modal>

      {/* 6. PRINT THERMAL SLIP MODAL */}
      {selectedReceipt && (
        <PrintReceiptModal
          isOpen={!!selectedReceipt}
          onClose={() => setSelectedReceipt(null)}
          data={selectedReceipt}
          type="milk"
        />
      )}
    </div>
  );
};
