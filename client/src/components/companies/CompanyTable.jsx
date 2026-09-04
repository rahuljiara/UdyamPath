import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit2, Trash2, ExternalLink, MapPin, Users, Briefcase, IndianRupee } from 'lucide-react';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import Badge from '../common/Badge';
import Button from '../common/Button';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes/paths';

const CompanyTable = ({
  companies = [],
  loading = false,
  viewMode = 'table',
  onDelete,
  onResetFilters
}) => {
  const navigate = useNavigate();
  const { isStudent } = useAuth();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching recruiting companies..." />
      </div>
    );
  }

  if (!companies || companies.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No companies found"
          description="Try adjusting your search criteria or filter options to discover recruiting partners."
          actionLabel="Clear Filters"
          onAction={onResetFilters}
        />
      </div>
    );
  }

  // Grid / Cards View
  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {companies.map((company) => (
          <div
            key={company.id}
            className="bg-white rounded-xl border border-border-color p-5 shadow-subtle hover:border-primary/40 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Header: Logo, Name & Status */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <Avatar
                    src={company.logo}
                    name={company.name}
                    size="lg"
                    className="rounded-xl shrink-0"
                  />
                  <div>
                    <Link
                      to={ROUTES.COMPANIES.DETAILS(company.id)}
                      className="text-sm font-bold text-text-primary hover:text-primary transition-colors block leading-tight"
                    >
                      {company.name}
                    </Link>
                    <span className="text-[11px] font-mono text-text-muted">{company.companyId}</span>
                  </div>
                </div>
                <StatusBadge status={company.status} size="sm" />
              </div>

              {/* Description */}
              <p className="text-xs text-text-muted line-clamp-2 leading-relaxed mb-4">
                {company.description}
              </p>

              {/* Metadata Badges & Location */}
              <div className="space-y-2 text-xs border-t border-slate-100 pt-3 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Industry</span>
                  <span className="font-semibold text-text-primary truncate max-w-[170px]">{company.industry}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted">Type</span>
                  <span className="font-medium text-slate-700">{company.type}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-text-muted flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    Location
                  </span>
                  <span className="font-medium text-text-secondary truncate max-w-[150px]">{company.location}</span>
                </div>
                {company.averagePackage && (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted flex items-center gap-1">
                      <IndianRupee className="w-3 h-3 text-slate-400" />
                      Avg CTC
                    </span>
                    <span className="font-bold text-primary">{company.averagePackage}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Footer Metrics & Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <span className="text-text-muted text-[10px] block">Total Hires</span>
                  <span className="font-bold text-text-primary">{company.totalHires || 0}</span>
                </div>
                {company.activeDrivesCount > 0 && (
                  <div>
                    <span className="text-text-muted text-[10px] block">Live Drives</span>
                    <span className="font-bold text-emerald-600">{company.activeDrivesCount}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(ROUTES.COMPANIES.DETAILS(company.id))}
                  className="text-xs py-1.5 px-2.5"
                >
                  View Details
                </Button>
                {!isStudent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.COMPANIES.EDIT(company.id))}
                    className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                    aria-label="Edit company"
                    title="Edit Company"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Standard Table View
  return (
    <div className="w-full bg-white rounded-xl border border-border-color shadow-subtle overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-border-color text-text-secondary font-semibold uppercase tracking-wider">
              <th className="px-4 py-3.5">Company</th>
              <th className="px-4 py-3.5">Industry</th>
              <th className="px-4 py-3.5">Type</th>
              <th className="px-4 py-3.5">Location</th>
              <th className="px-4 py-3.5">Total Placed</th>
              <th className="px-4 py-3.5">Status</th>
              <th className="px-4 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {companies.map((company) => (
              <tr
                key={company.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Company Logo + Name + ID */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-3">
                    <Avatar
                      src={company.logo}
                      name={company.name}
                      size="md"
                      className="rounded-lg shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={ROUTES.COMPANIES.DETAILS(company.id)}
                        className="font-semibold text-text-primary hover:text-primary transition-colors block truncate"
                      >
                        {company.name}
                      </Link>
                      <span className="text-[11px] font-mono text-text-muted truncate block">
                        {company.companyId}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Industry */}
                <td className="px-4 py-3.5 font-medium text-text-primary">
                  {company.industry}
                </td>

                {/* Type */}
                <td className="px-4 py-3.5">
                  <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                    {company.type}
                  </span>
                </td>

                {/* Location */}
                <td className="px-4 py-3.5 text-text-secondary">
                  {company.location}
                </td>

                {/* Total Placed & Package */}
                <td className="px-4 py-3.5">
                  <div className="space-y-0.5">
                    <span className="font-bold text-text-primary">{company.totalHires || 0} students</span>
                    {company.averagePackage && (
                      <span className="text-[11px] text-text-muted block">Avg: {company.averagePackage}</span>
                    )}
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5">
                  <StatusBadge status={company.status} size="sm" />
                </td>

                {/* Actions */}
                <td className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.COMPANIES.DETAILS(company.id))}
                      className="text-xs py-1 px-2.5 flex items-center gap-1 text-primary border-primary/30 hover:bg-primary-soft/50"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </Button>

                    {!isStudent && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(ROUTES.COMPANIES.EDIT(company.id))}
                          className="p-1.5 text-slate-500 hover:text-primary hover:bg-primary-soft/50 rounded-lg"
                          title="Edit Company"
                          aria-label="Edit Company"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDelete?.(company)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                          title="Delete Company"
                          aria-label="Delete Company"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </>
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

export default CompanyTable;
