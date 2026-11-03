import React, { useState } from 'react';
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useDairy } from '../context/DairyContext';
import { Modal } from '../components/common/Modal';
import { PublicLanguageDropdown } from '../components/common/PublicLanguageDropdown';

export const LoginView = ({ onNavigateRegister }) => {
  const { loginUser, showToast, t } = useDairy();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!username.trim() || !password) {
      showToast('Please enter both username and password', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      const result = await loginUser(username, password, rememberMe);
      if (result && !result.success) {
        setErrorMessage(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'An error occurred during authentication.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      showToast('Please enter your registered email or phone', 'warning');
      return;
    }
    showToast(`Password reset OTP has been sent to ${forgotEmail}`, 'success');
    setIsForgotModalOpen(false);
    setForgotEmail('');
  };

  return (
    <div className="w-screen h-screen min-h-screen max-h-screen flex bg-white overflow-hidden m-0 p-0">
      <div className="hidden lg:flex flex-none w-[40%] max-w-[40%] h-screen bg-gradient-to-br from-green-900 via-green-700 to-green-800 text-white p-12 flex-col justify-between relative overflow-y-auto">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none mix-blend-overlay bg-[url('/dairy-hero.jpg')]"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-12 h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md">
              <img src="/dairy-logo.jpg" alt="Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white leading-tight">
                {t('appName', 'AmritDhara')}
              </h2>
              <div className="text-xs opacity-90 tracking-wider">
                {t('appSubtitle', 'Smart Dairy Management System')}
              </div>
            </div>
          </div>

          <h1 className="text-3xl font-extrabold text-white leading-snug mb-4">
            {t('Login_HeroTitle', 'Empowering Dairy Farmers, Automating Milk Operations.')}
          </h1>
          <p className="text-sm opacity-90 leading-relaxed max-w-md">
            {t(
              'Login_HeroDesc',
              'Complete end-to-end ERP platform for automated milk collection, instant fat & SNF testing rate calculation, farmer passbook accounting, product logistics, and customer milk subscriptions.'
            )}
          </p>
        </div>

        <div className="relative z-10 mt-8">
          <div className="grid grid-cols-2 gap-3.5 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div>
              <div className="text-xl font-extrabold">100%</div>
              <div className="text-xs opacity-90">Real-Time Milk Testing</div>
            </div>
            <div>
              <div className="text-xl font-extrabold">Secure</div>
              <div className="text-xs opacity-90">Role-Based Access</div>
            </div>
            <div>
              <div className="text-xl font-extrabold">Instant Slip</div>
              <div className="text-xs opacity-90">Thermal Receipt Print</div>
            </div>
            <div>
              <div className="text-xl font-extrabold">Direct Payout</div>
              <div className="text-xs opacity-90">Farmer Bank Ledger</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 h-screen overflow-y-auto bg-white flex flex-col justify-center items-center px-6 sm:px-12 py-10 relative">
        <div className="absolute top-6 right-6 z-20">
          <PublicLanguageDropdown className="w-44" />
        </div>

        <div className="w-full max-w-md my-auto">
          <div className="mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3 border border-emerald-100">
              <ShieldCheck size={14} /> Secure Dairy Portal
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight">
              {t('Login_Welcome', 'Sign In to Your Account')}
            </h2>
            <p className="text-sm text-slate-500">
              {t('Login_Subtitle', 'Enter your registered username or email and password to access the portal.')}
            </p>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-800 border border-red-200 rounded-xl p-3.5 text-sm mb-5 flex items-center gap-2 shadow-sm">
              <AlertCircle size={18} className="shrink-0 text-red-600" />
              <div>{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block font-semibold text-xs text-slate-700">
                {t('EmailOrPhone', 'Email or Username')}
              </label>
              <div className="relative">
                <Mail
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t('EmailOrPhonePlaceholder', 'e.g. anand.patil or your username')}
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block font-semibold text-xs text-slate-700">
                  {t('Password', 'Password')}
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-transparent border-0 cursor-pointer"
                >
                  {t('ForgotPassword', 'Forgot Password?')}
                </button>
              </div>
              <div className="relative">
                <Lock
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('PasswordPlaceholder', 'Enter your password')}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-0 cursor-pointer p-1"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-600 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-emerald-600 w-4 h-4 rounded cursor-pointer"
                />
                {t('RememberMe', 'Remember my login on this device')}
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 text-sm font-bold flex items-center justify-center gap-2 rounded-xl shadow-lg shadow-emerald-700/20 text-white bg-emerald-700 hover:bg-emerald-800 disabled:opacity-75 disabled:cursor-not-allowed transition cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  {t('Login_SigningIn', 'Signing in...')}
                </>
              ) : (
                <>
                  <LogIn size={18} /> {t('Login', 'Sign In')}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-500">
            {t('DontHaveAccount', "Don't have an account yet?")}{' '}
            <button
              type="button"
              onClick={onNavigateRegister}
              className="text-emerald-700 font-bold hover:underline bg-transparent border-0 cursor-pointer"
            >
              {t('RegisterHere', 'Register here (नवीन नोंदणी)')}
            </button>
          </div>

          <div className="mt-8 text-center text-xs text-slate-400 border-t border-slate-100 pt-5">
            Need help signing in? Contact Dairy Admin: <strong className="text-slate-600">+91 2169 244890</strong>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
        title={t('ForgotPassword', 'Reset Account Password')}
        footer={
          <div className="flex justify-end gap-2 w-full">
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
              onClick={() => setIsForgotModalOpen(false)}
            >
              {t('Cancel', 'Cancel')}
            </button>
            <button
              className="px-4 py-2 text-sm font-medium rounded-lg bg-emerald-700 text-white hover:bg-emerald-800"
              onClick={handleForgotPassword}
            >
              {t('Submit', 'Send Reset Link')}
            </button>
          </div>
        }
      >
        <p className="text-sm text-slate-600 mb-4">
          Enter your registered email address or mobile number. We will send you an OTP verification code to reset your password.
        </p>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">
            {t('EmailOrPhone', 'Registered Email / Mobile')}
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600"
            placeholder="e.g. yourname@domain.com or +91 98..."
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
};
