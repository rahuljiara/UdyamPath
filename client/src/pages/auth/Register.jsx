import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Lock,
  Mail,
  User,
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  Briefcase,
  GraduationCap,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';
import logoImg from '../../assets/logo/Logo.png';

const ACCOUNT_TYPES = [
  {
    id: 'RECRUITER',
    label: 'Employee / Recruiter',
    icon: Building2,
    description: 'Corporate recruiters, HR leads, and enterprise hiring managers'
  },
  {
    id: 'STUDENT',
    label: 'Candidate / Student',
    icon: GraduationCap,
    description: 'Enrolled students participating in campus placement drives'
  },
  {
    id: 'HOD',
    label: 'Department Faculty',
    icon: Briefcase,
    description: 'Head of Department or faculty placement coordinator'
  }
];

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [accountType, setAccountType] = useState('RECRUITER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [company, setCompany] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [studentId, setStudentId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim()) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please re-enter.');
      return;
    }

    if (accountType === 'RECRUITER' && !company.trim()) {
      setErrorMsg('Please enter your company or employer name.');
      return;
    }

    setLoading(true);

    try {
      const deptCodeMap = {
        'Computer Science & Engineering': 'CSE',
        'Information Technology': 'IT',
        'Electronics & Communication': 'ECE',
        'Electrical & Electronics': 'EEE',
        'Mechanical Engineering': 'MECH'
      };

      await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: accountType,
        company: accountType === 'RECRUITER' ? company.trim() : '',
        department: accountType !== 'RECRUITER' ? department : '',
        deptCode: accountType !== 'RECRUITER' ? deptCodeMap[department] || 'CSE' : '',
        studentId: accountType === 'STUDENT' ? studentId.trim() : ''
      });

      setSuccessMsg('Account registered successfully! Redirecting to your dashboard...');
      setTimeout(() => {
        navigate(ROUTES.DASHBOARD, { replace: true });
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg mb-1">
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
            Create your account to access campus recruitment & placement tools
          </p>
        </div>

        {/* Main Registration Card */}
        <div className="bg-white text-text-primary rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-5">
          <div className="space-y-1">
            <h2 className="text-lg font-bold text-text-primary">Sign up for a new account</h2>
            <p className="text-xs text-text-muted">
              Select your role and complete your institutional / corporate profile
            </p>
          </div>

          {/* Account Type Selector Tabs */}
          <div>
            <label className="block text-xs font-semibold text-text-secondary mb-2">
              Select Account Persona
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ACCOUNT_TYPES.map((type) => {
                const Icon = type.icon;
                const isSelected = accountType === type.id;
                return (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => {
                      setAccountType(type.id);
                      setErrorMsg('');
                    }}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                      isSelected
                        ? 'border-primary bg-primary-soft/40 text-primary font-bold shadow-2xs'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-slate-400'}`} />
                    <span className="text-[11px] leading-tight">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{errorMsg}</div>
            </div>
          )}

          {/* Success Alert */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-start gap-2.5 animate-in fade-in duration-150">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-snug">{successMsg}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sneha Kulkarni"
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                {accountType === 'RECRUITER' ? 'Corporate Work Email' : 'Institutional Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={accountType === 'RECRUITER' ? 'name@company.com' : 'name@college.edu.in'}
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Conditional: Company name for Recruiter / Employee */}
            {accountType === 'RECRUITER' && (
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">
                  Company / Organization Name
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Microsoft India, Google, Tata Consultancy Services"
                    className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            )}

            {/* Conditional: Department for Student / Faculty */}
            {accountType !== 'RECRUITER' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary mb-1">
                    Academic Department
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full bg-slate-50 border border-border-color rounded-xl px-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  >
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Information Technology">IT</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Electrical & Electronics">EEE</option>
                    <option value="Mechanical Engineering">MECH</option>
                  </select>
                </div>

                {accountType === 'STUDENT' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-secondary mb-1">
                      Student Roll / ID
                    </label>
                    <input
                      type="text"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      placeholder="e.g. 2021CSE045"
                      className="w-full bg-slate-50 border border-border-color rounded-xl px-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-8 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-secondary mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter password"
                    className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={ArrowRight}
              className="w-full justify-center text-xs py-2.5 font-semibold mt-3"
            >
              {accountType === 'RECRUITER'
                ? 'Register Employee / Recruiter Account'
                : accountType === 'STUDENT'
                ? 'Register Candidate Account'
                : 'Register Faculty Account'}
            </Button>
          </form>

          {/* Link to Sign In */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-text-muted">
              Already have an institutional account?{' '}
              <Link to={ROUTES.LOGIN} className="font-semibold text-primary hover:underline">
                Sign in here →
              </Link>
            </p>
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

export default Register;
