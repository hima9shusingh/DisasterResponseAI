import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2, Activity, Phone, MapPin, Users, Crosshair, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useGovernment } from '../../context/GovernmentContext';
import OccupancyProgress from '../../components/ui/OccupancyProgress';
import SupplyCard from '../../components/cards/SupplyCard';
import NearbyServiceCard from '../../components/cards/NearbyServiceCard';
import ResidentTable from '../../components/tables/ResidentTable';
import EditCampModal from '../../components/modals/EditCampModal';
import DashboardChart from '../../components/charts/DashboardChart';
import ToastNotification from '../../components/ui/ToastNotification';

export default function CampDetails() {
  const { campId } = useParams();
  const navigate = useNavigate();
  const { camps, nearbyServices, campResidents, updateCamp } = useGovernment();

  const camp = camps.find(c => c.id === campId);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: '', type: 'success' });
  const showToast = (msg, type = 'success') => setToast({ show: true, msg, type });

  if (!camp) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-12 h-12 text-neutral-400 mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Relief Camp Not Found</h2>
        <button onClick={() => navigate('/government/relief-camps')} className="mt-4 text-blue-600 font-semibold hover:underline">Return to Camp List</button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Near Capacity': return 'bg-orange-100 text-orange-700';
      case 'Full': return 'bg-red-100 text-red-700';
      case 'Temporarily Closed': return 'bg-neutral-200 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getMedColor = (status) => {
    switch(status) {
      case 'Available': return 'text-green-600 bg-green-50 border-green-200';
      case 'Limited': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-neutral-600 bg-neutral-50 border-neutral-200';
    }
  };

  // Dummy 7-day occupancy trend data for the chart
  const occupancyTrend = [
    { name: 'Day 1', Occupied: Math.floor(camp.capacity * 0.4) },
    { name: 'Day 2', Occupied: Math.floor(camp.capacity * 0.5) },
    { name: 'Day 3', Occupied: Math.floor(camp.capacity * 0.6) },
    { name: 'Day 4', Occupied: Math.floor(camp.capacity * 0.75) },
    { name: 'Day 5', Occupied: Math.floor(camp.capacity * 0.8) },
    { name: 'Day 6', Occupied: Math.floor(camp.capacity * 0.85) },
    { name: 'Today', Occupied: camp.occupied },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      <ToastNotification show={toast.show} message={toast.msg} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <button onClick={() => navigate('/government/relief-camps')} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to Camps
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">{camp.name}</h1>
              <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider", getStatusColor(camp.status))}>
                {camp.status}
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{camp.id} • {camp.address}, {camp.district}</p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 text-sm font-bold rounded-xl transition-colors">Generate Report</button>
            <button onClick={() => setIsEditOpen(true)} className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4" /> Update Status
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Capacity Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full space-y-4">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">Camp Capacity</h2>
              <OccupancyProgress occupancyPct={camp.occupancyPct} occupied={camp.occupied} capacity={camp.capacity} />
              
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Available Beds</p>
                  <p className="text-2xl font-extrabold text-blue-600">{camp.availableBeds}</p>
                </div>
                <div className="bg-neutral-50 rounded-xl p-3 border border-neutral-100">
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">People Sheltered</p>
                  <p className="text-2xl font-extrabold text-neutral-800">{camp.occupied}</p>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2 h-40">
               <DashboardChart data={occupancyTrend} type="bar" dataKey="Occupied" />
            </div>
          </div>

          {/* Essential Supplies */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Essential Supplies Inventory</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SupplyCard type="Food" inventory={camp.inventory.food} />
              <SupplyCard type="Water" inventory={camp.inventory.water} />
              <SupplyCard type="Medicine" inventory={camp.inventory.medicine} />
              <SupplyCard type="Blankets" inventory={camp.inventory.blankets} />
            </div>
          </div>

          {/* People Sheltered List */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
             <div className="p-5 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">People Sheltered Directory</h2>
              <button className="text-xs font-bold text-blue-600 hover:underline">View Full Roster</button>
             </div>
             <ResidentTable residents={campResidents} />
          </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          
          {/* Admin Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-4">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2">Command Contacts</h2>
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-700">
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500"><Users className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider leading-tight">Camp Director</p>
                <p>{camp.contactPerson}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm font-semibold text-neutral-700">
              <div className="p-2 bg-neutral-100 rounded-lg text-neutral-500"><Phone className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] text-neutral-400 uppercase tracking-wider leading-tight">Emergency Line</p>
                <p className="text-blue-600">{camp.contactNumber}</p>
              </div>
            </div>
          </div>

          {/* Medical Support */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <div className="flex justify-between items-center mb-4 border-b border-neutral-100 pb-2">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Medical Support</h2>
              <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border", getMedColor(camp.medicalSupport.status))}>
                {camp.medicalSupport.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-semibold flex items-center gap-2"><Activity className="w-4 h-4 text-neutral-400" /> Doctors on Call</span>
                <span className="font-bold text-neutral-800">{camp.medicalSupport.doctors}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-semibold flex items-center gap-2"><Users className="w-4 h-4 text-neutral-400" /> Nursing Staff</span>
                <span className="font-bold text-neutral-800">{camp.medicalSupport.nurses}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-neutral-500 font-semibold flex items-center gap-2"><Crosshair className="w-4 h-4 text-neutral-400" /> Medical Volunteers</span>
                <span className="font-bold text-neutral-800">{camp.medicalSupport.volunteers}</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-neutral-100">
                <span className="text-neutral-800 font-bold">Medical Beds</span>
                <span className="font-bold text-blue-600">{camp.medicalSupport.beds}</span>
              </div>
            </div>
            <button className="w-full py-2 bg-neutral-100 text-neutral-600 text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors">Request Medical Units</button>
          </div>

          {/* Nearby Services */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Nearby Emergency Services</h2>
            <div className="flex flex-col gap-3">
              {nearbyServices.map(service => (
                <NearbyServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>

        </div>
      </div>

      <EditCampModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        camp={camp} 
        onSubmit={(id, data) => {
          updateCamp(id, data);
          showToast('Camp capacity and status updated successfully.');
        }} 
      />
    </div>
  );
}
