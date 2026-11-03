import React, { useState } from 'react';
import {
  Lock,
  Mail,
  User,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  UserPlus,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';

export const RegisterView = ({ onNavigateLogin }) => {
  const { registerUser, showToast } = useDairy();

  const [roleId, setRoleId] = useState('farmer'); // 'farmer', 'customer', 'operator'
  const [formData, setFormData] = useState({
    fullName: '',
    userName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (field === 'fullName' && (!prev.userName || prev.userName === prev.fullName.toLowerCase().replace(/\s+/g, '.'))) {
        updated.userName = value.toLowerCase().trim().replace(/[^a-z0-9]/g, '.');
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.fullName.trim() || !formData.userName.trim() || !formData.phone.trim()) {
      showToast('Please fill all mandatory fields (Name, Username, Phone)', 'warning');
      return;
    }

    if (!formData.password || formData.password.length < 6) {
      showToast('Password should be at least 6 characters long', 'warning');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match. Please verify.', 'error');
      return;
    }

    if (!agreeTerms) {
      showToast('Please accept the Dairy Cooperative terms to proceed', 'warning');
      return;
    }

    registerUser({
      fullName: formData.fullName.trim(),
      userName: formData.userName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      roleId: roleId,
      address: formData.address.trim() || (roleId === 'farmer' ? 'Shirwal Village' : 'Pune City'),
      password: formData.password
    });
  };

  return (
    <div className="w-screen h-screen min-h-screen max-h-screen flex bg-white overflow-hidden m-0 p-0">
      <div className="hidden lg:flex flex-none w-[40%] max-w-[40%] h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-800 text-white p-12 flex-col justify-between relative overflow-y-auto">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay bg-[url('/dairy-hero.jpg')]"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <img src="/dairy-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">AmritDhara</h2>
              <div className="text-xs opacity-90 tracking-wider">Smart Dairy Management System</div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-snug mb-4">
            Join Maharashtra's Leading Smart Dairy Network.
          </h1>
          <p className="text-sm opacity-90 leading-relaxed max-w-md mb-6">
            Register today for transparent milk collection slips, real-time fat & SNF testing rates, direct farmer bank transfers, or doorstep fresh milk delivery.
          </p>

          <div className="space-y-3.5">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-300 mt-0.5 shrink-0" />
              <span className="text-xs opacity-95 leading-relaxed">
                <strong className="text-white">Farmers:</strong> Instant computerized receipt, passbook ledger & 10-day cycle bank payout.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-300 mt-0.5 shrink-0" />
              <span className="text-xs opacity-95 leading-relaxed">
                <strong className="text-white">Customers:</strong> Pure cow/buffalo milk subscription with morning/evening doorstep delivery.
              </span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={18} className="text-emerald-300 mt-0.5 shrink-0" />
              <span className="text-xs opacity-95 leading-relaxed">
                <strong className="text-white">Staff & Operators:</strong> Fast digital intake desk, lactometer logging & thermal billing.
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-8">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex items-center justify-between">
            <div>
              <div className="text-xs opacity-85">Already registered?</div>
              <div className="text-sm font-bold">Sign in to your account</div>
            </div>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="px-3.5 py-1.5 rounded-lg bg-white text-green-900 font-bold text-xs flex items-center gap-1 hover:bg-slate-50 transition cursor-pointer"
            >
              Sign In <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 h-screen overflow-y-auto bg-white flex flex-col items-center px-6 sm:px-12 py-8">
        <div className="w-full max-w-lg my-auto py-4">
          <div className="mb-5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-2 border border-emerald-100">
              <Sparkles size={14} /> New Account Registration
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
              Create Your Account
            </h2>
            <p className="text-sm text-slate-500">
              Choose your profile type and enter your details to set up your dairy portal access.
            </p>
          </div>

          <div className="mb-4">
            <label className="block font-bold text-xs text-slate-700 mb-1.5">
              Select Account Type *
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRoleId('farmer')}
                className={`p-2.5 rounded-xl border-2 text-center text-xs transition cursor-pointer ${
                  roleId === 'farmer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                }`}
              >
                <div className="text-base mb-0.5">🌾</div>
                <div>Dairy Farmer</div>
                <div className="text-[10px] opacity-75">दूध उत्पादक</div>
              </button>

              <button
                type="button"
                onClick={() => setRoleId('customer')}
                className={`p-2.5 rounded-xl border-2 text-center text-xs transition cursor-pointer ${
                  roleId === 'customer'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                }`}
              >
                <div className="text-base mb-0.5">🥛</div>
                <div>Customer</div>
                <div className="text-[10px] opacity-75">दूध ग्राहक</div>
              </button>

              <button
                type="button"
                onClick={() => setRoleId('operator')}
                className={`p-2.5 rounded-xl border-2 text-center text-xs transition cursor-pointer ${
                  roleId === 'operator'
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 font-medium'
                }`}
              >
                <div className="text-base mb-0.5">🏢</div>
                <div>Dairy Staff</div>
                <div className="text-[10px] opacity-75">डेअरी ऑपरेटर</div>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder={roleId === 'farmer' ? 'e.g. Anand Rao Patil' : (roleId === 'customer' ? 'e.g. Priya Sharma' : 'e.g. Suresh Shinde')}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Mobile Number *
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="tel"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="e.g. +91 98221 44556"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Login Username *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold pointer-events-none">@</span>
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.userName}
                    onChange={(e) => handleInputChange('userName', e.target.value)}
                    placeholder="e.g. anand.patil"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="email"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="name@domain.com"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  {roleId === 'farmer' ? 'Village / Center Name' : (roleId === 'customer' ? 'Delivery Address' : 'Assigned Plant / Branch')}
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder={roleId === 'farmer' ? 'e.g. Shirwal Village, Satara' : (roleId === 'customer' ? 'e.g. Flat 402, Kothrud, Pune' : 'e.g. Shirwal Center #04')}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-9 pr-9 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Min 6 characters"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-0.5"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block font-semibold text-xs text-slate-700">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                />
                I agree to the AmritDhara Cooperative bylaws & terms of service
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-700/20 text-white bg-emerald-700 hover:bg-emerald-800 transition cursor-pointer mt-2"
            >
              <UserPlus size={18} /> Complete Registration & Access Dashboard
            </button>
          </form>

          <div className="mt-5 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateLogin}
              className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              Sign In here
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
