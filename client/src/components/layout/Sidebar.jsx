import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileCheck2,
  CalendarCheck2,
  Award,
  BarChart3,
  FileSpreadsheet,
  Calendar,
  Settings,
  ShieldCheck,
  UserCheck,
  X,
  Compass,
  GraduationCap,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';
import logoImg from '../../assets/logo/Logo.png';

const Sidebar = ({ isOpen, onClose }) => {
  const { currentUser, role, isAdmin, isManager, isStudent } = useAuth();

  // 1. Navigation items tailored for Admin
  const adminMainNav = [
    { name: 'Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Students', to: ROUTES.STUDENTS.ROOT, icon: Users },
    { name: 'Companies', to: ROUTES.COMPANIES.ROOT, icon: Building2 },
    { name: 'Placement Drives', to: ROUTES.DRIVES.ROOT, icon: Briefcase },
    { name: 'Applications', to: ROUTES.APPLICATIONS.ROOT, icon: FileCheck2 },
    { name: 'Interviews', to: ROUTES.INTERVIEWS.ROOT, icon: CalendarCheck2 },
    { name: 'Offers', to: ROUTES.OFFERS.ROOT, icon: Award }
  ];

  const adminManagementNav = [
    { name: 'Analytics', to: ROUTES.ANALYTICS, icon: BarChart3 },
    { name: 'Reports', to: ROUTES.REPORTS, icon: FileSpreadsheet },
    { name: 'Calendar', to: ROUTES.CALENDAR, icon: Calendar },
    { name: 'Settings', to: ROUTES.SETTINGS, icon: Settings },
    { name: 'Audit Logs', to: ROUTES.AUDIT_LOGS, icon: ShieldCheck }
  ];

  // 2. Navigation items tailored for Department Manager / HOD
  const managerMainNav = [
    { name: 'Dept Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: `${currentUser?.deptCode || 'CSE'} Students`, to: ROUTES.STUDENTS.ROOT, icon: Users },
    { name: 'Placement Drives', to: ROUTES.DRIVES.ROOT, icon: Briefcase },
    { name: 'Dept Applications', to: ROUTES.APPLICATIONS.ROOT, icon: FileCheck2 },
    { name: 'Interviews', to: ROUTES.INTERVIEWS.ROOT, icon: CalendarCheck2 },
    { name: 'Dept Offers', to: ROUTES.OFFERS.ROOT, icon: Award }
  ];

  const managerManagementNav = [
    { name: 'Dept Analytics', to: ROUTES.ANALYTICS, icon: BarChart3 },
    { name: 'NAAC / NIRF Reports', to: ROUTES.REPORTS, icon: FileSpreadsheet },
    { name: 'Calendar', to: ROUTES.CALENDAR, icon: Calendar }
  ];

  // 3. Navigation items tailored for Employee / Student Candidate
  const studentMainNav = [
    { name: 'My Dashboard', to: ROUTES.DASHBOARD, icon: LayoutDashboard },
    { name: 'Explore & Apply Drives', to: ROUTES.DRIVES.ROOT, icon: Briefcase },
    { name: 'My Applications', to: ROUTES.APPLICATIONS.ROOT, icon: FileCheck2 },
    { name: 'My Interviews', to: ROUTES.INTERVIEWS.ROOT, icon: CalendarCheck2 },
    { name: 'My Offers', to: ROUTES.OFFERS.ROOT, icon: Award }
  ];

  const studentManagementNav = [
    { name: 'My Profile & Resume', to: ROUTES.PROFILE, icon: UserCheck },
    { name: 'Placement Calendar', to: ROUTES.CALENDAR, icon: Calendar }
  ];

  const activeMainNav = isStudent ? studentMainNav : isManager ? managerMainNav : adminMainNav;
  const activeMgmtNav = isStudent ? studentManagementNav : isManager ? managerManagementNav : adminManagementNav;

  const sectionLabel1 = isStudent ? 'Candidate Portal' : isManager ? `${currentUser?.deptCode || 'CSE'} Department` : 'Main Menu';
  const sectionLabel2 = isStudent ? 'Personal Career Tools' : isManager ? 'Analytics & Reports' : 'Management & System';

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-white border-r border-border-color flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-border-color shrink-0">
          <NavLink to={ROUTES.DASHBOARD} className="flex items-center gap-3 focus:outline-none group" onClick={onClose}>
            <img
              src={logoImg}
              alt="UdyamPath"
              className="w-9 h-9 object-contain rounded-lg transition-transform duration-200 group-hover:scale-105"
            />
            <div>
              <span className="text-base font-bold text-text-primary tracking-tight block leading-none">
                Udyam<span className="text-primary">Path</span>
              </span>
              <span className="text-[10px] font-medium text-text-muted uppercase tracking-widest mt-1 block">
                Campus to Career
              </span>
            </div>
          </NavLink>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 lg:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              {sectionLabel1}
            </p>
            <nav className="space-y-1">
              {activeMainNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-soft text-primary font-semibold'
                          : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-primary' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Management / Career Tools Section */}
          <div>
            <p className="px-3 text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-2">
              {sectionLabel2}
            </p>
            <nav className="space-y-1">
              {activeMgmtNav.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.name}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary-soft text-primary font-semibold'
                          : 'text-text-secondary hover:bg-slate-50 hover:text-text-primary'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isActive ? 'text-primary' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Role & Academic Session Badge in Sidebar Footer */}
        <div className="p-3 border-t border-border-color bg-slate-50/70 shrink-0 space-y-1.5">
          <div className="flex items-center justify-between text-xs px-2">
            <span className="font-semibold text-slate-700 truncate max-w-[120px]">
              {currentUser?.name}
            </span>
            <span
              className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                isAdmin
                  ? 'bg-rose-100 text-rose-800'
                  : isManager
                  ? 'bg-indigo-100 text-indigo-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {currentUser?.roleBadge || 'User'}
            </span>
          </div>
          <div className="text-[10px] text-text-muted px-2 flex items-center justify-between">
            <span>{currentUser?.department || 'Batch 2021-2025'}</span>
            <span className="font-medium text-emerald-600">Active</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
