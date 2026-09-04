import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Printer,
  FileSpreadsheet,
  Filter,
  CheckCircle2,
  Users,
  Building2,
  GraduationCap,
  Award,
  Layers
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import EmptyState from '../../components/common/EmptyState';
import { reportService } from '../../services/reportService';

const quickReports = [
  {
    id: 'department',
    title: 'NAAC / NIRF Accreditation Report',
    desc: 'Department-wise placement conversion percentage, average package, and highest CTC.',
    icon: GraduationCap,
    iconBg: 'bg-primary-soft text-primary'
  },
  {
    id: 'summary',
    title: 'Placed Candidates & Offer Letters',
    desc: 'Complete student roster of confirmed placements, packages, and recruiter designations.',
    icon: Award,
    iconBg: 'bg-emerald-50 text-emerald-600'
  },
  {
    id: 'company',
    title: 'Corporate Recruiter Performance',
    desc: 'Aggregated hiring data by recruiting partner, tier classification, and sectors.',
    icon: Building2,
    iconBg: 'bg-sky-50 text-sky-600'
  },
  {
    id: 'unplaced',
    title: 'Unplaced Talent Pool Roster',
    desc: 'Students actively seeking opportunities with academic CGPA, backlogs, and tech stack.',
    icon: Users,
    iconBg: 'bg-amber-50 text-amber-600'
  }
];

const Reports = () => {
  const [reportType, setReportType] = useState('summary');
  const [department, setDepartment] = useState('All');
  const [batch, setBatch] = useState('2021-2025');
  const [minCgpa, setMinCgpa] = useState(0);

  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);

  const generateReport = async (overrideParams = {}) => {
    try {
      setLoading(true);
      const params = {
        reportType: overrideParams.reportType || reportType,
        department: overrideParams.department || department,
        batch: overrideParams.batch || batch,
        minCgpa: overrideParams.minCgpa !== undefined ? overrideParams.minCgpa : minCgpa
      };
      const data = await reportService.getReportData(params);
      setReportData(data);
    } catch (err) {
      console.error('Error generating report:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateReport();
  }, []);

  const handleQuickReport = (typeId) => {
    setReportType(typeId);
    generateReport({ reportType: typeId });
  };

  const handleDownloadCSV = () => {
    if (!reportData || !reportData.headers) return;

    const csvContent = [
      reportData.headers.map((h) => `"${h}"`).join(','),
      ...reportData.rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `UdyamPath_${reportType}_Report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Reports & Institutional Audits"
        subtitle="Generate NAAC/NIRF accreditation reports, department matrices, and unplaced talent rosters"
        breadcrumbs={[{ label: 'Reports' }]}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={Printer}
              onClick={handlePrint}
              className="text-xs"
            >
              Print Report
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Download}
              onClick={handleDownloadCSV}
              disabled={!reportData || reportData.rows?.length === 0}
              className="text-xs"
            >
              Export CSV
            </Button>
          </>
        }
      />

      {/* 2. Quick One-Click Accreditation Report Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickReports.map((q) => {
          const Icon = q.icon;
          const isSelected = reportType === q.id;
          return (
            <div
              key={q.id}
              onClick={() => handleQuickReport(q.id)}
              className={`bg-white rounded-xl border p-4 shadow-subtle cursor-pointer transition-all hover:border-primary/50 flex flex-col justify-between ${
                isSelected ? 'border-primary ring-2 ring-primary/20 bg-primary-soft/10' : 'border-border-color'
              }`}
            >
              <div className="space-y-2">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${q.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-text-primary text-xs">{q.title}</h4>
                <p className="text-[11px] text-text-muted leading-relaxed">{q.desc}</p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-primary">
                <span>{isSelected ? 'Active Selection' : 'Generate'}</span>
                <span>→</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Custom Report Filter Builder */}
      <Card
        title="Custom Report Builder"
        subtitle="Filter cohort parameters, academic batch, and cut-off criteria"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          {/* Report Category */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="summary">Placement Summary & Placed List</option>
              <option value="department">Department-wise (NAAC/NIRF Matrix)</option>
              <option value="company">Company & Recruiter Audit</option>
              <option value="unplaced">Unplaced Candidate Roster</option>
            </select>
          </div>

          {/* Academic Batch */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Academic Batch</label>
            <select
              value={batch}
              onChange={(e) => setBatch(e.target.value)}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="2021-2025">2021-2025 (Graduating Class)</option>
              <option value="2022-2026">2022-2026 (Pre-Final Year)</option>
              <option value="2020-2024">2020-2024 (Alumni)</option>
              <option value="All">All Batches</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block font-medium text-text-secondary mb-1">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full bg-white border border-border-color rounded-lg px-3 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary cursor-pointer"
            >
              <option value="All">All Departments</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="IT">Information Technology (IT)</option>
              <option value="ECE">Electronics (ECE)</option>
              <option value="EEE">Electrical (EEE)</option>
              <option value="MECH">Mechanical (MECH)</option>
            </select>
          </div>

          {/* Action Trigger */}
          <div className="flex items-end">
            <Button
              variant="primary"
              onClick={() => generateReport()}
              loading={loading}
              className="w-full text-xs py-2"
            >
              Update Preview
            </Button>
          </div>
        </div>
      </Card>

      {/* 4. Live Report Data Preview Table */}
      <Card
        title={reportData?.type || 'Report Preview'}
        subtitle={`Showing ${reportData?.totalRecords || 0} records for ${department} • Batch ${batch}`}
        action={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleDownloadCSV}
            disabled={!reportData || reportData.rows?.length === 0}
            className="text-xs"
          >
            Download CSV
          </Button>
        }
        padding={false}
      >
        {loading ? (
          <div className="py-16">
            <Loading message="Generating institutional report dataset..." />
          </div>
        ) : reportData && reportData.rows?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                  {reportData.headers.map((h, idx) => (
                    <th key={idx} className="px-4 py-3.5">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/75 text-text-primary">
                {reportData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} className="hover:bg-slate-50/60 transition-colors">
                    {row.map((cell, cellIdx) => (
                      <td
                        key={cellIdx}
                        className={`px-4 py-3.5 ${
                          cellIdx === 0
                            ? 'font-bold text-text-primary'
                            : cellIdx === row.length - 1 && String(cell).includes('LPA')
                            ? 'font-bold text-primary'
                            : 'text-text-secondary'
                        }`}
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center">
            <EmptyState
              title="No records matching filter criteria"
              description="Try adjusting your department or batch filters."
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
