import React from 'react';
import { clsx } from 'clsx';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MissionTable({ missions }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Mission ID / Disaster</th>
              <th className="p-4 font-semibold">Location</th>
              <th className="p-4 font-semibold">Completed At</th>
              <th className="p-4 font-semibold">People Assisted</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {missions.map((mission, idx) => (
              <tr key={mission._id || mission.id} className={clsx("hover:bg-neutral-50 transition-colors", idx !== missions.length - 1 && "border-b border-neutral-100")}>
                <td className="p-4">
                  <div className="font-bold text-neutral-900">{mission.missionId || mission.id}</div>
                  <div className="text-xs text-neutral-500 font-semibold capitalize">{mission.incident?.disasterType?.replace('_', ' ') || mission.disasterType}</div>
                </td>
                <td className="p-4 text-xs font-semibold text-neutral-700 max-w-[200px] truncate">{mission.location?.city || mission.location?.address || mission.location}</td>
                <td className="p-4 text-xs font-semibold text-neutral-600">{mission.completedAt ? new Date(mission.completedAt).toLocaleString() : '-'}</td>
                <td className="p-4 text-xs font-bold text-neutral-700">{mission.peopleRescued || 0} / {mission.incident?.peopleAffected || mission.peopleRemaining || (mission.peopleRescued || 0)}</td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700">
                    {mission.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => navigate(`/volunteer/missions/${mission._id || mission.id}`)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors inline-block"><Eye className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {missions.length === 0 && (
              <tr><td colSpan="6" className="p-8 text-center text-neutral-500 text-sm font-semibold">No completed missions yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
