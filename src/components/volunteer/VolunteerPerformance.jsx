import React from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import { ShieldCheck, Users, Clock, Star } from 'lucide-react';

export default function VolunteerPerformance() {
  const { profile } = useVolunteer();
  const { stats } = profile;

  const kpis = [
    { label: 'Completed Missions', value: stats.missionsCompleted, icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Active Missions', value: stats.activeMissions, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Total Assigned', value: stats.totalAssignedMissions, icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-100' },
    { label: 'People Assisted', value: stats.peopleAssisted, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <div key={idx} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-xl ${kpi.bg} ${kpi.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-neutral-800">{kpi.value}</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{kpi.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
