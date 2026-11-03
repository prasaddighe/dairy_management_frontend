import React, { useState } from 'react';
import {
  Plus,
  CheckCircle
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';

export const EmployeesView = () => {
  const { showToast } = useDairy();

  const [staffList, setStaffList] = useState([
    { id: 'EMP-01', name: 'Vikram Deshmukh', role: 'Plant Operations Manager', dept: 'Operations', phone: '+91 98221 00112', email: 'vikram.d@amritdhara.com', salary: '₹55,000', status: 'On Duty' },
    { id: 'EMP-02', name: 'Suresh Shinde', role: 'Milk Collection Operator', dept: 'Intake Counter', phone: '+91 98224 55667', email: 'suresh.s@amritdhara.com', salary: '₹26,000', status: 'On Duty' },
    { id: 'EMP-03', name: 'Neha Kulkarni', role: 'Senior Financial Controller', dept: 'Accounts', phone: '+91 98811 77889', email: 'neha.k@amritdhara.com', salary: '₹48,000', status: 'On Duty' },
    { id: 'EMP-04', name: 'Santosh Gaikwad', role: 'Delivery Route Executive', dept: 'Logistics', phone: '+91 97654 33221', email: 'santosh.g@amritdhara.com', salary: '₹22,000', status: 'On Duty' },
    { id: 'EMP-05', name: 'Ramesh Jadhav', role: 'Chilling Plant Technician', dept: 'Maintenance', phone: '+91 98901 88776', email: 'ramesh.j@amritdhara.com', salary: '₹28,000', status: 'On Duty' },
    { id: 'EMP-06', name: 'Anita Pawar', role: 'Quality Control Lab Chemist', dept: 'Testing Lab', phone: '+91 94231 66554', email: 'anita.p@amritdhara.com', salary: '₹34,000', status: 'On Duty' }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Milk Collection Operator',
    dept: 'Operations',
    phone: '',
    email: '',
    salary: '₹25,000'
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      showToast('Please fill all required fields', 'warning');
      return;
    }
    const newEmp = {
      ...formData,
      id: `EMP-0${staffList.length + 1}`,
      status: 'On Duty'
    };
    setStaffList([...staffList, newEmp]);
    showToast(`Employee ${newEmp.name} added to staff roster`, 'success');
    setIsAddModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Employees & Dairy Staff</h1>
          <p className="text-sm text-slate-500">
            Plant operators, quality chemists, accounts team, and route delivery personnel.
          </p>
        </div>

        <button className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Add New Employee
        </button>
      </div>

      <div className="card-dairy">
        <div className="table-responsive">
          <table className="table-dairy">
            <thead>
              <tr>
                <th>Emp ID</th>
                <th>Employee Name</th>
                <th>Role Designation</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Monthly Salary</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {staffList.map(emp => (
                <tr key={emp.id}>
                  <td className="mono-font font-bold text-primary">{emp.id}</td>
                  <td>
                    <div className="font-bold text-slate-900">{emp.name}</div>
                    <div className="text-[11px] text-slate-400">{emp.email}</div>
                  </td>
                  <td className="font-semibold">{emp.role}</td>
                  <td>
                    <span className="badge-dairy info text-[11px]">{emp.dept}</span>
                  </td>
                  <td>{emp.phone}</td>
                  <td className="font-bold">{emp.salary}</td>
                  <td>
                    <span className="badge-dairy success">{emp.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Employee to Dairy Staff"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 flex items-center gap-1.5" onClick={handleAddSubmit}>
              <CheckCircle size={16} /> Save Staff Member
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddSubmit} className="space-y-3">
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Full Name *</label>
            <input
              type="text"
              className="form-control-dairy"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Role Designation</label>
            <input
              type="text"
              className="form-control-dairy"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Department</label>
            <select
              className="form-control-dairy"
              value={formData.dept}
              onChange={(e) => setFormData({ ...formData, dept: e.target.value })}
            >
              <option value="Operations">Plant Operations</option>
              <option value="Intake Counter">Milk Collection Counter</option>
              <option value="Testing Lab">Quality Control & Testing</option>
              <option value="Logistics">Delivery & Route Logistics</option>
              <option value="Accounts">Finance & Accounts</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Mobile Number *</label>
            <input
              type="tel"
              className="form-control-dairy"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label text-xs font-semibold text-slate-700">Monthly Salary</label>
            <input
              type="text"
              className="form-control-dairy"
              value={formData.salary}
              onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};
