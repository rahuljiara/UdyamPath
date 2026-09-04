import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Award,
  Users,
  Building2,
  Download,
  IndianRupee,
  Layers,
  GraduationCap,
  Briefcase,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import DepartmentAnalyticsChart from '../../components/analytics/DepartmentAnalyticsChart';
import SalaryDistributionChart from '../../components/analytics/SalaryDistributionChart';
import SectorPieChart from '../../components/analytics/SectorPieChart';
import CgpaCorrelationChart from '../../components/analytics/CgpaCorrelationChart';
import { analyticsService } from '../../services/analyticsService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const Analytics = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState(null);
  const [deptData, setDeptData] = useState([]);
  const [salaryData, setSalaryData] = useState([]);
  const [sectorData, setSectorData] = useState([]);
  const [topRecruiters, setTopRecruiters] = useState([]);
  const [cgpaData, setCgpaData] = useState([]);
  const [skillsData, setSkillsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const [
          overviewRes,
          deptRes,
          salaryRes,
          sectorRes,
          recruitersRes,
          cgpaRes,
          skillsRes
        ] = await Promise.all([
          analyticsService.getOverviewMetrics(),
          analyticsService.getDepartmentAnalytics(),
          analyticsService.getSalaryDistribution(),
          analyticsService.getSectorDistribution(),
          analyticsService.getTopRecruiters(),
          analyticsService.getCgpaVsPlacement(),
          analyticsService.getSkillDemand()
        ]);

        setMetrics(overviewRes);
        setDeptData(deptRes);
        setSalaryData(salaryRes);
        setSectorData(sectorRes);
        setTopRecruiters(recruitersRes);
        setCgpaData(cgpaRes);
        setSkillsData(skillsRes);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    const headers = 'Department,Total Students,Placed Students,Unplaced,Placement Rate (%),Avg CTC (LPA),Highest CTC (LPA)\n';
    const rows = deptData
      .map(
        (d) =>
          `"${d.dept}",${d.total},${d.placed},${d.unplaced},${d.rate},${d.avgCtc},${d.highestCtc}`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Department_Analytics_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Loading message="Computing placement statistics & cohort analytics..." className="py-24" />;
  }

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title="Placement Analytics & Reports"
        subtitle="Cohort placement conversion rates, compensation distributions, and corporate hiring trends"
        breadcrumbs={[{ label: 'Analytics' }]}
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExportCSV}
            className="text-xs"
          >
            Export Department Report
          </Button>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Overall Placement Rate"
          value={metrics?.placementRate || '0%'}
          change="+4.2% vs previous session"
          trend="up"
          subtitle="990 of 1,150 eligible placed"
          icon={TrendingUp}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Highest Offered CTC"
          value={metrics?.highestPackage || '0.0 LPA'}
          change="Campus record"
          trend="up"
          subtitle="Super Dream Tier (Microsoft)"
          icon={Award}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Average CTC Package"
          value={metrics?.averagePackage || '0.0 LPA'}
          subtitle={`Median: ${metrics?.medianPackage}`}
          icon={IndianRupee}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Corporate Recruiters"
          value={formatNumber(metrics?.totalCompanies || 48)}
          subtitle="Hiring across campus"
          icon={Building2}
          iconBg="bg-slate-100 text-slate-700"
        />
      </div>

      {/* 3. Section 1: Department Comparisons & Salary Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Department Placement Rate & Avg CTC"
          subtitle="Comparison of placement conversion (%) and average package by branch"
        >
          <DepartmentAnalyticsChart data={deptData} />
        </Card>

        <Card
          title="Salary Range Distribution"
          subtitle="Number of placed students across compensation brackets"
        >
          <SalaryDistributionChart data={salaryData} />
        </Card>
      </div>

      {/* 4. Section 2: Industry Sectors & Academic CGPA Correlation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card
          title="Sector-wise Hiring Breakdown"
          subtitle="Offer distribution by industry domain"
          className="lg:col-span-1"
        >
          <SectorPieChart data={sectorData} />
        </Card>

        <Card
          title="Academic CGPA vs Placement Conversion"
          subtitle="Placement success rate (%) across student CGPA brackets"
          className="lg:col-span-2"
        >
          <CgpaCorrelationChart data={cgpaData} />
        </Card>
      </div>

      {/* 5. Section 3: Top Campus Recruiters & Skill Demand Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Recruiters Table */}
        <Card
          title="Top Campus Recruiters"
          subtitle="Companies with maximum confirmed placement offers"
          className="lg:col-span-2"
          padding={false}
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
                  <th className="px-4 py-3">Recruiting Partner</th>
                  <th className="px-4 py-3">Category / Tier</th>
                  <th className="px-4 py-3">Offers Issued</th>
                  <th className="px-4 py-3">Top CTC</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-color/70 text-text-primary">
                {topRecruiters.map((rec, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-3 font-semibold text-text-primary">
                      {rec.name}
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200/60">
                        {rec.tier}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-bold text-primary">
                      {rec.offers} students
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {rec.highestCtc}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(ROUTES.COMPANIES.ROOT)}
                        className="text-xs text-primary hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* In-Demand Technical Skills */}
        <Card
          title="In-Demand Skills & Technologies"
          subtitle="Top technical proficiencies evaluated in technical rounds"
          className="lg:col-span-1"
        >
          <div className="space-y-3.5 text-xs">
            {skillsData.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-text-secondary">
                  <span className="font-medium text-text-primary">{item.skill}</span>
                  <span className="font-semibold text-primary">{item.demand}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-500"
                    style={{ width: `${item.demand}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
