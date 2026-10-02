import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, PlusCircle, FileText, Bell, CheckCircle2, ArrowRight } from 'lucide-react';
import { useCitizen } from '../../context/CitizenContext';
import SafetyStatusCard from '../../components/cards/SafetyStatusCard';
import WeatherSummary from '../../components/cards/WeatherSummary';
import { clsx } from 'clsx';
import { useWeather } from '../../hooks/useWeather';
import { useNotifications } from '../../context/NotificationContext';

export default function CitizenDashboard() {
  const navigate = useNavigate();
  const { profile, reports, safetyStatus } = useCitizen();
  const { unreadCount } = useNotifications();
  const { weather, isLoading: isWeatherLoading, error: weatherError } = useWeather();

  const activeReports = reports.filter(r => r.status !== 'resolved' && r.status !== 'Resolved');
  const activeIncident = activeReports.length > 0 ? activeReports[0] : null;

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'pending_verification': return 'Pending Verification';
      case 'verified': return 'Verified';
      case 'resources_assigned': return 'Resources Assigned';
      case 'rescue_in_progress': return 'Rescue In Progress';
      default: return status;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Welcome back, {profile.name.split(' ')[0]}</h1>
          <p className="text-sm text-neutral-500 mt-1">Stay informed and get help when you need it.</p>
        </div>
        <div className="hidden md:flex gap-3">
          <button 
            onClick={() => navigate('/citizen/sos')}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <ShieldAlert className="w-4 h-4" /> SOS
          </button>
          <button 
            onClick={() => navigate('/report')}
            className="bg-red-50 hover:bg-red-100 text-red-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" /> Report Emergency
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Emergency Status & Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Emergency Status Card */}
          {activeIncident ? (
            <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-2 border-red-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none text-red-500">
                <ShieldAlert className="w-32 h-32" />
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded border border-red-100 mb-2 inline-block">Active Emergency</span>
                    <h2 className="text-xl font-extrabold text-neutral-900 leading-tight capitalize">{activeIncident.disasterType?.replace('_', ' ') || activeIncident.type} - {activeIncident.incidentId || activeIncident.id}</h2>
                  </div>
                  <span className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                    {getStatusDisplay(activeIncident.status)}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Severity</p>
                    <p className="font-bold text-red-600">{activeIncident.severity}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                    <p className="font-bold text-neutral-800 truncate">{activeIncident.location?.address || activeIncident.location}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Assigned Team</p>
                    <p className="font-bold text-neutral-800">{activeIncident.assignedTeam ? activeIncident.assignedTeam.id : 'Pending'}</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => navigate(`/citizen/reports/${activeIncident.id}`)} className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-center">
                    Track Response
                  </button>
                  <button onClick={() => navigate(`/citizen/reports/${activeIncident.id}`)} className="flex-1 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors text-center">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-neutral-100 text-center border-dashed border-2">
              <ShieldAlert className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
              <h2 className="text-lg font-bold text-neutral-800 mb-2">No Active Emergencies</h2>
              <p className="text-sm text-neutral-500 mb-6 max-w-sm mx-auto">You do not have any active emergency reports. If you need immediate assistance, please file a report.</p>
              <button onClick={() => navigate('/report')} className="bg-red-50 hover:bg-red-100 text-red-700 px-6 py-2.5 rounded-xl font-bold text-sm transition-colors inline-flex items-center gap-2">
                <PlusCircle className="w-4 h-4" /> Report an Emergency
              </button>
            </div>
          )}

          {/* Citizen KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
              <FileText className="w-5 h-5 text-blue-500 mb-2" />
              <p className="text-2xl font-bold text-neutral-800">{reports.length}</p>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mt-1">My Reports</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
              <ShieldAlert className="w-5 h-5 text-red-500 mb-2" />
              <p className="text-2xl font-bold text-neutral-800">{activeReports.length}</p>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mt-1">Active Emergencies</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm">
              <CheckCircle2 className="w-5 h-5 text-green-500 mb-2" />
              <p className="text-2xl font-bold text-neutral-800">{reports.filter(r => r.status === 'resolved' || r.status === 'Resolved').length}</p>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mt-1">Resolved</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm cursor-pointer hover:border-blue-200 transition-colors" onClick={() => navigate('/citizen/notifications')}>
              <Bell className="w-5 h-5 text-purple-500 mb-2" />
              <p className="text-2xl font-bold text-neutral-800">{unreadCount}</p>
              <p className="text-[10px] font-bold uppercase text-neutral-500 mt-1">Unread Alerts</p>
            </div>
          </div>
          
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Live Disaster Map', path: '/' },
                { name: 'Nearby Relief Camps', path: '/' }, 
                { name: 'Nearby Hospitals', path: '/' },
                { name: 'Emergency Guide', path: '/' },
              ].map((action, idx) => (
                <button key={idx} onClick={() => navigate(action.path)} className="p-3 text-left bg-neutral-50 hover:bg-blue-50 border border-neutral-100 hover:border-blue-200 rounded-xl transition-colors group">
                  <span className="text-xs font-bold text-neutral-700 group-hover:text-blue-700 leading-tight block">{action.name}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Col - Status & Weather */}
        <div className="space-y-6">
          <SafetyStatusCard safetyStatus={safetyStatus} />
          
          {isWeatherLoading ? (
            <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-sm border border-blue-800 text-white min-h-[150px] flex items-center justify-center">
              <span className="text-blue-300 font-bold animate-pulse">Loading weather data...</span>
            </div>
          ) : weatherError ? (
            <div className="bg-neutral-100 rounded-2xl p-6 shadow-sm border border-neutral-200 text-center text-neutral-500 text-sm font-medium">
              Weather information is temporarily unavailable.
            </div>
          ) : (
            <WeatherSummary weather={weather} />
          )}

          {/* Recent Reports List */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <div className="flex justify-between items-center border-b border-neutral-100 pb-2 mb-4">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider">Recent Reports</h2>
              <button onClick={() => navigate('/citizen/reports')} className="text-xs font-bold text-blue-600 hover:underline">View All</button>
            </div>
            <div className="space-y-3">
              {reports.slice(0, 3).map(report => (
                <div key={report.incidentId || report.id} onClick={() => navigate(`/citizen/reports/${report.incidentId || report.id}`)} className="p-3 bg-neutral-50 rounded-xl border border-neutral-100 cursor-pointer hover:border-blue-200 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-bold text-neutral-800 capitalize">{report.disasterType?.replace('_', ' ') || report.type}</span>
                    <span className={clsx(
                      "text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                      (report.status === 'resolved' || report.status === 'Resolved') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    )}>{getStatusDisplay(report.status)}</span>
                  </div>
                  <p className="text-[10px] text-neutral-500 mb-2 truncate">{report.location?.address || report.location}</p>
                  <p className="text-[10px] font-bold text-blue-600 flex items-center gap-1">Track <ArrowRight className="w-3 h-3" /></p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
