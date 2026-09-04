import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Award,
  TrendingUp,
  FileCheck2,
  Briefcase,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  Building2,
  Download
} from 'lucide-react';
import StatCard from '../common/StatCard';
import Card from '../common/Card';
import Badge from '../common/Badge';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Avatar from '../common/Avatar';
import Loading from '../common/Loading';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { driveService } from '../../services/driveService';
import { applicationService } from '../../services/applicationService';
import { ROUTES } from '../../routes/paths';

const ManagerDashboard = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [deptStudents, setDeptStudents] = useState([]);
  const [deptDrives, setDeptDrives] = useState([]);
  const [deptApplications, setDeptApplications] = useState([]);
  const [verifiedCount, setVerifiedCount] = useState(38);
  const [verificationQueue, setVerificationQueue] = useState([
    {
      id: 'stud-2',
      name: 'Ananya Deshpande',
      studentId: '21BCS018',
      cgpa: 9.35,
      backlogs: 0,
      skills: ['React.js', 'Node.js', 'AWS'],
      submittedAt: 'Today, 10:30 AM'
    },
    {
      id: 'stud-4',
      name: 'Sneha Kulkarni',
      studentId: '21BCS033',
      cgpa: 8.92,
      backlogs: 0,
      skills: ['Python', 'SQL', 'FastAPI'],
      submittedAt: 'Today, 09:15 AM'
    },
    {
      id: 'stud-5',
      name: 'Rohan Mehta',
      studentId: '21BCS089',
      cgpa: 7.85,
      backlogs: 0,
      skills: ['Java', 'Spring Boot', 'MySQL'],
      submittedAt: 'Yesterday'
    }
  ]);

  const deptCode = currentUser?.deptCode || 'CSE';
  const deptName = currentUser?.department || 'Computer Science & Engineering';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [studRes, driveRes, appRes] = await Promise.all([
          studentService.getAll({ department: deptCode, limit: 10 }),
          driveService.getAll({ limit: 6 }),
          applicationService.getAll({ department: deptCode, limit: 5 })
        ]);

        setDeptStudents(studRes.students || []);
        // Filter drives eligible for this department
        const eligibleDrives = (driveRes.drives || []).filter(
          (d) => !d.eligibility?.departments || d.eligibility.departments.some((dept) => dept.includes(deptCode) || dept.includes('Computer'))
        );
        setDeptDrives(eligibleDrives);
        setDeptApplications(appRes.applications || []);
      } catch (err) {
        console.error('Error fetching manager dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [deptCode]);

  const handleVerifyStudent = (studentId) => {
    setVerificationQueue((prev) => prev.filter((s) => s.id !== studentId));
    setVerifiedCount((prev) => prev + 1);
  };

  if (loading) {
    return <Loading text={`Loading ${deptCode} Department Overview...`} />;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-primary/90 rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-primary-soft/20 text-primary-200 border border-primary-400/30">
              Department Portal • {deptCode}
            </span>
            <span className="text-xs text-slate-300">Academic Year 2024-2025</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.name}
          </h1>
          <p className="text-sm text-slate-300 max-w-xl">
            Here is the live placement progress, verification queue, and company drive status for the{' '}
            <strong className="text-white">{deptName}</strong>.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Download}
            onClick={() => navigate(ROUTES.REPORTS)}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 text-xs py-2"
          >
            NAAC/NIRF Report
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={Users}
            onClick={() => navigate(ROUTES.STUDENTS.ROOT)}
            className="text-xs py-2 shadow-sm"
          >
            Manage {deptCode} Students
          </Button>
        </div>
      </div>

      {/* 4 Department Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title={`Total ${deptCode} Students`}
          value="420"
          subtitle="Batch 2021-2025 enrolled"
          icon={Users}
          color="primary"
          trend="up"
          trendValue="+12 vs last yr"
        />
        <StatCard
          title="Department Placed"
          value="358"
          subtitle="85.2% Placement Rate"
          icon={Award}
          color="emerald"
          trend="up"
          trendValue="Target: 90%"
        />
        <StatCard
          title="Average Package (CTC)"
          value="12.4 LPA"
          subtitle="Highest: 44.0 LPA (Microsoft)"
          icon={TrendingUp}
          color="sky"
          trend="up"
          trendValue="+18.5% YoY"
        />
        <StatCard
          title="Pending Verifications"
          value={verificationQueue.length}
          subtitle={`${verifiedCount} resumes approved`}
          icon={ShieldCheck}
          color={verificationQueue.length > 0 ? 'amber' : 'emerald'}
          trend="neutral"
          trendValue="Action Required"
        />
      </div>

      {/* Dual Section: Pending Verifications & Department Drives */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Student Verification Queue */}
        <div className="lg:col-span-6">
          <Card
            title="Student Profile & Resume Verification Queue"
            subtitle="Review academic records and skills before candidate drive applications"
            headerAction={
              <Badge variant="primary" size="sm">
                {verificationQueue.length} Pending
              </Badge>
            }
          >
            {verificationQueue.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {verificationQueue.map((student) => (
                  <div key={student.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar name={student.name} size="sm" />
                      <div className="min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-text-primary truncate">{student.name}</p>
                          <span className="text-[10px] text-text-muted bg-slate-100 px-1.5 py-0.5 rounded font-mono">
                            {student.studentId}
                          </span>
                        </div>
                        <p className="text-[11px] text-text-muted">
                          CGPA: <strong className="text-emerald-700 font-semibold">{student.cgpa}</strong> •{' '}
                          {student.skills.slice(0, 2).join(', ')}
                        </p>
                        <span className="text-[10px] text-slate-400 block">{student.submittedAt}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => navigate(`/students/${student.id}`)}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                        title="View Full Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={CheckCircle2}
                        onClick={() => handleVerifyStudent(student.id)}
                        className="text-xs py-1 px-2.5"
                      >
                        Verify
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-xs font-bold text-text-primary">All Resumes Verified</p>
                <p className="text-xs text-text-muted">No pending student profiles in the queue for {deptCode}.</p>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Active Drives Eligible for this Department */}
        <div className="lg:col-span-6">
          <Card
            title={`Active Drives for ${deptCode}`}
            subtitle="Campus hiring opportunities open to department students"
            headerAction={
              <button
                type="button"
                onClick={() => navigate(ROUTES.DRIVES.ROOT)}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-3">
              {deptDrives.slice(0, 4).map((drive) => (
                <div
                  key={drive.id}
                  onClick={() => navigate(`/placement-drives/${drive.id}`)}
                  className="p-3.5 rounded-xl border border-border-color hover:border-primary/40 hover:bg-slate-50/60 transition-all cursor-pointer flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-primary-soft/60 flex items-center justify-center text-primary shrink-0">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 space-y-0.5">
                      <p className="text-xs font-bold text-text-primary truncate">{drive.companyName}</p>
                      <p className="text-[11px] text-text-secondary truncate">{drive.title}</p>
                      <div className="flex items-center gap-2 text-[10px] text-text-muted">
                        <span>Min CGPA: {drive.eligibility?.minCgpa || 7.0}</span>
                        <span>•</span>
                        <span className="text-primary font-semibold">{drive.salary || 'Competitive'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0 space-y-1">
                    <StatusBadge status={drive.status} />
                    <span className="text-[10px] text-slate-400 block">
                      {drive.applicationsCount || 0} applicants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Recent Department Applications */}
      <Card
        title={`Recent ${deptCode} Candidate Applications`}
        subtitle="Tracking stage movement for department students"
        headerAction={
          <button
            type="button"
            onClick={() => navigate(ROUTES.APPLICATIONS.ROOT)}
            className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
          >
            <span>All Applications</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-text-muted font-medium border-b border-border-color">
              <tr>
                <th className="py-2.5 px-3">Student</th>
                <th className="py-2.5 px-3">Company & Role</th>
                <th className="py-2.5 px-3">CGPA</th>
                <th className="py-2.5 px-3">Current Stage</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Applied</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptApplications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-text-primary flex items-center gap-2">
                    <Avatar name={app.studentName} size="xs" />
                    <span>{app.studentName}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-text-primary block">{app.companyName}</span>
                    <span className="text-[11px] text-text-muted">{app.position}</span>
                  </td>
                  <td className="py-3 px-3 font-semibold text-slate-700">{app.studentCgpa || '8.5'}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
                      {app.currentStage || 'Application'}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <StatusBadge status={app.status} />
                  </td>
                  <td className="py-3 px-3 text-right text-text-muted">
                    {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default ManagerDashboard;
