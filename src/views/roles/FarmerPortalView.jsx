import React, { useState } from 'react';
import {
  Milk,
  CreditCard,
  Printer,
  Calendar,
  Building,
  Coins,
  CheckCircle,
  TrendingUp,
  User,
  MapPin,
  Phone
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';

export const FarmerPortalView = () => {
  const { farmers, milkRecords, calculateRate, currentUser } = useDairy();

  // Resolve dynamic logged-in farmer
  const farmer = farmers.find(f =>
    f.id === currentUser?.farmerId ||
    (currentUser?.phone && f.phone === currentUser.phone) ||
    (currentUser?.fullName && f.name?.toLowerCase() === currentUser.fullName.toLowerCase())
  ) || {
    id: currentUser?.farmerId || 'FRM-1024',
    name: currentUser?.fullName || 'Anand Rao Patil',
    phone: currentUser?.phone || '+91 98221 44356',
    village: currentUser?.branch || 'Sangli Dairy Center #12',
    totalMilk: 0,
    avgFat: 4.2,
    avgSnf: 8.6,
    pendingDue: 0,
    totalCattle: 0,
    cows: 0,
    buffaloes: 0,
    bankName: 'State Bank of India',
    accountNumber: '**** **** 1980',
    ifsc: 'SBIN0004291',
    paymentStatus: 'Paid'
  };

  // Records for this farmer
  const myMilkRecords = milkRecords.filter(r =>
    r.farmerId === farmer.id ||
    (currentUser?.farmerId && r.farmerId === currentUser.farmerId) ||
    (farmer.name && r.farmerName === farmer.name)
  );

  // Rate calc test for farmer
  const [testType, setTestType] = useState('Cow');
  const [testFat, setTestFat] = useState('4.2');
  const [testSnf, setTestSnf] = useState('8.6');
  const testRate = calculateRate(testType, testFat, testSnf);

  // Selected slip modal
  const [selectedSlip, setSelectedSlip] = useState(null);

  const totalMyLiters = myMilkRecords.reduce((acc, r) => acc + r.quantity, 0);
  const totalMyEarnings = myMilkRecords.reduce((acc, r) => acc + r.totalAmount, 0);

  return (
    <div>
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-green-900 to-green-700 text-white rounded-2xl p-7 mb-7 shadow-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white text-emerald-800 text-2xl font-extrabold flex items-center justify-center shadow-lg shrink-0">
            {currentUser?.avatar || farmer.name?.slice(0, 2).toUpperCase() || 'AP'}
          </div>
          <div>
            <div className="text-xs opacity-90 uppercase tracking-wider font-semibold">
              Farmer Member Portal &bull; {currentUser?.branch || farmer.village || 'AmritDhara Center'}
            </div>
            <h1 className="text-3xl font-extrabold text-white my-0.5 tracking-tight">
              {currentUser?.fullName || farmer.name}
            </h1>
            <div className="text-sm opacity-90">
              Farmer ID: <strong>{currentUser?.farmerId || farmer.id}</strong> | Village: {currentUser?.branch || farmer.village} | {currentUser?.phone || farmer.phone}
            </div>
          </div>
        </div>

        <div>
          <button
            className="btn-dairy bg-white text-green-950 font-bold hover:bg-slate-100 shadow transition flex items-center gap-2 cursor-pointer"
            onClick={() => window.print()}
          >
            <Printer size={16} /> Print Milk Passbook
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Total Milk Supplied</span>
              <span className="stat-value">{farmer.totalMilk} <span className="text-base font-normal">L</span></span>
              <span className="stat-subtext text-success">Accrued Volume</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Milk size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Average Fat & SNF</span>
              <span className="stat-value text-success">{farmer.avgFat}%</span>
              <span className="stat-subtext text-muted">SNF: {farmer.avgSnf}% (Grade A)</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Pending Bank Payout</span>
              <span className="stat-value text-danger">₹{farmer.pendingDue?.toLocaleString() || 0}</span>
              <span className="stat-subtext text-danger">Cycle 11th - 20th Oct</span>
            </div>
            <div className="stat-icon-wrapper warning">
              <CreditCard size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Registered Cattle</span>
              <span className="stat-value">{farmer.totalCattle || 0}</span>
              <span className="stat-subtext text-muted">{farmer.cows || 0} Cows, {farmer.buffaloes || 0} Buff</span>
            </div>
            <div className="stat-icon-wrapper info">
              <User size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Daily Records Table & Bank + Rate Calculator */}
      <div className="row g-4">
        {/* Left: Daily Milk Supply Table */}
        <div className="col-12 col-lg-8">
          <div className="card-dairy">
            <div className="card-dairy-header">
              <div className="card-dairy-title">
                <Milk size={18} className="text-primary" />
                <span>Daily Milk Supply Records & Fat/SNF Readings</span>
              </div>
            </div>
            <div className="table-responsive">
              <table className="table-dairy">
                <thead>
                  <tr>
                    <th>Slip No</th>
                    <th>Date</th>
                    <th>Shift</th>
                    <th>Milk Variety</th>
                    <th>Qty (L)</th>
                    <th>Fat %</th>
                    <th>SNF %</th>
                    <th>Rate / L</th>
                    <th>Total (₹)</th>
                    <th>Slip</th>
                  </tr>
                </thead>
                <tbody>
                  {myMilkRecords.length === 0 ? (
                    <tr>
                      <td colSpan="10" className="text-center py-8 text-slate-400">
                        No milk collection records recorded yet for this cycle.
                      </td>
                    </tr>
                  ) : (
                    myMilkRecords.map(r => (
                      <tr key={r.id}>
                        <td className="mono-font font-bold text-primary text-xs">
                          {r.slipNo}
                        </td>
                        <td>{r.date}</td>
                        <td>
                          <span className={`badge-dairy ${r.shift?.toLowerCase() || 'morning'}`}>{r.shift}</span>
                        </td>
                        <td>
                          <span className={`badge-dairy ${r.milkType?.toLowerCase() || 'cow'}`}>{r.milkType}</span>
                        </td>
                        <td className="font-bold">{r.quantity?.toFixed(1) || '0.0'} L</td>
                        <td>{r.fat?.toFixed(1) || '0.0'}%</td>
                        <td>{r.snf?.toFixed(1) || '0.0'}%</td>
                        <td>₹{r.rate?.toFixed(2) || '0.00'}</td>
                        <td className="font-bold text-success">₹{r.totalAmount?.toFixed(2) || '0.00'}</td>
                        <td>
                          <button
                            className="btn-icon"
                            title="Print Thermal Slip"
                            onClick={() => setSelectedSlip(r)}
                          >
                            <Printer size={14} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right: Bank Profile & Live Rate Calculator */}
        <div className="col-12 col-lg-4">
          {/* Bank Account */}
          <div className="card-dairy mb-4">
            <div className="card-dairy-header">
              <div className="card-dairy-title">
                <Building size={18} className="text-primary" />
                <span>Registered Bank Account</span>
              </div>
              <span className="badge-dairy success">KYC Verified</span>
            </div>
            <div className="card-dairy-body">
              <div className="text-sm mb-2">
                <span className="text-muted">Bank:</span> <strong>{farmer.bankName}</strong>
              </div>
              <div className="text-sm mb-2">
                <span className="text-muted">Account No:</span> <strong className="mono-font">{farmer.accountNumber}</strong>
              </div>
              <div className="text-sm mb-3">
                <span className="text-muted">IFSC Code:</span> <strong className="mono-font">{farmer.ifsc}</strong>
              </div>
              <div className="py-2.5 px-3.5 bg-slate-100 rounded-lg text-xs text-slate-600">
                Milk dues are settled bi-monthly directly to this account via NEFT/RTGS.
              </div>
            </div>
          </div>

          {/* Farmer Rate Estimator */}
          <div className="card-dairy">
            <div className="card-dairy-header">
              <div className="card-dairy-title">
                <Coins size={18} className="text-primary" />
                <span>Milk Rate Estimator</span>
              </div>
            </div>
            <div className="card-dairy-body">
              <div className="form-group mb-3">
                <label className="form-label text-xs font-semibold text-slate-700">Milk Variety</label>
                <select
                  className="form-control-dairy"
                  value={testType}
                  onChange={(e) => setTestType(e.target.value)}
                >
                  <option value="Cow">Cow Milk</option>
                  <option value="Buffalo">Buffalo Milk</option>
                </select>
              </div>

              <div className="row g-2 mb-3">
                <div className="col-6">
                  <label className="form-label text-xs font-semibold text-slate-700">Fat %</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control-dairy"
                    value={testFat}
                    onChange={(e) => setTestFat(e.target.value)}
                  />
                </div>
                <div className="col-6">
                  <label className="form-label text-xs font-semibold text-slate-700">SNF %</label>
                  <input
                    type="number"
                    step="0.1"
                    className="form-control-dairy"
                    value={testSnf}
                    onChange={(e) => setTestSnf(e.target.value)}
                  />
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-xl text-center border border-emerald-100">
                <div className="text-xs text-emerald-800 font-bold uppercase tracking-wider mb-1">
                  Expected Milk Rate
                </div>
                <div className="text-3xl font-extrabold text-emerald-700">
                  ₹{testRate.toFixed(2)} <span className="text-sm font-normal">/ Liter</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slip Modal */}
      {selectedSlip && (
        <PrintReceiptModal
          isOpen={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
          data={selectedSlip}
          type="milk"
        />
      )}
    </div>
  );
};
