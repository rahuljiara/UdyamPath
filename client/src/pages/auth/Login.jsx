import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  Shield,
  Users2,
  GraduationCap,
  ArrowRight,
  Lock,
  Mail,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import Button from '../../components/common/Button';
import Avatar from '../../components/common/Avatar';
import { useAuth, USER_ROLES } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';
import logoImg from '../../assets/logo/Logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { availableUsers, switchUser } = useAuth();

  const [email, setEmail] = useState('tpo.director@college.edu.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState(USER_ROLES.ADMIN);
  const [loading, setLoading] = useState(false);

  const handleRoleTabClick = (role) => {
    setSelectedRole(role);
    const user = availableUsers.find((u) => u.role === role);
    if (user) {
      setEmail(user.email);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const user = availableUsers.find((u) => u.email === email || u.role === selectedRole) || availableUsers[0];
    switchUser(user.id);

    setTimeout(() => {
      setLoading(false);
      navigate(ROUTES.DASHBOARD);
    }, 400);
  };

  const handleQuickLogin = (userId) => {
    switchUser(userId);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
      {/* Background Decorative Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shadow-lg mb-2">
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
        <div className="bg-white text-text-primary rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xl space-y-6">
          {/* Role Tabs */}
          <div className="flex rounded-xl bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => handleRoleTabClick(USER_ROLES.ADMIN)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === USER_ROLES.ADMIN
                  ? 'bg-white text-rose-800 shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              <span>Admin / HR</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabClick(USER_ROLES.MANAGER)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === USER_ROLES.MANAGER
                  ? 'bg-white text-indigo-800 shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Users2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Manager / HOD</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleTabClick(USER_ROLES.STUDENT)}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                selectedRole === USER_ROLES.STUDENT
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
              <span>Candidate</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1">
                Institutional Email ID
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu.in"
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-text-secondary">Password</label>
                <span className="text-[11px] text-primary hover:underline cursor-pointer">
                  Forgot password?
                </span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border border-border-color rounded-xl pl-9 pr-3 py-2 text-xs text-text-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={loading}
              icon={ArrowRight}
              className="w-full justify-center text-xs py-2.5 font-semibold"
            >
              Sign In to Portal
            </Button>
          </form>

          {/* 1-Click Demo Profiles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block text-center">
              ⚡ 1-Click Fast Demo Login
            </span>
            <div className="grid grid-cols-1 gap-2">
              {availableUsers.slice(0, 3).map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => handleQuickLogin(user.id)}
                  className="p-2 rounded-xl border border-slate-200 hover:border-primary/50 hover:bg-slate-50/80 transition-all text-left flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar name={user.name} size="xs" src={user.avatar} />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-text-primary truncate">{user.name}</p>
                      <p className="text-[10px] text-text-muted">{user.roleTitle}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-primary font-semibold group-hover:translate-x-0.5 transition-transform">
                    Enter →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[11px] text-slate-400">
          UdyamPath Platform • Tier-1 Placement Automation Architecture
        </p>
      </div>
    </div>
  );
};

export default Login;
