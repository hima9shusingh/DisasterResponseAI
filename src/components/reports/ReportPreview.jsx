import React from 'react';
import { X, Printer, Download, FileText, AlertTriangle } from 'lucide-react';
import { mockAnalyticsIncidents, mockResourceUtilization } from '../../data/mock/analyticsMockData';

export default function ReportPreview({ report, onClose }) {
  if (!report) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm">
      <div className="bg-neutral-100 rounded-2xl w-full max-w-4xl h-[90vh] shadow-2xl overflow-hidden flex flex-col">
        
        {/* Toolbar */}
        <div className="px-6 py-4 bg-white border-b border-neutral-200 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex justify-center items-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold text-neutral-900 leading-tight">Document Preview</h2>
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">{report.name}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
              <Printer className="w-4 h-4" /> Print
            </button>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm transition-colors flex items-center gap-2 shadow-sm">
              <Download className="w-4 h-4" /> Download PDF
            </button>
            <div className="w-px h-8 bg-neutral-200 mx-2 self-center"></div>
            <button onClick={onClose} className="p-2 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-200 rounded-xl transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Paper Document */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center">
          <div className="bg-white w-full max-w-3xl min-h-full shadow-lg border border-neutral-200 p-10 md:p-16 relative">
            
            <div className="flex justify-between items-end border-b-2 border-neutral-900 pb-6 mb-8">
              <div>
                <h1 className="text-4xl font-black text-neutral-900 tracking-tight">ADRRAS</h1>
                <p className="text-sm font-bold text-neutral-500 tracking-widest uppercase mt-1">Disaster Response Report</p>
              </div>
              <div className="text-right text-xs font-semibold text-neutral-600">
                <p>Generated: {new Date(report.date).toLocaleString()}</p>
                <p>Report ID: {report.id}</p>
                <p>Author: {report.generatedBy}</p>
              </div>
            </div>

            <div className="space-y-8 text-neutral-800">
              
              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1">1. Summary</h2>
                <p className="text-sm leading-relaxed text-neutral-700">
                  This report summarizes the operational metrics and disaster response activities during the specified period ({report.filters}).
                  Data is aggregated from field reports, sensor networks, and participating NGOs.
                </p>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1">2. Key Metrics</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Total Incidents</p>
                    <p className="text-2xl font-black text-neutral-900">{mockAnalyticsIncidents.total}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">People Assisted</p>
                    <p className="text-2xl font-black text-neutral-900">{mockAnalyticsIncidents.peopleAssisted.toLocaleString()}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Avg Response Time</p>
                    <p className="text-2xl font-black text-neutral-900">{mockAnalyticsIncidents.averageResponseTime}</p>
                  </div>
                  <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-100">
                    <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Active Relief Camps</p>
                    <p className="text-2xl font-black text-neutral-900">{mockAnalyticsIncidents.reliefCampsActive}</p>
                  </div>
                </div>
              </section>

              <section>
                <h2 className="text-lg font-bold uppercase tracking-wider mb-3 text-neutral-900 border-b border-neutral-200 pb-1">3. Resource Deployment</h2>
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-neutral-100 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-3">Resource Type</th>
                      <th className="p-3 text-right">Available</th>
                      <th className="p-3 text-right">Deployed</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {mockResourceUtilization.map((res, idx) => (
                      <tr key={idx}>
                        <td className="p-3 font-semibold">{res.name}</td>
                        <td className="p-3 text-right text-green-700 font-bold">{res.available}</td>
                        <td className="p-3 text-right text-blue-700 font-bold">{res.deployed}</td>
                        <td className="p-3 text-right font-bold text-neutral-900">{res.available + res.deployed + res.busy}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>

              <div className="mt-12 pt-8 border-t border-dashed border-neutral-300 text-center">
                <AlertTriangle className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">End of Official Document</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
