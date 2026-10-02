import React, { useState } from 'react';
import { useNGO } from '../../context/NGOContext';
import { clsx } from 'clsx';
import { MapPin, Loader2, Check, X } from 'lucide-react';

export default function NGOVolunteers() {
  const { camps, volunteers, assignVolunteerToCamp, removeVolunteerAssignment, isInitializing } = useNGO();
  const [assigningVol, setAssigningVol] = useState(null);
  const [selectedCamp, setSelectedCamp] = useState('');

  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-neutral-500 font-semibold">Loading volunteers...</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'assigned': return 'bg-blue-100 text-blue-700';
      case 'on_task': return 'bg-orange-100 text-orange-700';
      case 'unavailable': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getAssignedCamp = (volId) => {
    return camps.find(c => c.assignedVolunteers?.some(v => v === volId || v._id === volId));
  };

  const handleConfirmAssign = async (volId) => {
    if (!selectedCamp) return;
    try {
      await assignVolunteerToCamp(selectedCamp, volId);
      setAssigningVol(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign volunteer');
    }
  };

  const handleRemove = async (campId, volId) => {
    if (!campId) return;
    try {
      await removeVolunteerAssignment(campId, volId);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to remove volunteer');
    }
  };



  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Volunteer Coordination</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Manage and dispatch registered NGO volunteers.</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
                <th className="p-4 font-semibold">Volunteer</th>
                <th className="p-4 font-semibold">Skills</th>
                <th className="p-4 font-semibold">Assigned Camp & Task</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-neutral-100">
              {volunteers.map((vol) => {
                const assignedCamp = getAssignedCamp(vol._id);
                const isAssigned = !!assignedCamp;
                const status = isAssigned ? 'assigned' : (vol.availability || 'available');

                return (
                <tr key={vol._id} className="hover:bg-neutral-50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-neutral-900">{vol.name}</div>
                    <div className="text-xs font-semibold text-neutral-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {vol.location?.city || vol.location?.address || 'Unknown'}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {vol.skills?.map(skill => <span key={skill} className="px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded text-[10px] font-bold">{skill}</span>)}
                      {(!vol.skills || vol.skills.length === 0) && <span className="text-xs text-neutral-400">None</span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-neutral-800">{assignedCamp ? assignedCamp.name : '-'}</div>
                    <div className="text-xs text-neutral-500">{assignedCamp ? assignedCamp.campId : '-'}</div>
                  </td>
                  <td className="p-4">
                    <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(status))}>
                      {status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {!isAssigned && status === 'available' ? (
                      assigningVol === vol._id ? (
                        <div className="flex items-center justify-end gap-2">
                          <select value={selectedCamp} onChange={e => setSelectedCamp(e.target.value)} className="text-xs border border-neutral-200 rounded p-1">
                            <option value="">Select Camp</option>
                            {camps.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                          </select>
                          <button onClick={() => handleConfirmAssign(vol._id)} className="p-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setAssigningVol(null)} className="p-1 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 rounded"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      ) : (
                        <button onClick={() => { setAssigningVol(vol._id); setSelectedCamp(''); }} className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs rounded-lg transition-colors border border-blue-200">Assign</button>
                      )
                    ) : isAssigned ? (
                      <button onClick={() => handleRemove(assignedCamp._id, vol._id)} className="px-3 py-1.5 bg-neutral-100 text-neutral-700 hover:bg-neutral-200 font-bold text-xs rounded-lg transition-colors">Remove</button>
                    ) : (
                      <span className="text-xs text-neutral-400 font-semibold">Unavailable</span>
                    )}
                  </td>
                </tr>
                );
              })}
              {volunteers.length === 0 && (
                <tr><td colSpan="5" className="p-8 text-center text-neutral-500 font-semibold text-sm">No volunteers found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
