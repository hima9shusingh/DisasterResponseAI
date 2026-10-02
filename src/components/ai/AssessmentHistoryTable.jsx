import React from 'react';
import { Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clsx } from 'clsx';

export default function AssessmentHistoryTable({ assessments }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-neutral-200 overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[900px]">
          <thead>
            <tr className="bg-neutral-50 text-neutral-500 text-[10px] uppercase tracking-wider border-b border-neutral-100">
              <th className="p-4 font-semibold">Assessment ID</th>
              <th className="p-4 font-semibold">Location & Type</th>
              <th className="p-4 font-semibold">Severity</th>
              <th className="p-4 font-semibold text-center">Confidence</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-neutral-100">
            {assessments.map((item) => (
              <tr key={item.id} className="hover:bg-neutral-50 transition-colors group">
                <td className="p-4">
                  <div className="font-bold text-neutral-900 font-mono text-xs">{item.id}</div>
                  <div className="text-[10px] font-bold text-neutral-400 mt-0.5">{new Date(item.createdAt).toLocaleString()}</div>
                </td>
                <td className="p-4">
                  <div className="font-bold text-neutral-800">{item.disasterType}</div>
                  <div className="text-xs font-semibold text-neutral-500 line-clamp-1">{item.location}</div>
                </td>
                <td className="p-4">
                  <span className={clsx(
                    "px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border",
                    item.severity === 'Critical' ? 'bg-red-50 text-red-700 border-red-200' : 
                    item.severity === 'High' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                  )}>
                    {item.severity}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <span className="font-black text-indigo-600">{item.confidence}%</span>
                </td>
                <td className="p-4">
                  <div className="flex flex-col gap-1">
                    <span className={clsx(
                      "inline-flex w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      item.status === 'Reviewed' ? 'bg-blue-100 text-blue-700' : 
                      item.status === 'Analyzed' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-600'
                    )}>
                      {item.status}
                    </span>
                    {item.reviewStatus && (
                      <span className={clsx(
                        "inline-flex w-max px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                        item.reviewStatus === 'Confirmed' ? 'text-green-600' : 'text-yellow-600'
                      )}>
                        {item.reviewStatus}
                      </span>
                    )}
                  </div>
                </td>
                <td className="p-4 text-right">
                  <Link 
                    to={`/government/ai-assessment/${item.id}`} 
                    className="inline-flex items-center justify-center p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                    title="View Assessment Details"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
