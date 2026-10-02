import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import AdminAnalyticsChart from '../../components/admin/AdminAnalyticsChart';
import ResourceUtilizationChart from '../../components/analytics/ResourceUtilizationChart';
import { Users, AlertTriangle, Activity, Server, Map, HeartHandshake, Loader2 } from 'lucide-react';
import ErrorState from '../../components/ui/ErrorState';

export default function AdminAnalytics() {
  const [dateRange, setDateRange] = useState('30d');
  
  const [data, setData] = useState({
    dashboard: null,
    incidentTrend: [],
    regional: [],
    resourceUtilization: [],
    missionPerformance: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      try {
        const [dashboardRes, trendRes, regionalRes, resourceRes, missionRes] = await Promise.all([
          analyticsService.getDashboardAnalytics(),
          analyticsService.getIncidentTrend(dateRange),
          analyticsService.getRegionalAnalytics(),
          analyticsService.getResourceUtilization(),
          analyticsService.getMissionPerformance()
        ]);
        
        setData({
          dashboard: dashboardRes.data || dashboardRes,
          incidentTrend: trendRes.data || trendRes,
          regional: regionalRes.data || regionalRes,
          resourceUtilization: resourceRes.data || resourceRes,
          missionPerformance: missionRes.data || missionRes
        });
        setError(null);
      } catch (err) {
        console.error(err);
        setError('Unable to load analytics.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [dateRange]);

  if (isLoading && !data.dashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading Analytics...</h2>
      </div>
    );
  }

  if (error && !data.dashboard) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  // The backend API returns dashboard object with incidents, sosRequests, etc.
  const incidentsData = data.dashboard?.incidents || {};
  const incidentsByTypeData = incidentsData.incidentsByType || [];
  const regionalActivityData = data.regional?.length ? data.regional : [];
  const resourceData = Array.isArray(data.resourceUtilization) ? data.resourceUtilization : (data.resourceUtilization?.stats || []);
  const sosData = data.dashboard?.sosRequests || {};

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-neutral-500 mt-1 font-semibold">Visualize system growth and incident trends.</p>
        </div>
        <select value={dateRange} onChange={e => setDateRange(e.target.value)} className="px-4 py-2 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none shadow-sm">
          <option value="7d">7 Days</option>
          <option value="30d">30 Days</option>
          <option value="90d">90 Days</option>
          <option value="1y">1 Year</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Incident Trend (Used as User Growth/Trend proxy if userGrowth doesn't exist) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Users className="w-4 h-4 text-blue-500" /> Incident Trend</h2>
          </div>
          {data.incidentTrend.length > 0 ? (
            <AdminAnalyticsChart 
              data={data.incidentTrend.map(d => ({ name: d.date || d._id, count: d.count }))} 
              type="area" 
              dataKey1="count" 
              color1="#3b82f6" 
              label1="Incidents" 
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-xl">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Incidents by Type</h2>
          </div>
          {incidentsByTypeData.length > 0 ? (
            <AdminAnalyticsChart 
              data={incidentsByTypeData} 
              type="bar" 
              dataKey1="count" 
              color1="#f97316" 
              label1="Incidents Reported" 
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-xl">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Map className="w-4 h-4 text-purple-500" /> Regional Activity</h2>
          </div>
          {regionalActivityData.length > 0 ? (
            <AdminAnalyticsChart 
              data={regionalActivityData.map(r => ({ name: r._id || r.region, count: r.count || r.totalIncidents }))} 
              type="bar" 
              dataKey1="count" 
              color1="#8b5cf6" 
              label1="Active Operations" 
            />
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-xl">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-blue-500" /> Resource Utilization</h2>
          </div>
          <div className="w-full h-72">
            {resourceData.length > 0 ? (
              <ResourceUtilizationChart data={resourceData} />
            ) : (
              <div className="h-full flex items-center justify-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-xl">No data available</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><HeartHandshake className="w-4 h-4 text-green-500" /> Mission Performance</h2>
          </div>
          {data.missionPerformance ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                 <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Completed Missions</p>
                 <p className="text-2xl font-black text-green-700">{data.missionPerformance.completedMissions || 0}</p>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                 <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">People Rescued</p>
                 <p className="text-2xl font-black text-blue-700">{data.missionPerformance.peopleRescued || 0}</p>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                 <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">Total Missions</p>
                 <p className="text-2xl font-black text-orange-700">{data.missionPerformance.totalMissions || 0}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-xl border border-purple-100">
                 <p className="text-xs font-bold text-purple-600 uppercase tracking-wider">Completion Rate</p>
                 <p className="text-2xl font-black text-purple-700">
                   {data.missionPerformance.totalMissions > 0 
                     ? Math.round((data.missionPerformance.completedMissions / data.missionPerformance.totalMissions) * 100) 
                     : 0}%
                 </p>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-400 font-medium border-2 border-dashed border-neutral-100 rounded-xl">No data available</div>
          )}
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-red-500" /> Emergency SOS</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Active SOS</p>
                <p className="text-2xl font-black text-red-700">{sosData.activeSOS || 0}</p>
            </div>
            <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200">
                <p className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Total SOS</p>
                <p className="text-2xl font-black text-neutral-700">{sosData.totalSOS || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Resolved SOS</p>
                <p className="text-2xl font-black text-green-700">{sosData.resolvedSOS || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">False Alarms</p>
                <p className="text-2xl font-black text-yellow-700">{sosData.falseAlarms || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-orange-500" /> Incident Severity & Risk</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                <p className="text-xs font-bold text-red-600 uppercase tracking-wider">Critical Severity</p>
                <p className="text-2xl font-black text-red-700">{incidentsData.criticalIncidents || 0}</p>
            </div>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                <p className="text-xs font-bold text-orange-600 uppercase tracking-wider">High Severity</p>
                <p className="text-2xl font-black text-orange-700">{incidentsData.highSeverityIncidents || 0}</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <p className="text-xs font-bold text-yellow-600 uppercase tracking-wider">Medium Severity</p>
                <p className="text-2xl font-black text-yellow-700">{incidentsData.mediumSeverityIncidents || 0}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-xl border border-green-100">
                <p className="text-xs font-bold text-green-600 uppercase tracking-wider">Low Severity</p>
                <p className="text-2xl font-black text-green-700">{incidentsData.lowSeverityIncidents || 0}</p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
