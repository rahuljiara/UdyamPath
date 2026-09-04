import React from 'react';
import Badge from './Badge';

const statusMap = {
  // Placement & Student Statuses
  Placed: { variant: 'success', label: 'Placed' },
  Selected: { variant: 'success', label: 'Selected' },
  Accepted: { variant: 'success', label: 'Accepted' },
  Active: { variant: 'success', label: 'Active' },
  Completed: { variant: 'success', label: 'Completed' },

  // In-progress & Review Statuses
  Shortlisted: { variant: 'primary', label: 'Shortlisted' },
  'In Progress': { variant: 'primary', label: 'In Progress' },
  'Under Review': { variant: 'info', label: 'Under Review' },
  'Technical Interview': { variant: 'info', label: 'Tech Round' },
  'Final Selection': { variant: 'primary', label: 'Final Round' },
  'Aptitude Test': { variant: 'info', label: 'Aptitude Test' },
  Scheduled: { variant: 'info', label: 'Scheduled' },
  Open: { variant: 'success', label: 'Open' },
  Offered: { variant: 'primary', label: 'Offered' },
  Applied: { variant: 'neutral', label: 'Applied' },

  // Warnings & Paused
  Draft: { variant: 'warning', label: 'Draft' },
  Rescheduled: { variant: 'warning', label: 'Rescheduled' },
  Pending: { variant: 'warning', label: 'Pending' },

  // Inactive & Rejections
  Closed: { variant: 'default', label: 'Closed' },
  Rejected: { variant: 'danger', label: 'Rejected' },
  Declined: { variant: 'danger', label: 'Declined' },
  Cancelled: { variant: 'danger', label: 'Cancelled' },
  Expired: { variant: 'default', label: 'Expired' },
  Ineligible: { variant: 'danger', label: 'Ineligible' },
  Unplaced: { variant: 'default', label: 'Unplaced' }
};

const StatusBadge = ({ status, size = 'sm', className = '' }) => {
  const config = statusMap[status] || { variant: 'default', label: status || 'Unknown' };

  return (
    <Badge
      variant={config.variant}
      size={size}
      dot
      className={className}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
