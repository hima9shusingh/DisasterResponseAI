import React from 'react';
import { clsx } from 'clsx';

export default function ResidentTable({ residents }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Sheltered': return 'text-green-600 bg-green-50';
      case 'Under Observation': return 'text-orange-600 bg-orange-50';
      case 'Treated': return 'text-blue-600 bg-blue-50';
      default: return 'text-neutral-600 bg-neutral-50';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
            <th className="p-3 font-semibold">Resident ID & Name</th>
            <th className="p-3 font-semibold text-center">Age Group</th>
            <th className="p-3 font-semibold text-center">Family Size</th>
            <th className="p-3 font-semibold">Medical Requirement</th>
            <th className="p-3 font-semibold">Status</th>
            <th className="p-3 font-semibold text-right">Registration</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {residents.map((res, idx) => (
            <tr key={res.id} className={clsx("hover:bg-neutral-50 transition-colors", idx !== residents.length - 1 && "border-b border-neutral-50")}>
              <td className="p-3">
                <div className="font-bold text-neutral-800">{res.name}</div>
                <div className="text-[10px] text-neutral-500 mt-0.5">{res.id}</div>
              </td>
              <td className="p-3 text-center text-neutral-600">{res.ageGroup}</td>
              <td className="p-3 text-center text-neutral-600">{res.familySize}</td>
              <td className="p-3 text-neutral-600">{res.medicalReq}</td>
              <td className="p-3">
                <span className={clsx("px-2 py-0.5 rounded text-[10px] font-bold uppercase", getStatusColor(res.status))}>
                  {res.status}
                </span>
              </td>
              <td className="p-3 text-right text-xs text-neutral-500">
                {new Date(res.registrationTime).toLocaleString()}
              </td>
            </tr>
          ))}
          {residents.length === 0 && (
            <tr>
              <td colSpan="6" className="p-8 text-center text-neutral-500 text-sm border border-dashed border-neutral-200 rounded-xl m-4">No residents registered at this camp.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
