import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { adminService } from '../../services/adminService';
import AdminKpiCard from '../../components/admin/AdminKpiCard';
import SystemHealthCard from '../../components/admin/SystemHealthCard';
import GlobalSearch from '../../components/admin/GlobalSearch';
import { Users, ShieldCheck, Activity, AlertCircle, ShieldAlert, Loader2, Map as MapIcon } from 'lucide-react';
import ErrorState from '../../components/ui/ErrorState';
import { incidentService } from '../../services/incidentService';
import LiveIncidentMap from '../../components/map/LiveIncidentMap';
import { useSocket } from '../../context/SocketContext';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [mapFilters, setMapFilters] = useState({ severity: 'all', riskLevel: 'all' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const filteredIncidents = incidents.filter(inc => {
    if (mapFilters.severity !== 'all' && inc.severity !== mapFilters.severity) return false;
    if (mapFilters.riskLevel !== 'all' && inc.riskLevel !== mapFilters.riskLevel) return false;
    return true;
  });

  const fetchStats = async () => {
    try {
      const [statsResponse, incidentsResponse, sosResponse] = await Promise.all([
        adminService.getSystemStats(),
        incidentService.getIncidents({ limit: 100, status: 'active' }), // get active incidents for map
        api.get('/sos') // get active SOS for map
      ]);

      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      let allMapData = [];
      if (incidentsResponse.success) {
        const activeIncidents = incidentsResponse.data.incidents || incidentsResponse.data || [];
        allMapData = Array.isArray(activeIncidents) ? activeIncidents : activeIncidents.incidents || [];
      }

      if (sosResponse.data?.success) {
        const activeSos = sosResponse.data.data.sosRequests.filter(s => s.status !== 'RESOLVED' && s.status !== 'CANCELLED');
        const sosIncidents = activeSos.map(sos => ({
          _id: sos._id,
          incidentId: sos.emergencyId,
          type: 'SOS Emergency',
          severity: sos.priority === 'critical' ? 'critical' : 'high',
          riskLevel: 'CRITICAL',
          location: sos.location,
          status: sos.status,
          createdAt: sos.createdAt,
          isSOS: true
        }));
        allMapData = [...allMapData, ...sosIncidents];
      }

      setIncidents(allMapData);
    } catch (err) {
      console.error(err);
      setError('Unable to load analytics.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    const handleIncidentChange = () => {
      fetchStats();
    };

    socket.on('incident:created', handleIncidentChange);
    socket.on('incident:updated', handleIncidentChange);
    socket.on('alert:created', handleIncidentChange);
    socket.on('sos:created', handleIncidentChange);
    socket.on('sos:updated', handleIncidentChange);

    return () => {
      socket.off('incident:created', handleIncidentChange);
      socket.off('incident:updated', handleIncidentChange);
      socket.off('alert:created', handleIncidentChange);
      socket.off('sos:created', handleIncidentChange);
      socket.off('sos:updated', handleIncidentChange);
    };
  }, [socket]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading System Statistics...</h2>
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      <GlobalSearch />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">System Administration</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Manage users, roles, incidents, resources and platform activity.</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminKpiCard title="Total Users" value={(stats?.users?.totalUsers || 0).toLocaleString()} icon={Users} colorClass="bg-blue-50 text-blue-600" />
        <AdminKpiCard title="Total Incidents" value={(stats?.system?.totalIncidents || 0).toLocaleString()} icon={Activity} colorClass="bg-blue-50 text-blue-600" />
        <AdminKpiCard title="Critical Incidents" value={(stats?.system?.criticalIncidents || 0).toLocaleString()} icon={ShieldAlert} colorClass="bg-red-50 text-red-600" />
        <AdminKpiCard title="High Risk Incidents" value={(stats?.system?.highRiskIncidents || 0).toLocaleString()} icon={AlertCircle} colorClass="bg-orange-50 text-orange-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminKpiCard title="Total Missions" value={(stats?.system?.totalMissions || 0).toLocaleString()} icon={Activity} colorClass="bg-indigo-50 text-indigo-600" />
        <AdminKpiCard title="Total Resources" value={(stats?.system?.totalResources || 0).toLocaleString()} icon={ShieldCheck} colorClass="bg-teal-50 text-teal-600" />
        <AdminKpiCard title="Active Alerts" value={(stats?.system?.activeAlerts || 0).toLocaleString()} icon={AlertCircle} colorClass="bg-red-50 text-red-600" />
        <AdminKpiCard title="Total Alerts" value={(stats?.system?.totalAlerts || 0).toLocaleString()} icon={AlertCircle} colorClass="bg-orange-50 text-orange-600" />
      </div>

      {/* System Health */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2 border-b border-neutral-100 pb-2">
          <Activity className="w-4 h-4 text-blue-500" /> System Health Status
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats?.health ? stats.health.map((h, idx) => (
            <SystemHealthCard key={idx} health={h} />
          )) : (
            <div className="col-span-full p-8 text-center text-neutral-500 border-2 border-dashed border-neutral-200 rounded-xl">
              No system health data available.
            </div>
          )}
        </div>
      </div>

      {/* Operational Map */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
          <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-blue-500" /> Live Operational Map
          </h2>
          <div className="flex gap-2">
            <select 
              className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white"
              onChange={(e) => setMapFilters(prev => ({ ...prev, severity: e.target.value }))}
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select 
              className="text-xs border border-neutral-200 rounded px-2 py-1 bg-white"
              onChange={(e) => setMapFilters(prev => ({ ...prev, riskLevel: e.target.value }))}
            >
              <option value="all">All Risks</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
            <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-1 rounded">
              {filteredIncidents.length} Active Incidents
            </span>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden relative">
          {filteredIncidents.length > 0 ? (
            <LiveIncidentMap incidents={filteredIncidents} />
          ) : (
            <div className="flex flex-col items-center justify-center h-[450px] bg-neutral-50">
              <MapIcon className="w-12 h-12 text-neutral-300 mb-3" />
              <p className="text-sm font-semibold text-neutral-500">No active incidents match filters.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
