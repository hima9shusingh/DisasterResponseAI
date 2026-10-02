import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { Search, Filter, AlertTriangle, Flame, Clock, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGovernment } from '../../context/GovernmentContext';
import SeverityBadge from '../../components/ui/SeverityBadge';
import StatusBadge from '../../components/ui/StatusBadge';
import { Link } from 'react-router-dom';
import { incidentService } from '../../services/incidentService';
import { useAuth } from '../../context/AuthContext';

export default function IncidentManagement() {
  const { isAuthenticated } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [severityFilter, setSeverityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  const fetchIncidents = async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    try {
      const statusMap = {
        'Pending Verification': 'pending_verification',
        'Verified': 'verified',
        'Resources Assigned': 'resources_assigned',
        'Rescue In Progress': 'rescue_in_progress',
        'Resolved': 'resolved'
      };

      const params = {
        page,
        limit: 10
      };
      
      if (typeFilter !== 'All') params.disasterType = typeFilter.toLowerCase();
      if (severityFilter !== 'All') params.severity = severityFilter.toLowerCase();
      if (statusFilter !== 'All') params.status = statusMap[statusFilter];
      if (searchTerm) params.search = searchTerm;

      const res = await incidentService.getIncidents(params);
      if (res.success) {
        setIncidents(res.data.incidents);
        setTotalPages(res.data.pagination.pages);
        setTotalCount(res.data.pagination.total);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchIncidents();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, typeFilter, severityFilter, statusFilter, page, isAuthenticated]);

  const getSummary = () => {
    // Basic fallback since we don't fetch all.
    // Real implementation would use an analytics API endpoint.
    return { 
      total: totalCount || 0,
      critical: incidents.filter(i => i.severity === 'critical').length,
      pending: incidents.filter(i => i.status === 'pending_verification').length,
      inProgress: incidents.filter(i => i.status === 'rescue_in_progress' || i.status === 'resources_assigned').length,
      resolved: incidents.filter(i => i.status === 'resolved').length
    };
  };
  const summary = getSummary();

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
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Incident Management</h1>
          <p className="text-sm text-neutral-500 mt-1">Monitor, verify and coordinate active disaster incidents.</p>
        </div>
      </div>

      {/* Summary Cards */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total Incidents', value: summary.total, icon: AlertTriangle, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Critical', value: summary.critical, icon: Flame, color: 'text-red-600', bg: 'bg-red-50' },
          { label: 'Pending Verification', value: summary.pending, icon: Clock, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'In Progress', value: summary.inProgress, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Resolved', value: summary.resolved, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' }
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.bg}`}><stat.icon className={`w-5 h-5 ${stat.color}`} /></div>
            <div>
              <p className="text-2xl font-bold text-neutral-800 leading-none">{stat.value}</p>
              <p className="text-[10px] font-semibold uppercase text-neutral-500 mt-1 tracking-wider">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex flex-col lg:flex-row gap-4 items-center">
        <div className="relative w-full lg:w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input 
            type="text" 
            placeholder="Search Incident ID / Location" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
          />
        </div>
        <div className="w-full lg:w-2/3 flex flex-wrap gap-3">
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="flex-1 min-w-[120px] text-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
            <option value="All">All Types</option>
            <option value="Flood">Flood</option>
            <option value="Fire">Fire</option>
            <option value="Earthquake">Earthquake</option>
            <option value="Cyclone">Cyclone</option>
            <option value="Landslide">Landslide</option>
          </select>
          <select value={severityFilter} onChange={e => setSeverityFilter(e.target.value)} className="flex-1 min-w-[120px] text-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
            <option value="All">All Severities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="flex-1 min-w-[120px] text-sm px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none">
            <option value="All">All Statuses</option>
            <option value="Pending Verification">Pending</option>
            <option value="Verified">Verified</option>
            <option value="Resources Assigned">Assigned</option>
            <option value="Rescue In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
          </select>
        </div>
      </div>

      {/* Incident List */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 overflow-hidden">
        
        {/* Mobile View: Cards */}
        <div className="grid grid-cols-1 gap-4 md:hidden p-4 bg-neutral-50">
          {isLoading ? (
            <div className="p-8 text-center bg-white rounded-xl border border-neutral-200">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
              <p className="text-sm text-neutral-500 font-medium">Loading incidents...</p>
            </div>
          ) : incidents.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-neutral-200 text-neutral-500 text-sm font-medium">
              No incidents match your filters.
            </div>
          ) : (
            incidents.map((inc) => (
              <div key={inc._id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <Link to={`/government/incidents/${inc._id}`} className="font-bold text-blue-600 hover:underline">{inc.incidentId}</Link>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{new Date(inc.reportedAt).toLocaleDateString()}</div>
                  </div>
                  <SeverityBadge severity={inc.severity} />
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">Disaster & Location</span>
                  <div className="font-bold text-neutral-800 capitalize">{inc.disasterType?.replace('_', ' ')}</div>
                  <div className="text-sm text-neutral-600 truncate">{inc.location?.address || inc.location?.city}</div>
                </div>

                <div className="flex justify-between items-end mt-2 border-t border-neutral-100 pt-3">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">Status</span>
                    <StatusBadge status={inc.status} />
                  </div>
                  <Link to={`/government/incidents/${inc._id}`} className="text-xs font-bold text-neutral-700 bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg transition-colors">
                    View
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
                <th className="p-4 font-semibold">Incident ID</th>
                <th className="p-4 font-semibold">Disaster & Location</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Reported</th>
                <th className="p-4 font-semibold text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-12 text-center">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                    <p className="text-sm text-neutral-500 font-medium">Loading incidents...</p>
                  </td>
                </tr>
              ) : incidents.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500 text-sm font-medium">No incidents match your filters.</td>
                </tr>
              ) : (
                incidents.map((inc, idx) => (
                  <tr key={inc._id} className={`hover:bg-neutral-50 transition-colors ${idx !== incidents.length - 1 ? 'border-b border-neutral-100' : ''}`}>
                    <td className="p-4">
                      <Link to={`/government/incidents/${inc._id}`} className="font-bold text-blue-600 hover:underline">{inc.incidentId}</Link>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-neutral-800 capitalize">{inc.disasterType?.replace('_', ' ')}</div>
                      <div className="text-xs text-neutral-500 mt-0.5 truncate max-w-[200px]">{inc.location?.address || inc.location?.city}</div>
                    </td>
                    <td className="p-4"><SeverityBadge severity={inc.severity} /></td>
                    <td className="p-4"><StatusBadge status={inc.status} /></td>
                    <td className="p-4 text-right text-xs text-neutral-500">{new Date(inc.reportedAt).toLocaleString()}</td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Link to={`/government/incidents/${inc._id}`} className="text-xs font-semibold text-neutral-600 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-colors">
                          View
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination controls */}
        {!isLoading && totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-neutral-100 bg-neutral-50">
            <p className="text-xs text-neutral-500 font-medium">
              Showing page {page} of {totalPages}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-md border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-md border border-neutral-200 text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
