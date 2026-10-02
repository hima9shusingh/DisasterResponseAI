import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Map, ShieldAlert, Phone, AlertTriangle, Users, Loader2 } from 'lucide-react';
import { useVolunteer } from '../../context/VolunteerContext';
import { missionService } from '../../services/missionService';
import { clsx } from 'clsx';
import MissionTimeline from '../../components/volunteer/MissionTimeline';
import MissionProgress from '../../components/volunteer/MissionProgress';
import VolunteerMap from '../../components/volunteer/VolunteerMap';
import MissionUpdateModal from '../../components/volunteer/MissionUpdateModal';

export default function MissionDetails() {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const { acceptMission, updateMissionStatus, updateRescueProgress } = useVolunteer();
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [mission, setMission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMission = async () => {
      try {
        const res = await missionService.getMissionById(missionId);
        if (res.success) {
          setMission(res.data.mission);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMission();
  }, [missionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading mission details...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <ShieldAlert className="w-12 h-12 text-neutral-400 mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Mission Not Found</h2>
        <button onClick={() => navigate('/volunteer/missions')} className="mt-4 text-blue-600 font-semibold hover:underline">Return to Missions</button>
      </div>
    );
  }

  const handleAction = async () => {
    try {
      switch (mission.status) {
        case 'assigned': 
          await acceptMission(mission._id); 
          break;
        case 'accepted': 
          await updateMissionStatus(mission._id, 'En Route'); 
          break;
        case 'en_route': 
          await updateMissionStatus(mission._id, 'On Site'); 
          break;
        case 'on_site': 
          if (window.confirm('Confirm you are starting the rescue operation?')) {
            await updateMissionStatus(mission._id, 'Rescue In Progress'); 
          }
          break;
        case 'rescue_in_progress':
          if (window.confirm('Are you sure you want to mark this mission as COMPLETED?')) {
            await updateMissionStatus(mission._id, 'Completed');
            navigate('/volunteer/history');
            return; // prevent refetch since we are navigating
          }
          break;
        default: break;
      }
      
      // refetch mission directly
      const res = await missionService.getMissionById(missionId);
      if (res.success) setMission(res.data.mission);
    } catch (err) {
      console.error(err);
      alert('Failed to update mission status');
    }
  };

  const getActionLabel = () => {
    switch (mission.status) {
      case 'assigned': return 'Accept Mission';
      case 'accepted': return 'Start Journey';
      case 'en_route': return 'Arrived On Site';
      case 'on_site': return 'Start Rescue';
      case 'rescue_in_progress': return 'Complete Mission';
      default: return 'Mission Completed';
    }
  };

  const getActionStyle = () => {
    if (mission.status === 'assigned') return 'bg-blue-600 hover:bg-blue-700 text-white';
    if (mission.status === 'rescue_in_progress') return 'bg-green-600 hover:bg-green-700 text-white';
    return 'bg-blue-600 hover:bg-blue-700 text-white';
  };

  const handleUpdateSave = async (rescuedCount, notes) => {
    try {
      await updateRescueProgress(mission._id, rescuedCount, notes, mission.peopleRemaining - rescuedCount, mission.progress + 10);
      setIsUpdateModalOpen(false);
      const res = await missionService.getMissionById(missionId);
      if (res.success) setMission(res.data.mission);
    } catch (err) {
      console.error(err);
      alert('Failed to update progress');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-blue-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", (mission.incident?.severity || mission.severity) === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')}>{mission.incident?.severity || mission.severity}</span>
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700">{mission.status?.replace('_', ' ')}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">{mission.location?.address || mission.location?.city || mission.location}</h1>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{mission.missionId || mission.id} • {mission.incident?.disasterType?.replace('_', ' ') || mission.disasterType}</p>
          </div>
          
          {mission.status !== 'completed' && (
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {mission.status === 'rescue_in_progress' && (
                <button onClick={() => setIsUpdateModalOpen(true)} className="px-6 py-3 bg-neutral-100 text-neutral-700 rounded-xl font-bold text-sm shadow-sm hover:bg-neutral-200 transition-colors flex items-center justify-center gap-2">
                  Update Progress
                </button>
              )}
              <button onClick={handleAction} className={clsx("px-8 py-3 rounded-xl font-bold text-sm shadow-sm transition-colors text-center", getActionStyle())}>
                {getActionLabel()}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Progress */}
          {(mission.status === 'rescue_in_progress' || mission.status === 'completed') && (
            <MissionProgress rescued={mission.peopleRescued || 0} total={mission.incident?.peopleAffected || mission.peopleRemaining || 0} />
          )}

          {/* Map */}
          <div className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm h-[400px] flex flex-col">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
                <Map className="w-4 h-4" /> Tactical Map
              </h2>
            </div>
            <div className="flex-1 relative">
              {/* Dummy coords: volunteer is slightly offset from incident */}
              <VolunteerMap incidentCoords={mission.incident?.location?.latitude ? [mission.incident.location.latitude, mission.incident.location.longitude] : mission.coords || [28.6139, 77.2090]} volunteerCoords={mission.incident?.location?.latitude ? [mission.incident.location.latitude - 0.02, mission.incident.location.longitude - 0.02] : mission.coords ? [mission.coords[0] - 0.02, mission.coords[1] - 0.02] : [28.6139, 77.2090]} />
            </div>
          </div>

          {/* Details */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6">
            <div>
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Mission Description</h2>
              <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{mission.instructions || mission.description || 'No specific instructions.'}</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-neutral-50 p-4 rounded-xl">
              <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Affected</p><p className="text-sm font-bold text-neutral-800 flex items-center gap-1.5"><Users className="w-3.5 h-3.5" /> {mission.incident?.peopleAffected || mission.peopleRemaining || 0}</p></div>
              <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Team Required</p><p className="text-sm font-bold text-neutral-800">{mission.team?.type || mission.requiredTeam || 'Rescue Team'}</p></div>
              <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Est. Duration</p><p className="text-sm font-bold text-neutral-800">{mission.estimatedDuration || 'TBD'}</p></div>
              <div><p className="text-[10px] font-bold text-neutral-400 uppercase">Distance</p><p className="text-sm font-bold text-neutral-800">{mission.distance || 'N/A'}</p></div>
            </div>
          </div>
          
        </div>

        {/* Side Column */}
        <div className="space-y-6">
          
          {/* Emergency Instructions */}
          <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl shadow-sm">
            <h2 className="text-sm font-bold text-orange-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-orange-600" /> Emergency Instructions
            </h2>
            <p className="text-sm text-orange-800 leading-relaxed font-semibold mb-6">{mission.instructions || mission.incident?.description || 'Ensure all team members follow safety protocols.'}</p>
            <button className="w-full py-3 bg-white text-orange-700 font-bold text-sm rounded-xl border border-orange-200 hover:bg-orange-100 transition-colors flex justify-center items-center gap-2">
              <Phone className="w-4 h-4" /> Call Command Center
            </button>
          </div>

          {/* Timeline */}
          {(mission.timeline || mission.createdAt) && (
            <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-6 border-b border-neutral-100 pb-2">Response Timeline</h2>
              <MissionTimeline timeline={mission.timeline || [
                { stage: 'Mission Created', time: mission.createdAt, active: mission.status === 'assigned' },
                { stage: 'Mission Started', time: mission.startedAt, active: mission.status === 'en_route' || mission.status === 'on_site' },
                { stage: 'Rescue Ops', time: mission.updatedAt, active: mission.status === 'rescue_in_progress' },
                { stage: 'Completed', time: mission.completedAt, active: mission.status === 'completed' }
              ].filter(t => t.time)} />
            </div>
          )}

        </div>
      </div>

      <MissionUpdateModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
        onSave={handleUpdateSave}
        remaining={mission.peopleRemaining || (mission.incident?.peopleAffected - (mission.peopleRescued || 0)) || 0} 
      />
    </div>
  );
}
