import React from 'react';
import { AlertTriangle, Info, ShieldAlert, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';
// Assuming we pull active alerts from GovernmentContext in a real app, 
// but for layout independence, we can accept it as a prop or use a global hook.
// Since Citizen and Gov layouts use it, we will use a custom hook or just mock it here if not provided.

export default function EmergencyAlertBanner({ alert, onClose }) {
  const navigate = useNavigate();

  if (!alert || alert.status !== 'Active') return null;

  const isCritical = alert.severity === 'Critical';
  const isWarning = alert.severity === 'Warning';

  if (!isCritical && !isWarning) return null; // Only show prominent banners for high severity

  return (
    <div className={clsx(
      "w-full px-4 py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-50",
      isCritical ? "bg-red-600 text-white" : "bg-orange-500 text-white"
    )}>
      <div className="flex items-start gap-3">
        {isCritical ? <ShieldAlert className="w-6 h-6 shrink-0 mt-0.5" /> : <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />}
        <div>
          <div className="flex items-center gap-2">
            <span className={clsx(
              "text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
              isCritical ? "bg-red-800 text-red-100" : "bg-orange-700 text-orange-100"
            )}>{alert.severity}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">{alert.location}</span>
          </div>
          <h4 className="font-bold text-sm sm:text-base leading-tight mt-1">{alert.title}</h4>
          <p className="text-xs sm:text-sm opacity-90 mt-0.5 line-clamp-1 sm:line-clamp-none">{alert.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <button 
          onClick={() => navigate(`/government/alerts/${alert.id}`)} 
          className={clsx(
            "text-xs font-bold px-4 py-2 rounded-lg whitespace-nowrap transition-colors flex-1 sm:flex-none text-center",
            isCritical ? "bg-red-700 hover:bg-red-800" : "bg-orange-600 hover:bg-orange-700"
          )}
        >
          View Details
        </button>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-black/10 rounded-lg transition-colors hidden sm:block">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
