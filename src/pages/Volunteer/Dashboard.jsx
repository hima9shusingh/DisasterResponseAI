import React from 'react';
import { useVolunteer } from '../../context/VolunteerContext';
import AvailabilityToggle from '../../components/volunteer/AvailabilityToggle';
import VolunteerPerformance from '../../components/volunteer/VolunteerPerformance';
import MissionCard from '../../components/volunteer/MissionCard';
import { ArrowRight, Inbox, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function VolunteerDashboard() {
  const { profile, activeMission, isInitializing } = useVolunteer();
  const navigate = useNavigate();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading your command center...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Good evening, {profile?.name?.split(' ')[0]}</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">View assigned rescue missions and help coordinate emergency response.</p>
        </div>
        <AvailabilityToggle />
      </div>

      <VolunteerPerformance />

      {/* Active Mission */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center justify-between">
          Active Mission
        </h2>
        {activeMission ? (
          <MissionCard mission={activeMission} active={true} />
        ) : (
          <div className="bg-white p-8 rounded-2xl border border-neutral-100 shadow-sm flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center mb-4">
              <Inbox className="w-8 h-8 text-neutral-300" />
            </div>
            <h3 className="text-lg font-bold text-neutral-800 mb-1">No Active Missions</h3>
            <p className="text-sm text-neutral-500 max-w-sm mb-6">You are currently not assigned to any active operations. Check the available missions board to find operations near you.</p>
            <button onClick={() => navigate('/volunteer/missions')} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm transition-colors flex items-center gap-2">
              Find Missions <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
