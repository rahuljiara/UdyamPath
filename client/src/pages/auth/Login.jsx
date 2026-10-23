import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  UserPlus,
  Building2
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';
import logoImg from '../../assets/logo/Logo.png';
import DEMO_ACCOUNTS from '../../data/demoAccounts';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both your institutional email and password.');
      return;
    }

    setErrorMsg('');
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      const message =
        err.message || 'Invalid email or password. Please verify your credentials and try again.';
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg mb-2">
            <img
              src={logoImg}
              alt="UdyamPath Logo"
              className="w-12 h-12 object-contain"
            />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Udyam<span className="text-primary-300">Path</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            From Campus to Career • Centralized Placement Operating System
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white text-text-primary rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5">
          {/* Top Auth Nav Tabs */}
          <div className="flex items-center p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              className="flex-1 py-1.5 text-xs font-bold rounded-lg bg-white text-primary shadow-xs transition-all text-center"
            >
              Sign In
            </button>
            <Link
              to={ROUTES.REGISTER}
              className="flex-1 py-1.5 text-xs font-semibold rounded-lg text-slate-600 hover:text-slate-900 transition-all text-center flex items-center justify-center gap-1"
            >
              <UserPlus className="w-3.5 h-3.5 text-slate-400" />
              <span>Sign Up Employee</span>
            </Link>
          </div>

          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Sign in to your account</h2>
            <p className="text-xs text-text-muted">
              Enter your institutional credentials to access the placement portal
            </p>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">
                Institutional Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="name@college.edu.in"
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2.5 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-10 py-2.5 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-slate-300 text-primary focus:ring-primary/20 accent-primary"
                />
                <span className="text-xs text-text-muted">Remember my session</span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={ArrowRight}
              className="w-full justify-center text-xs py-2.5 font-semibold mt-2"
            >
              Sign In to Portal
            </Button>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-text-muted">New hiring partner or employee?</span>
              <Link
                to={ROUTES.REGISTER}
                className="font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>Sign Up Employee →</span>
              </Link>
            </div>
          </form>

          {/* Corporate Employee Sign Up Callout */}
          <div className="p-3 rounded-xl bg-indigo-50/80 border border-indigo-100 flex items-center justify-between gap-3">
            <div className="space-y-0.5 min-w-0">
              <p className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 truncate">
                <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span>Corporate Recruiter / Employee?</span>
              </p>
              <p className="text-[11px] text-indigo-700 truncate">
                Register company account to publish campus placement drives
              </p>
            </div>
            <Link
              to={ROUTES.REGISTER}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs shrink-0 transition-colors"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Sign Up</span>
            </Link>
          </div>

          {/* Quick Demo Accounts 1-Click Login */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                Quick Demo Accounts (1-Click Login)
              </span>
              <span className="text-[10px] text-primary font-medium">Default: password123</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {DEMO_ACCOUNTS.map((acc) => (
                <button
                  key={acc.email}
                  type="button"
                  disabled={loading}
                  onClick={async () => {
                    setEmail(acc.email);
                    setPassword(acc.password);
                    setErrorMsg('');
                    setLoading(true);
                    try {
                      await login(acc.email, acc.password);
                      navigate(redirectPath, { replace: true });
                    } catch (err) {
                      setErrorMsg(err.message || 'Login failed');
                    } finally {
                      setLoading(false);
                    }
                  }}
                  className="flex items-start gap-2 p-2 rounded-xl text-left border border-slate-200/90 hover:border-primary/50 hover:bg-primary-soft/20 transition-all group disabled:opacity-50"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5 border border-slate-200 group-hover:scale-105 transition-transform"
                  />
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-[11px] font-bold text-text-primary truncate leading-tight group-hover:text-primary">
                      {acc.roleLabel}
                    </p>
                    <p className="text-[10px] text-text-muted truncate leading-none">
                      {acc.name}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400">
          © {new Date().getFullYear()} UdyamPath • All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login;
