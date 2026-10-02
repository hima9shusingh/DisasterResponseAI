import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';
import { clsx } from 'clsx';
import { useGovernment } from '../../context/GovernmentContext';

export default function AlertDetails() {
  const { alertId } = useParams();
  const navigate = useNavigate();
  const { emergencyAlerts, updateEmergencyAlert, deleteEmergencyAlert } = useGovernment();

  const alert = emergencyAlerts.find(a => a._id === alertId || a.id === alertId);

  if (!alert) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <ShieldAlert className="w-12 h-12 text-neutral-400 mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Alert Not Found</h2>
        <button onClick={() => navigate('/government/alerts')} className="mt-4 text-blue-600 font-semibold hover:underline">Return to Alert Center</button>
      </div>
    );
  }

  const handleStatusChange = (newStatus) => {
    if (window.confirm(`Change alert status to ${newStatus}?`)) {
      updateEmergencyAlert(alert._id || alert.id, { status: newStatus.toLowerCase() });
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this alert permanently?')) {
      deleteEmergencyAlert(alert._id || alert.id);
      navigate('/government/alerts');
    }
  };

  const displayId = alert.alertId || alert.id;
  const displayType = (alert.type || '').replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  const displaySeverity = (alert.severity || '').charAt(0).toUpperCase() + (alert.severity || '').slice(1);
  const displayStatus = (alert.status || '').charAt(0).toUpperCase() + (alert.status || '').slice(1);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <button onClick={() => navigate('/government/alerts')} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-blue-600 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Alert Center
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={clsx(
                "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                displaySeverity === 'Critical' ? 'bg-red-100 text-red-700' :
                displaySeverity === 'Warning' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'
              )}>{displaySeverity}</span>
              <span className="px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-100">{displayType}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight mb-2">{alert.title}</h1>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{displayId}</p>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
            {displayStatus === 'Active' && <button onClick={() => handleStatusChange('Resolved')} className="px-6 py-2.5 bg-green-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-green-700 flex justify-center items-center gap-2"><CheckCircle2 className="w-4 h-4" /> Mark Resolved</button>}
            {(displayStatus === 'Draft' || displayStatus === 'Scheduled') ? <button onClick={() => handleStatusChange('Active')} className="px-6 py-2.5 bg-red-600 text-white rounded-xl font-bold text-sm shadow-sm hover:bg-red-700">Publish Now</button> : null}
            <button onClick={handleDelete} className="px-6 py-2.5 bg-neutral-100 text-red-600 rounded-xl font-bold text-sm hover:bg-red-50">Delete Alert</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Description</h2>
            <p className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">{alert.description}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 border-b border-neutral-100 pb-2">Emergency Instructions</h2>
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
              <p className="text-sm font-semibold text-orange-900 leading-relaxed whitespace-pre-line">{alert.instructions}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6 space-y-5">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><MapPin className="w-3.5 h-3.5" /> Target Region</p>
              <p className="text-sm font-semibold text-neutral-800">{alert.location}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5" /> Current Status</p>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-wider">{alert.status}</p>
            </div>
            <div className="pt-4 border-t border-neutral-100 space-y-3">
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Issued At</p>
                <p className="text-xs font-semibold text-neutral-700">{new Date(alert.issuedTime).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Valid From</p>
                <p className="text-xs font-semibold text-neutral-700">{alert.startTime ? new Date(alert.startTime).toLocaleString() : 'Immediate'}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Valid Until</p>
                <p className="text-xs font-semibold text-neutral-700">{alert.endTime ? new Date(alert.endTime).toLocaleString() : 'Until further notice'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
