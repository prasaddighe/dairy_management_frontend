import React, { useState } from 'react';
import {
  Warehouse,
  Plus,
  Milk,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const InventoryView = () => {
  const { showToast } = useDairy();

  // Raw Silo data
  const [silos] = useState([
    {
      id: 'SILO-01',
      name: 'Bulk Milk Silo #1 (Cow)',
      capacity: 5000,
      current: 4200,
      temp: '3.8°C',
      status: 'Optimal Chilling'
    },
    {
      id: 'SILO-02',
      name: 'Bulk Milk Silo #2 (Buffalo)',
      capacity: 5000,
      current: 3100,
      temp: '4.1°C',
      status: 'Optimal Chilling'
    },
    {
      id: 'SILO-03',
      name: 'Cream & Butter Vat',
      capacity: 1000,
      current: 780,
      temp: '5.0°C',
      status: 'Processing'
    }
  ]);

  // Supplies Inventory (Animal Feed & Packaging)
  const [supplies] = useState([
    { id: 'SUP-01', name: 'Amul Dan Cattle Feed (50kg)', category: 'Animal Feed', current: 140, unit: 'Bags', min: 40, status: 'In Stock' },
    { id: 'SUP-02', name: 'Chelated Mineral Mixture (10kg)', category: 'Nutritional Supplements', current: 28, unit: 'Bags', min: 20, status: 'In Stock' },
    { id: 'SUP-03', name: 'Food-Grade 1L LDPE Pouches', category: 'Packaging', current: 8500, unit: 'Pouches', min: 3000, status: 'In Stock' },
    { id: 'SUP-04', name: '500g Glass Ghee Bottles & Caps', category: 'Packaging', current: 180, unit: 'Bottles', min: 200, status: 'Low Stock' },
    { id: 'SUP-05', name: 'Vacuum Barrier Film for Paneer', category: 'Packaging', current: 1200, unit: 'Sheets', min: 500, status: 'In Stock' }
  ]);

  // Movement Log
  const [movementLogs, setMovementLogs] = useState([
    { id: 'MOV-101', date: '2026-10-21 09:30 AM', item: 'Food-Grade 1L LDPE Pouches', type: 'Stock In', qty: '+5,000 Pouches', source: 'Polypack Industries', by: 'Vikram Deshmukh' },
    { id: 'MOV-102', date: '2026-10-21 08:45 AM', item: 'Amul Dan Cattle Feed', type: 'Stock Out', qty: '-15 Bags', source: 'Issued to Farmer Anand Patil', by: 'Suresh Shinde' },
    { id: 'MOV-103', date: '2026-10-20 04:15 PM', item: 'Bulk Milk Silo #1', type: 'Transfer', qty: '-800 L', source: 'Transferred to Bottling Plant', by: 'Vikram Deshmukh' },
    { id: 'MOV-104', date: '2026-10-20 11:00 AM', item: '500g Glass Ghee Bottles', type: 'Stock Out', qty: '-40 Bottles', source: 'Used in Bilona Ghee packaging', by: 'Production Team' }
  ]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [logForm, setLogForm] = useState({
    item: 'Amul Dan Cattle Feed (50kg)',
    type: 'Stock In',
    qty: '',
    source: '',
    unit: 'Bags'
  });

  const handleStockSubmit = (e) => {
    e.preventDefault();
    if (!logForm.qty) {
      showToast('Please enter quantity', 'warning');
      return;
    }

    const newLog = {
      id: `MOV-${Date.now().toString().slice(-3)}`,
      date: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric', year: 'numeric' }),
      item: logForm.item,
      type: logForm.type,
      qty: `${logForm.type === 'Stock In' ? '+' : '-'}${logForm.qty} ${logForm.unit}`,
      source: logForm.source || 'General Movement',
      by: 'Dairy Plant Admin'
    };

    setMovementLogs([newLog, ...movementLogs]);
    showToast(`Inventory updated: ${logForm.type} of ${logForm.qty} ${logForm.unit} logged`, 'success');
    setIsModalOpen(false);
  };

  return (
    <div>
      {/* Title */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dairy Inventory & Silos</h1>
          <p className="text-sm text-slate-500">
            Bulk milk storage silos, cattle feed stocks, dairy packaging supplies, and movement audits.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={18} /> Record Stock In / Stock Out
        </button>
      </div>

      {/* Silo Status Gauges */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <Milk size={18} className="text-primary" />
            <span>Raw Milk Storage Silos & Temperature Monitoring</span>
          </div>
          <span className="badge-dairy success">Chilling Plant Operational</span>
        </div>
        <div className="card-dairy-body">
          <div className="row g-4">
            {silos.map(s => {
              const pct = Math.round((s.current / s.capacity) * 100);
              return (
                <div key={s.id} className="col-12 col-md-4">
                  <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 shadow-xs">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-slate-900">{s.name}</span>
                      <span className="badge-dairy success text-[11px]">{s.temp}</span>
                    </div>

                    <div className="text-2xl font-extrabold font-outfit text-emerald-950 mb-1">
                      {s.current.toLocaleString()} <span className="text-sm font-normal text-slate-500">/ {s.capacity.toLocaleString()} L</span>
                    </div>

                    <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${pct > 80 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Capacity: {pct}% Full</span>
                      <span className="text-emerald-700 font-semibold">{s.status}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Supplies & Raw Materials Table */}
      <div className="card-dairy mb-4">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <Warehouse size={18} className="text-primary" />
            <span>Feed, Minerals & Packaging Supplies</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Item ID</th>
                <th>Material Description</th>
                <th>Category</th>
                <th>Available Quantity</th>
                <th>Min Safe Stock</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {supplies.map(sup => (
                <tr key={sup.id}>
                  <td className="mono-font font-semibold text-primary">{sup.id}</td>
                  <td className="font-bold">{sup.name}</td>
                  <td>
                    <span className="badge-dairy info text-[11px]">{sup.category}</span>
                  </td>
                  <td>
                    <span className={`font-bold text-base ${sup.current <= sup.min ? 'text-danger' : 'text-slate-800'}`}>
                      {sup.current.toLocaleString()} {sup.unit}
                    </span>
                  </td>
                  <td>{sup.min.toLocaleString()} {sup.unit}</td>
                  <td>
                    <span className={`badge-dairy ${sup.status === 'In Stock' ? 'success' : 'warning'}`}>
                      {sup.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-dairy btn-secondary-dairy btn-sm-dairy"
                      onClick={() => {
                        setLogForm({ item: sup.name, type: 'Stock In', qty: '50', source: 'Fresh Supplier PO', unit: sup.unit });
                        setIsModalOpen(true);
                      }}
                    >
                      Restock
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Movement History Log */}
      <div className="card-dairy">
        <div className="card-dairy-header">
          <div className="card-dairy-title">
            <Clock size={18} className="text-primary" />
            <span>Recent Inventory Movement Log</span>
          </div>
        </div>
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Entry ID</th>
                <th>Timestamp</th>
                <th>Item / Silo</th>
                <th>Action Type</th>
                <th>Quantity</th>
                <th>Reason / Destination</th>
                <th>Logged By</th>
              </tr>
            </thead>
            <tbody>
              {movementLogs.map(log => (
                <tr key={log.id}>
                  <td className="mono-font font-bold text-slate-800">{log.id}</td>
                  <td>{log.date}</td>
                  <td className="font-semibold text-slate-800">{log.item}</td>
                  <td>
                    <span className={`badge-dairy ${log.type === 'Stock In' ? 'success' : (log.type === 'Stock Out' ? 'danger' : 'info')}`}>
                      {log.type}
                    </span>
                  </td>
                  <td className="font-bold">{log.qty}</td>
                  <td>{log.source}</td>
                  <td className="text-xs text-slate-500">{log.by}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock In / Out Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Record Stock Movement (Stock-In / Stock-Out)"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1.5" onClick={handleStockSubmit}>
              <CheckCircle size={16} /> Save Movement
            </button>
          </div>
        }
      >
        <form onSubmit={handleStockSubmit} className="space-y-3">
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Material / Product Item</label>
            <input
              type="text"
              className="form-control-dairy"
              value={logForm.item}
              onChange={(e) => setLogForm({ ...logForm, item: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Movement Type</label>
            <select
              className="form-control-dairy"
              value={logForm.type}
              onChange={(e) => setLogForm({ ...logForm, type: e.target.value })}
            >
              <option value="Stock In">Stock In (+ Inward Receipt)</option>
              <option value="Stock Out">Stock Out (- Consumption / Issued)</option>
              <option value="Transfer">Plant Transfer</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Quantity</label>
            <input
              type="number"
              className="form-control-dairy"
              placeholder="e.g. 50"
              value={logForm.qty}
              onChange={(e) => setLogForm({ ...logForm, qty: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Source / Supplier / Purpose</label>
            <input
              type="text"
              className="form-control-dairy"
              placeholder="e.g. Sahyadri Feeds / Distributed to Farmers"
              value={logForm.source}
              onChange={(e) => setLogForm({ ...logForm, source: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
