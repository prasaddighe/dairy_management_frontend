import React, { useState } from 'react';
import {
  Save,
  Building,
  Coins,
  Printer,
  CheckCircle
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';

export const SettingsView = () => {
  const { settings, setSettings, showToast } = useDairy();

  const [formState, setFormState] = useState({ ...settings });

  const handleSave = (e) => {
    e.preventDefault();
    setSettings({
      ...formState,
      cowBaseRate: parseFloat(formState.cowBaseRate) || 38,
      cowFatMultiplier: parseFloat(formState.cowFatMultiplier) || 4.8,
      cowSnfMultiplier: parseFloat(formState.cowSnfMultiplier) || 2.2,
      buffaloBaseRate: parseFloat(formState.buffaloBaseRate) || 54,
      buffaloFatMultiplier: parseFloat(formState.buffaloFatMultiplier) || 5.6,
      buffaloSnfMultiplier: parseFloat(formState.buffaloSnfMultiplier) || 2.5
    });
    showToast('Dairy configuration & rate formulas updated!', 'success');
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dairy System Settings</h1>
          <p className="text-sm text-slate-500">
            Cooperative registration profile, rate chart formulas, and shift operating hours.
          </p>
        </div>

        <button className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer" onClick={handleSave}>
          <Save size={16} /> Save Changes
        </button>
      </div>

      <form onSubmit={handleSave}>
        {/* Section 1: Organization Profile */}
        <div className="card-dairy mb-4">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <Building size={18} className="text-primary" />
              <span>Dairy Cooperative Profile & Invoicing Details</span>
            </div>
          </div>
          <div className="card-dairy-body">
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label text-xs font-semibold text-slate-700">Dairy Cooperative Name</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  value={formState.dairyName}
                  onChange={(e) => setFormState({ ...formState, dairyName: e.target.value })}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-xs font-semibold text-slate-700">Cooperative Registration Number</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  value={formState.registrationNo}
                  onChange={(e) => setFormState({ ...formState, registrationNo: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-xs font-semibold text-slate-700">GSTIN / Tax ID</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  value={formState.gstNumber}
                  onChange={(e) => setFormState({ ...formState, gstNumber: e.target.value })}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label text-xs font-semibold text-slate-700">Official Contact Phone</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  value={formState.phone}
                  onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                />
              </div>

              <div className="col-12">
                <label className="form-label text-xs font-semibold text-slate-700">Plant Physical Address</label>
                <textarea
                  className="form-control-dairy"
                  rows={2}
                  value={formState.address}
                  onChange={(e) => setFormState({ ...formState, address: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Milk Rate Chart Quality Formulas */}
        <div className="card-dairy mb-4">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <Coins size={18} className="text-primary" />
              <span>Dynamic Quality Testing Rate Formulas (Fat & SNF Multipliers)</span>
            </div>
          </div>
          <div className="card-dairy-body">
            <div className="row g-4">
              {/* Cow Milk Formula */}
              <div className="col-12 col-md-6">
                <div className="p-5 border border-emerald-200 bg-emerald-50/70 rounded-2xl shadow-xs">
                  <h4 className="text-base font-extrabold text-emerald-950 mb-3">
                    Cow Milk Standard Rate Chart
                  </h4>
                  <div className="mb-3">
                    <label className="form-label text-xs font-semibold text-slate-700">Cow Base Rate (₹ at 3.5% Fat & 8.5% SNF)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.cowBaseRate}
                      onChange={(e) => setFormState({ ...formState, cowBaseRate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs font-semibold text-slate-700">Fat Incentive Multiplier (per 1% Fat above base)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.cowFatMultiplier}
                      onChange={(e) => setFormState({ ...formState, cowFatMultiplier: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs font-semibold text-slate-700">SNF Incentive Multiplier (per 1% SNF above base)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.cowSnfMultiplier}
                      onChange={(e) => setFormState({ ...formState, cowSnfMultiplier: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Buffalo Milk Formula */}
              <div className="col-12 col-md-6">
                <div className="p-5 border border-amber-200 bg-amber-50/70 rounded-2xl shadow-xs">
                  <h4 className="text-base font-extrabold text-amber-950 mb-3">
                    Buffalo Milk Standard Rate Chart
                  </h4>
                  <div className="mb-3">
                    <label className="form-label text-xs font-semibold text-slate-700">Buffalo Base Rate (₹ at 6.0% Fat & 9.0% SNF)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.buffaloBaseRate}
                      onChange={(e) => setFormState({ ...formState, buffaloBaseRate: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label text-xs font-semibold text-slate-700">Fat Incentive Multiplier (per 1% Fat above base)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.buffaloFatMultiplier}
                      onChange={(e) => setFormState({ ...formState, buffaloFatMultiplier: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label text-xs font-semibold text-slate-700">SNF Incentive Multiplier (per 1% SNF above base)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control-dairy bg-white"
                      value={formState.buffaloSnfMultiplier}
                      onChange={(e) => setFormState({ ...formState, buffaloSnfMultiplier: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Hardware & Shift Timings */}
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <Printer size={18} className="text-primary" />
              <span>Slip Printer & Shift Timings Configuration</span>
            </div>
          </div>
          <div className="card-dairy-body">
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label text-xs font-semibold text-slate-700">Thermal Slip Printer Interface</label>
                <select className="form-control-dairy" defaultValue="USB-Direct">
                  <option value="USB-Direct">Direct USB Thermal 80mm ESC/POS</option>
                  <option value="Network">Network LAN / WiFi ESC/POS Printer</option>
                  <option value="Browser">Browser Print Dialog (Standard)</option>
                </select>
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label text-xs font-semibold text-slate-700">Morning Collection Shift</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  defaultValue="06:00 AM - 09:30 AM"
                />
              </div>

              <div className="col-12 col-md-4">
                <label className="form-label text-xs font-semibold text-slate-700">Evening Collection Shift</label>
                <input
                  type="text"
                  className="form-control-dairy"
                  defaultValue="05:00 PM - 08:30 PM"
                />
              </div>
            </div>

            <div className="mt-5 text-right">
              <button type="submit" className="btn-dairy btn-primary-dairy flex items-center gap-2 ml-auto cursor-pointer">
                <CheckCircle size={16} /> Save System Settings
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
