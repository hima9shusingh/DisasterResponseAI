import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, AlertTriangle, Users, Image as ImageIcon, Loader2, Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { useCitizen } from '../../context/CitizenContext';
import { useToast } from '../../context/ToastContext';
import ReportStatusTimeline from '../../components/ui/ReportStatusTimeline';
import ResponseTeamCard from '../../components/cards/ResponseTeamCard';
import CitizenMap from '../../components/map/CitizenMap';
import AIUploadZone from '../../components/ai/AIUploadZone';
import EvidenceGallery from '../../components/ui/EvidenceGallery';
import { incidentService } from '../../services/incidentService';
import { evidenceService } from '../../services/evidenceService';

export default function ReportDetails() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const { reports } = useCitizen();
  const { addToast } = useToast();
  
  const [report, setReport] = useState(reports.find(r => r.id === reportId || r.incidentId === reportId));
  const [isLoading, setIsLoading] = useState(!report);
  const [uploadFile, setUploadFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fetchReport = async () => {
    try {
      const res = await incidentService.getIncidentById(reportId);
      if (res.success) {
        setReport(res.data.incident);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!report) {
      fetchReport();
    }
  }, [report, reportId]);

  const handleUpload = async () => {
    if (!uploadFile) return;

    const file = uploadFile.file;
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    
    if (isImage && file.size > 10 * 1024 * 1024) {
      addToast('Upload Error', 'File is too large. Images must be under 10MB.', 'error');
      return;
    }
    
    if (isVideo && file.size > 50 * 1024 * 1024) {
      addToast('Upload Error', 'File is too large. Videos must be under 50MB.', 'error');
      return;
    }

    if (!isImage && !isVideo) {
      addToast('Upload Error', 'Unsupported file type.', 'error');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);

      await evidenceService.uploadEvidence(reportId, formData);
      addToast('Upload Success', 'Evidence uploaded successfully.', 'success');
      setUploadFile(null);
      fetchReport();
    } catch (error) {
      if (error.response?.status === 413) {
        addToast('Upload Error', 'File is too large.', 'error');
      } else if (error.response?.status === 403) {
        addToast('Upload Error', 'You do not have permission to upload evidence.', 'error');
      } else if (error.response?.status === 400) {
        addToast('Upload Error', 'Unsupported file type.', 'error');
      } else {
        addToast('Upload Error', 'Unable to upload evidence.', 'error');
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Loading Incident Details...</h2>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <AlertTriangle className="w-12 h-12 text-neutral-400 mb-4" />
        <h2 className="text-xl font-bold text-neutral-800">Report Not Found</h2>
        <button onClick={() => navigate('/citizen/reports')} className="mt-4 text-blue-600 font-semibold hover:underline">Return to My Reports</button>
      </div>
    );
  }

  const getStatusDisplay = (status) => {
    switch (status) {
      case 'resolved': return { label: 'Resolved', color: 'bg-green-100 text-green-700' };
      case 'pending_verification': return { label: 'Pending Verification', color: 'bg-neutral-100 text-neutral-700' };
      case 'verified': return { label: 'Verified', color: 'bg-blue-100 text-blue-700' };
      case 'resources_assigned': return { label: 'Resources Assigned', color: 'bg-purple-100 text-purple-700' };
      case 'rescue_in_progress': return { label: 'Rescue In Progress', color: 'bg-orange-100 text-orange-700' };
      default: return { label: status, color: 'bg-neutral-100 text-neutral-700' };
    }
  };



  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
        <button onClick={() => navigate('/citizen/reports')} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-blue-600 transition-colors mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to My Reports
        </button>
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight capitalize">{report.disasterType?.replace('_', ' ') || report.type}</h1>
              <span className={clsx("px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider", getStatusDisplay(report.status).color)}>
                {getStatusDisplay(report.status).label}
              </span>
              <span className="px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-100">
                {report.severity}
              </span>
            </div>
            <p className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">{report.incidentId || report.id} • Reported on {new Date(report.reportedAt).toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details & Evidence */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Tracking Map & Info */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Incident Location</h2>
            <div className="h-64 rounded-xl overflow-hidden mb-4 border border-neutral-100">
              <CitizenMap 
                incidentCoords={report.location?.latitude ? [report.location.longitude, report.location.latitude] : report.coords} 
                teamCoords={report.assignedTeam ? report.assignedTeam.coords : null} 
              />
            </div>
            <div className="flex gap-4">
              <div className="flex-1 bg-neutral-50 rounded-xl p-4 border border-neutral-100">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1"><MapPin className="w-3.5 h-3.5" /> Address</p>
                <p className="text-sm font-semibold text-neutral-800">{report.location?.address || report.location}</p>
              </div>
              <div className="bg-neutral-50 rounded-xl p-4 border border-neutral-100 min-w-[120px]">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1 mb-1"><Users className="w-3.5 h-3.5" /> Affected</p>
                <p className="text-xl font-extrabold text-neutral-800">{report.peopleAffected}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Description</h2>
            <p className="text-sm text-neutral-700 leading-relaxed bg-neutral-50 p-4 rounded-xl border border-neutral-100">{report.description}</p>
          </div>

          {/* Evidence Gallery */}
          <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
            <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-2 mb-4">Evidence</h2>
            
            <div className="mb-6 bg-neutral-50 p-4 rounded-xl border border-neutral-100">
              <h3 className="text-xs font-bold text-neutral-700 uppercase tracking-wider mb-3">Upload Additional Evidence</h3>
              <AIUploadZone 
                file={uploadFile}
                onFileSelect={setUploadFile}
                onRemove={() => setUploadFile(null)}
              />
              {uploadFile && (
                <div className="mt-3 flex justify-end">
                  <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-bold rounded-lg transition-colors flex items-center gap-2"
                  >
                    {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                    {isUploading ? 'Uploading...' : 'Upload File'}
                  </button>
                </div>
              )}
            </div>

            {report.evidence && (report.evidence.images?.length > 0 || report.evidence.videos?.length > 0) ? (
              <EvidenceGallery evidence={report.evidence} />
            ) : (
              <div className="text-center py-8 text-neutral-500 text-sm font-medium border-2 border-dashed border-neutral-100 rounded-xl">
                No evidence uploaded yet.
              </div>
            )}
          </div>

        </div>

        {/* Right Column - Status Tracking & Team */}
        <div className="space-y-6">
          
          <ResponseTeamCard team={report.assignedTeam} />

          {report.timeline && (
            <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 p-6">
              <h2 className="text-sm font-bold text-neutral-800 uppercase tracking-wider border-b border-neutral-100 pb-4 mb-6">Response Tracking</h2>
              <ReportStatusTimeline timeline={report.timeline} />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
