import React from 'react';
import { Shield, Clock, User, ArrowRight, Laptop } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import Loading from '../common/Loading';
import EmptyState from '../common/EmptyState';
import { formatDate } from '../../utils/formatters';

const severityBadgeVariants = {
  Success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Info: 'bg-sky-50 text-sky-700 border-sky-200',
  Warning: 'bg-amber-50 text-amber-700 border-amber-200',
  Security: 'bg-purple-50 text-purple-700 border-purple-200'
};

const AuditTable = ({
  logs = [],
  loading = false,
  onResetFilters
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-border-color py-16">
        <Loading message="Fetching institutional audit logs & system trails..." />
      </div>
    );
  }

  if (!logs || logs.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border-color">
        <EmptyState
          title="No audit log entries found"
          description="Try adjusting your filter options or search criteria."
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
              <th className="px-4 py-3.5">Timestamp</th>
              <th className="px-4 py-3.5">User Actor</th>
              <th className="px-4 py-3.5">Action Code</th>
              <th className="px-4 py-3.5">Target Entity</th>
              <th className="px-4 py-3.5">Activity Description</th>
              <th className="px-4 py-3.5">Severity</th>
              <th className="px-4 py-3.5 text-right">IP Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-color/75 text-text-primary">
            {logs.map((log) => (
              <tr
                key={log.id}
                className="hover:bg-slate-50/60 transition-colors group"
              >
                {/* Timestamp */}
                <td className="px-4 py-3.5 whitespace-nowrap text-text-muted font-medium">
                  {formatDate(log.timestamp)}
                  <span className="text-[10px] text-slate-400 block">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </td>

                {/* User Actor */}
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Avatar src={log.userAvatar} name={log.user} size="sm" />
                    <div>
                      <span className="font-semibold text-text-primary block">{log.user}</span>
                      <span className="text-[10px] text-primary font-medium">{log.userRole}</span>
                    </div>
                  </div>
                </td>

                {/* Action & Category */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono text-[11px] font-bold text-slate-800 block">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-text-muted">{log.category}</span>
                </td>

                {/* Target Entity */}
                <td className="px-4 py-3.5 font-medium text-text-primary">
                  {log.entity}
                </td>

                {/* Activity Description */}
                <td className="px-4 py-3.5 text-text-secondary max-w-xs leading-relaxed">
                  {log.details}
                </td>

                {/* Severity */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      severityBadgeVariants[log.severity] || 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {log.severity}
                  </span>
                </td>

                {/* IP Address */}
                <td className="px-4 py-3.5 text-right font-mono text-[11px] text-text-muted whitespace-nowrap">
                  {log.ipAddress}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditTable;
