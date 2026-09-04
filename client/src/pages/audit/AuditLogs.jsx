import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, ShieldAlert, Award, FileText, Download, Trash2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import AuditTable from '../../components/audit/AuditTable';
import AuditFilters from '../../components/audit/AuditFilters';
import { auditService } from '../../services/auditService';
import { formatNumber } from '../../utils/formatters';

const AuditLogs = () => {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Stats
  const [stats, setStats] = useState({
    totalLogs: 0,
    placementActions: 0,
    systemModifications: 0,
    securityEvents: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [severity, setSeverity] = useState('All');

  // Clear modal
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  // Fetch stats
  const fetchStats = async () => {
    try {
      const statsData = await auditService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching audit stats:', err);
    }
  };

  // Fetch logs
  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const data = await auditService.getAll({
        search,
        category,
        severity,
        page,
        limit
      });
      setLogs(data.logs);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  }, [search, category, severity, page, limit]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setSeverity('All');
    setPage(1);
  };

  const handleClearLogsConfirm = async () => {
    try {
      setClearing(true);
      await auditService.clearLogs();
      setShowClearModal(false);
      await fetchStats();
      await fetchLogs();
    } catch (err) {
      console.error('Error clearing audit logs:', err);
    } finally {
      setClearing(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Timestamp,User,User Role,Action Code,Category,Target Entity,Details,Severity,IP Address\n';
    const rows = logs
      .map(
        (l) =>
          `"${l.timestamp}","${l.user}","${l.userRole}","${l.action}","${l.category}","${l.entity}","${l.details}","${l.severity}","${l.ipAddress}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Audit_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Audit Logs & Security Trail"
        subtitle="Chronological trail of administrative actions, placement updates, policy adjustments, and authentication events"
        breadcrumbs={[{ label: 'Audit Logs' }]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={Download}
              onClick={handleExportCSV}
              className="text-xs"
            >
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={Trash2}
              onClick={() => setShowClearModal(true)}
              className="text-xs text-rose-600 hover:bg-rose-50"
            >
              Clear Logs
            </Button>
          </>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Events Logged"
          value={formatNumber(stats.totalLogs)}
          subtitle="Audit records retained"
          icon={ShieldCheck}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Placement & Drive Actions"
          value={formatNumber(stats.placementActions)}
          subtitle="Offers, drives & stages"
          icon={Award}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Policy & System Changes"
          value={formatNumber(stats.systemModifications)}
          subtitle="Configurations modified"
          icon={FileText}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Security & Auth Events"
          value={formatNumber(stats.securityEvents)}
          subtitle="2FA logins & sessions"
          icon={ShieldAlert}
          iconBg="bg-sky-50 text-sky-600"
        />
      </div>

      {/* 3. Search and Filters */}
      <AuditFilters
        search={search}
        category={category}
        severity={severity}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onCategoryChange={(val) => {
          setCategory(val);
          setPage(1);
        }}
        onSeverityChange={(val) => {
          setSeverity(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* 4. Audit Table */}
      <div>
        <AuditTable
          logs={logs}
          loading={loading}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && logs.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* 5. Clear Logs Dialog */}
      <ConfirmDialog
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleClearLogsConfirm}
        title="Clear Audit History"
        message="Are you sure you want to purge current audit trail records? This action cannot be undone."
        confirmLabel="Purge Logs"
        loading={clearing}
      />
    </div>
  );
};

export default AuditLogs;
