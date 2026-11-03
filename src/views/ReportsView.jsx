import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Milk,
  DollarSign,
  TrendingUp,
  MapPin,
  Eye
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { CommonTable } from '../components/common/CommonTable';
import { ActionMenu } from '../components/common/ActionMenu';
import { CustomDropdown } from '../components/common/CustomDropdown';

export const ReportsView = () => {
  const { milkRecords, farmers, sales, expenses, showToast } = useDairy();

  const [reportType, setReportType] = useState('daily-milk');
  const [dateRange, setDateRange] = useState('Today');

  // Aggregations
  const totalLiters = milkRecords.reduce((acc, r) => acc + r.quantity, 0);
  const cowLiters = milkRecords.filter(r => r.milkType === 'Cow').reduce((acc, r) => acc + r.quantity, 0);
  const bufLiters = milkRecords.filter(r => r.milkType === 'Buffalo').reduce((acc, r) => acc + r.quantity, 0);

  const avgFat = milkRecords.length > 0 
    ? (milkRecords.reduce((acc, r) => acc + r.fat, 0) / milkRecords.length).toFixed(2) 
    : '0';

  const avgSnf = milkRecords.length > 0 
    ? (milkRecords.reduce((acc, r) => acc + r.snf, 0) / milkRecords.length).toFixed(2) 
    : '0';

  const totalSalesRevenue = sales.reduce((acc, s) => acc + s.total, 0);
  const totalExpensesAmount = expenses.reduce((acc, e) => acc + e.amount, 0);
  const totalFarmerPayouts = milkRecords.reduce((acc, r) => acc + r.totalAmount, 0);

  // Export CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (reportType === 'daily-milk') {
      csvContent += "SlipNo,Date,Shift,Farmer,Type,Quantity,Fat,SNF,Rate,Amount\n";
      milkRecords.forEach(r => {
        csvContent += `"${r.slipNo}","${r.date}","${r.shift}","${r.farmerName}","${r.milkType}",${r.quantity},${r.fat},${r.snf},${r.rate},${r.totalAmount}\n`;
      });
    } else {
      csvContent += "Invoice,Date,Customer,Subtotal,Discount,NetTotal,PaymentMethod\n";
      sales.forEach(s => {
        csvContent += `"${s.id}","${s.date}","${s.customerName}",${s.subtotal},${s.discount},${s.total},"${s.paymentMethod}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${reportType}_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Report CSV downloaded successfully', 'success');
  };

  // Columns for Daily Milk Quality Table
  const dailyMilkColumns = useMemo(() => [
    {
      key: 'slipNo',
      label: 'Slip ID',
      sortable: true,
      width: '135px',
      render: (r) => (
        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 text-xs">
          {r.slipNo}
        </span>
      )
    },
    {
      key: 'dateTime',
      label: 'Date & Time',
      sortable: true,
      width: '160px',
      sortValue: (r) => `${r.date} ${r.time}`,
      render: (r) => (
        <div>
          <div className="font-semibold text-slate-800 text-xs">{r.date}</div>
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
          {r.shift === 'Morning' ? '☀️ Morning' : '🌙 Evening'}
        </span>
      )
    },
    {
      key: 'farmerName',
      label: 'Farmer',
      sortable: true,
      render: (r) => {
        const initials = r.farmerName ? r.farmerName.slice(0, 2).toUpperCase() : 'FR';
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 shadow-2xs">
              {initials}
            </div>
            <span className="font-semibold text-slate-800 text-xs truncate">{r.farmerName}</span>
          </div>
        );
      }
    },
    {
      key: 'milkType',
      label: 'Milk Variety',
      sortable: true,
      width: '125px',
      render: (r) => (
        <span className={`badge-dairy ${r.milkType?.toLowerCase()}`}>
          {r.milkType === 'Cow' ? '🐄 Cow' : '🐃 Buffalo'}
        </span>
      )
    },
    {
      key: 'quantity',
      label: 'Quantity (L)',
      sortable: true,
      align: 'right',
      width: '120px',
      sortValue: (r) => Number(r.quantity) || 0,
      render: (r) => (
        <div className="text-right font-bold text-slate-900 text-xs">
          {Number(r.quantity).toFixed(1)} <span className="text-[11px] text-slate-400 font-normal">L</span>
        </div>
      )
    },
    {
      key: 'fat',
      label: 'Fat %',
      sortable: true,
      align: 'right',
      width: '95px',
      sortValue: (r) => Number(r.fat) || 0,
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
      sortValue: (r) => Number(r.snf) || 0,
      render: (r) => (
        <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200/80 text-xs">
          {Number(r.snf).toFixed(1)}%
        </span>
      )
    },
    {
      key: 'rate',
      label: 'Rate/L (₹)',
      sortable: true,
      align: 'right',
      width: '110px',
      sortValue: (r) => Number(r.rate) || 0,
      render: (r) => (
        <span className="font-semibold text-slate-700 text-xs">
          ₹{Number(r.rate).toFixed(2)}
        </span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total Payout (₹)',
      sortable: true,
      align: 'right',
      width: '140px',
      sortValue: (r) => Number(r.totalAmount) || 0,
      render: (r) => (
        <span className="font-extrabold text-emerald-700 font-mono text-xs">
          ₹{Number(r.totalAmount).toFixed(2)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      width: '75px',
      render: (r) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            align="right"
            items={[
              {
                label: `Print Slip #${r.slipNo}`,
                icon: <Printer size={14} />,
                onClick: () => {
                  showToast(`Printed slip ${r.slipNo} for ${r.farmerName}`, 'success');
                }
              },
              {
                label: 'View Intake Quality',
                icon: <Eye size={14} />,
                onClick: () => {
                  showToast(`Batch: ${r.farmerName} - Fat: ${r.fat}%, SNF: ${r.snf}%`, 'info');
                }
              }
            ]}
          />
        </div>
      )
    }
  ], [showToast]);

  // Columns for Farmer-wise Supply Table
  const farmerSupplyColumns = useMemo(() => [
    {
      key: 'id',
      label: 'Farmer Code',
      sortable: true,
      width: '130px',
      render: (f) => (
        <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200/80 text-xs">
          {f.id}
        </span>
      )
    },
    {
      key: 'name',
      label: 'Farmer Name',
      sortable: true,
      render: (f) => {
        const initials = f.name ? f.name.slice(0, 2).toUpperCase() : 'FR';
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-200 shadow-2xs">
              {initials}
            </div>
            <span className="font-bold text-slate-800 text-xs truncate">{f.name}</span>
          </div>
        );
      }
    },
    {
      key: 'village',
      label: 'Village',
      sortable: true,
      width: '135px',
      render: (f) => (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin size={13} className="text-emerald-500" />
          <span>{f.village}</span>
        </div>
      )
    },
    {
      key: 'totalCattle',
      label: 'Total Cattle',
      sortable: true,
      width: '140px',
      sortValue: (f) => f.totalCattle || 0,
      render: (f) => (
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-200">
          {f.totalCattle || ((f.cows || 0) + (f.buffaloes || 0))} Animals
        </span>
      )
    },
    {
      key: 'totalMilk',
      label: 'Total Milk (L)',
      sortable: true,
      align: 'right',
      width: '145px',
      sortValue: (f) => Number(f.totalMilk) || 0,
      render: (f) => (
        <div className="text-right font-bold text-emerald-700 text-xs font-mono">
          {f.totalMilk} L
        </div>
      )
    },
    {
      key: 'avgFat',
      label: 'Avg Fat %',
      sortable: true,
      align: 'right',
      width: '105px',
      sortValue: (f) => Number(f.avgFat) || 0,
      render: (f) => (
        <span className="font-semibold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-xs">
          {f.avgFat}%
        </span>
      )
    },
    {
      key: 'avgSnf',
      label: 'Avg SNF %',
      sortable: true,
      align: 'right',
      width: '105px',
      sortValue: (f) => Number(f.avgSnf) || 0,
      render: (f) => (
        <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 text-xs">
          {f.avgSnf}%
        </span>
      )
    },
    {
      key: 'pendingDue',
      label: 'Outstanding Dues',
      sortable: true,
      align: 'right',
      width: '150px',
      sortValue: (f) => Number(f.pendingDue) || 0,
      render: (f) => (
        <div className="text-right">
          {f.pendingDue > 0 ? (
            <span className="font-bold text-rose-600 font-mono text-xs">
              ₹{Number(f.pendingDue).toLocaleString()}
            </span>
          ) : (
            <span className="text-slate-400 font-mono text-xs">₹0.00</span>
          )}
        </div>
      )
    },
    {
      key: 'paymentStatus',
      label: 'Status',
      sortable: true,
      width: '125px',
      render: (f) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          f.paymentStatus === 'Paid'
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            : 'bg-rose-50 text-rose-700 border border-rose-200'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${f.paymentStatus === 'Paid' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          {f.paymentStatus}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      width: '75px',
      render: (f) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            align="right"
            items={[
              {
                label: `View ${f.name} Dossier`,
                icon: <Eye size={14} />,
                onClick: () => {
                  showToast(`Opening profile for ${f.name} (${f.id})`, 'info');
                }
              },
              {
                label: 'Export Passbook',
                icon: <Download size={14} />,
                onClick: () => {
                  showToast(`Passbook downloaded for ${f.name}`, 'success');
                }
              }
            ]}
          />
        </div>
      )
    }
  ], [showToast]);

  // Export handlers for CommonTable
  const handleDailyMilkExport = (format) => {
    if (format === 'print') {
      window.print();
      return;
    }
    const headers = ['Slip ID', 'Date', 'Time', 'Shift', 'Farmer', 'Milk Type', 'Quantity (L)', 'Fat %', 'SNF %', 'Rate', 'Total (₹)'];
    const rows = milkRecords.map(r => [
      r.slipNo, r.date, r.time, r.shift, r.farmerName, r.milkType, r.quantity, r.fat, r.snf, r.rate, r.totalAmount
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(row => row.map(c => `"${c}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `shift_quality_intake_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Intake quality report exported', 'success');
  };

  const handleFarmerSupplyExport = (format) => {
    if (format === 'print') {
      window.print();
      return;
    }
    const headers = ['Farmer Code', 'Farmer Name', 'Village', 'Cattle Count', 'Total Milk (L)', 'Avg Fat %', 'Avg SNF %', 'Dues (₹)', 'Status'];
    const rows = farmers.map(f => [
      f.id, f.name, f.village, f.totalCattle || (f.cows + f.buffaloes), f.totalMilk, f.avgFat, f.avgSnf, f.pendingDue, f.paymentStatus
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(row => row.map(c => `"${c}"`).join(','))].join('\n');
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = `farmer_supply_summary_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Farmer supply summary exported', 'success');
  };

  return (
    <div>
      {/* Title & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Reports & Dairy Analytics</h1>
          <p className="text-sm text-slate-500">
            Milk intake distribution, Fat/SNF quality analysis, farmer supply statements, and financial P&L.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="btn-dairy btn-secondary-dairy flex items-center gap-2 cursor-pointer" onClick={handleExportCSV}>
            <Download size={16} /> Export CSV
          </button>
          <button className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer" onClick={() => window.print()}>
            <Printer size={16} /> Print Full Report
          </button>
        </div>
      </div>

      {/* Report Selector Pills */}
      <div className="card-dairy mb-4 relative z-30 overflow-visible">
        <div className="card-dairy-body py-3.5 px-5 overflow-visible">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="tab-pills">
              <button
                className={`tab-pill-btn ${reportType === 'daily-milk' ? 'active' : ''}`}
                onClick={() => setReportType('daily-milk')}
              >
                Milk Collection Quality
              </button>
              <button
                className={`tab-pill-btn ${reportType === 'farmer-supply' ? 'active' : ''}`}
                onClick={() => setReportType('farmer-supply')}
              >
                Farmer-wise Supply
              </button>
              <button
                className={`tab-pill-btn ${reportType === 'financial' ? 'active' : ''}`}
                onClick={() => setReportType('financial')}
              >
                Income & P&L Statement
              </button>
            </div>

            <CustomDropdown
              icon={<Calendar size={14} className="text-emerald-600" />}
              options={[
                { label: 'Current Shift / Today', value: 'Today' },
                { label: 'This Week (Last 7 Days)', value: 'Week' },
                { label: 'Billing Cycle (11th - 20th Oct)', value: 'Cycle' },
                { label: 'Month of October 2026', value: 'Month' }
              ]}
              value={dateRange}
              onChange={setDateRange}
              defaultValue="Today"
              clearable={false}
              placeholder="Select Date Range"
            />
          </div>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Total Volume Intake</span>
              <span className="stat-value">{totalLiters.toFixed(1)} <span className="text-base font-normal">L</span></span>
              <span className="stat-subtext text-success">Cow: {cowLiters}L | Buf: {bufLiters}L</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <Milk size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Average Fat Content</span>
              <span className="stat-value text-success">{avgFat}%</span>
              <span className="stat-subtext text-muted">Solids-Not-Fat: {avgSnf}%</span>
            </div>
            <div className="stat-icon-wrapper primary">
              <BarChart3 size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Total Milk Purchase</span>
              <span className="stat-value">₹{totalFarmerPayouts.toFixed(2)}</span>
              <span className="stat-subtext text-muted">Accrued to Farmers</span>
            </div>
            <div className="stat-icon-wrapper warning">
              <DollarSign size={24} />
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Gross Margin</span>
              <span className="stat-value text-success">₹{(totalSalesRevenue - totalExpensesAmount + 42000).toLocaleString()}</span>
              <span className="stat-subtext text-success">Positive cash flow</span>
            </div>
            <div className="stat-icon-wrapper info">
              <TrendingUp size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Report View */}
      {reportType === 'daily-milk' && (
        <CommonTable
          columns={dailyMilkColumns}
          data={milkRecords}
          title="Shift Quality & Milk Intake Analysis"
          subtitle={`Showing all intake batches logged for ${dateRange}`}
          searchable={true}
          searchPlaceholder="Search slips, farmers, milk variety..."
          densityToggle={true}
          exportFormats={['csv', 'excel', 'print']}
          onExport={handleDailyMilkExport}
          pagination={true}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No milk collection records"
          emptyMessage="No intake entries found for selected cycle."
        />
      )}

      {reportType === 'farmer-supply' && (
        <CommonTable
          columns={farmerSupplyColumns}
          data={farmers}
          title="Farmer-wise Milk Supply & Passbook Summary"
          subtitle="Consolidated livestock count, total intake volume and pending payments"
          searchable={true}
          searchPlaceholder="Search by farmer code, name, village..."
          densityToggle={true}
          exportFormats={['csv', 'excel', 'print']}
          onExport={handleFarmerSupplyExport}
          pagination={true}
          defaultPageSize={10}
          pageSizeOptions={[10, 25, 50, 100]}
          emptyTitle="No farmer supply records"
          emptyMessage="No supplier data found matching current criteria."
        />
      )}

      {reportType === 'financial' && (
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <DollarSign size={18} className="text-primary" />
              <span>Dairy Financial Ledger & P&L Statement</span>
            </div>
          </div>
          <div className="card-dairy-body">
            <div className="row g-4">
              <div className="col-12 col-md-6">
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="text-base font-extrabold text-emerald-800 mb-4">
                    Revenue & Inflows
                  </h3>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Retail Milk Sales:</span>
                    <strong className="text-emerald-700">₹{(totalSalesRevenue * 0.6).toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Artisan Ghee & Paneer Sales:</span>
                    <strong className="text-emerald-700">₹{(totalSalesRevenue * 0.4).toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Wholesale Bulk Supply to Hotels:</span>
                    <strong className="text-emerald-700">₹85,400.00</strong>
                  </div>
                  <div className="flex justify-between pt-3 font-extrabold text-sm text-slate-800">
                    <span>Total Inflow:</span>
                    <span className="text-emerald-700">₹{(totalSalesRevenue + 85400).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-6">
                <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <h3 className="text-base font-extrabold text-red-800 mb-4">
                    Operating Outflows & Deductions
                  </h3>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Farmer Milk Raw Procurement:</span>
                    <strong className="text-red-700">₹{totalFarmerPayouts.toFixed(2)}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Chilling Plant Electricity & Maintenance:</span>
                    <strong className="text-red-700">₹14,200.00</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Packaging Pouches & Glass Jars:</span>
                    <strong className="text-red-700">₹8,500.00</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-200/60 text-xs">
                    <span className="text-slate-600">Delivery Vehicle Fuel:</span>
                    <strong className="text-red-700">₹3,200.00</strong>
                  </div>
                  <div className="flex justify-between pt-3 font-extrabold text-sm text-slate-800">
                    <span>Total Operational Outflow:</span>
                    <span className="text-red-700">₹{(totalFarmerPayouts + totalExpensesAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
