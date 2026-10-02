import React from 'react';
import { MapPin, Users, Phone, ShieldAlert, Crosshair } from 'lucide-react';
import { clsx } from 'clsx';

export default function TeamCard({ team, onClick }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'assigned':
      case 'en route': return 'bg-yellow-100 text-yellow-700';
      case 'on mission': return 'bg-blue-100 text-blue-700';
      case 'offline': return 'bg-neutral-200 text-neutral-600';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div 
      onClick={() => onClick(team)}
      className="bg-white border border-neutral-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-blue-200 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-bold text-lg text-neutral-900 leading-tight group-hover:text-blue-700 transition-colors">{team.name}</h3>
          <p className="text-xs font-semibold text-neutral-500 mt-1 uppercase tracking-wider">{team.type}</p>
        </div>
        <span className={clsx("px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider", getStatusColor(team.status))}>
          {team.status}
        </span>
      </div>

      <div className="space-y-2.5 mt-4 text-sm text-neutral-600">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-neutral-400" />
          <span>{team.memberCount ?? team.members} Members • {team.leader}</span>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-neutral-400" />
          <span className="truncate">{team.location}</span>
        </div>
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-neutral-400" />
          <span className="truncate">{team.currentMission?.name || team.mission || 'Standby'}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold">
        <span className="text-neutral-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {team.contactNumber ?? team.contact}</span>
        <span className="text-blue-600 group-hover:underline">View Details</span>
      </div>
    </div>
  );
}
