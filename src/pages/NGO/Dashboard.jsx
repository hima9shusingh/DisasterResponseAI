import React from 'react';
import { useNGO } from '../../context/NGOContext';
import { Activity, Package, Droplet, Pill, Users, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

export default function NGODashboard() {
  const { profile, stats, camps, requests, isInitializing } = useNGO();
  const navigate = useNavigate();

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading NGO dashboard...</p>
      </div>
    );
  }

  const getStockCount = (category) => camps.reduce((acc, camp) => acc + (camp.inventory?.[category] || 0), 0);
  
  // Calculate low stock items across all managed camps
  const lowStockItems = [];
  camps.forEach(camp => {
    Object.entries(camp.inventory || {}).forEach(([item, quantity]) => {
      if (quantity < 50) { // Arbitrary threshold for critical/low
        lowStockItems.push({
          id: `${camp._id}-${item}`,
          item: item.charAt(0).toUpperCase() + item.slice(1),
          camp: camp.name,
          status: quantity < 20 ? 'Critical' : 'Low',
          quantity
        });
      }
    });
  });

  const pendingRequests = stats.pendingSupplyRequests || 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Welcome, {profile.name?.split(' ')[0] || profile.organizationName?.split(' ')[0]}</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">Coordinate relief supplies, camps and volunteer support.</p>
        </div>
        <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-sm font-bold flex items-center gap-2 border border-green-200">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Operations Active
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600"><Activity className="w-6 h-6" /></div>
          <div><p className="text-2xl font-extrabold text-neutral-800">{stats.activeCamps || 0}</p><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Active Camps</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-50 text-orange-600"><Package className="w-6 h-6" /></div>
          <div><p className="text-2xl font-extrabold text-neutral-800">{getStockCount('food').toLocaleString()}</p><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Food Stock (kg)</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-cyan-50 text-cyan-600"><Droplet className="w-6 h-6" /></div>
          <div><p className="text-2xl font-extrabold text-neutral-800">{getStockCount('water').toLocaleString()}</p><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Water Stock (L)</p></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-50 text-red-600"><Pill className="w-6 h-6" /></div>
          <div><p className="text-2xl font-extrabold text-neutral-800">{getStockCount('medicine').toLocaleString()}</p><p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Medicine Stock</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Current Relief Operations</h2>
              <button onClick={() => navigate('/ngo/camps')} className="text-sm font-bold text-blue-600 hover:underline">View All</button>
            </div>
            
            <div className="space-y-4">
              {camps.slice(0, 3).map(camp => (
                <div key={camp._id} className="p-4 rounded-xl border border-neutral-100 hover:bg-neutral-50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">{camp.campId?.split('-')[1] || 'C'}</div>
                    <div>
                      <h4 className="font-bold text-neutral-900">{camp.name}</h4>
                      <p className="text-xs font-semibold text-neutral-500 flex items-center gap-2">{camp.campId} • <Users className="w-3.5 h-3.5" /> {camp.occupied} Supported</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-lg capitalize">{camp.status?.replace('_', ' ')}</span>
                    <button onClick={() => navigate('/ngo/camps')} className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><ArrowRight className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
              {camps.length === 0 && (
                <p className="text-sm font-semibold text-neutral-500">No active camps managed.</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Alerts */}
        <div className="space-y-6">
          
          <div className="bg-orange-50 rounded-2xl border border-orange-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-orange-900 uppercase tracking-wider mb-4">Low Stock Alerts</h2>
            {lowStockItems.length > 0 ? (
              <div className="space-y-3">
                {lowStockItems.slice(0, 3).map(item => (
                  <div key={item.id} className="bg-white p-3 rounded-xl shadow-sm border border-orange-100 flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-800">{item.item}</h4>
                      <p className="text-xs font-semibold text-neutral-500">{item.camp}</p>
                    </div>
                    <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider", item.status === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700')}>
                      {item.status} ({item.quantity})
                    </span>
                  </div>
                ))}
                <button onClick={() => navigate('/ngo/camps')} className="w-full mt-2 text-sm font-bold text-orange-700 hover:underline text-center">Manage Inventory</button>
              </div>
            ) : (
              <p className="text-sm font-semibold text-orange-700">Inventory levels are stable.</p>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Pending Requests</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-extrabold text-neutral-900">{pendingRequests}</p>
                <p className="text-xs font-semibold text-neutral-500">Require Approval</p>
              </div>
              <button onClick={() => navigate('/ngo/requests')} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-colors">Review</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
