import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Trash2,
  Briefcase,
  UserCheck,
  Calendar,
  Award,
  Shield,
  ExternalLink,
  CheckCircle2,
  Layers
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import Loading from '../../components/common/Loading';
import { notificationService } from '../../services/notificationService';
import { formatNumber } from '../../utils/formatters';

const categoryIcons = {
  Drive: { icon: Briefcase, bg: 'bg-primary-soft text-primary' },
  Application: { icon: UserCheck, bg: 'bg-sky-50 text-sky-600' },
  Interview: { icon: Calendar, bg: 'bg-purple-50 text-purple-600' },
  Offer: { icon: Award, bg: 'bg-emerald-50 text-emerald-600' },
  System: { icon: Shield, bg: 'bg-amber-50 text-amber-600' }
};

const filterTabs = [
  { label: 'All Alerts', value: 'All' },
  { label: 'Unread Only', value: 'unread' },
  { label: 'Drives', value: 'Drive' },
  { label: 'Applications', value: 'Application' },
  { label: 'Interviews', value: 'Interview' },
  { label: 'Offers', value: 'Offer' }
];

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('All');
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await notificationService.getAll({
        category: activeTab === 'unread' || activeTab === 'All' ? 'All' : activeTab,
        unreadOnly: activeTab === 'unread'
      });
      setNotifications(data);
    } catch (err) {
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const unsubscribe = notificationService.subscribe(() => {
      fetchNotifications();
    });
    return () => unsubscribe();
  }, [activeTab]);

  const handleMarkAllAsRead = async () => {
    await notificationService.markAllAsRead();
    fetchNotifications();
  };

  const handleMarkAsRead = async (id, e) => {
    e?.stopPropagation();
    await notificationService.markAsRead(id);
    fetchNotifications();
  };

  const handleDelete = async (id, e) => {
    e?.stopPropagation();
    await notificationService.delete(id);
    fetchNotifications();
  };

  const handleClearAllConfirm = async () => {
    try {
      setClearing(true);
      await notificationService.clearAll();
      setShowClearModal(false);
      fetchNotifications();
    } catch (err) {
      console.error('Error clearing notifications:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleNotificationClick = (item) => {
    notificationService.markAsRead(item.id);
    if (item.link) {
      navigate(item.link);
    }
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* 1. Page Header */}
      <PageHeader
        title="Notifications & Activity Center"
        subtitle="Real-time campus placement alerts, application submissions, and interview milestones"
        breadcrumbs={[{ label: 'Notifications' }]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={CheckCheck}
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
              className="text-xs"
            >
              Mark All as Read
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => setShowClearModal(true)}
              disabled={notifications.length === 0}
              className="text-xs text-rose-600 hover:bg-rose-50"
            >
              Clear All
            </Button>
          </>
        }
      />

      {/* 2. Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Notifications"
          value={formatNumber(notifications.length)}
          subtitle="Recent alerts"
          icon={Bell}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Unread Alerts"
          value={formatNumber(unreadCount)}
          change={unreadCount > 0 ? 'Requires attention' : 'All caught up'}
          trend={unreadCount > 0 ? 'up' : 'neutral'}
          subtitle="Pending review"
          icon={CheckCircle2}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Drive & Offer Updates"
          value={formatNumber(
            notifications.filter((n) => n.category === 'Drive' || n.category === 'Offer').length
          )}
          subtitle="Recruitment milestones"
          icon={Award}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Interview Appointments"
          value={formatNumber(notifications.filter((n) => n.category === 'Interview').length)}
          subtitle="Scheduled assessment slots"
          icon={Calendar}
          iconBg="bg-purple-50 text-purple-600"
        />
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="flex border-b border-border-color gap-2 overflow-x-auto">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            type="button"
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.value
                ? 'border-primary text-primary'
                : 'border-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Notifications List */}
      {loading ? (
        <div className="bg-white rounded-xl border border-border-color py-16">
          <Loading message="Syncing notification feed..." />
        </div>
      ) : notifications.length > 0 ? (
        <div className="space-y-3">
          {notifications.map((item) => {
            const cat = categoryIcons[item.category] || {
              icon: Bell,
              bg: 'bg-slate-100 text-slate-700'
            };
            const Icon = cat.icon;

            return (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start justify-between gap-4 ${
                  item.unread
                    ? 'bg-primary-50/25 border-primary/40 shadow-subtle hover:bg-primary-50/40'
                    : 'bg-white border-border-color hover:border-slate-300 shadow-subtle'
                }`}
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cat.bg}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-xs font-bold ${
                          item.unread ? 'text-primary' : 'text-text-primary'
                        }`}
                      >
                        {item.title}
                      </h4>
                      {item.unread && (
                        <span className="w-2 h-2 rounded-full bg-primary ring-2 ring-primary/20 shrink-0" />
                      )}
                      <span className="text-[10px] px-2 py-0.2 rounded-full font-semibold bg-slate-100 text-slate-600">
                        {item.category}
                      </span>
                    </div>

                    <p className="text-xs text-text-secondary leading-relaxed">{item.desc}</p>
                    <span className="text-[10px] text-text-muted block pt-0.5">{item.time}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                  {item.unread && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => handleMarkAsRead(item.id, e)}
                      className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-soft/40 rounded-lg text-xs"
                      title="Mark as Read"
                    >
                      <CheckCheck className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg text-xs"
                    title="Delete Notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <EmptyState
            title="All notifications cleared"
            description="You are completely up to date with all campus recruitment alerts."
          />
        </Card>
      )}

      {/* 5. Clear All Confirmation Modal */}
      <ConfirmDialog
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearAllConfirm}
        title="Clear All Notifications"
        message="Are you sure you want to remove all notification history?"
        confirmLabel="Clear All"
        loading={clearing}
      />
    </div>
  );
};

export default Notifications;
