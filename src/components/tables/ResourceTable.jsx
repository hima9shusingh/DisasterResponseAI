import React from 'react';
import { Eye, Edit2, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';

export default function ResourceTable({ resources, isLoading, onView }) {
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'available': return 'bg-green-100 text-green-700';
      case 'partially available': return 'bg-yellow-100 text-yellow-700';
      case 'deployed': return 'bg-blue-100 text-blue-700';
      case 'busy': return 'bg-orange-100 text-orange-700';
      case 'maintenance': return 'bg-red-100 text-red-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[900px]">
        <thead>
          <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
            <th className="p-4 font-semibold">Resource ID</th>
            <th className="p-4 font-semibold">Type & Dept</th>
            <th className="p-4 font-semibold">Location</th>
            <th className="p-4 font-semibold text-center">Total</th>
            <th className="p-4 font-semibold text-center">Available</th>
            <th className="p-4 font-semibold text-center">Deployed</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {isLoading ? (
            <tr>
              <td colSpan="8" className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-sm text-neutral-500 font-medium">Loading resources...</p>
              </td>
            </tr>
          ) : resources.length === 0 ? (
            <tr>
              <td colSpan="8" className="p-8 text-center text-neutral-500 text-sm">No resources match your filters.</td>
            </tr>
          ) : (
            resources.map((res, idx) => (
              <tr key={res._id || res.id} className={clsx("hover:bg-neutral-50 transition-colors", idx !== resources.length - 1 && "border-b border-neutral-100")}>
                <td className="p-4 font-bold text-neutral-800">{res.resourceId || res.id}</td>
                <td className="p-4">
                  <div className="font-bold text-neutral-800">{res.name || res.type}</div>
                  <div className="text-xs text-neutral-500 mt-0.5">{res.department}</div>
                </td>
                <td className="p-4 text-neutral-600">{res.location}</td>
                <td className="p-4 text-center font-semibold text-neutral-800">{res.totalUnits ?? res.total}</td>
                <td className="p-4 text-center font-bold text-green-600">{res.availableUnits ?? res.available}</td>
                <td className="p-4 text-center font-semibold text-blue-600">{res.deployedUnits ?? res.deployed}</td>
                <td className="p-4">
                  <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider", getStatusColor(res.status))}>
                    {res.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => onView(res)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="View Details">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 text-neutral-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Update Status">
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
