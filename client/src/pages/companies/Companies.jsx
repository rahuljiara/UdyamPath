import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Award, Briefcase, Plus, Download, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import CompanyTable from '../../components/companies/CompanyTable';
import CompanyFilters from '../../components/companies/CompanyFilters';
import { companyService } from '../../services/companyService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const Companies = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [companies, setCompanies] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 9;

  // View mode
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

  // Statistics
  const [stats, setStats] = useState({
    totalCompanies: 0,
    activeCompanies: 0,
    totalHires: 0,
    activeDrivesCount: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [industry, setIndustry] = useState('All');
  const [type, setType] = useState('All');
  const [status, setStatus] = useState('All');

  // Deletion modal state
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const statsData = await companyService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching company stats:', err);
    }
  };

  // Fetch companies list
  const fetchCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await companyService.getAll({
        search,
        industry,
        type,
        status,
        page,
        limit
      });
      setCompanies(data.companies);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching companies list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, industry, type, status, page, limit]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleResetFilters = () => {
    setSearch('');
    setIndustry('All');
    setType('All');
    setStatus('All');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!companyToDelete) return;
    try {
      setIsDeleting(true);
      await companyService.delete(companyToDelete.id);
      setCompanyToDelete(null);
      await fetchStats();
      await fetchCompanies();
    } catch (err) {
      console.error('Error deleting company:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Company ID,Company Name,Industry,Type,Location,Employees,Average Package,Total Hires,Status,Contact Person,Contact Email\n';
    const rows = companies
      .map(
        (c) =>
          `"${c.companyId}","${c.name}","${c.industry}","${c.type}","${c.location}","${c.employeeCount || ''}","${c.averagePackage || ''}",${c.totalHires || 0},"${c.status}","${c.contactPerson || ''}","${c.contactEmail || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Companies_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Partner Companies"
        subtitle="Corporate recruiters, campus hiring partners, and tier categorizations"
        breadcrumbs={[{ label: 'Companies' }]}
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
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => navigate(ROUTES.COMPANIES.CREATE)}
              className="text-xs"
            >
              Add Company
            </Button>
          </>
        }
      />

      {/* 2. Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Partner Companies"
          value={formatNumber(stats.totalCompanies)}
          subtitle="Registered recruiters"
          icon={Building2}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Active Recruiters"
          value={formatNumber(stats.activeCompanies)}
          change="100% active"
          trend="up"
          subtitle="Hiring this session"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Total Campus Hires"
          value={formatNumber(stats.totalHires)}
          change="Cumulative cohort offers"
          trend="up"
          subtitle="Across all drives"
          icon={Award}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Live Placement Drives"
          value={formatNumber(stats.activeDrivesCount)}
          subtitle="Accepting applications"
          icon={Briefcase}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. Search and Filters */}
      <CompanyFilters
        search={search}
        industry={industry}
        type={type}
        status={status}
        viewMode={viewMode}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onIndustryChange={(val) => {
          setIndustry(val);
          setPage(1);
        }}
        onTypeChange={(val) => {
          setType(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onViewModeChange={(mode) => setViewMode(mode)}
        onReset={handleResetFilters}
      />

      {/* 4. Company Display (Table / Grid) */}
      <div>
        <CompanyTable
          companies={companies}
          loading={loading}
          viewMode={viewMode}
          onDelete={(company) => setCompanyToDelete(company)}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && companies.length > 0 && (
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
        isOpen={!!companyToDelete}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Company Partner"
        message={`Are you sure you want to remove ${companyToDelete?.name} (${companyToDelete?.companyId})?`}
        confirmLabel="Delete Company"
        loading={isDeleting}
      />
    </div>
  );
};

export default Companies;
