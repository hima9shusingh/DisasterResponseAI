import React from 'react';
import { clsx } from 'clsx';
import { Edit, Eye, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AlertTable({ alerts, onDelete }) {
  const navigate = useNavigate();

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-700';
      case 'Warning': return 'bg-orange-100 text-orange-700';
      case 'Watch': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Active': return 'text-red-600';
      case 'Scheduled': return 'text-orange-600';
      case 'Resolved': return 'text-green-600';
      case 'Draft': return 'text-neutral-500';
      default: return 'text-neutral-600';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Alert ID / Title</th>
              <th className="p-4 font-semibold">Type</th>
              <th className="p-4 font-semibold">Severity</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {alerts.map((alert, idx) => {
              const uId = alert._id || alert.id;
              const displayId = alert.alertId || alert.id;
              const displayType = (alert.type || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
              const displaySeverity = (alert.severity || '').charAt(0).toUpperCase() + (alert.severity || '').slice(1);
              const displayStatus = (alert.status || '').charAt(0).toUpperCase() + (alert.status || '').slice(1);
              const displayLocation = alert.targetRegion || alert.location;

              return (
              <tr key={uId} className={clsx("hover:bg-neutral-50 transition-colors", idx !== alerts.length - 1 && "border-b border-neutral-100")}>
                <td className="p-4">
                  <div className="font-bold text-neutral-900">{alert.title}</div>
                  <div className="text-xs text-neutral-500 font-semibold">{displayId}</div>
                </td>
                <td className="p-4 font-bold text-neutral-700 capitalize">{displayType}</td>
                <td className="p-4">
                  <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", getSeverityStyle(displaySeverity))}>
                    {displaySeverity}
                  </span>
                </td>
                <td className="p-4 text-xs font-semibold text-neutral-600 max-w-[200px] truncate">{displayLocation}</td>
                <td className="p-4">
                  <span className={clsx("font-bold text-xs uppercase tracking-wider flex items-center gap-1.5", getStatusStyle(displayStatus))}>
                    <div className={clsx("w-1.5 h-1.5 rounded-full", displayStatus === 'Active' ? 'bg-red-500 animate-pulse' : displayStatus === 'Scheduled' ? 'bg-orange-500' : 'bg-green-500')}></div>
                    {displayStatus}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => navigate(`/government/alerts/${uId}`)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Eye className="w-4 h-4" /></button>
                    <button onClick={() => navigate(`/government/alerts/${uId}`)} className="p-1.5 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(uId)} className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            )})}
            {alerts.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-neutral-500 text-sm font-semibold">No alerts found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
