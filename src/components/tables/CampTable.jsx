import React from 'react';
import { Eye } from 'lucide-react';
import { clsx } from 'clsx';

export default function CampTable({ camps, onView }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return 'bg-green-100 text-green-700';
      case 'Near Capacity': return 'bg-orange-100 text-orange-700';
      case 'Full': return 'bg-red-100 text-red-700';
      case 'Temporarily Closed': return 'bg-neutral-200 text-neutral-700';
      default: return 'bg-neutral-100 text-neutral-700';
    }
  };

  const getInventoryColor = (status) => {
    switch(status) {
      case 'Good': return 'text-green-600 font-semibold';
      case 'Moderate': return 'text-yellow-600 font-semibold';
      case 'Low': return 'text-orange-600 font-bold';
      case 'Critical': return 'text-red-600 font-bold';
      default: return 'text-neutral-500';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left min-w-[1000px]">
        <thead>
          <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
            <th className="p-4 font-semibold">Camp ID & Name</th>
            <th className="p-4 font-semibold">Location</th>
            <th className="p-4 font-semibold text-center">Occupancy</th>
            <th className="p-4 font-semibold text-center">Food</th>
            <th className="p-4 font-semibold text-center">Water</th>
            <th className="p-4 font-semibold text-center">Medical</th>
            <th className="p-4 font-semibold">Status</th>
            <th className="p-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {camps.map((camp, idx) => (
            <tr key={camp.id} className={clsx("hover:bg-neutral-50 transition-colors", idx !== camps.length - 1 && "border-b border-neutral-100")}>
              <td className="p-4">
                <div className="font-bold text-neutral-800">{camp.name}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{camp.id}</div>
              </td>
              <td className="p-4">
                <div className="text-neutral-800">{camp.location}</div>
                <div className="text-xs text-neutral-500 mt-0.5">{camp.district}</div>
              </td>
              <td className="p-4">
                <div className="flex flex-col items-center justify-center">
                  <span className="font-bold text-neutral-800">{camp.occupancyPct}%</span>
                  <span className="text-[10px] text-neutral-500">{camp.occupied}/{camp.capacity}</span>
                </div>
              </td>
              <td className={`p-4 text-center ${getInventoryColor(camp.inventory.food.status)}`}>{camp.inventory.food.status}</td>
              <td className={`p-4 text-center ${getInventoryColor(camp.inventory.water.status)}`}>{camp.inventory.water.status}</td>
              <td className={`p-4 text-center ${getInventoryColor(camp.medicalSupport.status)}`}>{camp.medicalSupport.status}</td>
              <td className="p-4">
                <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider", getStatusColor(camp.status))}>
                  {camp.status}
                </span>
              </td>
              <td className="p-4 text-right">
                <button onClick={() => onView(camp.id)} className="p-1.5 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-end w-full gap-1.5 text-xs font-semibold">
                  <Eye className="w-4 h-4" /> View Details
                </button>
              </td>
            </tr>
          ))}
          {camps.length === 0 && (
            <tr>
              <td colSpan="8" className="p-8 text-center text-neutral-500 text-sm">No camps match your filters.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
