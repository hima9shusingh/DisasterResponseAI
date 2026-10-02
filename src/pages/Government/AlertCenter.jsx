import React, { useState } from 'react';
import { PlusCircle, BellRing, CheckCircle2, ShieldAlert, Clock } from 'lucide-react';
import { useGovernment } from '../../context/GovernmentContext';
import AlertTable from '../../components/alerts/AlertTable';
import CreateAlertModal from '../../components/modals/CreateAlertModal';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AlertCenter() {
  const { emergencyAlerts, alertKpis, createEmergencyAlert, deleteEmergencyAlert } = useGovernment();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock analytics based on context alerts
  const chartData = [
    { name: 'Flood', count: emergencyAlerts.filter(a => a.type === 'Flood').length },
    { name: 'Weather', count: emergencyAlerts.filter(a => a.type === 'Weather').length },
    { name: 'Cyclone', count: emergencyAlerts.filter(a => a.type === 'Cyclone').length },
    { name: 'Fire', count: emergencyAlerts.filter(a => a.type === 'Fire').length },
  ];

  const handleSaveAlert = (alertData) => {
    createEmergencyAlert(alertData);
    // In a real app, this would also push notifications to citizens
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      deleteEmergencyAlert(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Emergency Alert Center</h1>
          <p className="text-sm text-neutral-500 mt-1">Create and monitor emergency communications.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Create Emergency Alert
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><BellRing className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-neutral-800">{emergencyAlerts.filter(a => a.status === 'Active').length}</p><p className="text-[10px] font-bold uppercase text-neutral-500">Active Alerts</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-100 text-red-600 rounded-lg"><ShieldAlert className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-neutral-800">{emergencyAlerts.filter(a => a.severity === 'Critical').length}</p><p className="text-[10px] font-bold uppercase text-neutral-500">Critical Alerts</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg"><Clock className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-neutral-800">{emergencyAlerts.filter(a => a.status === 'Scheduled').length}</p><p className="text-[10px] font-bold uppercase text-neutral-500">Scheduled</p></div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg"><CheckCircle2 className="w-5 h-5" /></div>
          <div><p className="text-2xl font-bold text-neutral-800">{alertKpis.resolved}</p><p className="text-[10px] font-bold uppercase text-neutral-500">Resolved</p></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Table */}
        <div className="lg:col-span-2 space-y-6">
          <AlertTable alerts={emergencyAlerts} onDelete={handleDelete} />
        </div>

        {/* Analytics */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 h-[350px]">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-6 border-b border-neutral-100 pb-2">Alerts by Type</h2>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#737373' }} />
                <Tooltip cursor={{ fill: '#f5f5f5' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <CreateAlertModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveAlert} />
    </div>
  );
}
