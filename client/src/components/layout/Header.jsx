import React, { useState, useEffect, useRef } from 'react';
import {
  Menu,
  Bell,
  Search as SearchIcon,
  ChevronDown,
  Plus,
  LogOut,
  User,
  Shield,
  CheckCheck,
  Briefcase,
  UserCheck,
  Calendar,
  Award,
  Building2,
  ArrowLeftRight,
  Sparkles,
  Check
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import { notificationService } from '../../services/notificationService';
import { ROUTES } from '../../routes/paths';
import DEMO_ACCOUNTS from '../../data/demoAccounts';

const categoryIcons = {
  Drive: Briefcase,
  Application: UserCheck,
  Interview: Calendar,
  Offer: Award
};

const Header = ({ onMenuClick }) => {
  const { currentUser, role, logout, switchUser, isAdmin, isManager, isStudent, isRecruiter } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [switchingEmail, setSwitchingEmail] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const notifRef = useRef(null);
  const profileRef = useRef(null);
  const roleModalRef = useRef(null);

  const fetchNotifs = async () => {
    try {
      const data = await notificationService.getAll();
      setNotifications(data);
      setUnreadCount(notificationService.getUnreadCount());
    } catch (err) {
      console.error('Error fetching notifications:', err);
    }
  };

  useEffect(() => {
    fetchNotifs();
    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);
      setUnreadCount(updated.filter((n) => n.unread).length);
    });
    return () => unsubscribe();
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    await notificationService.markAllAsRead();
    fetchNotifs();
  };

  const handleItemClick = (item) => {
    notificationService.markAsRead(item.id);
    setShowNotifications(false);
    if (item.link) {
      navigate(item.link);
    }
  };

  const handleLogout = () => {
    setShowProfileMenu(false);
    logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <header className="h-16 bg-white border-b border-border-color sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
      {/* Left section: Hamburger & Search */}
      <div className="flex items-center gap-3 sm:gap-4 flex-1 max-w-lg">
        <button
          type="button"
          onClick={onMenuClick}
          className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Bar */}
        <div className="relative w-full hidden sm:block">
          <SearchIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              isStudent
                ? 'Search matching drives, companies, roles...'
                : isManager
                ? `Search ${currentUser?.deptCode || 'department'} students, applications, drives...`
                : 'Search students, drives, companies (Press Ctrl + K)...'
            }
            className="w-full bg-slate-50 border border-slate-200/90 rounded-lg pl-9 pr-4 py-1.5 text-xs text-text-primary placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Right section: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Switch Role button */}
        <button
          type="button"
          onClick={() => setShowRoleModal(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200/90 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 hover:border-primary/40 hover:text-primary transition-colors shadow-2xs"
          title="Switch role / persona"
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
          <span className="hidden sm:inline">Switch Role</span>
          <span className="inline-block text-[10px] font-bold px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 sm:hidden">
            {currentUser?.roleBadge || 'Role'}
          </span>
        </button>

        {/* Quick Action: Create Drive (Only for Admin & Manager) */}
        {!isStudent && !isRecruiter && (
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate(ROUTES.DRIVES.CREATE)}
            className="hidden sm:inline-flex text-xs py-1.5 px-3"
          >
            Create Drive
          </Button>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative transition-colors focus:outline-none"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-primary rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-dropdown border border-border-color py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              {/* Dropdown Header with Mark All as Read */}
              <div className="flex items-center justify-between px-4 py-2 border-b border-border-color">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] bg-primary-soft text-primary font-semibold px-2 py-0.5 rounded-full">
                      {unreadCount} New
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={handleMarkAllRead}
                    className="text-[11px] text-primary hover:underline font-semibold flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {/* Notification Items List */}
              <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n) => {
                    const Icon = categoryIcons[n.category] || Bell;
                    return (
                      <div
                        key={n.id}
                        onClick={() => handleItemClick(n)}
                        className={`px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer flex items-start justify-between gap-3 ${
                          n.unread ? 'bg-primary-50/20' : ''
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              n.unread ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <p
                              className={`text-xs ${
                                n.unread ? 'font-bold text-text-primary' : 'font-medium text-text-secondary'
                              } truncate`}
                            >
                              {n.title}
                            </p>
                            <p className="text-[11px] text-text-muted leading-tight line-clamp-2">
                              {n.desc}
                            </p>
                            <span className="text-[10px] text-slate-400 block pt-0.5">{n.time}</span>
                          </div>
                        </div>

                        {n.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5 ring-2 ring-primary/20" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-xs text-text-muted">
                    No new notifications
                  </div>
                )}
              </div>

              {/* Dropdown Footer */}
              <div className="p-2 border-t border-border-color text-center bg-slate-50/50 rounded-b-xl">
                <Link
                  to={ROUTES.NOTIFICATIONS}
                  onClick={() => setShowNotifications(false)}
                  className="text-xs font-semibold text-primary hover:underline block py-0.5"
                >
                  View All Notifications in Center →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Profile Avatar & Info Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-slate-50 transition-colors text-left focus:outline-none"
          >
            <Avatar name={currentUser?.name || 'User'} size="sm" src={currentUser?.avatar} />
            <div className="hidden md:block">
              <span className="text-xs font-semibold text-text-primary block leading-tight">
                {currentUser?.name || 'User'}
              </span>
              <span className="text-[10px] font-medium text-primary block leading-tight">
                {currentUser?.roleTitle || currentUser?.role || 'Member'}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-dropdown border border-border-color py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-3 py-2 border-b border-border-color mb-1">
                <p className="text-xs font-bold text-text-primary">{currentUser?.name || 'User'}</p>
                <p className="text-[10px] text-primary font-medium">{currentUser?.email || ''}</p>
                {(currentUser?.company || currentUser?.department) && (
                  <span className="inline-block mt-1 text-[9px] px-1.5 py-0.5 rounded font-semibold bg-slate-100 text-slate-700">
                    {currentUser?.company || currentUser?.department}
                  </span>
                )}
              </div>

              {/* Quick Persona Switcher CTA */}
              <button
                type="button"
                onClick={() => {
                  setShowProfileMenu(false);
                  setShowRoleModal(true);
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-primary hover:bg-primary-soft/40 transition-colors"
              >
                <ArrowLeftRight className="w-3.5 h-3.5 text-primary" />
                Switch Role / Persona
              </button>

              {/* View Profile CTA */}
              <Link
                to={ROUTES.PROFILE}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-text-primary hover:bg-primary-soft/40 hover:text-primary transition-colors"
              >
                <User className="w-3.5 h-3.5 text-slate-400" />
                {isStudent ? 'My Profile & Resume' : 'View My Profile'}
              </Link>

              {/* System Institutional Settings (Admin only) */}
              {isAdmin && (
                <Link
                  to={ROUTES.SETTINGS}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors"
                >
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  System Configurations
                </Link>
              )}

              {/* Notification Center */}
              <Link
                to={ROUTES.NOTIFICATIONS}
                onClick={() => setShowProfileMenu(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors"
              >
                <Bell className="w-3.5 h-3.5 text-slate-400" />
                Notification Center
              </Link>

              {/* Audit Logs (Admin only) */}
              {isAdmin && (
                <Link
                  to={ROUTES.AUDIT_LOGS}
                  onClick={() => setShowProfileMenu(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs text-text-secondary hover:bg-slate-50 hover:text-text-primary transition-colors"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  Audit Logs
                </Link>
              )}

              <div className="border-t border-border-color my-1" />

              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Role Switcher Modal */}
      {showRoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            ref={roleModalRef}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150"
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-border-color flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ArrowLeftRight className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-text-primary">Switch Role Persona</h3>
                  <p className="text-xs text-text-muted">
                    Instantly toggle between Director, TPO, HOD, Student, or Recruiter
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            {/* Persona Grid */}
            <div className="p-5 max-h-[70vh] overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3">
              {DEMO_ACCOUNTS.map((acc) => {
                const isCurrent = acc.email.toLowerCase() === currentUser?.email?.toLowerCase();
                const isSwitching = switchingEmail === acc.email;

                return (
                  <div
                    key={acc.email}
                    onClick={async () => {
                      if (isCurrent || isSwitching) return;
                      setSwitchingEmail(acc.email);
                      try {
                        await switchUser(acc.email, acc.password);
                        setShowRoleModal(false);
                        navigate(ROUTES.DASHBOARD);
                      } catch (err) {
                        console.error('Failed to switch persona:', err);
                      } finally {
                        setSwitchingEmail('');
                      }
                    }}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      isCurrent
                        ? 'border-primary ring-2 ring-primary/20 bg-primary-50/20'
                        : 'border-slate-200 hover:border-primary/50 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <img
                        src={acc.avatar}
                        alt={acc.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200 shadow-2xs shrink-0"
                      />
                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${acc.badgeColor}`}>
                            {acc.roleLabel}
                          </span>
                          {isCurrent && (
                            <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-text-primary truncate">{acc.name}</h4>
                        <p className="text-[11px] text-text-muted truncate">{acc.email}</p>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {acc.description}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                      <span className="text-slate-400 font-medium">
                        {acc.deptCode ? `Dept: ${acc.deptCode}` : acc.company || acc.department}
                      </span>
                      <button
                        type="button"
                        disabled={isCurrent || !!switchingEmail}
                        className={`font-semibold px-2.5 py-1 rounded-lg transition-colors ${
                          isCurrent
                            ? 'text-slate-400 bg-slate-100 cursor-default'
                            : isSwitching
                            ? 'text-primary bg-primary-soft/50 animate-pulse'
                            : 'text-primary bg-primary-soft hover:bg-primary hover:text-white'
                        }`}
                      >
                        {isCurrent ? 'Current' : isSwitching ? 'Switching...' : 'Switch Persona →'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-3 px-5 border-t border-border-color bg-slate-50/50 flex items-center justify-between text-xs text-text-muted">
              <span>All accounts use default demo password: <code>password123</code></span>
              <button
                type="button"
                onClick={() => setShowRoleModal(false)}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
