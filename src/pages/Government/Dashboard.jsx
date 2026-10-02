import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { RefreshCcw, Bell, Search, Map, List, Eye, ShieldAlert, Users, Layers, Activity } from 'lucide-react';
import KpiCard from '../../components/cards/KpiCard';
import IncidentList from '../../components/ui/IncidentList';
import LiveIncidentMap from '../../components/map/LiveIncidentMap';
import AlertCard from '../../components/cards/AlertCard';
import ResourceProgress from '../../components/ui/ResourceProgress';
import CampCard from '../../components/cards/CampCard';
import WeatherCard from '../../components/cards/WeatherCard';
import ActivityTimeline from '../../components/ui/ActivityTimeline';
import DashboardChart from '../../components/charts/DashboardChart';
import QuickAction from '../../components/buttons/QuickAction';
import StatusBadge from '../../components/ui/StatusBadge';
import { useWeather } from '../../hooks/useWeather';
import { useGovernment } from '../../context/GovernmentContext';

export default function GovernmentDashboard() {
  const { incidents, resources, teams, kpis, emergencyAlerts, camps, activityTimeline, chartData } = useGovernment();
  const { weather, isLoading: isWeatherLoading, error: weatherError } = useWeather();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Disaster Command Center</h1>
            <span className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-green-50 text-green-700 rounded-full border border-green-100">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              System Operational
            </span>
          </div>
          <p className="text-sm text-neutral-500">Real-time overview of incidents, resources and emergency response operations.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block mr-2">
            <p className="text-xs font-bold text-neutral-800">Gov. Authority</p>
            <p className="text-[10px] text-neutral-500 uppercase">CMD-994</p>
          </div>
          <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm border-2 border-white ring-2 ring-neutral-100">
            GA
          </div>
          <button 
            onClick={handleRefresh}
            className={`p-2.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-100 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`}
          >
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="p-2.5 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative border border-transparent hover:border-blue-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
        </div>
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* KPI Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {kpis.map(kpi => (
            <KpiCard key={kpi.id} {...kpi} />
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Map & Incidents Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Live Map */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <Map className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-bold text-neutral-800">Live Incident Map</h2>
                </div>
                <div className="flex gap-2">
                  <select className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-blue-100">
                    <option>All Types</option>
                    <option>Flood</option>
                    <option>Fire</option>
                    <option>Earthquake</option>
                  </select>
                  <button className="text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 hover:bg-neutral-100 transition-colors flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5" />
                    Layers
                  </button>
                </div>
              </div>
              <LiveIncidentMap incidents={incidents} />
            </motion.div>

            {/* Charts Row */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-800 mb-4">Incident Trend (7 Days)</h3>
                <DashboardChart data={chartData.incidentTrend} type="line" dataKey="incidents" />
              </div>
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="text-sm font-bold text-neutral-800 mb-4">Response Status</h3>
                <DashboardChart data={chartData.responseStatus} type="bar" />
              </div>
            </motion.div>

            {/* Active Incidents List */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <List className="w-5 h-5 text-neutral-600" />
                  <h2 className="text-lg font-bold text-neutral-800">Active Incidents</h2>
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                  <input 
                    type="text" 
                    placeholder="Search incidents..." 
                    className="text-xs pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 w-48"
                  />
                </div>
              </div>
              <IncidentList incidents={incidents.slice(0, 5)} />
              <button className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200">
                View All Incidents
              </button>
            </motion.div>

            {/* Rescue Teams Table */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Rescue Team Status</h2>
              {/* Mobile View: Cards */}
              <div className="grid grid-cols-1 gap-3 md:hidden">
                {teams.map((team) => (
                  <div key={team.id} className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-bold text-neutral-800">{team.name}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{team.type}</div>
                      </div>
                      <StatusBadge status={team.status} />
                    </div>
                    <div className="text-sm text-neutral-600 mt-1">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">Location</span>
                      {team.location}
                    </div>
                    <div className="text-sm text-neutral-600">
                      <span className="font-semibold block text-[10px] uppercase tracking-wider text-neutral-400 mb-0.5">Mission</span>
                      {team.mission}
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View: Table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-neutral-50 text-neutral-500 text-xs uppercase tracking-wider">
                      <th className="p-3 font-semibold rounded-tl-lg">Team</th>
                      <th className="p-3 font-semibold">Type</th>
                      <th className="p-3 font-semibold">Location</th>
                      <th className="p-3 font-semibold">Mission</th>
                      <th className="p-3 font-semibold rounded-tr-lg">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {teams.map((team, idx) => (
                      <tr key={team.id} className={idx !== teams.length - 1 ? 'border-b border-neutral-100' : ''}>
                        <td className="p-3 font-bold text-neutral-800">{team.name}</td>
                        <td className="p-3 text-neutral-600">{team.type}</td>
                        <td className="p-3 text-neutral-600">{team.location}</td>
                        <td className="p-3 text-neutral-600 max-w-[150px] truncate">{team.mission}</td>
                        <td className="p-3"><StatusBadge status={team.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Sidebar Column */}
          <div className="space-y-6">
            
            {/* Quick Actions */}
            <motion.div variants={itemVariants} className="grid grid-cols-3 gap-2">
              <QuickAction icon={ShieldAlert} label="Alert" />
              <QuickAction icon={Users} label="Teams" />
              <QuickAction icon={Activity} label="Analytics" />
            </motion.div>

            {/* Alerts Panel */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                <Bell className="w-5 h-5 text-red-500" />
                Emergency Alerts
              </h2>
              <div className="space-y-3">
                {emergencyAlerts.slice(0, 3).map(alert => (
                  <AlertCard key={alert._id || alert.id} alert={alert} />
                ))}
                {emergencyAlerts.length === 0 && <p className="text-sm text-neutral-500">No active alerts.</p>}
              </div>
            </motion.div>

            {/* Weather */}
            <motion.div variants={itemVariants}>
              {isWeatherLoading ? (
                <div className="bg-gradient-to-br from-blue-900 to-blue-950 rounded-2xl p-6 shadow-sm border border-blue-800 text-white min-h-[150px] flex items-center justify-center">
                  <span className="text-blue-300 font-bold animate-pulse">Loading weather data...</span>
                </div>
              ) : weatherError ? (
                <div className="bg-neutral-100 rounded-2xl p-6 shadow-sm border border-neutral-200 text-center text-neutral-500 text-sm font-medium">
                  Weather information is temporarily unavailable.
                </div>
              ) : (
                <WeatherCard weather={weather} />
              )}
            </motion.div>

            {/* Resource Overview */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Resource Availability</h2>
              <div className="space-y-4">
                {resources.map(res => (
                  <div key={res.id}>
                    <p className="text-sm font-semibold text-neutral-700 mb-1">{res.type}</p>
                    <ResourceProgress available={res.available} deployed={res.deployed} total={res.total} />
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Relief Camps */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Relief Camps</h2>
              <div className="space-y-3">
                {camps.slice(0, 3).map(camp => (
                  <CampCard key={camp.id} camp={camp} />
                ))}
              </div>
              <button className="w-full mt-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-blue-200">
                View All Camps
              </button>
            </motion.div>

            {/* Recent Activity */}
            <motion.div variants={itemVariants} className="bg-white p-5 rounded-2xl shadow-sm border border-neutral-100">
              <h2 className="text-lg font-bold text-neutral-800 mb-4">Recent Activity</h2>
              <ActivityTimeline activities={activityTimeline} />
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
