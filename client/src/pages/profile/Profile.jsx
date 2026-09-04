import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Shield,
  Key,
  Mail,
  Phone,
  MapPin,
  Building2,
  Calendar,
  Save,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Award,
  Users,
  Smartphone,
  Laptop,
  LogOut,
  ExternalLink,
  Camera
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Loading from '../../components/common/Loading';
import { profileService } from '../../services/profileService';
import { formatDate } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const Profile = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Active tab: 'overview' | 'edit' | 'security'
  const initialTab = searchParams.get('tab') || 'overview';
  const [activeTab, setActiveTab] = useState(initialTab);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    department: '',
    email: '',
    altEmail: '',
    phone: '',
    officeLocation: '',
    bio: '',
    avatar: ''
  });

  // Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Feedback states
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const data = await profileService.getProfile();
      setProfile(data);
      setSessions(data.sessions || []);
      setFormData({
        name: data.name || '',
        title: data.title || '',
        department: data.department || '',
        email: data.email || '',
        altEmail: data.altEmail || '',
        phone: data.phone || '',
        officeLocation: data.officeLocation || '',
        bio: data.bio || '',
        avatar: data.avatar || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
    setSuccessMsg('');
    setErrorMsg('');
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setErrorMsg('');
      const updated = await profileService.updateProfile(formData);
      setProfile((prev) => ({ ...prev, ...updated }));
      setSuccessMsg('Profile information updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }
    try {
      setSaving(true);
      setErrorMsg('');
      await profileService.changePassword(passwordData);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSuccessMsg('Password changed successfully!');
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update password');
    } finally {
      setSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    try {
      const nextState = !profile.twoFactorEnabled;
      await profileService.toggleTwoFactor(nextState);
      setProfile((prev) => ({ ...prev, twoFactorEnabled: nextState }));
      setSuccessMsg(`Two-Factor Authentication ${nextState ? 'Enabled' : 'Disabled'}`);
      setTimeout(() => setSuccessMsg(''), 3500);
    } catch (err) {
      setErrorMsg('Failed to update 2FA status');
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await profileService.terminateSession(sessionId);
      setSessions((prev) => prev.filter((s) => s.id !== sessionId));
      setSuccessMsg('Session terminated successfully.');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      console.error('Error terminating session:', err);
    }
  };

  if (loading) {
    return <Loading message="Loading user profile & credentials..." className="py-24" />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title="User Profile & Settings"
        subtitle="Manage your TPO account credentials, contact information, and security preferences"
        breadcrumbs={[{ label: 'Profile' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(ROUTES.SETTINGS)}
            className="text-xs"
          >
            System Settings
          </Button>
        }
      />

      {/* Success / Error Alerts */}
      {successMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* 2. Top Hero Profile Card */}
      <div className="bg-white rounded-xl border border-border-color p-6 shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="relative">
            <Avatar
              src={profile?.avatar}
              name={profile?.name}
              size="xl"
              className="ring-4 ring-slate-50 shrink-0"
            />
            <button
              type="button"
              onClick={() => handleTabChange('edit')}
              className="absolute -bottom-1 -right-1 p-1.5 bg-primary text-white rounded-full shadow-md hover:bg-primary-hover transition-colors"
              title="Change Avatar"
            >
              <Camera className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-text-primary tracking-tight">
                {profile?.name}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-primary-soft text-primary">
                {profile?.role}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {profile?.status}
              </span>
            </div>

            <p className="text-xs text-text-secondary font-medium">
              {profile?.title} • <span className="text-text-muted">{profile?.department}</span>
            </p>

            <div className="flex items-center gap-4 text-xs text-text-muted flex-wrap pt-1">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.email}</span>
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{profile?.phone}</span>
              </span>

              <span>•</span>

              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="truncate max-w-[200px]">{profile?.officeLocation}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={activeTab === 'edit' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => handleTabChange('edit')}
            className="text-xs"
          >
            Edit Profile
          </Button>
          <Button
            variant={activeTab === 'security' ? 'primary' : 'outline'}
            size="sm"
            icon={Shield}
            onClick={() => handleTabChange('security')}
            className="text-xs"
          >
            Security
          </Button>
        </div>
      </div>

      {/* 3. Tab Navigation */}
      <div className="flex border-b border-border-color gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => handleTabChange('overview')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Overview</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('edit')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'edit'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Edit Profile Details</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange('security')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'security'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>Security & Password</span>
        </button>
      </div>

      {/* 4. Tab Content Panels */}

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left 2 Cols: Statement & Stats */}
            <div className="md:col-span-2 space-y-6">
              {/* Executive Bio */}
              <Card title="Executive Statement & Bio" subtitle="Officer responsibilities and mandate">
                <p className="text-xs text-text-secondary leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200/80">
                  {profile?.bio}
                </p>
              </Card>

              {/* Placement Season Accomplishments */}
              <Card title="Current Placement Highlights" subtitle="Academic cohort performance indicators">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-center">
                    <span className="text-text-muted text-[11px] block">Students Placed</span>
                    <p className="text-lg font-bold text-primary mt-1">990</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-center">
                    <span className="text-text-muted text-[11px] block">Placement Rate</span>
                    <p className="text-lg font-bold text-emerald-600 mt-1">86.1%</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-center">
                    <span className="text-text-muted text-[11px] block">Top Package</span>
                    <p className="text-lg font-bold text-text-primary mt-1">44.0 LPA</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/70 text-center">
                    <span className="text-text-muted text-[11px] block">Recruiters</span>
                    <p className="text-lg font-bold text-text-primary mt-1">48</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right 1 Col: Account Metadata & Shortcuts */}
            <div className="space-y-6">
              <Card title="Account Metadata" subtitle="Official registration credentials">
                <div className="divide-y divide-border-color/60 text-xs">
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Employee ID</span>
                    <span className="font-mono font-bold text-text-primary">{profile?.employeeId}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Officer Role</span>
                    <span className="font-semibold text-primary">{profile?.role}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Member Since</span>
                    <span className="font-medium text-text-primary">{formatDate(profile?.joinedDate)}</span>
                  </div>
                  <div className="py-2.5 flex items-center justify-between">
                    <span className="text-text-muted">Two-Factor Auth</span>
                    <span className={`font-semibold ${profile?.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {profile?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Navigation Shortcuts */}
              <Card title="Quick Management Shortcuts">
                <div className="space-y-2 text-xs">
                  <Link
                    to={ROUTES.DRIVES.ROOT}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-primary-soft/30 hover:border-primary transition-colors text-text-primary font-medium"
                  >
                    <span>Manage Placement Drives</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to={ROUTES.STUDENTS.ROOT}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-primary-soft/30 hover:border-primary transition-colors text-text-primary font-medium"
                  >
                    <span>Student Talent Pool</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    to={ROUTES.AUDIT_LOGS}
                    className="flex items-center justify-between p-2.5 rounded-lg border border-border-color hover:bg-primary-soft/30 hover:border-primary transition-colors text-text-primary font-medium"
                  >
                    <span>System Audit Trail</span>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Edit Profile Form */}
      {activeTab === 'edit' && (
        <form onSubmit={handleSaveProfile} className="space-y-6">
          <Card
            title="Personal & Professional Information"
            subtitle="Update your official contact details and officer bio"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Official Title / Designation
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Official Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Alternate / Institutional Email
                </label>
                <input
                  type="email"
                  value={formData.altEmail}
                  onChange={(e) => setFormData({ ...formData, altEmail: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Office Location / Room
                </label>
                <input
                  type="text"
                  value={formData.officeLocation}
                  onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-text-secondary mb-1">
                  Profile Avatar Image URL
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-medium text-text-secondary mb-1">
                  Officer Bio & Executive Statement
                </label>
                <textarea
                  rows="3"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary leading-relaxed"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleTabChange('overview')}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab 3: Security & Credentials */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          {/* Change Password Form */}
          <form onSubmit={handleChangePassword} className="space-y-4">
            <Card
              title="Change Account Password"
              subtitle="Ensure your administrative password uses at least 8 characters with numbers and symbols"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    Current Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                    className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                    className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-medium text-text-secondary mb-1">
                    Confirm New Password <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                    className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-slate-100">
                <Button type="submit" variant="primary" icon={Key} loading={saving}>
                  Update Password
                </Button>
              </div>
            </Card>
          </form>

          {/* Two-Factor Authentication Toggle */}
          <Card
            title="Two-Factor Authentication (2FA)"
            subtitle="Protect your institutional placement portal with multi-factor verification"
          >
            <div className="flex items-center justify-between p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 text-xs">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">2FA Status:</span>
                  <span
                    className={`font-semibold ${
                      profile?.twoFactorEnabled ? 'text-emerald-600' : 'text-slate-500'
                    }`}
                  >
                    {profile?.twoFactorEnabled ? 'Enabled & Enforced' : 'Disabled'}
                  </span>
                </div>
                <p className="text-[11px] text-text-muted">
                  Requires OTP verification via registered mobile/authenticator app upon login.
                </p>
              </div>

              <Button
                variant={profile?.twoFactorEnabled ? 'danger' : 'primary'}
                size="sm"
                onClick={handleToggle2FA}
                className="text-xs"
              >
                {profile?.twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
              </Button>
            </div>
          </Card>

          {/* Active Logged-In Sessions */}
          <Card
            title="Active Device Sessions"
            subtitle="Devices and browsers currently authenticated to this account"
            padding={false}
          >
            <div className="divide-y divide-border-color/70 text-xs">
              {sessions.map((sess) => (
                <div key={sess.id} className="p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      {sess.device.includes('iPhone') || sess.device.includes('Mobile') ? (
                        <Smartphone className="w-4 h-4" />
                      ) : (
                        <Laptop className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text-primary">{sess.device}</span>
                        {sess.isCurrent && (
                          <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Current Session
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-text-muted block mt-0.5">
                        IP: {sess.ip} • {sess.location} • {sess.lastActive}
                      </span>
                    </div>
                  </div>

                  {!sess.isCurrent && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleTerminateSession(sess.id)}
                      className="text-xs text-rose-600 hover:bg-rose-50"
                    >
                      Terminate
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Profile;
