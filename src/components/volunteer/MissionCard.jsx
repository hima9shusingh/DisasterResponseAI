import React from 'react';
import { MapPin, Navigation, Clock, ShieldAlert, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function MissionCard({ mission, active = false }) {
  const navigate = useNavigate();

  const getSeverityStyle = (s) => {
    if (s === 'Critical') return 'bg-red-100 text-red-700';
    if (s === 'High') return 'bg-orange-100 text-orange-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <div className={clsx(
      "bg-white rounded-2xl border shadow-sm p-5 transition-all hover:shadow-md",
      active ? "border-blue-500 ring-1 ring-blue-500" : "border-neutral-100"
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", getSeverityStyle(mission.incident?.severity || mission.severity))}>
            {mission.incident?.severity || mission.severity}
          </span>
          <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-600 border border-neutral-200 capitalize">
            {mission.incident?.disasterType?.replace('_', ' ') || mission.disasterType}
          </span>
        </div>
        <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{mission.missionId || mission.id}</span>
      </div>

      <h3 className="text-lg font-bold text-neutral-900 mb-2 truncate">{mission.location?.city || mission.location}</h3>
      <p className="text-sm text-neutral-500 mb-4 line-clamp-2">{mission.instructions || mission.description}</p>

      <div className="grid grid-cols-2 gap-y-3 gap-x-2 mb-6">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-100 rounded text-neutral-500"><MapPin className="w-3.5 h-3.5" /></div>
          <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Distance</p><p className="text-xs font-semibold text-neutral-700">{mission.distance || 'N/A'}</p></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-neutral-100 rounded text-neutral-500"><ShieldAlert className="w-3.5 h-3.5" /></div>
          <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Affected</p><p className="text-xs font-semibold text-neutral-700">{mission.incident?.peopleAffected || mission.peopleRemaining || 0} People</p></div>
        </div>
        <div className="flex items-center gap-2 col-span-2">
          <div className="p-1.5 bg-neutral-100 rounded text-neutral-500"><Clock className="w-3.5 h-3.5" /></div>
          <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Reported</p><p className="text-xs font-semibold text-neutral-700">{new Date(mission.createdAt || mission.reportedTime).toLocaleString()}</p></div>
        </div>
      </div>

      {active ? (
        <button onClick={() => navigate(`/volunteer/missions/${mission._id || mission.id}`)} className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2">
          View Active Mission <ArrowRight className="w-4 h-4" />
        </button>
      ) : (
        <div className="flex gap-2">
          <button onClick={() => navigate(`/volunteer/missions/${mission._id || mission.id}`)} className="flex-1 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-bold text-xs transition-colors">Details</button>
          <button onClick={() => navigate(`/volunteer/missions/${mission._id || mission.id}`)} className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold text-xs transition-colors border border-blue-200">Accept</button>
        </div>
      )}
    </div>
  );
}
