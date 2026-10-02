import React, { useState } from 'react';
import { FileText, X, Loader2 } from 'lucide-react';

export default function ReportGeneratorModal({ report, onClose, onSuccess }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [format, setFormat] = useState('PDF');

  const handleGenerate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      setIsGenerating(false);
      onSuccess({
        id: `RPT-90${Math.floor(Math.random() * 99)}`,
        name: report.title,
        generatedBy: 'Current User',
        date: new Date().toISOString(),
        filters: 'Custom Filters',
        format,
        status: 'Available'
      });
    }, 2000);
  };

  if (!report) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="px-6 py-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex justify-center items-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900 leading-tight">Configure Report</h2>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{report.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Date Range</label>
            <select className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Region</label>
            <select className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Regions</option>
              <option>State</option>
              <option>District</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Disaster Type</label>
            <select className="w-full p-3 bg-white border border-neutral-200 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-blue-500 outline-none">
              <option>All Disasters</option>
              <option>Flood</option>
              <option>Fire</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Output Format</label>
            <div className="grid grid-cols-3 gap-2">
              {['PDF', 'CSV', 'Excel'].map(fmt => (
                <button 
                  key={fmt} 
                  onClick={() => setFormat(fmt)}
                  className={`py-2 rounded-xl text-sm font-bold border transition-colors ${
                    format === fmt ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-neutral-100 bg-neutral-50 flex justify-end gap-3">
          <button onClick={onClose} disabled={isGenerating} className="px-5 py-2.5 text-neutral-600 hover:bg-neutral-200 font-bold text-sm rounded-xl transition-colors">
            Cancel
          </button>
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isGenerating ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : 'Generate Report'}
          </button>
        </div>

      </div>
    </div>
  );
}
