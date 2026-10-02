import React from 'react';
import { clsx } from 'clsx';

export default function StatusBadge({ status, className }) {
  const styles = {
    'Pending Verification': 'bg-neutral-100 text-neutral-700',
    'Verified': 'bg-blue-50 text-blue-700',
    'Resources Assigned': 'bg-purple-50 text-purple-700',
    'Rescue In Progress': 'bg-orange-50 text-orange-700',
    'Resolved': 'bg-green-50 text-green-700',
    // Rescue Team statuses
    'Available': 'bg-green-50 text-green-700',
    'En Route': 'bg-blue-50 text-blue-700',
    'On Mission': 'bg-orange-50 text-orange-700',
    'Offline': 'bg-neutral-100 text-neutral-500'
  };

  const currentStyle = styles[status] || 'bg-neutral-100 text-neutral-800';

  return (
    <span className={clsx('px-2 py-1 text-xs font-medium rounded-full', currentStyle, className)}>
      {status}
    </span>
  );
}
