import React, { useState, useMemo } from 'react';
import {
  Plus,
  Eye,
  Edit2,
  Trash2,
  CreditCard,
  Building,
  CheckCircle,
  Phone,
  MapPin,
  Download
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';
import { CommonTable } from '../components/common/CommonTable';
import { ActionMenu } from '../components/common/ActionMenu';
import { CustomDropdown } from '../components/common/CustomDropdown';

export const FarmersView = () => {
  const {
    farmers,
    addFarmer,
    updateFarmer,
    deleteFarmer,
    milkRecords,
    settleFarmerPayment,
    showToast
  } = useDairy();

  const [searchTerm, setSearchTerm] = useState('');
  const [villageFilter, setVillageFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isSettleModalOpen, setIsSettleModalOpen] = useState(false);
  const [selectedFarmer, setSelectedFarmer] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    village: 'Shirwal',
    cows: 4,
    buffaloes: 2,
    bankName: 'State Bank of India',
    accountNumber: '',
    ifsc: 'SBIN0004291',
    status: 'Active'
  });

  // Payout Settlement Form State
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMethod, setPayoutMethod] = useState('Bank Transfer (NEFT)');
  const [payoutRef, setPayoutRef] = useState('');

  // Unique villages
  const villages = ['All', ...new Set(farmers.map(f => f.village))];

  // Open Edit
  const handleOpenEdit = (farmer) => {
    setSelectedFarmer(farmer);
    setFormData({
      name: farmer.name,
      phone: farmer.phone,
      village: farmer.village,
      cows: farmer.cows,
      buffaloes: farmer.buffaloes,
      bankName: farmer.bankName,
      accountNumber: farmer.accountNumber,
      ifsc: farmer.ifsc,
      status: farmer.status
    });
    setIsEditModalOpen(true);
  };

  // Open View Profile
  const handleOpenView = (farmer) => {
    setSelectedFarmer(farmer);
    setIsViewModalOpen(true);
  };

  // Open Settle
  const handleOpenSettle = (farmer) => {
    setSelectedFarmer(farmer);
    setPayoutAmount(farmer.pendingDue.toString());
    setPayoutRef(`NEFT-PUN-${Date.now().toString().slice(-6)}`);
    setIsSettleModalOpen(true);
  };

  // Submit Add
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please enter farmer name and phone number', 'warning');
      return;
    }
    addFarmer({
      ...formData,
      cows: parseInt(formData.cows) || 0,
      buffaloes: parseInt(formData.buffaloes) || 0,
      totalCattle: (parseInt(formData.cows) || 0) + (parseInt(formData.buffaloes) || 0)
    });
    setIsAddModalOpen(false);
    resetForm();
  };

  // Submit Edit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    updateFarmer(selectedFarmer.id, {
      ...formData,
      cows: parseInt(formData.cows) || 0,
      buffaloes: parseInt(formData.buffaloes) || 0,
      totalCattle: (parseInt(formData.cows) || 0) + (parseInt(formData.buffaloes) || 0)
    });
    setIsEditModalOpen(false);
  };

  // Submit Payout Settlement
  const handleSettleSubmit = (e) => {
    e.preventDefault();
    const amount = parseFloat(payoutAmount);
    if (!amount || amount <= 0) {
      showToast('Please enter a valid payout amount', 'warning');
      return;
    }
    settleFarmerPayment(selectedFarmer.id, amount, payoutMethod, payoutRef);
    setIsSettleModalOpen(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      village: 'Shirwal',
      cows: 4,
      buffaloes: 2,
      bankName: 'State Bank of India',
      accountNumber: '',
      ifsc: 'SBIN0004291',
      status: 'Active'
    });
  };

  // Filtered farmers
  const filteredFarmers = farmers.filter(f => {
    const matchesVillage = villageFilter === 'All' || f.village === villageFilter;
    const matchesStatus = statusFilter === 'All' || f.paymentStatus === statusFilter;
    const matchesSearch = !searchTerm ||
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.phone.includes(searchTerm) ||
      f.village.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesVillage && matchesStatus && matchesSearch;
  });

  // Farmer's milk records for profile modal
  const farmerMilkRecords = selectedFarmer ? milkRecords.filter(r => r.farmerId === selectedFarmer.id) : [];

  const [selectedFarmerIds, setSelectedFarmerIds] = useState([]);

  // Column definitions for CommonTable
  const farmerColumns = useMemo(() => [
    {
      key: 'id',
      label: 'Farmer ID',
      sortable: true,
      width: '130px',
      render: (farmer) => (
        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 text-xs">
          {farmer.id}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Farmer Name',
      sortable: true,
      render: (farmer) => {
        const initials = farmer.name
          ? farmer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
          : 'FR';
        return (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 shadow-2xs">
              {initials}
            </div>
            <div className="min-w-0">
              <div className="font-bold text-slate-800 text-[13.5px] truncate">{farmer.name}</div>
              <div className="text-[11px] text-slate-400">Joined {farmer.joinDate || '2023-01'}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'phone',
      label: 'Mobile Number',
      sortable: true,
      width: '145px',
      render: (farmer) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium">
          <Phone size={13} className="text-slate-400" />
          <span>{farmer.phone}</span>
        </div>
      )
    },
    {
      key: 'village',
      label: 'Village',
      sortable: true,
      width: '135px',
      render: (farmer) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
          <MapPin size={13} className="text-emerald-500" />
          <span>{farmer.village}</span>
        </div>
      )
    },
    {
      key: 'totalCattle',
      label: 'Animal Count',
      sortable: true,
      width: '185px',
      sortValue: (f) => f.totalCattle || (f.cows + f.buffaloes) || 0,
      render: (farmer) => (
        <div className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2 py-0.5 rounded-full border border-sky-200 text-xs font-semibold">
          <span>{farmer.totalCattle || ((farmer.cows || 0) + (farmer.buffaloes || 0))} Cattle</span>
          <span className="text-[10px] text-sky-600 font-normal">
            ({farmer.cows || 0} Cows, {farmer.buffaloes || 0} Buff)
          </span>
        </div>
      )
    },
    {
      key: 'totalMilk',
      label: 'Total Milk',
      sortable: true,
      align: 'right',
      width: '115px',
      sortValue: (f) => Number(f.totalMilk) || 0,
      render: (farmer) => (
        <div className="text-right">
          <span className="font-bold text-slate-900 text-[13.5px]">
            {farmer.totalMilk}
          </span>
          <span className="text-xs text-slate-500 font-medium ml-1">L</span>
        </div>
      )
    },
    {
      key: 'pendingDue',
      label: 'Pending Dues',
      sortable: true,
      align: 'right',
      width: '135px',
      sortValue: (f) => Number(f.pendingDue) || 0,
      render: (farmer) => (
        <div className="text-right">
          {farmer.pendingDue > 0 ? (
            <span className="font-bold text-rose-600 font-mono text-[13.5px]">
              ₹{Number(farmer.pendingDue).toLocaleString()}
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-mono">₹0.00</span>
          )}
        </div>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Payment Status',
      sortable: true,
      width: '130px',
      render: (farmer) => {
        const isPaid = farmer.paymentStatus === 'Paid';
        const isPending = farmer.paymentStatus === 'Pending';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
            isPaid
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : isPending
              ? 'bg-rose-50 text-rose-700 border border-rose-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
              isPaid ? 'bg-emerald-500' : isPending ? 'bg-rose-500' : 'bg-amber-500'
            }`} />
            {farmer.paymentStatus}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      width: '85px',
      render: (farmer) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            align="right"
            items={[
              {
                label: 'View Profile & Logs',
                icon: <Eye size={15} />,
                onClick: () => handleOpenView(farmer)
              },
              {
                label: 'Edit Details',
                icon: <Edit2 size={14} />,
                onClick: () => handleOpenEdit(farmer)
              },
              farmer.pendingDue > 0 ? {
                label: `Settle Dues (₹${Number(farmer.pendingDue).toLocaleString()})`,
                icon: <CreditCard size={14} />,
                onClick: () => handleOpenSettle(farmer)
              } : null,
              { divider: true },
              {
                label: 'Delete Farmer',
                icon: <Trash2 size={14} />,
                danger: true,
                onClick: () => {
                  if (window.confirm(`Are you sure you want to remove ${farmer.name}?`)) {
                    deleteFarmer(farmer.id);
                  }
                }
              }
            ].filter(Boolean)}
          />
        </div>
      )
    }
  ], [deleteFarmer]);

  // Export handlers
  const handleFarmerExport = (format) => {
    if (format === 'print') {
      window.print();
      return;
    }
    const headers = ['Farmer ID', 'Name', 'Phone', 'Village', 'Total Cattle', 'Total Milk (L)', 'Pending Due (₹)', 'Payment Status'];
    const rows = filteredFarmers.map(f => [
      f.id,
      f.name,
      f.phone,
      f.village,
      f.totalCattle || ((f.cows || 0) + (f.buffaloes || 0)),
      f.totalMilk,
      f.pendingDue,
      f.paymentStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.map(c => `"${c}"`).join(','))].join('\n');
    const encoded = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encoded);
    link.setAttribute('download', `farmers_directory_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Farmers exported successfully', 'success');
  };

  const extraToolbar = (
    <div className="flex items-center gap-2">
      <CustomDropdown
        icon={<MapPin size={13} className="text-emerald-500" />}
        options={villages.map(v => ({
          label: `Village: ${v}`,
          value: v
        }))}
        value={villageFilter}
        onChange={setVillageFilter}
        defaultValue="All"
        placeholder="All Villages"
      />
      <CustomDropdown
        options={[
          { label: 'All Payment Statuses', value: 'All' },
          { label: 'Fully Paid', value: 'Paid' },
          { label: 'Pending Payment', value: 'Pending' },
          { label: 'Partial Paid', value: 'Partial' }
        ]}
        value={statusFilter}
        onChange={setStatusFilter}
        defaultValue="All"
        placeholder="All Statuses"
      />
    </div>
  );

  const bulkActionNode = (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 transition flex items-center gap-1.5 shadow-sm"
        onClick={() => {
          showToast(`Exporting statements for ${selectedFarmerIds.length} farmers`, 'info');
        }}
      >
        <Download size={13} /> Export Statements ({selectedFarmerIds.length})
      </button>
    </div>
  );

  return (
    <div>
      {/* Page Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Farmers Management</h1>
          <p className="text-sm text-slate-500">
            Dairy farmer registry, cattle inventory, milk supply history, and bank payout records.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy"
          onClick={() => {
            resetForm();
            setIsAddModalOpen(true);
          }}
        >
          <Plus size={18} /> Register New Farmer
        </button>
      </div>

      {/* Modern CommonTable Component */}
      <CommonTable
        columns={farmerColumns}
        data={filteredFarmers}
        title="Farmers Directory & Cattle Ledger"
        subtitle={`Showing ${filteredFarmers.length} of ${farmers.length} registered farmers`}
        searchable={true}
        searchPlaceholder="Search by name, ID, phone, village..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        extraToolbar={extraToolbar}
        showCheckbox={true}
        selectedItems={selectedFarmerIds}
        onSelectionChange={setSelectedFarmerIds}
        bulkActionNode={bulkActionNode}
        densityToggle={true}
        exportFormats={['csv', 'excel', 'print']}
        onExport={handleFarmerExport}
        pagination={true}
        defaultPageSize={10}
        pageSizeOptions={[10, 25, 50, 100]}
        emptyTitle="No farmers found"
        emptyMessage="No dairy farmers match your search or filter criteria."
        onEmptyReset={() => {
          setSearchTerm('');
          setVillageFilter('All');
          setStatusFilter('All');
        }}
        onRowClick={(farmer) => handleOpenView(farmer)}
      />

      {/* Add / Register Farmer Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Dairy Farmer"
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleAddSubmit}>
              <CheckCircle size={16} /> Register Farmer
            </button>
          </>
        }
      >
        <form onSubmit={handleAddSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Farmer Full Name *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Ramesh Baburao Shinde"
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

            <div className="col-12 col-md-6">
              <label className="form-label">Village / Location *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Shirwal, Khandala, Wai"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                required
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Number of Cows</label>
              <input
                type="number"
                min="0"
                className="form-control-dairy"
                value={formData.cows}
                onChange={(e) => setFormData({ ...formData, cows: e.target.value })}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Number of Buffaloes</label>
              <input
                type="number"
                min="0"
                className="form-control-dairy"
                value={formData.buffaloes}
                onChange={(e) => setFormData({ ...formData, buffaloes: e.target.value })}
              />
            </div>

            <div className="col-12">
              <div className="text-sm font-bold text-emerald-800 my-3 pb-1 border-b border-emerald-100">
                Bank Account Details (For Direct Milk Payment Credits)
              </div>
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. State Bank of India"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="Account No."
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. SBIN0004291"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Edit Farmer Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={`Edit Farmer Profile (${selectedFarmer?.id})`}
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleEditSubmit}>
              Update Profile
            </button>
          </>
        }
      >
        <form onSubmit={handleEditSubmit}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label">Farmer Full Name</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-control-dairy"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label">Village / Location</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Cows</label>
              <input
                type="number"
                min="0"
                className="form-control-dairy"
                value={formData.cows}
                onChange={(e) => setFormData({ ...formData, cows: e.target.value })}
              />
            </div>

            <div className="col-6 col-md-3">
              <label className="form-label">Buffaloes</label>
              <input
                type="number"
                min="0"
                className="form-control-dairy"
                value={formData.buffaloes}
                onChange={(e) => setFormData({ ...formData, buffaloes: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Bank Name</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.bankName}
                onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">Account Number</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.accountNumber}
                onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-4">
              <label className="form-label">IFSC Code</label>
              <input
                type="text"
                className="form-control-dairy"
                value={formData.ifsc}
                onChange={(e) => setFormData({ ...formData, ifsc: e.target.value.toUpperCase() })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* View Farmer Profile Modal */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Farmer Profile & Supply History"
        size="lg"
        footer={
          <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsViewModalOpen(false)}>
            Close
          </button>
        }
      >
        {selectedFarmer && (
          <div>
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl mb-5 border border-slate-200">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg">
                {selectedFarmer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-lg font-extrabold text-slate-800 truncate">{selectedFarmer.name}</div>
                <div className="text-xs text-slate-500">
                  Farmer ID: <strong className="text-emerald-600">{selectedFarmer.id}</strong> • Village: {selectedFarmer.village}
                </div>
              </div>
              <div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${selectedFarmer.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                  {selectedFarmer.paymentStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <div className="text-xs text-slate-500">Cattle Count</div>
                <div className="font-bold text-base text-slate-800">{selectedFarmer.totalCattle} Animals</div>
                <div className="text-xs text-slate-400">{selectedFarmer.cows} Cows, {selectedFarmer.buffaloes} Buff</div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <div className="text-xs text-slate-500">Total Milk Supplied</div>
                <div className="font-bold text-emerald-600 text-base">{selectedFarmer.totalMilk} L</div>
                <div className="text-xs text-slate-400">Avg Fat: {selectedFarmer.avgFat}%</div>
              </div>

              <div className="p-3 border border-slate-200 rounded-lg bg-white">
                <div className="text-xs text-slate-500">Pending Payout</div>
                <div className="font-bold text-rose-600 text-base">₹{selectedFarmer.pendingDue}</div>
                <div className="text-xs text-slate-400">Cycle Settlement</div>
              </div>
            </div>

            {/* Bank Info */}
            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 mb-5 flex items-center gap-3">
              <Building size={20} className="text-amber-600 shrink-0" />
              <div className="text-xs text-slate-700">
                <strong>Bank:</strong> {selectedFarmer.bankName} | <strong>A/C:</strong> {selectedFarmer.accountNumber} | <strong>IFSC:</strong> {selectedFarmer.ifsc}
              </div>
            </div>

            {/* Recent Supply Logs */}
            <div className="font-bold text-sm mb-2 text-slate-800">
              Recent Milk Intake Logs ({farmerMilkRecords.length})
            </div>
            <div className="overflow-x-auto max-h-[200px] border border-slate-200 rounded-lg">
              <table className="min-w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Date & Shift</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Qty (L)</th>
                    <th className="px-3 py-2 font-semibold">Fat/SNF</th>
                    <th className="px-3 py-2 font-semibold">Rate</th>
                    <th className="px-3 py-2 font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {farmerMilkRecords.length > 0 ? (
                    farmerMilkRecords.map(r => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-3 py-2 text-slate-600">{r.date} ({r.shift})</td>
                        <td className="px-3 py-2 text-slate-700">{r.milkType}</td>
                        <td className="px-3 py-2 font-bold text-slate-900">{r.quantity.toFixed(1)} L</td>
                        <td className="px-3 py-2 text-slate-600">{r.fat}% / {r.snf}%</td>
                        <td className="px-3 py-2 text-slate-600">₹{r.rate.toFixed(2)}</td>
                        <td className="px-3 py-2 font-bold text-emerald-600">₹{r.totalAmount.toFixed(2)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="text-center py-4 text-slate-400">
                        No milk intake recorded yet for this farmer.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </Modal>

      {/* Settle Farmer Payment Modal */}
      <Modal
        isOpen={isSettleModalOpen}
        onClose={() => setIsSettleModalOpen(false)}
        title={`Settle Farmer Payment: ${selectedFarmer?.name}`}
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsSettleModalOpen(false)}>
              Cancel
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={handleSettleSubmit}>
              <CheckCircle size={16} /> Confirm Bank Payout
            </button>
          </>
        }
      >
        <form onSubmit={handleSettleSubmit}>
          <div className="form-group">
            <label className="form-label">Total Outstanding Due</label>
            <div className="text-2xl font-extrabold text-rose-600 font-mono">
              ₹{selectedFarmer?.pendingDue.toLocaleString()}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Settlement Amount (₹) *</label>
            <input
              type="number"
              className="form-control-dairy"
              value={payoutAmount}
              onChange={(e) => setPayoutAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Payment Mode *</label>
            <select
              className="form-control-dairy"
              value={payoutMethod}
              onChange={(e) => setPayoutMethod(e.target.value)}
            >
              <option value="Bank Transfer (NEFT)">Bank Transfer (NEFT / RTGS)</option>
              <option value="UPI / PhonePe">Direct UPI to Mobile</option>
              <option value="Cash Voucher">Cash Voucher from Dairy Desk</option>
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
    </div>
  );
};
