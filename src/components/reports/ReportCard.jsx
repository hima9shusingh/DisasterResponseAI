import React from 'react';
import { FileText, Clock, Settings } from 'lucide-react';

export default function ReportCard({ report, onGenerate }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-100 flex flex-col h-full">
      <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
        <FileText className="w-6 h-6" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">{report.title}</h3>
      <p className="text-sm font-medium text-neutral-500 mb-6 flex-1">{report.description}</p>
      
      <div className="space-y-3 pt-4 border-t border-neutral-100">
        <div className="flex justify-between items-center text-xs font-semibold text-neutral-500">
          <span className="flex items-center gap-1"><Settings className="w-3.5 h-3.5" /> {report.format}</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Last: {new Date(report.lastGenerated).toLocaleDateString()}</span>
        </div>
        <button onClick={() => onGenerate(report)} className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold transition-colors shadow-sm">
          Generate Report
        </button>
      </div>
    </div>
  );
}
