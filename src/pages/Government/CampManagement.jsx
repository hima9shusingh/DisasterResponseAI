import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, Plus, Tent, Users, AlertCircle, AlertTriangle, CheckCircle2, Map as MapIcon } from 'lucide-react';
import { useGovernment } from '../../context/GovernmentContext';
import CampTable from '../../components/tables/CampTable';
import CampMap from '../../components/map/CampMap';
import AlertCard from '../../components/cards/AlertCard';
import AddCampModal from '../../components/modals/AddCampModal';
import ToastNotification from '../../components/ui/ToastNotification';

export default function CampManagement() {
  const navigate = useNavigate();
  const { camps, campAlerts, addCamp } = useGovernment();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterOccupancy, setFilterOccupancy] = useState('All');

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => setToast({ show: true, msg, type });

  // Filtering
  const filteredCamps = camps.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'All' || c.status === filterStatus;
    
    let matchOcc = true;
    if (filterOccupancy === '50+') matchOcc = c.occupancyPct >= 50;
    if (filterOccupancy === '75+') matchOcc = c.occupancyPct >= 75;
    if (filterOccupancy === '90+') matchOcc = c.occupancyPct >= 90;
    if (filterOccupancy === 'Full') matchOcc = c.occupancyPct >= 100;

    return matchSearch && matchStatus && matchOcc;
  });

  // KPIs
  const totalCamps = camps.length;
  const activeCamps = camps.filter(c => c.status === 'Active' || c.status === 'Near Capacity').length;
  const nearCapacity = camps.filter(c => c.status === 'Near Capacity' || c.occupancyPct >= 85).length;
  const totalBedsAvailable = camps.reduce((acc, curr) => acc + curr.availableBeds, 0);
  const totalPeopleSheltered = camps.reduce((acc, curr) => acc + curr.occupied, 0);
  const criticalAlerts = campAlerts.filter(a => a.severity === 'Critical').length;

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
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Relief Camp Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Monitor shelter capacity and essential supplies across the region.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Establish Relief Camp
        </button>
      </div>

      {/* KPIs */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          { label: 'Total Camps', value: totalCamps, icon: Tent, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Camps', value: activeCamps, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Near Capacity', value: nearCapacity, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Available Beds', value: totalBedsAvailable.toLocaleString(), icon: MapIcon, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'People Sheltered', value: totalPeopleSheltered.toLocaleString(), icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Critical Alerts', value: criticalAlerts, icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex flex-col justify-between">
            <div className={`p-2 rounded-lg w-fit mb-3 ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <div>
              <p className="text-2xl font-bold text-neutral-800 leading-none">{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase text-neutral-500 mt-1.5 tracking-wider leading-tight">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Map & Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col">
          <h2 className="text-lg font-bold text-neutral-800 mb-4">Camp Location Overview</h2>
          <div className="flex-1 min-h-[400px]">
            <CampMap camps={camps} />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 flex flex-col max-h-[500px]">
          <h2 className="text-sm font-bold text-neutral-800 mb-4">Camp Alerts & Needs</h2>
          <div className="space-y-3 overflow-y-auto pr-1">
            {campAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} />
            ))}
            {campAlerts.length === 0 && (
              <p className="text-sm text-neutral-500 text-center py-4">No active alerts.</p>
            )}
          </div>
        </div>
      </div>

      {/* Camp Inventory Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h2 className="text-lg font-bold text-neutral-800">Shelter Network</h2>
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input 
                type="text" 
                placeholder="Search camps..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
              />
            </div>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="w-full md:w-40 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Near Capacity">Near Capacity</option>
              <option value="Full">Full</option>
              <option value="Temporarily Closed">Temporarily Closed</option>
            </select>
            <select value={filterOccupancy} onChange={e => setFilterOccupancy(e.target.value)} className="w-full md:w-40 px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
              <option value="All">Any Occupancy</option>
              <option value="50+">50%+ Occupied</option>
              <option value="75+">75%+ Occupied</option>
              <option value="90+">90%+ Occupied</option>
              <option value="Full">100% Full</option>
            </select>
          </div>
        </div>
        
        <CampTable 
          camps={filteredCamps} 
          onView={(campId) => navigate(`/government/relief-camps/${campId}`)} 
        />
      </div>

      {/* Modals */}
      <AddCampModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSubmit={(data) => {
          addCamp(data);
          showToast(`Successfully established ${data.name}`);
        }} 
      />
    </div>
  );
}
