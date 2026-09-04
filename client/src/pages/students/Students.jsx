import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Award, UserCheck, GraduationCap, Plus, Download, ShieldCheck, User } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StudentTable from '../../components/students/StudentTable';
import StudentFilters from '../../components/students/StudentFilters';
import { useAuth } from '../../context/AuthContext';
import { studentService } from '../../services/studentService';
import { formatNumber } from '../../utils/formatters';
import { ROUTES } from '../../routes/paths';

const Students = () => {
  const navigate = useNavigate();
  const { currentUser, isManager, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Statistics
  const [stats, setStats] = useState({
    total: 0,
    placed: 0,
    eligible: 0,
    avgCgpa: '0.00',
    placementRate: '0%'
  });

  // Filter states (Manager automatically scopes to their department)
  const defaultDept = isManager ? currentUser?.deptCode || 'CSE' : 'All';
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState(defaultDept);
  const [batch, setBatch] = useState('All');
  const [status, setStatus] = useState('All');

  // Deletion modal state
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Synchronize department filter if role switches to Manager
  useEffect(() => {
    if (isManager && currentUser?.deptCode) {
      setDepartment(currentUser.deptCode);
    } else if (isAdmin) {
      setDepartment('All');
    }
  }, [isManager, isAdmin, currentUser]);

  const fetchStats = async () => {
    try {
      const statsData = await studentService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching student stats:', err);
    }
  };

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll({
        search,
        department: isManager ? currentUser?.deptCode || 'CSE' : department,
        batch,
        status,
        page,
        limit
      });
      setStudents(data.students);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error('Error fetching students list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, department, batch, status, page, limit, isManager, currentUser]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleResetFilters = () => {
    setSearch('');
    setDepartment(isManager ? currentUser?.deptCode || 'CSE' : 'All');
    setBatch('All');
    setStatus('All');
    setPage(1);
  };

  const handleDeleteConfirm = async () => {
    if (!studentToDelete) return;
    try {
      setIsDeleting(true);
      await studentService.delete(studentToDelete.id);
      setStudentToDelete(null);
      await fetchStats();
      await fetchStudents();
    } catch (err) {
      console.error('Error deleting student:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Student ID,Full Name,Email,Department,Course,Batch,Semester,CGPA,Backlogs,Placement Status,Placed Company,Placed Package\n';
    const rows = students
      .map(
        (s) =>
          `"${s.studentId}","${s.fullName}","${s.email}","${s.department}","${s.course}","${s.batch}",${s.semester},${s.cgpa},${s.backlogs},"${s.placementStatus}","${s.placedCompany || ''}","${s.placedPackage || ''}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Students_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header with Role Scoping Info */}
      <PageHeader
        title={isManager ? `${currentUser?.deptCode || 'CSE'} Department Students` : 'Students Directory'}
        subtitle={
          isManager
            ? `Managing candidate profiles, verified credentials, and placement records for ${currentUser?.department || 'Department'}`
            : 'Manage student placement records, academic eligibility, and portfolios'
        }
        breadcrumbs={[{ label: 'Students' }]}
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
                onClick={() => navigate(ROUTES.STUDENTS.CREATE)}
                className="text-xs"
              >
                Add Student
              </Button>
            )}
          </>
        }
      />

      {/* 2. Top Metric Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isManager ? `${currentUser?.deptCode} Students` : 'Total Students'}
          value={formatNumber(isManager ? students.length : stats.total)}
          subtitle={isManager ? 'Department strength' : 'Cohort strength'}
          icon={Users}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Placed Students"
          value={formatNumber(isManager ? students.filter((s) => s.placementStatus === 'Placed').length : stats.placed)}
          change={`${stats.placementRate} placed`}
          trend="up"
          subtitle="Offers confirmed"
          icon={Award}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title="Eligible Students"
          value={formatNumber(isManager ? students.filter((s) => s.isEligible).length : stats.eligible)}
          subtitle="Zero critical backlogs"
          icon={UserCheck}
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Average CGPA"
          value={stats.avgCgpa}
          subtitle="Out of 10.0 scale"
          icon={GraduationCap}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. Search and Filters */}
      <StudentFilters
        search={search}
        department={department}
        batch={batch}
        status={status}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onDepartmentChange={(val) => {
          if (!isManager) {
            setDepartment(val);
            setPage(1);
          }
        }}
        onBatchChange={(val) => {
          setBatch(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onReset={handleResetFilters}
      />

      {/* 4. Student Data Table */}
      <div>
        <StudentTable
          students={students}
          loading={loading}
          onDelete={!isStudent ? (student) => setStudentToDelete(student) : undefined}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && students.length > 0 && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* 5. Delete Student Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Student Record"
        message={`Are you sure you want to remove ${studentToDelete?.fullName} (${studentToDelete?.studentId})? This will delete all associated application records.`}
        confirmLabel="Delete Student"
        loading={isDeleting}
      />
    </div>
  );
};

export default Students;
