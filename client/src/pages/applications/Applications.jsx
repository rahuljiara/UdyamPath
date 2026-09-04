import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileCheck2, Clock, CheckCircle2, Award, Download, Filter, Briefcase } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ApplicationTable from '../../components/applications/ApplicationTable';
import ApplicationFilters from '../../components/applications/ApplicationFilters';
import UpdateStatusModal from '../../components/applications/UpdateStatusModal';
import { useAuth } from '../../context/AuthContext';
import { applicationService } from '../../services/applicationService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const Applications = () => {
  const navigate = useNavigate();
  const { currentUser, isManager, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    underReview: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [stage, setStage] = useState('All');
  const [department, setDepartment] = useState(isManager ? currentUser?.deptCode || 'CSE' : 'All');

  // Modals state
  const [selectedAppForStatus, setSelectedAppForStatus] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isManager && currentUser?.deptCode) {
      setDepartment(currentUser.deptCode);
    } else if (isAdmin) {
      setDepartment('All');
    }
  }, [isManager, isAdmin, currentUser]);

  const fetchStats = async () => {
    try {
      const statsData = await applicationService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching application stats:', err);
    }
  };

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await applicationService.getAll({
        search,
        status,
        stage,
        department: isManager ? currentUser?.deptCode || 'CSE' : department,
        page,
        limit
      });

      // If Student, scope to personal applications
      let filtered = data.applications || [];
      if (isStudent) {
        filtered = filtered.filter(
          (a) =>
            a.studentId === currentUser?.id ||
            a.studentEmail === currentUser?.email ||
            a.studentName?.toLowerCase() === currentUser?.name?.toLowerCase()
        );
      }

      setApplications(filtered);
      setTotal(isStudent ? filtered.length : data.total);
      setTotalPages(isStudent ? 1 : data.totalPages);
    } catch (err) {
      console.error('Error fetching applications list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, stage, department, page, limit, isStudent, isManager, currentUser]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setStage('All');
    setDepartment(isManager ? currentUser?.deptCode || 'CSE' : 'All');
    setPage(1);
  };

  const handleStatusUpdateSubmit = async (updateData) => {
    if (!selectedAppForStatus) return;
    try {
      setUpdatingStatus(true);
      await applicationService.updateStatus(selectedAppForStatus.id, updateData);
      setSelectedAppForStatus(null);
      await fetchStats();
      await fetchApplications();
    } catch (err) {
      console.error('Error updating application status:', err);
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!appToDelete) return;
    try {
      setIsDeleting(true);
      await applicationService.delete(appToDelete.id);
      setAppToDelete(null);
      await fetchStats();
      await fetchApplications();
    } catch (err) {
      console.error('Error deleting application:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Application ID,Student Name,Student Email,Department,CGPA,Company,Position,Applied Date,Current Stage,Status\n';
    const rows = applications
      .map(
        (a) =>
          `"${a.applicationId}","${a.studentName}","${a.studentEmail}","${a.studentDepartment}",${a.studentCgpa || 0},"${a.companyName}","${a.position}","${a.appliedAt}","${a.currentStage}","${a.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title={isStudent ? 'My Applications & Pipeline' : isManager ? `${currentUser?.deptCode || 'CSE'} Applications` : 'Candidate Applications'}
        subtitle={
          isStudent
            ? 'Track the real-time stage progression of your campus placement applications'
            : isManager
            ? `Review and track application stages for students from ${currentUser?.department || 'Department'}`
            : 'Track student recruitment submissions, assessment stages, and selection results'
        }
        breadcrumbs={[{ label: 'Applications' }]}
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
            {isStudent && (
              <Button
                variant="primary"
                size="sm"
                icon={Briefcase}
                onClick={() => navigate(ROUTES.DRIVES.ROOT)}
                className="text-xs"
              >
                Apply to New Drives
              </Button>
            )}
          </>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isStudent ? 'My Submissions' : 'Total Applications'}
          value={formatNumber(isStudent ? applications.length : stats.total)}
          subtitle={isStudent ? 'Submitted by you' : 'Submissions received'}
          icon={FileCheck2}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Under Review"
          value={formatNumber(isStudent ? applications.filter((a) => a.status === 'Under Review' || a.status === 'Applied').length : stats.underReview)}
          subtitle="Screening & OA"
          icon={Clock}
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Shortlisted"
          value={formatNumber(isStudent ? applications.filter((a) => a.status === 'Shortlisted').length : stats.shortlisted)}
          change="In interview rounds"
          trend="up"
          subtitle="Active candidates"
          icon={CheckCircle2}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title={isStudent ? 'Offers Awarded' : 'Final Selections'}
          value={formatNumber(isStudent ? applications.filter((a) => a.status === 'Selected').length : stats.selected)}
          change={isStudent ? 'Placement confirmed' : 'Offers awarded'}
          trend="up"
          subtitle="Selected candidates"
          icon={Award}
          iconBg="bg-primary-soft text-primary"
        />
      </div>

      {/* 3. Search and Filters (Hidden or simplified for student if needed) */}
      {!isStudent && (
        <ApplicationFilters
          search={search}
          status={status}
          stage={stage}
          department={department}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onStatusChange={(val) => {
            setStatus(val);
            setPage(1);
          }}
          onStageChange={(val) => {
            setStage(val);
            setPage(1);
          }}
          onDepartmentChange={(val) => {
            if (!isManager) {
              setDepartment(val);
              setPage(1);
            }
          }}
          onReset={handleResetFilters}
        />
      )}

      {/* 4. Applications Table */}
      <div>
        <ApplicationTable
          applications={applications}
          loading={loading}
          onUpdateStatus={!isStudent ? (app) => setSelectedAppForStatus(app) : undefined}
          onDelete={!isStudent ? (app) => setAppToDelete(app) : undefined}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && applications.length > 0 && !isStudent && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* 5. Update Status Modal (Admin & Manager only) */}
      <UpdateStatusModal
        isOpen={!!selectedAppForStatus}
        onClose={() => setSelectedAppForStatus(null)}
        application={selectedAppForStatus}
        onUpdate={handleStatusUpdateSubmit}
        loading={updatingStatus}
      />

      {/* 6. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!appToDelete}
        onClose={() => setAppToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Application Record"
        message={`Are you sure you want to remove the application for ${appToDelete?.studentName} at ${appToDelete?.companyName}?`}
        confirmLabel="Delete Application"
        loading={isDeleting}
      />
    </div>
  );
};

export default Applications;
