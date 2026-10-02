import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { ShieldAlert, MapPin, Clock, Search, Filter, Loader2, CheckCircle2, ChevronRight, Check } from 'lucide-react';
import ErrorState from '../../components/ui/ErrorState';
import { rescueTeamService } from '../../services/rescueTeamService';

export default function AdminSOS() {
  const [sosList, setSosList] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSOS, setSelectedSOS] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { socket } = useSocket();

  const fetchSOS = async () => {
    try {
      const response = await api.get('/sos');
      if (response.data.success) {
        setSosList(response.data.data.sosRequests);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to fetch SOS requests.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await rescueTeamService.getAllTeams();
      if (response.success) {
        setTeams(response.data.teams);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSOS();
    fetchTeams();
  }, []);

  useEffect(() => {
    if (!socket) return;
    
    const handleSOSChange = () => fetchSOS();
    
    socket.on('sos:created', handleSOSChange);
    socket.on('sos:updated', handleSOSChange);

    return () => {
      socket.off('sos:created', handleSOSChange);
      socket.off('sos:updated', handleSOSChange);
    };
  }, [socket]);

  const handleUpdateStatus = async (id, status, assignedTeam = null) => {
    setIsUpdating(true);
    try {
      const payload = { status };
      if (assignedTeam) payload.assignedTeam = assignedTeam;
      
      const res = await api.patch(`/sos/${id}/status`, payload);
      if (res.data.success) {
        if (selectedSOS && selectedSOS._id === id) {
          setSelectedSOS(res.data.data.sos);
        }
        await fetchSOS();
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update SOS status.');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredSOS = sosList.filter(sos => {
    const matchesSearch = sos.emergencyId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sos.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-[60vh]">
      <Loader2 className="w-12 h-12 text-red-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold text-neutral-800">Loading SOS Console...</h2>
    </div>
  );

  if (error) return <ErrorState message={error} onRetry={fetchSOS} />;

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
              <ShieldAlert size={24} />
            </div>
            SOS Response Console
          </h1>
          <p className="text-sm font-semibold text-neutral-500 mt-1">Manage high-priority one-click emergencies</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search Emergency ID..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-neutral-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all"
              />
            </div>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-neutral-200 rounded-xl px-4 py-2.5 text-sm font-bold text-neutral-700 outline-none focus:border-red-500 cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="ACKNOWLEDGED">Acknowledged</option>
              <option value="ASSIGNED">Assigned</option>
              <option value="RESPONDING">Responding</option>
              <option value="ON_SCENE">On Scene</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
            {filteredSOS.length === 0 ? (
              <div className="p-12 text-center text-neutral-500">
                <ShieldAlert className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="font-bold">No SOS requests found matching filters.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {filteredSOS.map(sos => (
                  <div 
                    key={sos._id}
                    onClick={() => setSelectedSOS(sos)}
                    className={`p-4 cursor-pointer transition-colors flex items-center justify-between group ${selectedSOS?._id === sos._id ? 'bg-red-50/50' : 'hover:bg-neutral-50'}`}
                  >
                    <div className="flex gap-4 items-center">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${sos.status === 'RESOLVED' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                        {sos.status === 'RESOLVED' ? <CheckCircle2 size={24} /> : <ShieldAlert size={24} className={sos.status === 'PENDING' ? 'animate-pulse' : ''} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-neutral-900 font-mono text-sm">{sos.emergencyId}</h3>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            sos.status === 'PENDING' ? 'bg-red-100 text-red-700' : 
                            sos.status === 'RESOLVED' ? 'bg-green-100 text-green-700' : 
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {sos.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs font-semibold text-neutral-500">
                          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(sos.createdAt).toLocaleTimeString()}</span>
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {sos.location?.latitude ? 'GPS Available' : 'No GPS'}</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-neutral-300 transition-transform ${selectedSOS?._id === sos._id ? 'translate-x-1 text-red-500' : 'group-hover:translate-x-1'}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Details */}
        <div className="lg:col-span-1">
          {selectedSOS ? (
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm sticky top-6">
              <h2 className="text-lg font-black text-neutral-900 mb-4 border-b border-neutral-100 pb-4">SOS Details</h2>
              
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Emergency ID</span>
                  <p className="font-mono font-bold text-neutral-900">{selectedSOS.emergencyId}</p>
                </div>
                
                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Time Reported</span>
                  <p className="font-bold text-neutral-900">{new Date(selectedSOS.createdAt).toLocaleString()}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Location Data</span>
                  {selectedSOS.location?.latitude ? (
                    <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      <p className="font-bold text-sm text-neutral-900">{selectedSOS.location.latitude.toFixed(5)}° N, {selectedSOS.location.longitude.toFixed(5)}° E</p>
                      <a href={`https://www.google.com/maps?q=${selectedSOS.location.latitude},${selectedSOS.location.longitude}`} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-600 hover:underline mt-1 inline-block">Open in Maps</a>
                    </div>
                  ) : (
                    <p className="font-bold text-neutral-500 text-sm">GPS Data Unavailable</p>
                  )}
                </div>

                {selectedSOS.userId && (
                  <div>
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Reporter</span>
                    <p className="font-bold text-neutral-900 text-sm">{selectedSOS.userId.name} ({selectedSOS.userId.phone || selectedSOS.userId.email})</p>
                  </div>
                )}

                <div className="pt-4 border-t border-neutral-100">
                  <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-3">Response Actions</span>
                  
                  {selectedSOS.status === 'PENDING' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedSOS._id, 'ACKNOWLEDGED')}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm flex items-center justify-center gap-2"
                    >
                      {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      Acknowledge Request
                    </button>
                  )}

                  {(selectedSOS.status === 'ACKNOWLEDGED' || selectedSOS.status === 'ASSIGNED') && (
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-neutral-600 mb-1 block">Assign Team</label>
                        <select 
                          className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-2 text-sm font-bold outline-none focus:border-blue-500"
                          onChange={(e) => {
                            if (e.target.value) handleUpdateStatus(selectedSOS._id, 'ASSIGNED', e.target.value);
                          }}
                          value={selectedSOS.assignedTeam?._id || ''}
                          disabled={isUpdating}
                        >
                          <option value="">Select Team...</option>
                          {teams.map(t => (
                            <option key={t._id} value={t._id}>{t.name} ({t.status})</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        onClick={() => handleUpdateStatus(selectedSOS._id, 'RESPONDING')}
                        disabled={isUpdating || !selectedSOS.assignedTeam}
                        className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                      >
                        Mark as Responding
                      </button>
                    </div>
                  )}

                  {selectedSOS.status === 'RESPONDING' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedSOS._id, 'ON_SCENE')}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                    >
                      Team Arrived On Scene
                    </button>
                  )}

                  {selectedSOS.status === 'ON_SCENE' && (
                    <button 
                      onClick={() => handleUpdateStatus(selectedSOS._id, 'RESOLVED')}
                      disabled={isUpdating}
                      className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 text-sm"
                    >
                      Mark as Resolved
                    </button>
                  )}

                  {selectedSOS.status === 'RESOLVED' && (
                    <div className="bg-green-50 p-3 rounded-xl border border-green-200 text-green-700 font-bold text-sm text-center">
                      Emergency Resolved Successfully
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-neutral-50 rounded-2xl border border-neutral-200 border-dashed p-12 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
              <ShieldAlert className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="font-bold text-neutral-500 text-sm">Select an SOS request to view details and assign teams.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
