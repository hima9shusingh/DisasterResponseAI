import React from 'react';
import { useDisaster } from '../../context/DisasterContext';
import { Activity, ShieldAlert, AlertTriangle } from 'lucide-react';
import { clsx } from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function AdminIncidents() {
  const [incidents, setIncidents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  React.useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const { incidentService } = await import('../../services/incidentService');
        const res = await incidentService.getIncidents({ limit: 100 });
        if (res.success) {
          setIncidents(res.data.incidents);
        }
      } catch (err) {
        console.error('Failed to fetch incidents', err);
      } finally {
        setLoading(false);
      }
    };
    fetchIncidents();
  }, []);

  const getSeverityColor = (sev) => {
    switch(sev?.toLowerCase()) {
      case 'critical': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-blue-100 text-blue-700';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Global Incident Oversight</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">System-wide view of all emergency incidents.</p>
      </div>

      {loading ? (
        <div className="p-8 text-center text-neutral-500 font-semibold text-sm bg-white rounded-2xl shadow-sm border border-neutral-100">
          Loading incidents...
        </div>
      ) : incidents.length === 0 ? (
        <div className="p-8 text-center text-neutral-500 font-semibold text-sm bg-white rounded-2xl shadow-sm border border-neutral-100">
          No incidents found.
        </div>
      ) : (
        <>
          {/* Mobile View: Cards */}
          <div className="grid grid-cols-1 gap-4 md:hidden">
            {incidents.map((inc) => (
              <div key={inc._id} className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-neutral-900 capitalize text-base">{inc.disasterType?.replace('_', ' ')}</div>
                    <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{inc.incidentId} • {new Date(inc.reportedAt).toLocaleDateString()}</div>
                  </div>
                  <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getSeverityColor(inc.severity))}>
                    {inc.severity}
                  </span>
                </div>
                
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">Location</span>
                  <div className="text-sm font-semibold text-neutral-700 truncate">{inc.location?.address}</div>
                </div>

                <div className="flex justify-between items-end mt-2">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-0.5">Status</span>
                    <span className="px-2 py-1 inline-block rounded-lg text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                      {inc.status?.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <button onClick={() => navigate(`/admin/incidents/${inc._id}`)} className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-lg transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop View: Table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
                    <th className="p-4 font-semibold">Incident</th>
                    <th className="p-4 font-semibold">Location</th>
                    <th className="p-4 font-semibold">Severity</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-neutral-100">
                  {incidents.map((inc) => (
                    <tr key={inc._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-neutral-900 capitalize">{inc.disasterType?.replace('_', ' ')}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{inc.incidentId} • {new Date(inc.reportedAt).toLocaleDateString()}</div>
                      </td>
                      <td className="p-4 font-semibold text-neutral-700">{inc.location?.address}</td>
                      <td className="p-4">
                        <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getSeverityColor(inc.severity))}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-700">
                          {inc.status?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => navigate(`/admin/incidents/${inc._id}`)} className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs rounded-lg transition-colors">View Details</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
