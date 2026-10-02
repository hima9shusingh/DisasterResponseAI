import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File } from 'lucide-react';
import { clsx } from 'clsx';

export default function ExportMenu({ onExport }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleExport = (format) => {
    onExport(format);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200 hover:bg-neutral-50 rounded-xl text-sm font-bold text-neutral-700 transition-colors shadow-sm"
      >
        <Download className="w-4 h-4" /> Export
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-neutral-100 overflow-hidden z-50">
          <div className="p-1">
            <button onClick={() => handleExport('PDF')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
              <FileText className="w-4 h-4 text-red-500" /> Export as PDF
            </button>
            <button onClick={() => handleExport('Excel')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
              <FileSpreadsheet className="w-4 h-4 text-green-600" /> Export to Excel
            </button>
            <button onClick={() => handleExport('CSV')} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 rounded-lg transition-colors">
              <File className="w-4 h-4 text-neutral-500" /> Export as CSV
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
