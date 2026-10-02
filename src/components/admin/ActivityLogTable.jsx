import React from 'react';
import { clsx } from 'clsx';
import { Activity } from 'lucide-react';

export default function ActivityLogTable({ logs }) {
  const getStatusColor = (status) => {
    return status === 'Success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1000px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Timestamp</th>
              <th className="p-4 font-semibold">User & Role</th>
              <th className="p-4 font-semibold">Action & Module</th>
              <th className="p-4 font-semibold">Description</th>
              <th className="p-4 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-100">
            {logs.map((log) => (
              <tr key={log.id} className="hover:bg-neutral-50 transition-colors">
                <td className="p-4 text-xs font-semibold text-neutral-500 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleString()}
                </td>
                <td className="p-4">
                  <div className="font-bold text-neutral-900">{log.user}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{log.role}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-neutral-800">{log.action}</div>
                  <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{log.module}</div>
                </td>
                <td className="p-4 text-xs text-neutral-600 max-w-sm">
                  {log.description}
                </td>
                <td className="p-4">
                  <span className={clsx("px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider", getStatusColor(log.status))}>
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr><td colSpan="5" className="p-8 text-center text-neutral-500 font-semibold text-sm">No activity logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
