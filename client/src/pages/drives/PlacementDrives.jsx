import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, Building2, Users, FileCheck2, Plus, Download, CheckCircle2, Check } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import DriveTable from '../../components/drives/DriveTable';
import DriveFilters from '../../components/drives/DriveFilters';
import { useAuth } from '../../context/AuthContext';
import { driveService } from '../../services/driveService';
import { companyService } from '../../services/companyService';
import { applicationService } from '../../services/applicationService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const PlacementDrives = () => {
  const navigate = useNavigate();
  const { currentUser, isManager, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [appliedDriveIds, setAppliedDriveIds] = useState(new Set());
  const [toastMessage, setToastMessage] = useState('');
  const limit = 8;

  // Stats
  const [stats, setStats] = useState({
    totalDrives: 0,
    activeDrives: 0,
    totalOpenings: 0,
    totalApplications: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [jobType, setJobType] = useState('All');
  const [company, setCompany] = useState('All');

  // Deletion modal state
  const [driveToDelete, setDriveToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStatsAndCompanies = async () => {
    try {
      const [statsData, companiesData] = await Promise.all([
        driveService.getStats(),
        companyService.getAll({ limit: 50 })
      ]);
      setStats(statsData);
      setCompanies(companiesData.companies || []);

      if (isStudent) {
        const apps = await applicationService.getAll();
        const personal = (apps.applications || []).filter(
          (a) => a.studentId === currentUser?.id || a.studentEmail === currentUser?.email
        );
        setAppliedDriveIds(new Set(personal.map((a) => a.driveId)));
      }
    } catch (err) {
      console.error('Error fetching drive stats:', err);
    }
  };

  const fetchDrives = useCallback(async () => {
    try {
      setLoading(true);
      const data = await driveService.getAll({
        search,
        status,
        jobType,
        company,
        page,
        limit
      });
      setDrives(data.drives);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching drives list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, jobType, company, page, limit]);

  useEffect(() => {
    fetchStatsAndCompanies();
  }, [isStudent, currentUser]);

  useEffect(() => {
    fetchDrives();
  }, [fetchDrives]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setJobType('All');
    setCompany('All');
    setPage(1);
  };

  const handleApply = async (drive) => {
    try {
      await driveService.applyToDrive(drive.id, currentUser);
      setAppliedDriveIds((prev) => new Set([...prev, drive.id]));
      setToastMessage(`Application submitted for ${drive.companyName} (${drive.title})!`);
      setTimeout(() => setToastMessage(''), 4000);
      await fetchStatsAndCompanies();
      await fetchDrives();
    } catch (err) {
      alert(err.message || 'Failed to submit application');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!driveToDelete) return;
    try {
      setIsDeleting(true);
      await driveService.delete(driveToDelete.id);
      setDriveToDelete(null);
      await fetchStatsAndCompanies();
      await fetchDrives();
    } catch (err) {
      console.error('Error deleting placement drive:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Drive ID,Job Title,Company,Job Type,Location,CTC,Openings,Applications,Deadline,Status\n';
    const rows = drives
      .map(
        (d) =>
          `"${d.driveId}","${d.title}","${d.companyName}","${d.jobType}","${d.location}","${d.ctc}",${d.openings},${d.applicationsCount},"${d.applicationDeadline}","${d.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Drives_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage('')}
            className="text-emerald-700 hover:text-emerald-900"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Page Header */}
      <PageHeader
        title={isStudent ? 'Explore Placement Drives' : 'Placement Drives'}
        subtitle={
          isStudent
            ? 'Discover active campus recruitment opportunities, check eligibility criteria, and submit applications'
            : 'Campus recruitment campaigns, eligibility cut-offs, and career openings'
        }
        breadcrumbs={[{ label: 'Placement Drives' }]}
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
            {!isStudent && (
              <Button
                variant="primary"
                size="sm"
                icon={Plus}
                onClick={() => navigate(ROUTES.DRIVES.CREATE)}
                className="text-xs"
              >
                Create Drive
              </Button>
            )}
          </>
        }
      />

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Placement Drives"
          value={formatNumber(stats.totalDrives)}
          subtitle="Hosted this session"
          icon={Briefcase}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Active Drives"
          value={formatNumber(stats.activeDrives)}
          change="Open for applicants"
          trend="up"
          subtitle="Accepting resumes"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Openings"
          value={formatNumber(stats.totalOpenings)}
          subtitle="Available job positions"
          icon={Users}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Total Applications"
          value={formatNumber(stats.totalApplications)}
          subtitle="Student submissions"
          icon={FileCheck2}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. Search and Filters */}
      <DriveFilters
        search={search}
        status={status}
        jobType={jobType}
        company={company}
        companies={companies}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onJobTypeChange={(val) => {
          setJobType(val);
          setPage(1);
        }}
        onCompanyChange={(val) => {
          setCompany(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* 4. Drive Table */}
      <div>
        <DriveTable
          drives={drives}
          loading={loading}
          onDelete={!isStudent ? (drive) => setDriveToDelete(drive) : undefined}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && drives.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* 5. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!driveToDelete}
        onClose={() => setDriveToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Placement Drive"
        message={`Are you sure you want to remove ${driveToDelete?.title} at ${driveToDelete?.companyName}?`}
        confirmLabel="Delete Drive"
        loading={isDeleting}
      />
    </div>
  );
};

export default PlacementDrives;
