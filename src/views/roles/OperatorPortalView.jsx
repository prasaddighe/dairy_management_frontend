import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Coins,
  Milk,
  Printer,
  Search,
  Calculator,
  Calendar,
  Sun,
  Moon,
  Scale,
  FlaskConical,
  Wifi,
  RotateCcw,
  FileSpreadsheet,
  Sliders,
  Sparkles,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { useDairy } from '../../context/DairyContext';
import { PrintReceiptModal } from '../../components/common/PrintReceiptModal';
import { Modal } from '../../components/common/Modal';
import { CommonTable } from '../../components/common/CommonTable';
import { ActionMenu } from '../../components/common/ActionMenu';
import { CustomDropdown } from '../../components/common/CustomDropdown';

export const OperatorPortalView = () => {
  const {
    farmers,
    milkRecords,
    addMilkRecord,
    calculateRate,
    currentShift,
    setCurrentShift,
    showToast,
    settings
  } = useDairy();

  // Fast Form Entry State
  const [selectedFarmerId, setSelectedFarmerId] = useState(farmers[0]?.id || '');
  const [farmerSearch, setFarmerSearch] = useState('');
  const [milkType, setMilkType] = useState('Cow');
  const [quantity, setQuantity] = useState('');
  const [fat, setFat] = useState('4.2');
  const [snf, setSnf] = useState('8.6');
  const [clr, setClr] = useState('28.5');
  const [selectedSlip, setSelectedSlip] = useState(null);

  // Modals
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isRateChartOpen, setIsRateChartOpen] = useState(false);
  const [isHardwareModalOpen, setIsHardwareModalOpen] = useState(false);

  // Table filter states
  const [tableSearch, setTableSearch] = useState('');
  const [tableTypeFilter, setTableTypeFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));

  // Hardware simulation states
  const [scaleReading, setScaleReading] = useState(false);
  const [analyzerReading, setAnalyzerReading] = useState(false);
  const [tareActive, setTareActive] = useState(false);

  const calculatedRate = calculateRate(milkType, fat, snf);
  const calculatedTotal = (parseFloat(quantity) || 0) * calculatedRate;

  const selectedFarmer = farmers.find(f => f.id === selectedFarmerId) || farmers[0];

  // Filtered farmers for fast lookup
  const filteredFarmerList = farmers.filter(f => 
    !farmerSearch || 
    f.name.toLowerCase().includes(farmerSearch.toLowerCase()) ||
    f.id.toLowerCase().includes(farmerSearch.toLowerCase()) ||
    (f.phone && f.phone.includes(farmerSearch)) ||
    (f.village && f.village.toLowerCase().includes(farmerSearch.toLowerCase()))
  );

  // Records for current shift and selected date
  const shiftRecords = milkRecords.filter(r => {
    const matchesShift = r.shift === currentShift;
    const matchesDate = !selectedDate || r.date === selectedDate;
    return matchesShift && matchesDate;
  });

  // Shift Aggregations
  const shiftLiters = shiftRecords.reduce((acc, r) => acc + (parseFloat(r.quantity) || 0), 0);
  const shiftTotalPayout = shiftRecords.reduce((acc, r) => acc + (parseFloat(r.totalAmount) || 0), 0);
  
  const cowRecords = shiftRecords.filter(r => r.milkType === 'Cow');
  const buffRecords = shiftRecords.filter(r => r.milkType === 'Buffalo');
  const cowLiters = cowRecords.reduce((acc, r) => acc + (parseFloat(r.quantity) || 0), 0);
  const buffLiters = buffRecords.reduce((acc, r) => acc + (parseFloat(r.quantity) || 0), 0);

  // Weighted Averages
  const weightedFat = shiftLiters > 0
    ? (shiftRecords.reduce((acc, r) => acc + (r.fat * r.quantity), 0) / shiftLiters).toFixed(2)
    : '0.0';
  const weightedSnf = shiftLiters > 0
    ? (shiftRecords.reduce((acc, r) => acc + (r.snf * r.quantity), 0) / shiftLiters).toFixed(2)
    : '0.0';

  // Target shift capacity (e.g. 350 Liters)
  const shiftTarget = 350;
  const targetProgress = Math.min(100, Math.round((shiftLiters / shiftTarget) * 100));

  // Handle Form Submission
  const handleRecordIntake = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!quantity || parseFloat(quantity) <= 0) {
      showToast('Please enter or capture milk quantity in Liters', 'warning');
      return;
    }

    const newRecord = addMilkRecord({
      farmerId: selectedFarmer.id,
      farmerName: selectedFarmer.name,
      shift: currentShift,
      milkType,
      quantity: parseFloat(quantity),
      fat: parseFloat(fat),
      snf: parseFloat(snf),
      rate: calculatedRate,
      totalAmount: calculatedTotal,
      date: selectedDate
    });

    // Reset quantity for next can
    setQuantity('');
    setSelectedSlip(newRecord);
  };

  // Hardware Simulation: Digital Weighing Scale Capture
  const handleReadScale = useCallback(() => {
    setScaleReading(true);
    setTimeout(() => {
      // Simulate realistic can weight based on selected milk type
      const simulatedWeight = milkType === 'Cow' 
        ? +(22 + Math.random() * 25).toFixed(1)
        : +(35 + Math.random() * 30).toFixed(1);
      setQuantity(simulatedWeight.toString());
      setScaleReading(false);
      showToast(`Scale COM1: Captured ${simulatedWeight} L weight!`, 'success');
    }, 600);
  }, [milkType, showToast]);

  // Hardware Simulation: Lactoscan Ultrasonic Analyzer Capture
  const handleReadAnalyzer = useCallback(() => {
    setAnalyzerReading(true);
    setTimeout(() => {
      if (milkType === 'Cow') {
        const simFat = (3.9 + Math.random() * 0.6).toFixed(1);
        const simSnf = (8.4 + Math.random() * 0.4).toFixed(1);
        setFat(simFat);
        setSnf(simSnf);
        setClr((27.5 + Math.random() * 2).toFixed(1));
      } else {
        const simFat = (6.4 + Math.random() * 1.2).toFixed(1);
        const simSnf = (8.9 + Math.random() * 0.5).toFixed(1);
        setFat(simFat);
        setSnf(simSnf);
        setClr((29.0 + Math.random() * 2).toFixed(1));
      }
      setAnalyzerReading(false);
      showToast('Analyzer COM2: Ultrasonic sample tested successfully!', 'success');
    }, 700);
  }, [milkType, showToast]);

  // Fast Demo Entry (fills next member for quick testing)
  const handleSimulateNextFarmer = () => {
    const randomIndex = Math.floor(Math.random() * farmers.length);
    const farmer = farmers[randomIndex];
    setSelectedFarmerId(farmer.id);
    const chosenType = Math.random() > 0.45 ? 'Cow' : 'Buffalo';
    setMilkType(chosenType);

    if (chosenType === 'Cow') {
      setQuantity((25 + Math.floor(Math.random() * 25)).toFixed(1));
      setFat((4.0 + Math.random() * 0.4).toFixed(1));
      setSnf((8.5 + Math.random() * 0.3).toFixed(1));
    } else {
      setQuantity((35 + Math.floor(Math.random() * 30)).toFixed(1));
      setFat((6.5 + Math.random() * 1.0).toFixed(1));
      setSnf((8.9 + Math.random() * 0.4).toFixed(1));
    }
    showToast(`Loaded ${farmer.name} (${chosenType}) ready for intake!`, 'info');
  };

  // Keyboard shortcut listener (Enter = Submit, F2 = Switch type, F3 = Scale, F4 = Analyzer)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        setMilkType(prev => prev === 'Cow' ? 'Buffalo' : 'Cow');
      } else if (e.key === 'F3') {
        e.preventDefault();
        handleReadScale();
      } else if (e.key === 'F4') {
        e.preventDefault();
        handleReadAnalyzer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleReadScale, handleReadAnalyzer]);

  // Filtered Table Slips
  const filteredTableSlips = shiftRecords.filter(r => {
    const matchesType = tableTypeFilter === 'All' || r.milkType === tableTypeFilter;
    const matchesSearch = !tableSearch || 
      r.farmerName.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.farmerId.toLowerCase().includes(tableSearch.toLowerCase()) ||
      r.slipNo.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Table Column Definitions for Shift Intake Stream
  const shiftTableColumns = useMemo(() => [
    {
      key: 'slipNo',
      label: 'Slip #',
      sortable: true,
      width: '135px',
      render: (r) => (
        <button
          type="button"
          onClick={() => setSelectedSlip(r)}
          className="font-mono font-bold text-emerald-700 hover:text-emerald-800 hover:underline bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 cursor-pointer text-xs"
        >
          {r.slipNo}
        </button>
      )
    },
    {
      key: 'time',
      label: 'Time',
      sortable: true,
      width: '95px',
      render: (r) => (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{r.time}</span>
      )
    },
    {
      key: 'farmerName',
      label: 'Farmer Member',
      sortable: true,
      width: '175px',
      render: (r) => (
        <div>
          <div className="fw-semibold text-slate-800" style={{ fontSize: '0.85rem' }}>{r.farmerName}</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>ID: {r.farmerId}</div>
        </div>
      )
    },
    {
      key: 'milkType',
      label: 'Type',
      sortable: true,
      width: '100px',
      render: (r) => (
        <span className={`badge-dairy ${r.milkType?.toLowerCase()}`}>
          {r.milkType === 'Cow' ? '🐄 Cow' : '🐃 Buff'}
        </span>
      )
    },
    {
      key: 'quantity',
      label: 'Qty (L)',
      sortable: true,
      align: 'right',
      width: '100px',
      render: (r) => (
        <span className="fw-bold" style={{ fontSize: '0.9rem' }}>
          {parseFloat(r.quantity).toFixed(1)} L
        </span>
      )
    },
    {
      key: 'fat',
      label: 'Fat / SNF',
      sortable: true,
      align: 'center',
      width: '110px',
      render: (r) => (
        <span style={{ fontSize: '0.8rem' }}>
          <strong>{r.fat}%</strong> / {r.snf}%
        </span>
      )
    },
    {
      key: 'rate',
      label: 'Rate',
      sortable: true,
      align: 'right',
      width: '90px',
      render: (r) => (
        <span style={{ fontSize: '0.825rem' }}>₹{parseFloat(r.rate).toFixed(2)}</span>
      )
    },
    {
      key: 'totalAmount',
      label: 'Total (₹)',
      sortable: true,
      align: 'right',
      width: '115px',
      render: (r) => (
        <span className="fw-bold text-success" style={{ fontSize: '0.925rem', fontFamily: 'Outfit' }}>
          ₹{parseFloat(r.totalAmount).toFixed(2)}
        </span>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      width: '80px',
      render: (r) => (
        <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          <ActionMenu
            align="right"
            items={[
              {
                label: 'Print Thermal Slip',
                icon: <Printer size={14} />,
                onClick: () => setSelectedSlip(r)
              },
              {
                label: 'View Intake Slip',
                icon: <Eye size={14} />,
                onClick: () => setSelectedSlip(r)
              }
            ]}
          />
        </div>
      )
    }
  ], []);

  return (
    <div>
      {/* 1. OPERATOR COMMAND HERO BANNER */}
      <div className="operator-hero-banner">
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.25rem', position: 'relative', zIndex: 2 }}>
          {/* Operator Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.15rem' }}>
            <div style={{
              width: '68px',
              height: '68px',
              borderRadius: '50%',
              backgroundColor: '#ffffff',
              color: 'var(--primary)',
              fontSize: '1.75rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
              position: 'relative',
              flexShrink: 0
            }}>
              SS
              <span style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                border: '2.5px solid #ffffff'
              }} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                <span style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '2px 8px',
                  borderRadius: '20px'
                }}>
                  BMCU Collection Center #04 • Shirwal
                </span>
                <span style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                  Desk OP-401
                </span>
              </div>
              <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.02em' }}>
                Suresh Shinde (Chief Operator)
              </h1>
              <div style={{ fontSize: '0.85rem', opacity: 0.92, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <span>⚡ High-Speed Electronic Counter Active</span>
                <span>• Bulk Cooler Temp: <strong>3.8°C (Normal)</strong></span>
                <span>• Center Capacity: <strong>5,000 L</strong></span>
              </div>
            </div>
          </div>

          {/* Right Action Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            {/* Shift Selector */}
            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '4px',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <button
                type="button"
                onClick={() => setCurrentShift('Morning')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  backgroundColor: currentShift === 'Morning' ? '#ffffff' : 'transparent',
                  color: currentShift === 'Morning' ? '#14532d' : '#ffffff',
                  boxShadow: currentShift === 'Morning' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Sun size={15} color={currentShift === 'Morning' ? '#f59e0b' : '#ffffff'} /> Morning
              </button>
              <button
                type="button"
                onClick={() => setCurrentShift('Evening')}
                style={{
                  padding: '0.45rem 0.9rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.825rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  backgroundColor: currentShift === 'Evening' ? '#ffffff' : 'transparent',
                  color: currentShift === 'Evening' ? '#14532d' : '#ffffff',
                  boxShadow: currentShift === 'Evening' ? '0 2px 6px rgba(0,0,0,0.15)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Moon size={15} color={currentShift === 'Evening' ? '#6366f1' : '#ffffff'} /> Evening
              </button>
            </div>

            {/* Quick Action Buttons */}
            <button
              type="button"
              className="btn-dairy"
              style={{ backgroundColor: '#ffffff', color: '#15803d', fontWeight: 700 }}
              onClick={() => setIsSummaryModalOpen(true)}
              title="Print Shift Reconciliation Sheet"
            >
              <FileSpreadsheet size={16} /> Shift Sheet
            </button>
            <button
              type="button"
              className="btn-dairy"
              style={{ backgroundColor: 'rgba(255,255,255,0.18)', color: '#ffffff', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }}
              onClick={() => setIsRateChartOpen(true)}
              title="View Rate Matrix Chart"
            >
              <Sliders size={16} /> Rate Chart
            </button>
          </div>
        </div>
      </div>

      {/* 2. REAL-TIME HARDWARE & PERIPHERAL DIAGNOSTICS RIBBON */}
      <div className="peripheral-ribbon">
        <div className="peripheral-item">
          <div className="peripheral-icon-box connected">
            <Scale size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" />
              <strong style={{ fontSize: '0.8rem' }}>Scale: CAS CI-2001A (COM1)</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Weight: {quantity ? `${quantity} L` : '0.00 kg (Live Stable)'} • <span style={{ color: '#059669', fontWeight: 600 }}>Connected</span>
            </div>
          </div>
        </div>

        <div className="peripheral-item">
          <div className="peripheral-icon-box connected">
            <FlaskConical size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" />
              <strong style={{ fontSize: '0.8rem' }}>Analyzer: Ekomilk Ultra (COM2)</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Ultrasonic Optical Cell • <span style={{ color: '#059669', fontWeight: 600 }}>Chamber Ready</span>
            </div>
          </div>
        </div>

        <div className="peripheral-item">
          <div className="peripheral-icon-box connected">
            <Printer size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" />
              <strong style={{ fontSize: '0.8rem' }}>Thermal Printer (80mm)</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              ESC/POS Auto-Cutter • <span style={{ color: '#059669', fontWeight: 600 }}>Online & Ready</span>
            </div>
          </div>
        </div>

        <div className="peripheral-item">
          <div className="peripheral-icon-box connected">
            <Wifi size={16} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="pulse-indicator" />
              <strong style={{ fontSize: '0.8rem' }}>Cloud Sync</strong>
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Real-Time Synced • 14ms
            </div>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="btn-dairy btn-sm-dairy btn-secondary-dairy"
            onClick={() => setIsHardwareModalOpen(true)}
          >
            Diagnostics
          </button>
        </div>
      </div>

      {/* 3. SHIFT EXECUTIVE METRICS - COMPACT 4-COLUMN GRID */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Total Volume */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info" style={{ width: '100%' }}>
              <span className="stat-label">{currentShift} Collection Volume</span>
              <span className="stat-value">
                {shiftLiters.toFixed(1)} <span style={{ fontSize: '1rem', fontWeight: 600 }}>Liters</span>
              </span>
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.75rem', marginTop: '2px' }}>
                <span style={{ color: '#059669', fontWeight: 700 }}>🐄 Cow: {cowLiters.toFixed(1)}L</span>
                <span style={{ color: '#2563eb', fontWeight: 700 }}>🐃 Buff: {buffLiters.toFixed(1)}L</span>
              </div>
              <div style={{ height: '4px', background: '#e2e8f0', borderRadius: '4px', marginTop: '6px', overflow: 'hidden' }}>
                <div style={{ width: `${targetProgress}%`, height: '100%', background: '#10b981', borderRadius: '4px' }} />
              </div>
            </div>
            <div className="stat-icon-wrapper primary">
              <Milk size={24} />
            </div>
          </div>
        </div>

        {/* Metric 2: Shift Payout */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card warning">
            <div className="stat-info">
              <span className="stat-label">Shift Payout Disbursed</span>
              <span className="stat-value">₹{shiftTotalPayout.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              <span className="stat-subtext text-muted">
                Direct Farmer Ledger Credit
              </span>
            </div>
            <div className="stat-icon-wrapper warning">
              <Coins size={24} />
            </div>
          </div>
        </div>

        {/* Metric 3: Farmer Turnout */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card info">
            <div className="stat-info">
              <span className="stat-label">Farmer Cans Logged</span>
              <span className="stat-value">
                {shiftRecords.length} <span style={{ fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-secondary)' }}>/ {farmers.length} Cans</span>
              </span>
              <span className="stat-subtext text-success" style={{ fontWeight: 600 }}>
                {Math.round((shiftRecords.length / Math.max(1, farmers.length)) * 100)}% Shift Turnout
              </span>
            </div>
            <div className="stat-icon-wrapper info">
              <CheckCircle2 size={24} />
            </div>
          </div>
        </div>

        {/* Metric 4: Quality Benchmark */}
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="stat-card primary">
            <div className="stat-info">
              <span className="stat-label">Average Quality Test</span>
              <span className="stat-value" style={{ fontSize: '1.45rem' }}>
                {weightedFat}% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Fat</span> • {weightedSnf}% <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>SNF</span>
              </span>
              <span className="stat-subtext" style={{ color: '#059669', fontWeight: 700 }}>
                Grade A+ Standard (Pure)
              </span>
            </div>
            <div className="stat-icon-wrapper primary">
              <FlaskConical size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN WORKSTATION: TWO-COLUMN LAYOUT */}
      <div className="row g-4 mb-4">
        {/* LEFT COLUMN: HIGH-SPEED INTAKE COUNTER */}
        <div className="col-12 col-xl-5">
          <div className="card-dairy" style={{ border: '1.5px solid #cbd5e1', boxShadow: 'var(--shadow-sm)' }}>
            <div className="card-dairy-header" style={{ backgroundColor: '#f8fafc' }}>
              <div className="card-dairy-title">
                <Calculator size={19} className="text-primary" />
                <span>Rapid Milk Collection Desk</span>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, backgroundColor: 'var(--primary-light)', color: 'var(--primary)', padding: '2px 8px', borderRadius: '4px' }}>
                LIVE COUNTER
              </span>
            </div>

            <div className="card-dairy-body">
              <form onSubmit={handleRecordIntake}>
                {/* Farmer Search & Selection */}
                <div className="form-group mb-3">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <label className="form-label" style={{ margin: 0, fontWeight: 700 }}>
                      Farmer Member (शेतकरी सभासद) *
                    </label>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Code or Name Lookup
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ position: 'relative', width: '38%' }}>
                      <input
                        type="text"
                        className="form-control-dairy"
                        placeholder="Search ID/Name..."
                        value={farmerSearch}
                        onChange={(e) => setFarmerSearch(e.target.value)}
                        style={{ paddingLeft: '28px', fontSize: '0.825rem' }}
                      />
                      <Search size={14} style={{ position: 'absolute', left: '9px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                    </div>

                    <CustomDropdown
                      options={filteredFarmerList.map(f => ({
                        label: `${f.name} (${f.id} - ${f.village})`,
                        value: f.id
                      }))}
                      value={selectedFarmerId}
                      onChange={setSelectedFarmerId}
                      clearable={false}
                      placeholder="Choose Farmer..."
                      buttonClassName="w-full !h-10 text-[13px]"
                      className="w-[62%]"
                    />
                  </div>
                </div>

                {/* Farmer Dossier Badge Preview */}
                {selectedFarmer && (
                  <div className="farmer-dossier-pill">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: '#dcfce7',
                        color: '#15803d',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '0.9rem',
                        flexShrink: 0
                      }}>
                        {selectedFarmer.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem' }}>
                          {selectedFarmer.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          ID: <strong className="text-primary">{selectedFarmer.id}</strong> • Village: {selectedFarmer.village} • Phone: {selectedFarmer.phone}
                        </div>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Pending Due</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedFarmer.pendingDue > 0 ? '#b45309' : '#15803d' }}>
                        ₹{selectedFarmer.pendingDue ? selectedFarmer.pendingDue.toLocaleString() : '0.00'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Milk Variety Selector (Cow / Buffalo) */}
                <div className="form-group mb-3">
                  <label className="form-label">Select Milk Variety (दुधाचा प्रकार) *</label>
                  <div className="variety-toggle-group">
                    <button
                      type="button"
                      className={`variety-btn cow ${milkType === 'Cow' ? 'active' : ''}`}
                      onClick={() => {
                        setMilkType('Cow');
                        setFat('4.2');
                        setSnf('8.6');
                      }}
                    >
                      <Milk size={18} color="#059669" />
                      <span>Cow Milk (गाय)</span>
                    </button>

                    <button
                      type="button"
                      className={`variety-btn buffalo ${milkType === 'Buffalo' ? 'active' : ''}`}
                      onClick={() => {
                        setMilkType('Buffalo');
                        setFat('6.8');
                        setSnf('9.0');
                      }}
                    >
                      <Milk size={18} color="#2563eb" />
                      <span>Buffalo Milk (म्हैस)</span>
                    </button>
                  </div>
                </div>

                {/* Milk Measurement Inputs with Simulated Hardware Capture */}
                <div className="row g-2 mb-3">
                  {/* Quantity Input */}
                  <div className="col-12 col-md-6">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
                      <label className="form-label" style={{ margin: 0 }}>Quantity (Liters) *</label>
                      <button
                        type="button"
                        onClick={handleReadScale}
                        disabled={scaleReading}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#059669',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}
                      >
                        <Scale size={12} /> {scaleReading ? 'Reading...' : 'Read Scale [F3]'}
                      </button>
                    </div>
                    <div className="input-group-dairy">
                      <input
                        type="number"
                        step="0.1"
                        className="form-control-dairy"
                        placeholder="e.g. 35.5"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required
                        style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}
                        autoFocus
                      />
                      <span className="input-addon" style={{ fontWeight: 800 }}>L</span>
                    </div>
                  </div>

                  {/* Fat % Input */}
                  <div className="col-6 col-md-3">
                    <label className="form-label">Fat % (स्निग्धांश)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy"
                      value={fat}
                      onChange={(e) => setFat(e.target.value)}
                      required
                      style={{ fontSize: '1.05rem', fontWeight: 700 }}
                    />
                  </div>

                  {/* SNF % Input */}
                  <div className="col-6 col-md-3">
                    <label className="form-label">SNF % (एस.एन.एफ)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy"
                      value={snf}
                      onChange={(e) => setSnf(e.target.value)}
                      required
                      style={{ fontSize: '1.05rem', fontWeight: 700 }}
                    />
                  </div>
                </div>

                {/* Lacto / Analyzer Quick Action & Quality Preview */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  backgroundColor: '#f1f5f9',
                  padding: '0.55rem 0.85rem',
                  borderRadius: '8px',
                  marginBottom: '1.15rem',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FlaskConical size={14} className="text-primary" />
                    <span>CLR: <strong>{clr}</strong></span>
                    <span>• Temp: <strong>22°C</strong></span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>• Zero Added Water</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleReadAnalyzer}
                    disabled={analyzerReading}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'var(--primary)',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                  >
                    {analyzerReading ? 'Scanning...' : '⚡ Test Analyzer [F4]'}
                  </button>
                </div>

                {/* REAL-TIME DYNAMIC VALUATION CARD */}
                <div className="intake-calc-box">
                  <div className="intake-calc-row">
                    <span>Base Fat & SNF Rate:</span>
                    <strong style={{ fontSize: '1.05rem' }}>₹{calculatedRate.toFixed(2)} / L</strong>
                  </div>
                  <div className="intake-calc-row">
                    <span>Clean Milk Incentive Bonus:</span>
                    <span style={{ color: '#a7f3d0', fontWeight: 700 }}>+₹0.50 / L Included</span>
                  </div>
                  <div className="intake-calc-row">
                    <span>Calculated Volume:</span>
                    <span>{quantity ? `${parseFloat(quantity).toFixed(1)} L` : '0.0 L'}</span>
                  </div>

                  <div className="intake-calc-total">
                    <div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.85, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                        Net Payable To Farmer
                      </div>
                      <div style={{ fontSize: '0.75rem', opacity: 0.9 }}>
                        Credit to Farmer Ledger
                      </div>
                    </div>
                    <div style={{ fontSize: '2.1rem', fontWeight: 800, fontFamily: 'Outfit', color: '#ffffff', letterSpacing: '-0.02em' }}>
                      ₹{calculatedTotal.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  <button
                    type="submit"
                    className="btn-dairy btn-primary-dairy"
                    style={{
                      width: '100%',
                      padding: '0.9rem',
                      fontSize: '1.05rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 14px rgba(21, 128, 61, 0.4)'
                    }}
                  >
                    <Printer size={20} /> Record Intake & Print Slip [Enter]
                  </button>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className="btn-dairy btn-secondary-dairy"
                      style={{ flex: 1, fontSize: '0.8rem' }}
                      onClick={handleSimulateNextFarmer}
                    >
                      <Sparkles size={14} className="text-warning" /> Next Demo Member
                    </button>
                    <button
                      type="button"
                      className="btn-dairy btn-secondary-dairy"
                      style={{ flex: 1, fontSize: '0.8rem' }}
                      onClick={() => {
                        setQuantity('');
                        setFat(milkType === 'Cow' ? '4.2' : '6.8');
                        setSnf(milkType === 'Cow' ? '8.6' : '9.0');
                      }}
                    >
                      <RotateCcw size={14} /> Clear Form
                    </button>
                  </div>
                </div>

                {/* Hotkeys Legend */}
                <div style={{
                  marginTop: '0.85rem',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  Shortcuts: <kbd>[Enter]</kbd> Submit • <kbd>[F2]</kbd> Cow/Buffalo • <kbd>[F3]</kbd> Read Scale • <kbd>[F4]</kbd> Read Analyzer
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE SHIFT INTAKE STREAM & SILO STORAGE */}
        <div className="col-12 col-xl-7">
          {/* BULK MILK COOLER (BMCU) SILO TANK GAUGES */}
          <div className="row g-2 mb-3">
            <div className="col-12 col-sm-6">
              <div className="silo-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#ecfdf5',
                  color: '#059669',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  🐄
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Cow Milk Vat #1</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                      {cowLiters.toFixed(0)} / 1,000 L
                    </span>
                  </div>
                  <div className="silo-level-bar">
                    <div className="silo-level-fill cow" style={{ width: `${Math.min(100, (cowLiters / 1000) * 100)}%` }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Chiller: 3.7°C</span>
                    <span>{Math.round((cowLiters / 1000) * 100)}% Filled</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-12 col-sm-6">
              <div className="silo-card">
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '10px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.2rem',
                  flexShrink: 0
                }}>
                  🐃
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ fontSize: '0.85rem' }}>Buffalo Milk Vat #2</strong>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#2563eb' }}>
                      {buffLiters.toFixed(0)} / 1,000 L
                    </span>
                  </div>
                  <div className="silo-level-bar">
                    <div className="silo-level-fill buffalo" style={{ width: `${Math.min(100, (buffLiters / 1000) * 100)}%` }} />
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Chiller: 3.9°C</span>
                    <span>{Math.round((buffLiters / 1000) * 100)}% Filled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Shift Intake Log Table */}
          <CommonTable
            columns={shiftTableColumns}
            data={filteredTableSlips}
            keyExtractor={(r) => r.id || r.slipNo}
            title={`Today's ${currentShift} Shift Intake Slips`}
            subtitle={`${selectedDate} • Real-time milk intake stream`}
            showCheckbox={false}
            densityToggle={true}
            searchable={true}
            searchValue={tableSearch}
            onSearchChange={setTableSearch}
            searchPlaceholder="Search slip/farmer..."
            pagination={true}
            defaultPageSize={10}
            pageSizeOptions={[5, 10, 20]}
            emptyTitle={`No Milk Cans Logged For ${currentShift} Shift Yet`}
            emptyMessage="The desk is connected and standing by. Fill in the intake form on the left or simulate an incoming member."
            onEmptyReset={handleSimulateNextFarmer}
            extraToolbar={
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} style={{ color: 'var(--text-muted)' }} />
                  <input
                    type="date"
                    className="form-control-dairy"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', width: '130px' }}
                  />
                </div>
                <div className="tab-pills" style={{ padding: '2px' }}>
                  <button
                    type="button"
                    className={`tab-pill-btn ${tableTypeFilter === 'All' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() => setTableTypeFilter('All')}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    className={`tab-pill-btn ${tableTypeFilter === 'Cow' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() => setTableTypeFilter('Cow')}
                  >
                    Cow
                  </button>
                  <button
                    type="button"
                    className={`tab-pill-btn ${tableTypeFilter === 'Buffalo' ? 'active' : ''}`}
                    style={{ padding: '0.2rem 0.55rem', fontSize: '0.72rem' }}
                    onClick={() => setTableTypeFilter('Buffalo')}
                  >
                    Buff
                  </button>
                </div>
              </div>
            }
          />
        </div>
      </div>

      {/* 5. MODAL: PRINT THERMAL SLIP */}
      {selectedSlip && (
        <PrintReceiptModal
          isOpen={!!selectedSlip}
          onClose={() => setSelectedSlip(null)}
          data={selectedSlip}
          type="milk"
        />
      )}

      {/* 6. MODAL: SHIFT SUMMARY RECONCILIATION SHEET */}
      <Modal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        title={`Shift Summary Report - ${currentShift} Shift (${selectedDate})`}
        size="lg"
        footer={
          <>
            <button className="btn-dairy btn-secondary-dairy" onClick={() => setIsSummaryModalOpen(false)}>
              Close
            </button>
            <button className="btn-dairy btn-primary-dairy" onClick={() => window.print()}>
              <Printer size={16} /> Print Shift Sheet
            </button>
          </>
        }
      >
        <div className="print-area">
          <div style={{ borderBottom: '2px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--primary)' }}>
                  {settings.dairyName}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  Center #04 • Shirwal BMCU • Registration: {settings.registrationNo}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span className="badge-dairy success" style={{ fontSize: '0.8rem' }}>
                  {currentShift} Shift
                </span>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Date: {selectedDate}
                </div>
              </div>
            </div>
          </div>

          {/* Shift KPI Table */}
          <div className="row g-2 mb-4">
            <div className="col-4">
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Milk Intake</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                  {shiftLiters.toFixed(1)} L
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Cow: {cowLiters.toFixed(1)}L | Buff: {buffLiters.toFixed(1)}L
                </div>
              </div>
            </div>

            <div className="col-4">
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Payout Disbursed</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#16a34a' }}>
                  ₹{shiftTotalPayout.toFixed(2)}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Avg Rate: ₹{shiftLiters > 0 ? (shiftTotalPayout / shiftLiters).toFixed(2) : '0.00'}/L
                </div>
              </div>
            </div>

            <div className="col-4">
              <div style={{ padding: '0.75rem', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Avg Quality</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {weightedFat}% / {weightedSnf}%
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                  Weighted Fat / SNF
                </div>
              </div>
            </div>
          </div>

          {/* Memberwise List */}
          <h5 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            Memberwise Milk Supply Log ({shiftRecords.length} Records)
          </h5>
          <div className="table-responsive">
            <table className="table-dairy" style={{ fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th>Slip</th>
                  <th>Farmer</th>
                  <th>Type</th>
                  <th>Qty (L)</th>
                  <th>Fat%</th>
                  <th>SNF%</th>
                  <th>Rate</th>
                  <th>Total (₹)</th>
                </tr>
              </thead>
              <tbody>
                {shiftRecords.map(r => (
                  <tr key={r.id}>
                    <td className="mono-font fw-bold">{r.slipNo}</td>
                    <td>{r.farmerName} ({r.farmerId})</td>
                    <td>{r.milkType}</td>
                    <td className="fw-bold">{r.quantity.toFixed(1)} L</td>
                    <td>{r.fat}%</td>
                    <td>{r.snf}%</td>
                    <td>₹{r.rate.toFixed(2)}</td>
                    <td className="fw-bold text-success">₹{r.totalAmount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px dashed #cbd5e1' }}>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ height: '35px' }}></div>
              <div style={{ borderTop: '1px solid #94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                Operator Signature (Suresh Shinde)
              </div>
            </div>
            <div style={{ textAlign: 'center', width: '200px' }}>
              <div style={{ height: '35px' }}></div>
              <div style={{ borderTop: '1px solid #94a3b8', fontSize: '0.75rem', fontWeight: 700 }}>
                Dairy Supervisor / Auditor
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* 7. MODAL: RATE MATRIX CHART */}
      <Modal
        isOpen={isRateChartOpen}
        onClose={() => setIsRateChartOpen(false)}
        title="AmritDhara Official Milk Rate Matrix (दर पत्रक)"
        size="lg"
        footer={
          <button className="btn-dairy btn-primary-dairy" onClick={() => setIsRateChartOpen(false)}>
            Done
          </button>
        }
      >
        <div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
            Base pricing governed by cooperative standards. Cow base rate: <strong>₹{settings.cowBaseRate}</strong> (3.5 Fat / 8.5 SNF). Buffalo base rate: <strong>₹{settings.buffaloBaseRate}</strong> (6.0 Fat / 9.0 SNF).
          </p>

          <div className="row g-3">
            <div className="col-12 col-md-6">
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#065f46', marginBottom: '0.5rem' }}>
                🐄 Cow Milk Rate Grid (₹ / Liter)
              </h5>
              <table className="table-dairy" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Fat %</th>
                    <th>SNF 8.2</th>
                    <th>SNF 8.5</th>
                    <th>SNF 8.8</th>
                  </tr>
                </thead>
                <tbody>
                  {[3.5, 3.8, 4.0, 4.2, 4.5].map(f => (
                    <tr key={f}>
                      <td className="fw-bold">{f}%</td>
                      <td>₹{calculateRate('Cow', f, 8.2).toFixed(2)}</td>
                      <td className="fw-bold text-primary">₹{calculateRate('Cow', f, 8.5).toFixed(2)}</td>
                      <td>₹{calculateRate('Cow', f, 8.8).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="col-12 col-md-6">
              <h5 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1e40af', marginBottom: '0.5rem' }}>
                🐃 Buffalo Milk Rate Grid (₹ / Liter)
              </h5>
              <table className="table-dairy" style={{ fontSize: '0.78rem' }}>
                <thead>
                  <tr>
                    <th>Fat %</th>
                    <th>SNF 8.8</th>
                    <th>SNF 9.0</th>
                    <th>SNF 9.2</th>
                  </tr>
                </thead>
                <tbody>
                  {[6.0, 6.5, 7.0, 7.5, 8.0].map(f => (
                    <tr key={f}>
                      <td className="fw-bold">{f}%</td>
                      <td>₹{calculateRate('Buffalo', f, 8.8).toFixed(2)}</td>
                      <td className="fw-bold text-primary">₹{calculateRate('Buffalo', f, 9.0).toFixed(2)}</td>
                      <td>₹{calculateRate('Buffalo', f, 9.2).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal>

      {/* 8. MODAL: HARDWARE DIAGNOSTICS */}
      <Modal
        isOpen={isHardwareModalOpen}
        onClose={() => setIsHardwareModalOpen(false)}
        title="Hardware Peripherals & Desk Diagnostics"
        footer={
          <button className="btn-dairy btn-primary-dairy" onClick={() => setIsHardwareModalOpen(false)}>
            Close Diagnostics
          </button>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Scale */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Scale size={24} color="#059669" />
              <div>
                <div style={{ fontWeight: 700 }}>Electronic Weigh Scale (CAS CI-2001A)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Port: COM1 • Baud: 9600 • Live Weight: 0.00 kg</div>
              </div>
            </div>
            <button
              className="btn-dairy btn-secondary-dairy btn-sm-dairy"
              onClick={() => {
                setTareActive(true);
                setTimeout(() => {
                  setTareActive(false);
                  showToast('Scale zeroed / tared to 0.00 kg', 'success');
                }, 400);
              }}
            >
              {tareActive ? 'Zeroing...' : 'Tare / Zero'}
            </button>
          </div>

          {/* Analyzer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FlaskConical size={24} color="#2563eb" />
              <div>
                <div style={{ fontWeight: 700 }}>Ultrasonic Milk Analyzer (Ekomilk Ultra)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Port: COM2 • Ultrasonic Sensor: Clean • Ready</div>
              </div>
            </div>
            <button
              className="btn-dairy btn-secondary-dairy btn-sm-dairy"
              onClick={() => showToast('Analyzer self-cleaning cycle completed', 'success')}
            >
              Wash Cycle
            </button>
          </div>

          {/* Printer */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Printer size={24} color="#d97706" />
              <div>
                <div style={{ fontWeight: 700 }}>Thermal Receipt Printer (TVS RP-3200)</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Port: USB-PRN-01 • Paper Roll: 85% Remaining</div>
              </div>
            </div>
            <button
              className="btn-dairy btn-secondary-dairy btn-sm-dairy"
              onClick={() => {
                showToast('Printed test pattern slip successfully on thermal printer!', 'success');
              }}
            >
              Print Test Pattern
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
