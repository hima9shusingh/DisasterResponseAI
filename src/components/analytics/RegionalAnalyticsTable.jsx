import React from 'react';

export default function RegionalAnalyticsTable({ data }) {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full text-left min-w-[800px]">
        <thead>
          <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
            <th className="p-4 font-semibold">Region</th>
            <th className="p-4 font-semibold text-right">Incidents</th>
            <th className="p-4 font-semibold text-right">Critical</th>
            <th className="p-4 font-semibold text-right">Affected</th>
            <th className="p-4 font-semibold text-right">Assisted</th>
            <th className="p-4 font-semibold text-right">Avg Response</th>
            <th className="p-4 font-semibold text-right">Resolution %</th>
          </tr>
        </thead>
        <tbody className="text-sm divide-y divide-neutral-100">
          {data.map((row) => (
            <tr key={row.id} className="hover:bg-neutral-50 transition-colors">
              <td className="p-4 font-bold text-neutral-800">{row.region}</td>
              <td className="p-4 text-right font-semibold text-neutral-600">{row.incidents.toLocaleString()}</td>
              <td className="p-4 text-right font-bold text-red-600">{row.critical.toLocaleString()}</td>
              <td className="p-4 text-right font-semibold text-neutral-600">{row.affected.toLocaleString()}</td>
              <td className="p-4 text-right font-semibold text-green-600">{row.assisted.toLocaleString()}</td>
              <td className="p-4 text-right font-bold text-blue-600">{row.responseTime}</td>
              <td className="p-4 text-right font-bold text-neutral-800">{row.resolutionRate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
