import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, IndianRupee, Calendar, ExternalLink, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const OfferTable = ({
  offers = [],
  loading = false,
  onEdit,
  onDelete,
  onAccept,
  onResetFilters
}) => {
  const { isStudent } = useAuth();
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching placement offer records..." />
      </div>
    );
  }

  if (!offers || offers.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No placement offers found"
          description="No offer records match your current filter selections."
          actionLabel="Clear Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
              <th className="px-4 py-3.5">Candidate / Student</th>
              <th className="px-4 py-3.5">Company & Role</th>
              <th className="px-4 py-3.5">Offered CTC</th>
              <th className="px-4 py-3.5">Offer Date</th>
              <th className="px-4 py-3.5">Joining Date</th>
              <th className="px-4 py-3.5">Offer Letter</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {offers.map((offer) => (
              <tr
                key={offer.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Student */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={offer.studentAvatar}
                      name={offer.studentName}
                      size="md"
                      className="shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.STUDENTS.DETAILS(offer.studentId)}
                        className="font-bold text-text-primary hover:text-primary transition-colors block text-sm truncate"
                      >
                        {offer.studentName}
                      </Link>
                      <span className="text-[11px] text-text-muted">{offer.studentDepartment}</span>
                    </div>
                  </div>
                </td>

                {/* Company & Role */}
                <td className="px-4 py-3.5">
                  <p className="font-semibold text-text-primary truncate max-w-[170px]">
                    {offer.companyName}
                  </p>
                  <p className="text-[11px] text-text-muted truncate max-w-[170px]">{offer.jobTitle}</p>
                </td>

                {/* CTC Package */}
                <td className="px-4 py-3.5">
                  <span className="font-bold text-primary flex items-center gap-1 text-sm">
                    <IndianRupee className="w-3.5 h-3.5" />
                    {offer.ctc}
                  </span>
                  {offer.salaryBreakup && (
                    <span className="text-[10px] text-text-muted block truncate max-w-[150px]">
                      {offer.salaryBreakup}
                    </span>
                  )}
                </td>

                {/* Offer Date */}
                <td className="px-4 py-3.5 text-text-muted">
                  {formatDate(offer.offerDate)}
                </td>

                {/* Joining Date */}
                <td className="px-4 py-3.5 text-text-muted font-medium">
                  {formatDate(offer.joiningDate)}
                </td>

                {/* Offer Letter Link */}
                <td className="px-4 py-3.5">
                  {offer.offerLetterUrl ? (
                    <a
                      href={offer.offerLetterUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline font-medium"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>PDF</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  ) : (
                    <span className="text-text-muted italic">Pending</span>
                  )}
                </td>

                {/* Status Badge */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={offer.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {!isStudent ? (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit?.(offer)}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Update Offer"
                          aria-label="Update Offer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(offer)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Offer"
                          aria-label="Delete Offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
                    ) : (
                      offer.status !== 'Accepted' ? (
                        <Button
                          variant="soft"
                          size="sm"
                          onClick={() => onAccept?.(offer)}
                          className="text-[11px] py-1 px-2.5 font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100/80 border border-emerald-200"
                        >
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Accept Offer
                        </Button>
                      ) : (
                        <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Accepted
                        </span>
                      )
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OfferTable;
