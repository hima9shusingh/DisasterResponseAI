import React, { useState, useEffect } from 'react';
import { MapPin, ScanSearch, History, Loader2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import AIUploadZone from '../../components/ai/AIUploadZone';
import AIResultCard from '../../components/ai/AIResultCard';
import SeverityScore from '../../components/ai/SeverityScore';
import DamageCategoryCard from '../../components/ai/DamageCategoryCard';
import RecommendationCard from '../../components/ai/RecommendationCard';
import HumanReviewPanel from '../../components/ai/HumanReviewPanel';
import ModelInfoCard from '../../components/ai/ModelInfoCard';
import { aiAssessmentService } from '../../services/aiAssessmentService';
import { useToast } from '../../context/ToastContext';

export default function AIAssessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { addToast } = useToast();
  
  const incidentIdFromState = location.state?.incidentId;
  const initialEvidence = location.state?.evidence;
  
  const [fileData, setFileData] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, analyzing, complete, failed
  const [assessment, setAssessment] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    // If navigated from IncidentDetails with an image evidence, use it as preview
    if (initialEvidence && initialEvidence.images && initialEvidence.images.length > 0) {
      setFileData({
        previewUrl: initialEvidence.images[0].url,
        isFromIncident: true
      });
    }
  }, [initialEvidence]);

  const handleAnalyze = async () => {
    if (!incidentIdFromState) {
      addToast('Error', 'No incident selected for analysis.', 'error');
      return;
    }

    if (!initialEvidence || !initialEvidence.images || initialEvidence.images.length === 0) {
      addToast('Error', 'No image evidence available for analysis.', 'error');
      return;
    }

    setStatus('analyzing');
    setErrorMsg('');
    
    try {
      const evidenceIds = initialEvidence.images.map(img => img.id || img._id).filter(Boolean);
      
      const response = await aiAssessmentService.createAssessment({
        incidentId: incidentIdFromState,
        evidenceIds: evidenceIds
      });
      
      if (response.success) {
        setAssessment(response.data.assessment);
        setStatus('complete');
      } else {
        throw new Error(response.message || 'Failed to create assessment');
      }
    } catch (err) {
      console.error('AI Assessment Error:', err);
      setStatus('failed');
      setErrorMsg('AI assessment could not be generated. Please try again.');
    }
  };

  const resetAnalysis = () => {
    setStatus('idle');
    setAssessment(null);
    setErrorMsg('');
  };

  const mapClassification = (c) => {
    if (!c) return 'Unknown';
    return c.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div>
          <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 uppercase tracking-wider hover:text-blue-600 transition-colors mb-4">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-neutral-900 tracking-tight">AI Damage Assessment</h1>
            {assessment?.analysisMode === 'simulation' || status !== 'complete' ? (
               <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded">AI Assessment — Simulation</span>
            ) : null}
          </div>
          <p className="text-sm font-semibold text-neutral-500">Analyze disaster evidence and estimate damage severity using backend ML models.</p>
          {assessment?.analysisMode === 'simulation' && (
            <p className="text-xs font-semibold text-orange-600 mt-1">Demo model output. Human review required.</p>
          )}
        </div>
        <button 
          onClick={() => navigate('/government/ai-assessment/history')}
          className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-sm rounded-xl transition-colors flex items-center gap-2"
        >
          <History className="w-4 h-4" /> Assessment History
        </button>
      </div>

      {status === 'failed' && (
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-red-700 mb-1">Analysis Failed</h2>
          <p className="text-sm font-medium text-red-600">{errorMsg}</p>
          <button onClick={() => setStatus('idle')} className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-bold">Try Again</button>
        </div>
      )}

      {status === 'idle' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Evidence for Analysis</h2>
              {fileData ? (
                 <div className="relative rounded-2xl overflow-hidden aspect-video bg-neutral-100 border border-neutral-200">
                   <img src={fileData.previewUrl} alt="Evidence Preview" className="w-full h-full object-contain" />
                 </div>
              ) : (
                <div className="p-8 border-2 border-dashed border-neutral-200 rounded-xl text-center">
                  <p className="text-sm font-medium text-neutral-500">No evidence available. Please start from an incident.</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900 mb-4">Assessment Details</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-1">Incident ID</p>
                  <p className="text-sm font-semibold text-neutral-800">{incidentIdFromState || 'Not Selected'}</p>
                </div>
                
                <div className="pt-2">
                  <button 
                    disabled={!incidentIdFromState || !fileData}
                    onClick={handleAnalyze}
                    className="w-full py-3 bg-indigo-600 disabled:bg-neutral-200 text-white disabled:text-neutral-400 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <ScanSearch className="w-5 h-5" /> Analyze Damage
                  </button>
                </div>
              </div>
            </div>
            
            <ModelInfoCard />
          </div>
        </div>
      )}

      {status === 'analyzing' && (
        <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
          <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
          <h2 className="text-lg font-bold text-neutral-800">Analyzing submitted evidence...</h2>
          <p className="text-sm text-neutral-500 mt-2">Running visual classification and severity estimation</p>
        </div>
      )}

      {status === 'complete' && assessment && (
        <div className="space-y-6 animate-in fade-in zoom-in duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Visual Evidence Area */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-neutral-900">Visual Damage Analysis</h2>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1 bg-neutral-100 rounded">Visualization only</span>
                </div>
                <div className="relative rounded-2xl overflow-hidden group border border-neutral-100 bg-black">
                  <img src={fileData?.previewUrl} alt="Analyzed Evidence" className="w-full h-80 object-cover opacity-80" />
                  <div className="absolute inset-0 bg-red-500 mix-blend-color-burn opacity-20"></div>
                  <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" /> Evidence Analysis Complete
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DamageCategoryCard categories={assessment.damageCategories || []} />
                <RecommendationCard recommendations={assessment.recommendations || []} priority={mapClassification(assessment.severity)} />
              </div>
            </div>

            {/* Assessment Sidebar */}
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-3xl border border-neutral-200 flex justify-between items-center shadow-sm">
                <div>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider mb-0.5">Assessment ID</p>
                  <p className="font-mono text-sm font-bold text-neutral-900">{assessment.assessmentId}</p>
                </div>
                <button onClick={resetAnalysis} className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline">New Analysis</button>
              </div>

              <AIResultCard 
                classification={mapClassification(assessment.classification)} 
                severity={mapClassification(assessment.severity)} 
                confidence={Math.round((assessment.confidence || 0) * 100)} 
                riskScore={assessment.riskScore || 0}
                finalSeverity={assessment.finalSeverity ? mapClassification(assessment.finalSeverity) : null}
              />
              
              <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-4">
                <SeverityScore score={assessment.riskScore || 0} label="Calculated Risk Score" />
              </div>

              <HumanReviewPanel 
                initialStatus={assessment.reviewStatus} 
                assessmentId={assessment._id} 
                onReviewComplete={(newAssessment) => setAssessment(newAssessment)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
