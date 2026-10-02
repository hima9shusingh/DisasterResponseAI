import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, Plus, Package, Truck, ShieldAlert, Activity, Crosshair } from 'lucide-react';
import { useGovernment } from '../../context/GovernmentContext';
import ResourceTable from '../../components/tables/ResourceTable';
import TeamCard from '../../components/cards/TeamCard';
import ResourceMap from '../../components/map/ResourceMap';
import DashboardChart from '../../components/charts/DashboardChart';
import AlertCard from '../../components/cards/AlertCard';
import AddResourceModal from '../../components/modals/AddResourceModal';
import ResourceDetailsModal from '../../components/modals/ResourceDetailsModal';
import TeamDetailsModal from '../../components/modals/TeamDetailsModal';
import ToastNotification from '../../components/ui/ToastNotification';
import { resourceService } from '../../services/resourceService';
import { rescueTeamService } from '../../services/rescueTeamService';
import { useAuth } from '../../context/AuthContext';

export default function ResourceManagement() {
  const { 
    resourceAlerts, 
    utilizationData,
    addResource,
    updateResourceStatus,
    updateTeamStatus,
    assignTeam
  } = useGovernment();

  const { isAuthenticated } = useAuth();
  const [resources, setResources] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);

  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => setToast({ show: true, msg, type });

  const fetchResourcesAndTeams = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const resParams = { limit: 50 };
      if (filterType !== 'All') resParams.type = filterType;
      if (filterStatus !== 'All') resParams.status = filterStatus.toLowerCase();
      if (searchTerm) resParams.search = searchTerm;

      const [resRes, teamRes] = await Promise.all([
        resourceService.getResources(resParams),
        rescueTeamService.getRescueTeams({ limit: 50 })
      ]);

      if (resRes.success) setResources(resRes.data.resources || []);
      if (teamRes.success) setTeams(teamRes.data.teams || []);
    } catch (err) {
      console.error(err);
      showToast('Failed to load resources', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResourcesAndTeams();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterType, filterStatus, isAuthenticated]);

  // KPIs
  const totalRes = resources.reduce((acc, curr) => acc + curr.totalUnits, 0);
  const totalAvail = resources.reduce((acc, curr) => acc + curr.availableUnits, 0);
  const totalDep = resources.reduce((acc, curr) => acc + curr.deployedUnits, 0);
  const teamsOnMission = teams.filter(t => t.status === 'assigned').length;
  const inMaintenance = resources.filter(r => r.status === 'maintenance').length;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <ToastNotification show={toast.show} message={toast.msg} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Resource Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Monitor, deploy and coordinate emergency response resources.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {/* KPIs */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Resources', value: totalRes, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Available Units', value: totalAvail, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Currently Deployed', value: totalDep, icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Teams On Mission', value: teamsOnMission, icon: Crosshair, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Under Maintenance', value: inMaintenance, icon: ShieldAlert, color: 'text-neutral-600', bg: 'bg-neutral-100' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <div>
              <p className="text-2xl font-bold text-neutral-800 leading-none">{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase text-neutral-500 mt-1 tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Map & Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col">
          <h2 className="text-lg font-bold text-neutral-800 mb-4">Location Overview</h2>
          <div className="flex-1 min-h-[400px]">
            <ResourceMap teams={teams} />
          </div>
        </div>
        <div className="space-y-6 flex flex-col">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex-1">
            <h2 className="text-sm font-bold text-neutral-800 mb-4">Resource Alerts</h2>
            <div className="space-y-3">
              {resourceAlerts.map(alert => (
                <AlertCard key={alert.id} alert={alert} />
              ))}
            </div>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex-1">
            <h2 className="text-sm font-bold text-neutral-800 mb-4">Deployment by Type</h2>
            <DashboardChart data={utilizationData.deploymentByType} type="bar" dataKey="deployed" />
          </div>
        </div>
      </div>

      {/* Resource Inventory */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-neutral-800">Resource Inventory</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full md:w-40 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
              <option value="All">All Types</option>
              <option value="Ambulance">Ambulance</option>
              <option value="Fire Brigade">Fire Brigade</option>
              <option value="Medical Team">Medical Team</option>
              <option value="Rescue Boat">Rescue Boat</option>
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full md:w-40 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
              <option value="All">All Statuses</option>
              <option value="Available">Available</option>
              <option value="Deployed">Deployed</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        </div>
        <ResourceTable 
          resources={resources} 
          isLoading={isLoading}
          onView={(res) => setSelectedResource(res)} 
        />
      </div>

      {/* Rescue Teams */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-neutral-800">Rescue Teams & Task Forces</h2>
          <button className="text-sm font-semibold text-blue-600 hover:underline">View All Teams</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {teams.map(team => (
            <TeamCard 
              key={team._id || team.id} 
              team={team} 
              onClick={(t) => setSelectedTeam(t)} 
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddResourceModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={(data) => {
          addResource(data);
          showToast(`Successfully added ${data.type} to inventory`);
        }} 
      />
      
      <ResourceDetailsModal 
        isOpen={!!selectedResource} 
        onClose={() => setSelectedResource(null)} 
        resource={selectedResource} 
        onUpdateStatus={(id, status) => {
          updateResourceStatus(id, status);
          showToast(`Status updated to ${status}`);
        }}
      />
      
      <TeamDetailsModal 
        isOpen={!!selectedTeam} 
        onClose={() => setSelectedTeam(null)} 
        team={selectedTeam} 
        onAssign={(teamId, incId, payload) => {
          assignTeam(teamId, incId, payload);
          showToast(`Team assigned to ${incId}`);
        }}
        onUpdateStatus={(id, status) => {
          updateTeamStatus(id, status);
          showToast(`Team status updated to ${status}`);
        }}
      />
    </div>
  );
}
