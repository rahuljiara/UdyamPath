import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  UserCheck,
  FileCheck2,
  Award,
  Plus,
  Download
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Button from '../common/Button';
import Loading from '../common/Loading';
import PlacementOverviewChart from './PlacementOverviewChart';
import PlacementFunnel from './PlacementFunnel';
import ActiveDrivesList from './ActiveDrivesList';
import RecentApplicationsTable from './RecentApplicationsTable';
import UpcomingInterviewsList from './UpcomingInterviewsList';
import { dashboardService } from '../../services/dashboardService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    overview: null,
    funnel: [],
    monthlyTrend: [],
    departmentDistribution: [],
    activeDrives: [],
    recentApplications: [],
    upcomingInterviews: []
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [
          overview,
          funnel,
          monthlyTrend,
          departmentDistribution,
          activeDrives,
          recentApplications,
          upcomingInterviews
        ] = await Promise.all([
          dashboardService.getOverview(),
          dashboardService.getPlacementFunnel(),
          dashboardService.getMonthlyTrend(),
          dashboardService.getDepartmentDistribution(),
          dashboardService.getActiveDrives(4),
          dashboardService.getRecentApplications(5),
          dashboardService.getUpcomingInterviews(3)
        ]);

        setData({
          overview,
          funnel,
          monthlyTrend,
          departmentDistribution,
          activeDrives,
          recentApplications,
          upcomingInterviews
        });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Metric,Value\n"
      + `Total Students,${data.overview?.totalStudents || 0}\n`
      + `Eligible Students,${data.overview?.eligibleStudents || 0}\n`
      + `Total Applications,${data.overview?.totalApplications || 0}\n`
      + `Placed Students,${data.overview?.placedStudents || 0}\n`
      + `Placement Rate,${data.overview?.placementRate || '0%'}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UdyamPath_Placement_Summary_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <Loading text="Loading placement dashboard metrics..." className="py-24" />;
  }

  const { overview, funnel, monthlyTrend, departmentDistribution, activeDrives, recentApplications, upcomingInterviews } = data;

  return (
    <div className="space-y-6">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
            Institutional Placement Command Center
          </h1>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Full campus recruitment analytics, company pipelines, and placement metrics.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={handleExport}
            className="text-xs"
          >
            Export Report
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => navigate(ROUTES.DRIVES.CREATE)}
            className="text-xs"
          >
            Create Drive
          </Button>
        </div>
      </div>

      {/* 2. Key Statistics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Students"
          value={formatNumber(overview?.totalStudents)}
          change="+8.4% from last batch"
          trend="up"
          subtitle="Registered 2025"
          icon={Users}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Eligible Students"
          value={formatNumber(overview?.eligibleStudents)}
          change={`${Math.round((overview?.eligibleStudents / overview?.totalStudents) * 100)}% of cohort`}
          trend="neutral"
          subtitle="Cleared criteria"
          icon={UserCheck}
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Total Applications"
          value={formatNumber(overview?.totalApplications)}
          change="3.0 apps / student"
          trend="up"
          subtitle="Across active drives"
          icon={FileCheck2}
          iconBg="bg-amber-50 text-amber-600"
        />

        <StatCard
          title="Placed Students"
          value={formatNumber(overview?.placedStudents)}
          change={`${overview?.placementRate} rate`}
          trend="up"
          subtitle="990 Unique offers"
          icon={Award}
          iconBg="bg-primary-soft text-primary"
        />
      </div>

      {/* 3. Placement Overview & Funnel Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PlacementOverviewChart
            monthlyTrend={monthlyTrend}
            departmentDistribution={departmentDistribution}
          />
        </div>
        <div className="lg:col-span-1">
          <PlacementFunnel funnel={funnel} />
        </div>
      </div>

      {/* 4. Active Placement Drives */}
      <div>
        <ActiveDrivesList drives={activeDrives} />
      </div>

      {/* 5. Dual Row: Recent Applications & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentApplicationsTable applications={recentApplications} />
        </div>
        <div className="lg:col-span-1">
          <UpcomingInterviewsList interviews={upcomingInterviews} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
