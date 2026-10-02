import React from 'react';
import { clsx } from 'clsx';

export default function SeverityBadge({ severity, className }) {
  const styles = {
    Critical: 'bg-red-100 text-red-800 border-red-200',
    High: 'bg-orange-100 text-orange-800 border-orange-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Low: 'bg-green-100 text-green-800 border-green-200'
  };

  const currentStyle = styles[severity] || 'bg-neutral-100 text-neutral-800 border-neutral-200';

  return (
    <span className={clsx('px-2 py-1 text-xs font-semibold rounded-full border', currentStyle, className)}>
      {severity}
    </span>
  );
}
