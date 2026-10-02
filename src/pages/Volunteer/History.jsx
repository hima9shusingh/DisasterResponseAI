import React, { useState } from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import MissionTable from '../../components/volunteer/MissionTable';
import { Search } from 'lucide-react';

export default function VolunteerHistory() {
  const { completedMissions } = useVolunteer();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMissions = completedMissions.filter(m => {
    const id = m.missionId || m._id || m.id || '';
    const loc = m.location?.city || m.location?.address || m.location || '';
    const type = m.incident?.disasterType || m.disasterType || '';
    return id.toLowerCase().includes(searchTerm.toLowerCase()) || 
           loc.toLowerCase().includes(searchTerm.toLowerCase()) ||
           type.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Mission History</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">Review your completed rescue operations and impact.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
      </div>

      <MissionTable missions={filteredMissions} />

    </div>
  );
}
