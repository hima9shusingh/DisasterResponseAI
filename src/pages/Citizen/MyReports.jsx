import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { clsx } from 'clsx';
import { useCitizen } from '../../context/CitizenContext';

export default function MyReports() {
  const navigate = useNavigate();
  const { reports } = useCitizen();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  
  const filteredReports = reports.filter(r => {
    const matchSearch = r.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.type.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        r.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'resolved': return { label: 'Resolved', color: 'bg-green-100 text-green-700' };
      case 'pending_verification': return { label: 'Pending Verification', color: 'bg-neutral-100 text-neutral-700' };
      case 'verified': return { label: 'Verified', color: 'bg-blue-100 text-blue-700' };
      case 'resources_assigned': return { label: 'Resources Assigned', color: 'bg-purple-100 text-purple-700' };
      case 'rescue_in_progress': return { label: 'Rescue In Progress', color: 'bg-orange-100 text-orange-700' };
      default: return { label: status, color: 'bg-neutral-100 text-neutral-700' };
    }
  };

  const getSeverityColor = (severity) => {
    if (severity === 'critical') return 'text-red-600';
    if (severity === 'high') return 'text-orange-600';
    if (severity === 'medium') return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
        <div>
          <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">My Emergency Reports</h1>
          <p className="text-sm text-neutral-500 mt-1">Track the status of all emergencies you have reported.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="p-5 border-b border-neutral-100 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search by ID, type, or location..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="px-3 py-2 text-sm bg-neutral-50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-100 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="verified">Verified</option>
              <option value="resources_assigned">Resources Assigned</option>
              <option value="rescue_in_progress">Rescue In Progress</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
                <th className="p-4 font-semibold">Incident Details</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Severity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Assigned Team</th>
                <th className="p-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {filteredReports.map((report, idx) => (
                <tr key={report.id} className={clsx("hover:bg-neutral-50 transition-colors", idx !== filteredReports.length - 1 && "border-b border-neutral-100")}>
                  <td className="p-4">
                    <div className="font-bold text-neutral-800 capitalize">{report.disasterType?.replace('_', ' ') || report.type}</div>
                    <div className="text-xs text-neutral-500 mt-0.5">{report.incidentId || report.id}</div>
                    <div className="text-[10px] text-neutral-400 mt-0.5">{new Date(report.reportedAt).toLocaleString()}</div>
                  </td>
                  <td className="p-4">
                    <div className="text-neutral-800 text-sm max-w-[200px] truncate">{report.location?.address || report.location}</div>
                  </td>
                  <td className="p-4">
                    <span className={clsx("font-bold text-xs", getSeverityColor(report.severity))}>{report.severity}</span>
                  </td>
                  <td className="p-4">
                    <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider", getStatusDisplay(report.status).color)}>
                      {getStatusDisplay(report.status).label}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-neutral-800 text-sm font-semibold">{report.assignedTeam ? report.assignedTeam.id : '-'}</div>
                  </td>
                  <td className="p-4 text-right">
                    <button onClick={() => navigate(`/citizen/reports/${report.id}`)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-end w-full gap-1.5 text-xs font-semibold">
                      <Eye className="w-4 h-4" /> Track
                    </button>
                  </td>
                </tr>
              ))}
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-neutral-500 text-sm">No reports match your filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
