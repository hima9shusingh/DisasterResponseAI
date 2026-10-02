import React, { useState, useEffect } from 'react';
import AnalyticsFilterBar from '../../components/analytics/AnalyticsFilterBar';
import AnalyticsKpiCard from '../../components/analytics/AnalyticsKpiCard';
import ChartCard from '../../components/analytics/ChartCard';
import DisasterDistributionChart from '../../components/analytics/DisasterDistributionChart';
import ResourceUtilizationChart from '../../components/analytics/ResourceUtilizationChart';
import ResponseTimeChart from '../../components/analytics/ResponseTimeChart';
import RegionalAnalyticsTable from '../../components/analytics/RegionalAnalyticsTable';
import AdminAnalyticsChart from '../../components/admin/AdminAnalyticsChart';
import { analyticsService } from '../../services/analyticsService';
import { AlertTriangle, TrendingUp, Clock, Activity, Map, PieChart, ShieldAlert, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ErrorState from '../../components/ui/ErrorState';

export default function GovernmentAnalytics() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('30d');
  
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
          analyticsService.getIncidentTrend(period),
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
  }, [period]);

  if (isLoading && !data.dashboard) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading Response Analytics...</h2>
      </div>
    );
  }

  if (error && !data.dashboard) {
    return <ErrorState message={error} onRetry={() => window.location.reload()} />;
  }

  // Fallbacks for data structures
  const dashboard = data.dashboard || {};
  const incidents = dashboard.incidents || {};
  const missions = dashboard.missions || {};
  const sosData = dashboard.sosRequests || {};
  
  const totalIncidents = incidents.totalIncidents || 0;
  const resolvedIncidents = incidents.resolvedIncidents || 0;
  
  const trendData = data.incidentTrend.length > 0 
    ? data.incidentTrend.map(d => ({ date: d.date || d._id, reported: d.count })) 
    : [];

  const PIE_COLORS = ['#3b82f6', '#f97316', '#ef4444', '#10b981', '#8b5cf6'];
  const disasterDistData = incidents.incidentsByType?.length > 0
    ? incidents.incidentsByType.map((d, idx) => ({ name: d.name, value: d.count, color: PIE_COLORS[idx % PIE_COLORS.length] }))
    : [];

  const regionalData = data.regional?.length > 0 
    ? data.regional.map(r => ({ region: r._id || r.region || r.city || 'Unknown', incidents: r.count || r.totalIncidents || r.incidents, riskLevel: 'N/A' })) 
    : [];

  const resourceData = Array.isArray(data.resourceUtilization) 
    ? data.resourceUtilization 
    : (data.resourceUtilization?.stats || []);

  const responseTimeData = dashboard.responseTime 
    ? [
        { name: 'Verification', avgTime: dashboard.responseTime.averageVerificationTimeMinutes },
        { name: 'Resolution', avgTime: dashboard.responseTime.averageResolutionTimeHours * 60 },
        { name: 'Mission Start', avgTime: dashboard.responseTime.averageMissionStartTimeMinutes }
      ] 
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Response Analytics</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Analyze incidents, response operations, resources and relief activities.</p>
      </div>

      <AnalyticsFilterBar onFilterChange={(filters) => {
        if (filters.period) setPeriod(filters.period);
      }} />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AnalyticsKpiCard label="Total Incidents" value={totalIncidents.toLocaleString()} trend="neutral" comparison="From database" />
        <AnalyticsKpiCard label="Resolved" value={resolvedIncidents.toLocaleString()} trend="neutral" comparison="Resolved Incidents" />
        <AnalyticsKpiCard label="Critical Incidents" value={(incidents.criticalIncidents || 0).toLocaleString()} trend="neutral" comparison="High Severity" />
        <AnalyticsKpiCard label="People Rescued" value={(dashboard.peopleRescued || data.missionPerformance?.peopleRescued || 0).toLocaleString()} trend="neutral" comparison="Reported rescued" />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Incident Trends" subtitle={`Reported vs Verified vs Resolved over the selected period.`} icon={TrendingUp}>
            {trendData.length > 0 ? (
              <AdminAnalyticsChart data={trendData} type="area" dataKey1="reported" color1="#3b82f6" label1="Reported Incidents" />
            ) : (
               <div className="h-64 flex items-center justify-center text-neutral-400 font-medium">No data available</div>
            )}
          </ChartCard>
        </div>
        <div className="lg:col-span-1">
          <ChartCard title="Disaster Distribution" subtitle="Breakdown by incident category." icon={PieChart}>
            {disasterDistData.length > 0 ? (
              <DisasterDistributionChart data={disasterDistData} />
            ) : (
               <div className="h-64 flex items-center justify-center text-neutral-400 font-medium">No data available</div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* Secondary Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Response Time Analytics" subtitle="Average time to first response across all active agencies." icon={Clock}>
          {responseTimeData.length > 0 ? (
            <ResponseTimeChart data={responseTimeData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-400 font-medium">No data available</div>
          )}
        </ChartCard>

        <ChartCard title="Resource Utilization" subtitle="Availability and deployment status of emergency assets." icon={Activity}>
          {resourceData.length > 0 ? (
            <ResourceUtilizationChart data={resourceData} />
          ) : (
             <div className="h-64 flex items-center justify-center text-neutral-400 font-medium">No data available</div>
          )}
        </ChartCard>
      </div>

      {/* Regional Data & Risk Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Regional Analytics" subtitle="Comparative analysis across administrative zones." icon={Map}>
            {regionalData.length > 0 ? (
              <RegionalAnalyticsTable data={regionalData} />
            ) : (
              <div className="p-8 text-center text-neutral-500">No regional data available.</div>
            )}
          </ChartCard>
        </div>
        
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-500" /> Mission Performance
            </h2>
            <div className="space-y-4">
               {data.missionPerformance ? (
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">Total Missions</p>
                      <p className="text-xl font-black text-neutral-900">{data.missionPerformance.totalMissions || 0}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">Completed</p>
                      <p className="text-xl font-black text-green-600">{data.missionPerformance.completedMissions || 0}</p>
                    </div>
                    <div className="p-3 bg-neutral-50 rounded-xl col-span-2">
                      <p className="text-[10px] font-bold text-neutral-400 uppercase">Avg Duration</p>
                      <p className="text-sm font-black text-neutral-700">{data.missionPerformance.averageMissionDuration || 'N/A'}</p>
                    </div>
                 </div>
               ) : (
                 <div className="text-center text-neutral-400 text-sm">No data available</div>
               )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
