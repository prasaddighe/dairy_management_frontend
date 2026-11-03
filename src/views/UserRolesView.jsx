import React, { useState } from 'react';
import {
  Check,
  X,
  Shield,
  UserPlus,
  Search,
  Trash2,
  Mail,
  Phone,
  Building
} from 'lucide-react';
import { useDairy, SYSTEM_ROLES } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';
import { StatusBadge } from '../components/common/StatusBadge';
import { EmptyState } from '../components/common/EmptyState';

export const UserRolesView = () => {
  const { users, addUser, deleteUser, showToast } = useDairy();

  const [activeSubTab, setActiveSubTab] = useState('users'); // 'users' or 'matrix'
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [newUserData, setNewUserData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phone: '',
    roleId: 'operator',
    branch: 'Shirwal Chilling Center #04',
    roleTitle: 'Milk Collection Operator'
  });

  const permissions = [
    { module: 'Dashboard & Executive KPIs', roles: ['super_admin', 'dairy_admin', 'accountant'] },
    { module: 'Milk Collection & Lacto Entry', roles: ['super_admin', 'dairy_admin', 'operator'] },
    { module: 'Farmers Registry & KYC', roles: ['super_admin', 'dairy_admin', 'operator'] },
    { module: 'Customer Subscriptions', roles: ['super_admin', 'dairy_admin', 'accountant'] },
    { module: 'Milk Products & POS Billing', roles: ['super_admin', 'dairy_admin', 'accountant'] },
    { module: 'Delivery Scheduling & Routes', roles: ['super_admin', 'dairy_admin', 'delivery'] },
    { module: 'Farmer Bank Payouts', roles: ['super_admin', 'accountant'] },
    { module: 'Operating Expense Vouchers', roles: ['super_admin', 'accountant'] },
    { module: 'Silo Inventory & Cold Chain', roles: ['super_admin', 'dairy_admin'] },
    { module: 'Audit Reports & P&L', roles: ['super_admin', 'accountant'] },
    { module: 'Farmer Self-Service Portal', roles: ['farmer'] },
    { module: 'Customer Self-Service Portal', roles: ['customer'] },
    { module: 'Delivery Staff Route Board', roles: ['delivery'] }
  ];

  const handleRoleChange = (roleId) => {
    const selected = SYSTEM_ROLES.find(r => r.id === roleId);
    setNewUserData(prev => ({
      ...prev,
      roleId,
      roleTitle: selected ? selected.roleTitle : 'System User'
    }));
  };

  const handleCreateUser = (e) => {
    e.preventDefault();
    if (!newUserData.fullName.trim() || !newUserData.userName.trim()) {
      showToast('Please provide both full name and login username', 'warning');
      return;
    }

    const cleanUsername = newUserData.userName.toLowerCase().trim();
    if (users.some(u => u.userName === cleanUsername)) {
      showToast(`Username '${cleanUsername}' is already taken`, 'warning');
      return;
    }

    addUser({
      ...newUserData,
      userName: cleanUsername
    });

    setIsAddUserModalOpen(false);
    setNewUserData({
      fullName: '',
      userName: '',
      email: '',
      phone: '',
      roleId: 'operator',
      branch: 'Shirwal Chilling Center #04',
      roleTitle: 'Milk Collection Operator'
    });
  };

  const filteredUsers = (users || []).filter(u => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ||
      (u.fullName && u.fullName.toLowerCase().includes(q)) ||
      (u.name && u.name.toLowerCase().includes(q)) ||
      (u.userName && u.userName.toLowerCase().includes(q)) ||
      (u.email && u.email.toLowerCase().includes(q)) ||
      (u.branch && u.branch.toLowerCase().includes(q));

    const matchesRole = roleFilter === 'all' || u.roleId === roleFilter || u.id === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">User & Access Management</h1>
          <p className="text-sm text-slate-500">
            Manage database user accounts, role allocations, and operational permission matrices.
          </p>
        </div>

        <button
          className="btn-dairy btn-primary-dairy flex items-center gap-2 cursor-pointer"
          onClick={() => setIsAddUserModalOpen(true)}
        >
          <UserPlus size={18} /> Add New User
        </button>
      </div>

      <div className="flex gap-2 border-b border-slate-200 mb-6">
        <button
          type="button"
          onClick={() => setActiveSubTab('users')}
          className={`py-3 px-5 border-0 bg-transparent font-bold text-sm cursor-pointer border-b-2 transition ${
            activeSubTab === 'users'
              ? 'text-emerald-700 border-b-emerald-700'
              : 'text-slate-500 border-b-transparent hover:text-slate-800'
          }`}
        >
          Active System Users ({users?.length || 0})
        </button>
        <button
          type="button"
          onClick={() => setActiveSubTab('matrix')}
          className={`py-3 px-5 border-0 bg-transparent font-bold text-sm cursor-pointer border-b-2 transition ${
            activeSubTab === 'matrix'
              ? 'text-emerald-700 border-b-emerald-700'
              : 'text-slate-500 border-b-transparent hover:text-slate-800'
          }`}
        >
          Role Permissions Matrix
        </button>
      </div>

      {activeSubTab === 'users' ? (
        <>
          <div className="card-dairy mb-3 p-3 sm:px-5">
            <div className="row g-2 align-items-center">
              <div className="col-12 col-md-6 col-lg-4">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    className="form-control-dairy pl-9"
                    placeholder="Search by name, username, branch..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>

              <div className="col-12 col-md-6 col-lg-3">
                <select
                  className="form-control-dairy"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  {SYSTEM_ROLES.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div className="col-12 col-lg-5 text-lg-end text-slate-400 text-xs">
                Showing <strong className="text-slate-700">{filteredUsers.length}</strong> of <strong className="text-slate-700">{users?.length || 0}</strong> users
              </div>
            </div>
          </div>

          <div className="card-dairy">
            <div className="table-responsive">
              <table className="table-dairy">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Login Username</th>
                    <th>Role & Privilege</th>
                    <th>Assigned Branch</th>
                    <th>Contact</th>
                    <th className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8">
                        <EmptyState
                          title="No user accounts found"
                          description="No user records match your search or role filter criteria."
                        />
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => {
                      const roleConfig = SYSTEM_ROLES.find(r => r.id === (user.roleId || user.id));
                      const badgeLabel = roleConfig ? roleConfig.name : (user.badge || 'Staff');

                      return (
                        <tr key={user.id || user.userName}>
                          <td>
                            <div className="flex items-center gap-2.5">
                              <div className="user-avatar w-9 h-9 text-xs">
                                {user.avatar || (user.fullName || 'U').slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-sm text-slate-800">{user.fullName || user.name}</div>
                                <div className="text-xs text-slate-400">ID: {user.id}</div>
                              </div>
                            </div>
                          </td>

                          <td>
                            <code className="px-2 py-0.5 rounded-md bg-slate-100 text-emerald-800 font-bold text-xs font-mono">
                              {user.userName}
                            </code>
                          </td>

                          <td>
                            <StatusBadge
                              label={badgeLabel}
                              status={user.roleId || user.id}
                              showDot={true}
                            />
                            <div className="text-[11px] text-slate-400 mt-0.5">
                              {user.roleTitle}
                            </div>
                          </td>

                          <td>
                            <div className="flex items-center gap-1.5 text-xs text-slate-700">
                              <Building size={14} className="text-slate-400" />
                              <span>{user.branch || 'Central Dairy'}</span>
                            </div>
                          </td>

                          <td>
                            <div className="text-xs space-y-0.5">
                              {user.email && (
                                <div className="flex items-center gap-1 text-slate-600">
                                  <Mail size={12} className="text-slate-400" />
                                  <span>{user.email}</span>
                                </div>
                              )}
                              {user.phone && (
                                <div className="flex items-center gap-1 text-slate-400 text-[11px]">
                                  <Phone size={12} />
                                  <span>{user.phone}</span>
                                </div>
                              )}
                            </div>
                          </td>

                          <td className="text-center">
                            <button
                              type="button"
                              className="btn-icon text-danger cursor-pointer"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete user ${user.fullName || user.userName}?`)) {
                                  deleteUser(user.id);
                                }
                              }}
                              title="Delete user"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <div className="card-dairy">
          <div className="card-dairy-header">
            <div className="card-dairy-title">
              <Shield size={18} className="text-primary" />
              <span>Role Access Authorization Matrix</span>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table-dairy">
              <thead>
                <tr>
                  <th>System Module / Feature</th>
                  <th className="text-center">Super Admin</th>
                  <th className="text-center">Dairy Admin</th>
                  <th className="text-center">Operator</th>
                  <th className="text-center">Farmer</th>
                  <th className="text-center">Customer</th>
                  <th className="text-center">Delivery</th>
                  <th className="text-center">Accountant</th>
                </tr>
              </thead>
              <tbody>
                {permissions.map((perm, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{perm.module}</td>
                    {SYSTEM_ROLES.map(role => {
                      const hasAccess = perm.roles.includes(role.id);
                      return (
                        <td key={role.id} className="text-center">
                          {hasAccess ? (
                            <span className="text-emerald-600 inline-flex items-center justify-center">
                              <Check size={18} />
                            </span>
                          ) : (
                            <span className="text-slate-300 inline-flex items-center justify-center">
                              <X size={16} />
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add New User Account"
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200" onClick={() => setIsAddUserModalOpen(false)}>
              Cancel
            </button>
            <button className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800" onClick={handleCreateUser}>
              Create User Account
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateUser}>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Full Name *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Ramesh Patil"
                value={newUserData.fullName}
                onChange={(e) => setNewUserData({ ...newUserData, fullName: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Login Username *</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. ramesh.patil"
                value={newUserData.userName}
                onChange={(e) => setNewUserData({ ...newUserData, userName: e.target.value })}
                required
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Assigned Role *</label>
              <select
                className="form-control-dairy"
                value={newUserData.roleId}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                {SYSTEM_ROLES.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Role Designation / Title</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Milk Collection Operator"
                value={newUserData.roleTitle}
                onChange={(e) => setNewUserData({ ...newUserData, roleTitle: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Email Address</label>
              <input
                type="email"
                className="form-control-dairy"
                placeholder="e.g. ramesh.patil@amritdhara.com"
                value={newUserData.email}
                onChange={(e) => setNewUserData({ ...newUserData, email: e.target.value })}
              />
            </div>

            <div className="col-12 col-md-6">
              <label className="form-label text-xs font-semibold text-slate-700">Mobile Phone</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. +91 98221 44556"
                value={newUserData.phone}
                onChange={(e) => setNewUserData({ ...newUserData, phone: e.target.value })}
              />
            </div>

            <div className="col-12">
              <label className="form-label text-xs font-semibold text-slate-700">Assigned Center / Branch</label>
              <input
                type="text"
                className="form-control-dairy"
                placeholder="e.g. Shirwal Center #04"
                value={newUserData.branch}
                onChange={(e) => setNewUserData({ ...newUserData, branch: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};
