import React, { useState } from 'react';
import { Search, SlidersHorizontal, MapPin, Loader2 } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import MissionCard from '../../components/volunteer/MissionCard';

export default function VolunteerMissions() {
  const { availableMissions, isInitializing } = useVolunteer();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');

  const filteredMissions = availableMissions.filter(m => {
    const idMatch = (m.missionId || m._id || m.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = (m.location?.city || m.location?.address || m.location || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = idMatch || locMatch;
    
    const type = m.incident?.disasterType || m.disasterType || '';
    const matchesType = filterType === 'All' || type.toLowerCase().includes(filterType.toLowerCase());
    
    return matchesSearch && matchesType;
  });

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Finding active missions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Available Missions</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Find and accept emergency response missions near you.</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input 
            type="text"
            placeholder="Search by Mission ID or Location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select 
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold text-neutral-800 focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          >
            <option value="All">All Types</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Building Collapse">Building Collapse</option>
          </select>
          <button className="px-4 py-3 bg-white border border-neutral-200 rounded-xl text-neutral-700 hover:bg-neutral-50 transition-colors shadow-sm flex items-center justify-center">
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMissions.length > 0 ? (
          filteredMissions.map(mission => (
            <MissionCard key={mission._id || mission.id} mission={mission} />
          ))
        ) : (
          <div className="md:col-span-2 text-center p-12 bg-white rounded-2xl border border-neutral-100">
            <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500 font-semibold">No available missions match your search criteria.</p>
          </div>
        )}
      </div>

    </div>
  );
}
