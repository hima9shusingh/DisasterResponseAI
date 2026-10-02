import React from 'react';
import { Truck, Users, MapPin, Clock } from 'lucide-react';

export default function ResponseTeamCard({ team }) {
  if (!team) return null;

  return (
    <div className="bg-white border-2 border-blue-500 rounded-xl p-5 shadow-[0_4px_20px_-10px_rgba(59,130,246,0.2)]">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-0.5 rounded border border-blue-100 mb-2 inline-block">Assigned Response Team</span>
          <h3 className="font-extrabold text-lg text-neutral-900 leading-tight">{team.name}</h3>
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mt-0.5">{team.type}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <Truck className="w-5 h-5" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm mt-5 pt-4 border-t border-neutral-100">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Clock className="w-3.5 h-3.5" /> Current Status</p>
          <p className="font-bold text-blue-600 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            {team.status}
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> ETA</p>
          <p className="font-bold text-neutral-800">{team.eta}</p>
        </div>
        <div className="col-span-2">
           <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Users className="w-3.5 h-3.5" /> Team Composition</p>
           <p className="font-bold text-neutral-800">{team.members} Professional Responders</p>
        </div>
      </div>
    </div>
  );
}
