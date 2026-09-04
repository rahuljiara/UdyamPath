import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Award, CheckCircle2, TrendingUp, IndianRupee, Plus, Download, FileSpreadsheet, Check, X } from 'lucide-react';
import PageHeader from '../../components/common/PageHeader';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import Pagination from '../../components/common/Pagination';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import OfferTable from '../../components/offers/OfferTable';
import OfferFilters from '../../components/offers/OfferFilters';
import RecordOfferModal from '../../components/offers/RecordOfferModal';
import { useAuth } from '../../context/AuthContext';
import { placementService } from '../../services/placementService';
import { formatNumber } from '../../utils/formatters';

const Offers = () => {
  const navigate = useNavigate();
  const { currentUser, isManager, isStudent, isAdmin } = useAuth();

  const [loading, setLoading] = useState(true);
  const [offers, setOffers] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 8;

  // Stats
  const [stats, setStats] = useState({
    totalOffers: 0,
    acceptedOffers: 0,
    acceptanceRate: '0%',
    highestPackage: '0.0 LPA',
    averagePackage: '0.0 LPA'
  });

  // Filter states
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [department, setDepartment] = useState(isManager ? currentUser?.deptCode || 'CSE' : 'All');

  // Modals state
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerToEdit, setOfferToEdit] = useState(null);
  const [savingOffer, setSavingOffer] = useState(false);
  const [offerToDelete, setOfferToDelete] = useState(null);
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
      const statsData = await placementService.getOfferStats();
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching offer stats:', err);
    }
  };

  const fetchOffers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await placementService.getAllOffers({
        search,
        status,
        department: isManager ? currentUser?.deptCode || 'CSE' : department,
        page,
        limit
      });

      let filtered = data.offers || [];
      if (isStudent) {
        filtered = filtered.filter(
          (o) =>
            o.studentId === currentUser?.id ||
            o.studentName?.toLowerCase() === currentUser?.name?.toLowerCase()
        );
      }

      setOffers(filtered);
      setTotal(isStudent ? filtered.length : data.total);
      setTotalPages(isStudent ? 1 : data.totalPages);
    } catch (err) {
      console.error('Error fetching offers list:', err);
    } finally {
      setLoading(false);
    }
  }, [search, status, department, page, limit, isStudent, isManager, currentUser]);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  const handleResetFilters = () => {
    setSearch('');
    setStatus('All');
    setDepartment(isManager ? currentUser?.deptCode || 'CSE' : 'All');
    setPage(1);
  };

  const handleOfferSubmit = async (formData) => {
    try {
      setSavingOffer(true);
      if (offerToEdit) {
        await placementService.updateOfferStatus(offerToEdit.id, formData);
      } else {
        await placementService.createOffer(formData);
      }
      setShowOfferModal(false);
      setOfferToEdit(null);
      await fetchStats();
      await fetchOffers();
    } catch (err) {
      console.error('Error saving placement offer:', err);
    } finally {
      setSavingOffer(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    try {
      await placementService.updateOfferStatus(offerId, { status: 'Accepted' });
      await fetchStats();
      await fetchOffers();
    } catch (err) {
      console.error('Error accepting offer:', err);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!offerToDelete) return;
    try {
      setIsDeleting(true);
      await placementService.deleteOffer(offerToDelete.id);
      setOfferToDelete(null);
      await fetchStats();
      await fetchOffers();
    } catch (err) {
      console.error('Error deleting placement offer record:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportCSV = () => {
    const headers = 'Offer ID,Student Name,Department,Company,Job Title,CTC,Offer Date,Joining Date,Status\n';
    const rows = offers
      .map(
        (o) =>
          `"${o.offerId || ''}","${o.studentName}","${o.studentDepartment}","${o.companyName}","${o.jobTitle}","${o.ctc}","${o.offerDate}","${o.joiningDate}","${o.status}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `UdyamPath_Offers_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <PageHeader
        title={isStudent ? 'My Placement Offers' : isManager ? `${currentUser?.deptCode || 'CSE'} Placement Offers` : 'Placement Offers'}
        subtitle={
          isStudent
            ? 'Review and manage verified job offers received from campus recruiting partners'
            : isManager
            ? `Tracking CTC distribution and offer letter acceptance for ${currentUser?.department || 'Department'}`
            : 'Manage offer letters, compensation packages, and student acceptances'
        }
        breadcrumbs={[{ label: 'Offers' }]}
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
                  setOfferToEdit(null);
                  setShowOfferModal(true);
                }}
                className="text-xs"
              >
                Record Offer
              </Button>
            )}
          </>
        }
      />

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={isStudent ? 'My Offers' : 'Total Offers Issued'}
          value={formatNumber(isStudent ? offers.length : stats.totalOffers)}
          subtitle={isStudent ? 'Received so far' : 'Confirmed letters'}
          icon={Award}
          iconBg="bg-slate-100 text-slate-700"
        />

        <StatCard
          title={isStudent ? 'Accepted Status' : 'Accepted Offers'}
          value={isStudent ? (offers.some((o) => o.status === 'Accepted') ? 'Accepted' : 'Pending') : formatNumber(stats.acceptedOffers)}
          change={isStudent ? (offers.length > 0 ? offers[0].companyName : 'None') : `${stats.acceptanceRate} conversion`}
          trend="up"
          subtitle={isStudent ? 'Final decision' : 'Students joining'}
          icon={CheckCircle2}
          iconBg="bg-primary-soft text-primary"
        />

        <StatCard
          title={isStudent ? 'Offered Package' : 'Highest Package'}
          value={isStudent ? (offers.length > 0 ? offers[0].ctc : '0.0 LPA') : stats.highestPackage}
          change={isStudent ? 'Dream Package' : 'Campus high'}
          trend="up"
          subtitle={isStudent ? 'Annual CTC' : 'Top offered CTC'}
          icon={TrendingUp}
          iconBg="bg-emerald-50 text-emerald-600"
        />

        <StatCard
          title={isStudent ? 'Joining Role' : 'Average Package'}
          value={isStudent ? (offers.length > 0 ? offers[0].jobTitle : 'N/A') : stats.averagePackage}
          subtitle={isStudent ? 'Designation' : 'Across all departments'}
          icon={IndianRupee}
          iconBg="bg-amber-50 text-amber-600"
        />
      </div>

      {/* 3. Search and Filters */}
      {!isStudent && (
        <OfferFilters
          search={search}
          status={status}
          department={department}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          onStatusChange={(val) => {
            setStatus(val);
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

      {/* 4. Offers Table / Student Offer Cards */}
      <div>
        <OfferTable
          offers={offers}
          loading={loading}
          onEdit={!isStudent ? (offer) => {
            setOfferToEdit(offer);
            setShowOfferModal(true);
          } : undefined}
          onDelete={!isStudent ? (offer) => setOfferToDelete(offer) : undefined}
          onAccept={isStudent ? (offer) => handleAcceptOffer(offer.id) : undefined}
          onResetFilters={handleResetFilters}
        />

        {/* Pagination Bar */}
        {!loading && offers.length > 0 && !isStudent && (
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            totalItems={total}
            pageSize={limit}
            onPageChange={(newPage) => setPage(newPage)}
          />
        )}
      </div>

      {/* 5. Record / Edit Offer Modal */}
      <RecordOfferModal
        isOpen={showOfferModal}
        onClose={() => {
          setShowOfferModal(false);
          setOfferToEdit(null);
        }}
        initialData={offerToEdit}
        onSubmit={handleOfferSubmit}
        loading={savingOffer}
        isEdit={!!offerToEdit}
      />

      {/* 6. Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!offerToDelete}
        onClose={() => setOfferToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Offer Record"
        message={`Are you sure you want to remove the placement offer from ${offerToDelete?.companyName} for ${offerToDelete?.studentName}?`}
        confirmLabel="Delete Offer"
        loading={isDeleting}
      />
    </div>
  );
};

export default Offers;
