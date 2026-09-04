import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck2, Clock, CheckCircle2, AlertCircle, Plus, Download } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import InterviewTable from '../../components/interviews/InterviewTable';
import InterviewTimelineView from '../../components/interviews/InterviewTimelineView';
import InterviewFilters from '../../components/interviews/InterviewFilters';
import ScheduleInterviewModal from '../../components/interviews/ScheduleInterviewModal';
import { useAuth } from '../../context/AuthContext';
import { interviewService } from '../../services/interviewService';
import { formatNumber } from '../../utils/formatters';

const Interviews = () => {
  const navigate = useNavigate();
  const { currentUser, isManager, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [interviews, setInterviews] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // View mode: 'table' | 'calendar'
  const [viewMode, setViewMode] = useState('table');

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [mode, setMode] = useState('All');

  // Modals state
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [interviewToEdit, setInterviewToEdit] = useState(null);
  const [savingInterview, setSavingInterview] = useState(false);
  const [interviewToDelete, setInterviewToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchStats = async () => {
    try {
      const statsData = await interviewService.getStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching interview stats:', err);
    }
  };

  const fetchInterviews = useCallback(async () => {
    try {
      setLoading(true);
      const data = await interviewService.getAll({
        search,
        status,
        mode,
        page,
        limit: viewMode === 'calendar' ? 50 : limit
      });

      let filtered = data.interviews || [];
      if (isStudent) {
        filtered = filtered.filter(
          (i) =>
            i.studentId === currentUser?.id ||
            i.studentName?.toLowerCase() === currentUser?.name?.toLowerCase()
        );
      } else if (isManager && currentUser?.deptCode) {
        filtered = filtered.filter(
          (i) => !i.studentDepartment || i.studentDepartment === currentUser.deptCode
        );
      }

      setInterviews(filtered);
      setTotal(isStudent ? filtered.length : data.total);
      setTotalPages(isStudent ? 1 : data.totalPages);
    } catch (err) {
      console.error('Error fetching interviews list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, mode, page, limit, viewMode, isStudent, isManager, currentUser]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setMode('All');
    setPage(1);
  };

  const handleScheduleSubmit = async (formData) => {
    try {
      setSavingInterview(true);
      if (interviewToEdit) {
        await interviewService.update(interviewToEdit.id, formData);
      } else {
        await interviewService.schedule(formData);
      }
      setShowScheduleModal(false);
      setInterviewToEdit(null);
      await fetchStats();
      await fetchInterviews();
    } catch (err) {
      console.error('Error saving interview appointment:', err);
    } finally {
      setSavingInterview(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!interviewToDelete) return;
    try {
      setIsDeleting(true);
      await interviewService.delete(interviewToDelete.id);
      setInterviewToDelete(null);
      await fetchStats();
      await fetchInterviews();
    } catch (err) {
      console.error('Error deleting interview appointment:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Round,Student Name,Student Branch,Company,Position,Date,Start Time,End Time,Mode,Interviewer,Status\n';
    const rows = interviews
      .map(
        (i) =>
          `"${i.round}","${i.studentName}","${i.studentDepartment}","${i.companyName}","${i.position}","${i.date}","${i.startTime}","${i.endTime}","${i.mode}","${i.interviewer}","${i.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Interviews_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title={isStudent ? 'My Interview Schedule' : isManager ? `${currentUser?.deptCode || 'CSE'} Interviews` : 'Assessment & Interviews'}
        subtitle={
          isStudent
            ? 'Track upcoming technical and HR evaluation rounds, view links, and prepare for interviews'
            : isManager
            ? `Coordinate and track candidate evaluation rounds for ${currentUser?.department || 'Department'}`
            : 'Schedule, coordinate and evaluate campus recruitment rounds'
        }
        breadcrumbs={[{ label: 'Interviews' }]}
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
                onClick={() => {
                  setInterviewToEdit(null);
                  setShowScheduleModal(true);
                }}
                className="text-xs"
              >
                Schedule Interview
              </Button>
            )}
          </>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isStudent ? 'My Scheduled Slots' : 'Total Interviews'}
          value={formatNumber(isStudent ? interviews.length : stats.total)}
          subtitle={isStudent ? 'Assigned to you' : 'All rounds conducted'}
          icon={CalendarCheck2}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title="Upcoming / Scheduled"
          value={formatNumber(isStudent ? interviews.filter((i) => i.status === 'Scheduled').length : stats.scheduled)}
          change="Awaiting evaluation"
          trend="up"
          subtitle="Active slots"
          icon={Clock}
          iconBg="bg-sky-50 text-sky-600"
        />

        <StatCard
          title="Completed"
          value={formatNumber(isStudent ? interviews.filter((i) => i.status === 'Completed').length : stats.completed)}
          change="Feedback logged"
          trend="up"
          subtitle="Evaluations finished"
          icon={CheckCircle2}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title="Rescheduled / Cancelled"
          value={formatNumber(isStudent ? interviews.filter((i) => i.status === 'Cancelled' || i.status === 'Rescheduled').length : stats.cancelled)}
          subtitle="Slots modified"
          icon={AlertCircle}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. Search and Filters */}
      <InterviewFilters
        search={search}
        status={status}
        mode={mode}
        viewMode={viewMode}
        onSearchChange={(val) => {
          setSearch(val);
          setPage(1);
        }}
        onStatusChange={(val) => {
          setStatus(val);
          setPage(1);
        }}
        onModeChange={(val) => {
          setMode(val);
          setPage(1);
        }}
        onViewModeChange={(mode) => setViewMode(mode)}
        onReset={handleResetFilters}
      />

      {/* 4. Display: Table vs Calendar Timeline */}
      {viewMode === 'table' ? (
        <div>
          <InterviewTable
            interviews={interviews}
            loading={loading}
            onEdit={!isStudent ? (int) => {
              setInterviewToEdit(int);
              setShowScheduleModal(true);
            } : undefined}
            onDelete={!isStudent ? (int) => setInterviewToDelete(int) : undefined}
            onResetFilters={handleResetFilters}
          />

          {/* Pagination Bar for Table view */}
          {!loading && interviews.length > 0 && !isStudent && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={total}
              pageSize={limit}
              onPageChange={(newPage) => setPage(newPage)}
            />
          )}
        </div>
      ) : (
        <InterviewTimelineView
          interviews={interviews}
          loading={loading}
          onEdit={!isStudent ? (int) => {
            setInterviewToEdit(int);
            setShowScheduleModal(true);
          } : undefined}
          onDelete={!isStudent ? (int) => setInterviewToDelete(int) : undefined}
        />
      )}

      {/* 5. Schedule / Edit Interview Modal */}
      <ScheduleInterviewModal
        isOpen={showScheduleModal}
        onClose={() => {
          setShowScheduleModal(false);
          setInterviewToEdit(null);
        }}
        initialData={interviewToEdit}
        onSubmit={handleScheduleSubmit}
        loading={savingInterview}
        isEdit={!!interviewToEdit}
      />

      {/* 6. Cancel / Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!interviewToDelete}
        onClose={() => setInterviewToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Cancel Interview Slot"
        message={`Are you sure you want to cancel the ${interviewToDelete?.round} interview for ${interviewToDelete?.studentName}?`}
        confirmLabel="Cancel Slot"
        loading={isDeleting}
      />
    </div>
  );
};

export default Interviews;
