import React, { useState } from 'react';
import ReportCard from '../../components/reports/ReportCard';
import ReportTable from '../../components/reports/ReportTable';
import ReportGeneratorModal from '../../components/reports/ReportGeneratorModal';
import ReportPreview from '../../components/reports/ReportPreview';
import { mockReportTemplates, mockReportHistory } from '../../data/mock/reportsMockData';
import { useToast } from '../../context/ToastContext';
import { FileText, History } from 'lucide-react';
import { analyticsService } from '../../services/analyticsService';

export default function GovernmentReports() {
  const [history, setHistory] = useState(mockReportHistory);
  const [activeReportTemplate, setActiveReportTemplate] = useState(null);
  const [previewReport, setPreviewReport] = useState(null);
  const { addToast } = useToast();

  const handleGenerateInit = (template) => {
    setActiveReportTemplate(template);
  };

  const handleGenerateSuccess = (newReport) => {
    setActiveReportTemplate(null);
    setHistory(prev => [newReport, ...prev]);
    addToast('Success', `Report "${newReport.name}" generated successfully.`, 'success');
  };

  const handleDownloadMock = async (report) => {
    addToast('Download Started', `Downloading ${report.name || report.title}...`, 'info');
    if (report.format && report.format.includes('CSV') || report.id === 'REP-TPL-1') {
      try {
        await analyticsService.downloadIncidentReportCsv('1y');
        addToast('Success', 'CSV downloaded successfully.', 'success');
      } catch (err) {
        addToast('Error', 'Failed to generate CSV export.', 'error');
      }
    } else {
      addToast('Warning', 'Format not fully supported for this report. Generating generic output.', 'warning');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12 relative">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Reports & Documents</h1>
        <p className="text-sm text-neutral-500 mt-1 font-semibold">Generate operational reports from disaster-response data.</p>
      </div>

      {/* Templates Grid */}
      <section>
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-blue-500" /> Standard Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockReportTemplates.map(template => (
            <ReportCard 
              key={template.id} 
              report={template} 
              onGenerate={handleGenerateInit} 
            />
          ))}
        </div>
      </section>

      {/* Generated Reports Table */}
      <section>
        <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider mb-4 flex items-center gap-2 mt-12 border-b border-neutral-200 pb-2">
          <History className="w-4 h-4 text-blue-500" /> Generated Reports History
        </h2>
        <ReportTable 
          reports={history} 
          onView={setPreviewReport} 
          onDownload={handleDownloadMock} 
        />
      </section>

      {/* Modals */}
      {activeReportTemplate && (
        <ReportGeneratorModal 
          report={activeReportTemplate} 
          onClose={() => setActiveReportTemplate(null)} 
          onSuccess={handleGenerateSuccess} 
        />
      )}

      {previewReport && (
        <ReportPreview 
          report={previewReport} 
          onClose={() => setPreviewReport(null)} 
        />
      )}

    </div>
  );
}
