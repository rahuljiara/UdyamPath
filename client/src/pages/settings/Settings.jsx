import React, { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  GraduationCap,
  ShieldCheck,
  Bell,
  Save,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loading from '../../components/common/Loading';
import { settingsService } from '../../services/settingsService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('institution'); // 'institution' | 'departments' | 'policy' | 'notifications'
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState('');

  // Settings State
  const [institution, setInstitution] = useState({});
  const [policy, setPolicy] = useState({});
  const [notifications, setNotifications] = useState({});
  const [departments, setDepartments] = useState([]);

  // Department modal state
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState(null);
  const [deptFormData, setDeptFormData] = useState({ name: '', code: '', hod: '', totalStudents: 120 });
  const [deptToDelete, setDeptToDelete] = useState(null);
  const [isDeletingDept, setIsDeletingDept] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setInstitution(data.institution || {});
      setPolicy(data.policy || {});
      setNotifications(data.notifications || {});
      setDepartments(data.departments || []);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const triggerSuccess = (msg) => {
    setSavedSuccess(msg);
    setTimeout(() => setSavedSuccess(''), 3000);
  };

  const handleSaveInstitution = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateInstitution(institution);
      triggerSuccess('Institutional profile updated successfully!');
    } catch (err) {
      console.error('Error saving institution:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSavePolicy = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updatePolicy(policy);
      triggerSuccess('Placement policy parameters saved!');
    } catch (err) {
      console.error('Error saving policy:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveNotifications = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await settingsService.updateNotifications(notifications);
      triggerSuccess('Notification triggers updated!');
    } catch (err) {
      console.error('Error saving notifications:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleOpenAddDept = () => {
    setDeptToEdit(null);
    setDeptFormData({ name: '', code: '', hod: '', totalStudents: 120 });
    setShowDeptModal(true);
  };

  const handleOpenEditDept = (dept) => {
    setDeptToEdit(dept);
    setDeptFormData({
      name: dept.name,
      code: dept.code,
      hod: dept.hod,
      totalStudents: dept.totalStudents
    });
    setShowDeptModal(true);
  };

  const handleSaveDepartment = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (deptToEdit) {
        await settingsService.updateDepartment(deptToEdit.id, deptFormData);
      } else {
        await settingsService.addDepartment(deptFormData);
      }
      setShowDeptModal(false);
      const updatedDepts = await settingsService.getDepartments();
      setDepartments(updatedDepts);
      triggerSuccess(deptToEdit ? 'Department updated!' : 'New department registered!');
    } catch (err) {
      console.error('Error saving department:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDepartment = async () => {
    if (!deptToDelete) return;
    try {
      setIsDeletingDept(true);
      await settingsService.deleteDepartment(deptToDelete.id);
      setDeptToDelete(null);
      const updatedDepts = await settingsService.getDepartments();
      setDepartments(updatedDepts);
      triggerSuccess('Department removed.');
    } catch (err) {
      console.error('Error deleting department:', err);
    } finally {
      setIsDeletingDept(false);
    }
  };

  if (loading) {
    return <Loading message="Loading system settings and configuration..." className="py-24" />;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title="Settings & System Configuration"
        subtitle="Manage institution profile, academic departments, placement policy rules, and alerts"
        breadcrumbs={[{ label: 'Settings' }]}
      />

      {/* Success Notification Alert */}
      {savedSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center gap-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{savedSuccess}</span>
        </div>
      )}

      {/* 2. Navigation Tabs */}
      <div className="flex border-b border-border-color gap-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('institution')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'institution'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Institution Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('departments')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'departments'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Academic Departments ({departments.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policy')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'policy'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Placement Policy & Rules</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'notifications'
              ? 'border-primary text-primary'
              : 'border-transparent text-text-muted hover:text-text-primary'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts & Notifications</span>
        </button>
      </div>

      {/* 3. Tab Contents */}

      {/* Tab 1: Institution Profile */}
      {activeTab === 'institution' && (
        <form onSubmit={handleSaveInstitution} className="space-y-6">
          <Card
            title="Institution & Placement Cell Details"
            subtitle="Accreditation details, college identifiers, and TPO contact channels"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-medium text-text-secondary mb-1">
                  College / University Name
                </label>
                <input
                  type="text"
                  value={institution.name || ''}
                  onChange={(e) => setInstitution({ ...institution, name: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Institutional Code
                </label>
                <input
                  type="text"
                  value={institution.code || ''}
                  onChange={(e) => setInstitution({ ...institution, code: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  NAAC Accreditation Grade
                </label>
                <input
                  type="text"
                  value={institution.naacGrade || ''}
                  onChange={(e) => setInstitution({ ...institution, naacGrade: e.target.value })}
                  placeholder="e.g. A++"
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  NIRF Engineering Rank
                </label>
                <input
                  type="text"
                  value={institution.nirfRank || ''}
                  onChange={(e) => setInstitution({ ...institution, nirfRank: e.target.value })}
                  placeholder="e.g. 28"
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Academic Session
                </label>
                <input
                  type="text"
                  value={institution.currentAcademicYear || ''}
                  onChange={(e) => setInstitution({ ...institution, currentAcademicYear: e.target.value })}
                  placeholder="2024-2025"
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Head TPO Name
                </label>
                <input
                  type="text"
                  value={institution.tpoName || ''}
                  onChange={(e) => setInstitution({ ...institution, tpoName: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  TPO Official Email
                </label>
                <input
                  type="email"
                  value={institution.tpoEmail || ''}
                  onChange={(e) => setInstitution({ ...institution, tpoEmail: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  TPO Contact Phone
                </label>
                <input
                  type="text"
                  value={institution.tpoPhone || ''}
                  onChange={(e) => setInstitution({ ...institution, tpoPhone: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div className="sm:col-span-2 md:col-span-3">
                <label className="block font-medium text-text-secondary mb-1">
                  Placement Cell Office Location
                </label>
                <input
                  type="text"
                  value={institution.placementOffice || ''}
                  onChange={(e) => setInstitution({ ...institution, placementOffice: e.target.value })}
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      )}

      {/* Tab 2: Academic Departments */}
      {activeTab === 'departments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text-primary">
              Registered Academic Departments
            </h3>
            <Button
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={handleOpenAddDept}
              className="text-xs"
            >
              Add Department
            </Button>
          </div>

          <div className="bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3.5">Department Name</th>
                  <th className="px-4 py-3.5">Branch Code</th>
                  <th className="px-4 py-3.5">Head of Department (HOD)</th>
                  <th className="px-4 py-3.5">Enrolled</th>
                  <th className="px-4 py-3.5">Placed</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/75 text-text-primary">
                {departments.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-text-primary">{d.name}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[11px] font-bold">
                        {d.code}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-text-secondary">{d.hod}</td>
                    <td className="px-4 py-3.5 font-semibold text-text-primary">{d.totalStudents}</td>
                    <td className="px-4 py-3.5 font-bold text-primary">{d.placedStudents || 0}</td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDept(d)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Edit Department"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeptToDelete(d)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Department"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Placement Policy & Rules */}
      {activeTab === 'policy' && (
        <form onSubmit={handleSavePolicy} className="space-y-6">
          <Card
            title="Compensation Tiers & Offer Policy"
            subtitle="Configure salary cut-offs for Dream / Super Dream classification and offer limits"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Dream Offer CTC Threshold (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={policy.dreamPackageThreshold || 10.0}
                  onChange={(e) =>
                    setPolicy({ ...policy, dreamPackageThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Super Dream Threshold (LPA)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={policy.superDreamThreshold || 25.0}
                  onChange={(e) =>
                    setPolicy({ ...policy, superDreamThreshold: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>

              <div>
                <label className="block font-medium text-text-secondary mb-1">
                  Max Allowed Offers per Student
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={policy.maxOffersAllowed || 2}
                  onChange={(e) =>
                    setPolicy({ ...policy, maxOffersAllowed: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            </div>

            {/* Policy Toggles */}
            <div className="pt-4 mt-4 border-t border-slate-100 space-y-3 text-xs">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.allowDreamUpgrade ?? true}
                  onChange={(e) => setPolicy({ ...policy, allowDreamUpgrade: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Allow Dream / Super Dream Upgrades
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Placed students can apply to drives with packages $\ge$ 1.5x of their current offer.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.autoEligibilityCheck ?? true}
                  onChange={(e) => setPolicy({ ...policy, autoEligibilityCheck: e.target.checked })}
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Strict Automatic Eligibility Cutoff
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Block student application if CGPA or active backlogs do not meet drive requirements.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={policy.requireResumeVerification ?? true}
                  onChange={(e) =>
                    setPolicy({ ...policy, requireResumeVerification: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Require TPO Verified Resume
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Students must have a verified PDF resume attached before applying.
                  </span>
                </div>
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Placement Policies
            </Button>
          </div>
        </form>
      )}

      {/* Tab 4: Notifications */}
      {activeTab === 'notifications' && (
        <form onSubmit={handleSaveNotifications} className="space-y-6">
          <Card
            title="Automated Email & System Alert Triggers"
            subtitle="Configure delivery preferences for candidates, faculty, and recruiters"
          >
            <div className="space-y-4 text-xs">
              <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.emailOnNewDrive ?? true}
                  onChange={(e) =>
                    setNotifications({ ...notifications, emailOnNewDrive: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Drive Broadcast Notifications
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Email all eligible candidates when a new placement drive is published.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.emailOnShortlist ?? true}
                  onChange={(e) =>
                    setNotifications({ ...notifications, emailOnShortlist: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Interview Shortlisting Alerts
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Notify shortlisted candidates with interview timing and meeting link.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.emailOnOffer ?? true}
                  onChange={(e) =>
                    setNotifications({ ...notifications, emailOnOffer: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Offer Letter Notifications
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Alert student and HOD immediately when a placement offer is recorded.
                  </span>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-2.5 rounded-lg border border-border-color hover:bg-slate-50 transition-colors">
                <input
                  type="checkbox"
                  checked={notifications.dailyTpoDigest ?? true}
                  onChange={(e) =>
                    setNotifications({ ...notifications, dailyTpoDigest: e.target.checked })
                  }
                  className="rounded text-primary focus:ring-primary"
                />
                <div>
                  <span className="font-semibold text-text-primary block">
                    Daily TPO Placement Cell Digest
                  </span>
                  <span className="text-text-muted text-[11px]">
                    Send summary of scheduled interviews and pending application reviews at 08:00 AM.
                  </span>
                </div>
              </label>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Notification Preferences
            </Button>
          </div>
        </form>
      )}

      {/* Add / Edit Department Modal */}
      <Modal
        isOpen={showDeptModal}
        onClose={() => setShowDeptModal(false)}
        title={deptToEdit ? 'Edit Department' : 'Register Academic Department'}
        subtitle="Department designation, branch code, and faculty head"
        size="md"
        footer={
          <>
            <Button variant="outline" size="sm" onClick={() => setShowDeptModal(false)} disabled={saving}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={Save} onClick={handleSaveDepartment} loading={saving}>
              {deptToEdit ? 'Save Changes' : 'Register Department'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveDepartment} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-text-secondary mb-1">Department Name *</label>
            <input
              type="text"
              required
              value={deptFormData.name}
              onChange={(e) => setDeptFormData({ ...deptFormData, name: e.target.value })}
              placeholder="e.g. Artificial Intelligence & Data Science"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-text-secondary mb-1">Branch Code *</label>
              <input
                type="text"
                required
                value={deptFormData.code}
                onChange={(e) => setDeptFormData({ ...deptFormData, code: e.target.value })}
                placeholder="e.g. AIDS"
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>

            <div>
              <label className="block font-medium text-text-secondary mb-1">Student Capacity</label>
              <input
                type="number"
                min="1"
                value={deptFormData.totalStudents}
                onChange={(e) =>
                  setDeptFormData({ ...deptFormData, totalStudents: Number(e.target.value) })
                }
                className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-text-secondary mb-1">Head of Department (HOD) *</label>
            <input
              type="text"
              required
              value={deptFormData.hod}
              onChange={(e) => setDeptFormData({ ...deptFormData, hod: e.target.value })}
              placeholder="e.g. Dr. K. Radhakrishnan"
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Department Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deptToDelete}
        onClose={() => setDeptToDelete(null)}
        onConfirm={handleDeleteDepartment}
        title="Remove Academic Department"
        message={`Are you sure you want to remove the ${deptToDelete?.name} (${deptToDelete?.code}) department?`}
        confirmLabel="Remove Department"
        loading={isDeletingDept}
      />
    </div>
  );
};

export default Settings;
