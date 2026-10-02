import React from 'react';
import { AlertCircle, Info, Flame, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export default function AlertCard({ alert }) {
  const getIcon = () => {
    switch (alert.severity) {
      case 'critical': return <Flame className="w-5 h-5 text-red-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'info': return <Info className="w-5 h-5 text-blue-600" />;
      default: return <AlertCircle className="w-5 h-5 text-neutral-600" />;
    }
  };

  const getStyle = () => {
    switch (alert.severity) {
      case 'critical': return 'bg-red-50 border-red-100';
      case 'warning': return 'bg-orange-50 border-orange-100';
      case 'info': return 'bg-blue-50 border-blue-100';
      default: return 'bg-neutral-50 border-neutral-100';
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={clsx('p-4 rounded-xl border flex gap-3', getStyle())}
    >
      <div className="shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="font-bold text-sm text-neutral-900 capitalize">{alert.title || alert.type}</h4>
          <span className="text-xs text-neutral-500">{new Date(alert.createdAt || alert.time).toLocaleDateString()}</span>
        </div>
        <p className="text-sm text-neutral-700 mt-1 line-clamp-2">{alert.description || alert.message}</p>
        <button className="text-xs font-semibold mt-2 text-blue-600 hover:text-blue-800 transition-colors">
          View Alert &rarr;
        </button>
      </div>
    </motion.div>
  );
}
