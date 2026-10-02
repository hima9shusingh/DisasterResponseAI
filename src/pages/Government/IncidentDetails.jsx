import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Phone, Clock, FileText, CheckCircle2 } from 'lucide-react';
import { useGovernment } from '../../context/GovernmentContext';
import SeverityBadge from '../../components/ui/SeverityBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import IncidentTimeline from '../../components/ui/IncidentTimeline';
import EvidenceGallery from '../../components/ui/EvidenceGallery';
import LocationCard from '../../components/map/LocationCard';
import AssignResourceModal from '../../components/modals/AssignResourceModal';
import StatusUpdateControl from '../../components/ui/StatusUpdateControl';
import ToastNotification from '../../components/ui/ToastNotification';
import QuickAction from '../../components/buttons/QuickAction';
import { ShieldAlert, Activity, PhoneCall, MessageSquare, Loader2, AlertCircle } from 'lucide-react';
import { incidentService } from '../../services/incidentService';
import { getApiErrorMessage } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function IncidentDetails() {
  const { incidentId } = useParams(); // This is the _id
  const navigate = useNavigate();
  const { resources, teams, assignments, assignResource, assignTeam, updateIncidentStatus } = useGovernment();
  
  const [incident, setIncident] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const activeAssignments = incident?.assignedResources || [];
  const activeTeams = incident?.assignedTeams || [];

  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const fetchIncident = async () => {
    try {
      const res = await incidentService.getIncidentById(incidentId);
      if (res.success) {
        setIncident(res.data.incident);
      }
    } catch (error) {
      console.error(error);
      showToast(getApiErrorMessage(error), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchIncident();
  }, [incidentId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading Incident Details...</h2>
      </div>
    );
  }

  if (!incident) {
    return <div className="p-8 text-center text-neutral-500 font-medium">Incident not found.</div>;
  }

  const showToast = (message, type = 'success') => {
    setToastMessage(message);
    setToastType(type);
  };

  const handleAssignSubmit = async (data) => {
    try {
      if (data.team.startsWith('team_')) {
        const teamId = data.team.replace('team_', '');
        await assignTeam(teamId, incidentId, data);
        showToast(`Team successfully assigned`);
      } else if (data.team.startsWith('resource_')) {
        const resId = data.team.replace('resource_', '');
        await assignResource(incidentId, { id: resId, ...data });
        showToast(`Resource successfully assigned`);
      }
      fetchIncident();
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      if (newStatus === 'Verified') {
        await incidentService.verifyIncident(incidentId);
      } else {
        const backendStatusMap = {
          'Pending Verification': 'pending_verification',
          'Verified': 'verified',
          'Resources Assigned': 'resources_assigned',
          'Rescue In Progress': 'rescue_in_progress',
          'Resolved': 'resolved'
        };
        await incidentService.updateIncidentStatus(incidentId, backendStatusMap[newStatus] || newStatus);
      }
      showToast(`Incident status updated`);
      fetchIncident();
      updateIncidentStatus(incidentId, newStatus); // Update dashboard overview
    } catch (err) {
      showToast(getApiErrorMessage(err), 'error');
    }
  };

  const handleAssignmentStatusChange = (assignmentId, newStatus) => {
    updateAssignmentStatus(incidentId, assignmentId, newStatus);
    showToast('Resource status updated');
  };

  const { user } = useAuth();
  const backPath = user?.role === 'admin' ? '/admin/incidents' : '/government/incidents';

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <ToastNotification show={!!toastMessage} message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />

      <Link to={backPath} className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-blue-600 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Incidents
      </Link>

      {/* Header & Status Timeline */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">{incident.incidentId || incident.id}</h1>
              <span className="text-xs font-bold px-2 py-1 bg-neutral-100 text-neutral-600 rounded-md uppercase tracking-wider capitalize">{incident.disasterType?.replace('_', ' ')}</span>
              <SeverityBadge severity={incident.severity} />
            </div>
            <p className="text-sm text-neutral-500 flex items-center gap-1.5"><Clock className="w-4 h-4" /> Reported {new Date(incident.reportedAt).toLocaleString()}</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <StatusUpdateControl currentStatus={incident.status} onUpdate={handleStatusUpdate} />
          </div>
        </div>
        <div className="px-2 md:px-8">
          <IncidentTimeline currentStatus={incident.status} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Info Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" /> Incident Details</h2>
            <p className="text-sm text-neutral-700 leading-relaxed mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">{incident.description}</p>
            
            <div className="grid grid-cols-2 gap-y-4 text-sm">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><MapPin className="w-4 h-4 text-neutral-400" /> {incident.location?.address || incident.location}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">District / State</p>
                <p className="font-semibold text-neutral-800">{incident.location?.district}, {incident.location?.state}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">People Affected</p>
                <p className="font-semibold text-neutral-800 flex items-center gap-1.5"><Users className="w-4 h-4 text-neutral-400" /> {incident.peopleAffected} Est.</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Coordinates</p>
                <p className="font-semibold text-neutral-800">{incident.location?.latitude?.toFixed(4)}, {incident.location?.longitude?.toFixed(4)}</p>
              </div>
            </div>
            
            <div className="mt-6">
              <LocationCard coords={incident.location?.latitude ? [incident.location.longitude, incident.location.latitude] : incident.coords} locationName={incident.location?.address || incident.location} />
            </div>
          </div>

          {/* Risk Assessment Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-orange-600" /> AI Risk Assessment
            </h2>
            
            {incident.riskLevel ? (
              <div className="grid grid-cols-2 gap-y-4 text-sm bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Risk Score</p>
                  <p className="font-bold text-neutral-900 text-lg">{incident.riskScore} <span className="text-sm font-semibold text-neutral-400">/ 100</span></p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Risk Level</p>
                  <span className={`px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                    incident.riskLevel === 'CRITICAL' ? 'bg-red-100 text-red-700' : 
                    incident.riskLevel === 'HIGH' ? 'bg-orange-100 text-orange-700' :
                    incident.riskLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {incident.riskLevel}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Assessment Mode</p>
                  <p className="font-semibold text-neutral-700 capitalize flex items-center gap-1.5">
                    {incident.assessmentMode === 'automated' ? <Activity className="w-3.5 h-3.5" /> : <Users className="w-3.5 h-3.5" />}
                    {incident.assessmentMode}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-1">Assessed At</p>
                  <p className="font-semibold text-neutral-700">
                    {new Date(incident.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-100 text-center">
                <p className="text-sm font-semibold text-neutral-500 flex items-center justify-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Risk assessment unavailable
                </p>
              </div>
            )}
          </div>

          {incident.evidence && (incident.evidence.images?.length > 0 || incident.evidence.videos?.length > 0) && (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-neutral-800">Evidence & Media</h2>
                <button 
                  onClick={() => navigate('/government/ai-assessment', { state: { incidentId: incident.id || incidentId, evidence: incident.evidence } })}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <Activity className="w-3.5 h-3.5" /> Analyze Evidence
                </button>
              </div>
              <EvidenceGallery evidence={incident.evidence} />
            </div>
          )}

          {/* Assigned Resources */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-neutral-800">Assigned Resources</h2>
              <button 
                onClick={() => setIsAssignModalOpen(true)}
                className="text-xs font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                + Assign
              </button>
            </div>
            
            {activeAssignments.length === 0 && activeTeams.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-neutral-200 rounded-xl">
                <p className="text-sm font-medium text-neutral-500">No resources or teams assigned yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-[10px] uppercase tracking-wider text-neutral-400 border-b border-neutral-100">
                      <th className="pb-3 font-semibold">Asset Name</th>
                      <th className="pb-3 font-semibold">Type</th>
                      <th className="pb-3 font-semibold">Department</th>
                      <th className="pb-3 font-semibold">Units/Members</th>
                      <th className="pb-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {activeAssignments.map(a => (
                      <tr key={a._id} className="border-b border-neutral-50 last:border-0">
                        <td className="py-3 font-bold text-neutral-800">{a.name}</td>
                        <td className="py-3 text-neutral-600">{a.type}</td>
                        <td className="py-3 text-neutral-600">{a.department}</td>
                        <td className="py-3 text-neutral-600">{a.totalUnits} Units</td>
                        <td className="py-3"><StatusBadge status={a.status} /></td>
                      </tr>
                    ))}
                    {activeTeams.map(t => (
                      <tr key={t._id} className="border-b border-neutral-50 last:border-0">
                        <td className="py-3 font-bold text-neutral-800">{t.name} (Team)</td>
                        <td className="py-3 text-neutral-600">{t.type}</td>
                        <td className="py-3 text-neutral-600">-</td>
                        <td className="py-3 text-neutral-600">{t.memberCount} Members</td>
                        <td className="py-3"><StatusBadge status={t.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Action Grid */}
          <div className="grid grid-cols-2 gap-2">
            <QuickAction icon={ShieldAlert} label="Alert" onClick={() => showToast('Emergency alert broadcasted', 'info')} />
            <QuickAction icon={Activity} label="Verify" onClick={() => handleStatusUpdate('Verified')} />
            <QuickAction icon={PhoneCall} label="Call" onClick={() => showToast('Calling reporter...', 'info')} />
            <QuickAction icon={MessageSquare} label="Msg" onClick={() => showToast('Opening message thread', 'info')} />
          </div>

          {/* Contact Details */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-sm font-bold text-neutral-800 mb-3">Emergency Contact</h2>
            <div className="space-y-3 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Reporter Name</p>
                <p className="text-sm font-semibold text-neutral-800">{incident.reportedBy?.name || 'Citizen'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">Contact Number</p>
                <p className="text-sm font-semibold text-blue-600 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> {incident.contactNumber}</p>
              </div>
            </div>
          </div>

          {incident.timeline && (
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <h2 className="text-sm font-bold text-neutral-800 mb-4">Activity Log</h2>
              <div className="relative pl-4 space-y-4">
                <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-neutral-100" />
                {[...incident.timeline].reverse().map((t, i) => (
                  <div key={t.id || i} className="relative flex gap-3">
                    <div className="absolute -left-4 w-2 h-2 bg-blue-500 rounded-full border-2 border-white top-1" />
                    <div className="flex-1">
                      <p className="text-xs text-neutral-700 font-medium">{t.action}</p>
                      <p className="text-[10px] text-neutral-400 mt-0.5">{new Date(t.time).toLocaleTimeString()} • {t.actor}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      <AssignResourceModal 
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        incidentId={incident.id}
        availableResources={resources}
        availableTeams={teams}
        onSubmit={handleAssignSubmit}
      />
    </div>
  );
}
