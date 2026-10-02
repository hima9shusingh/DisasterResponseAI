import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, MapPin, Database, Loader2, AlertTriangle } from 'lucide-react';
import AIResultCard from '../../components/ai/AIResultCard';
import SeverityScore from '../../components/ai/SeverityScore';
import DamageCategoryCard from '../../components/ai/DamageCategoryCard';
import RecommendationCard from '../../components/ai/RecommendationCard';
import HumanReviewPanel from '../../components/ai/HumanReviewPanel';
import { aiAssessmentService } from '../../services/aiAssessmentService';

export default function AIDetails() {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  
  const [assessment, setAssessment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        const response = await aiAssessmentService.getAssessmentById(assessmentId);
        if (response.success) {
          setAssessment(response.data.assessment);
        } else {
          setError(response.message || 'Failed to load assessment details');
        }
      } catch (err) {
        console.error('Failed to load assessment', err);
        setError('Failed to load assessment details');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssessment();
  }, [assessmentId]);

  const mapClassification = (c) => {
    if (!c) return 'Unknown';
    return c.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-3xl border border-neutral-200 shadow-sm max-w-7xl mx-auto">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-2" />
        <p className="text-sm font-semibold text-neutral-500">Loading Assessment Details...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-red-50 rounded-3xl border border-red-200 shadow-sm max-w-7xl mx-auto">
        <AlertTriangle className="w-8 h-8 text-red-500 mb-2" />
        <h2 className="text-lg font-bold text-red-700">Assessment Not Found</h2>
        <p className="text-sm font-medium text-red-600 mb-4">{error}</p>
        <button onClick={() => navigate('/government/ai-assessment/history')} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg text-sm font-bold">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/government/ai-assessment/history')}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 transition-colors shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Assessment Record</h1>
              <span className="font-mono text-xs font-bold text-neutral-500 bg-neutral-100 px-2 py-1 rounded">{assessment.assessmentId}</span>
              {assessment.analysisMode === 'simulation' && (
                 <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded">Simulation</span>
              )}
            </div>
            <p className="text-xs font-semibold text-neutral-500 flex items-center gap-4">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {new Date(assessment.createdAt).toLocaleString()}</span>
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {assessment.incidentId?.location?.address || 'Unknown'}</span>
              <span className="flex items-center gap-1"><Database className="w-3.5 h-3.5" /> Incident: {assessment.incidentId?.incidentId || assessment.incidentId?._id || 'Unknown'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DamageCategoryCard categories={assessment.damageCategories || []} />
            <RecommendationCard recommendations={assessment.recommendations || []} priority={mapClassification(assessment.severity)} />
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider mb-4">Historical Visual Evidence</h3>
            <div className="aspect-video bg-neutral-100 rounded-2xl flex items-center justify-center border border-neutral-200 overflow-hidden relative">
              {assessment.evidenceIds && assessment.evidenceIds.length > 0 && assessment.evidenceIds[0].url ? (
                <img src={assessment.evidenceIds[0].url} alt="Historical Evidence" className="w-full h-full object-contain" />
              ) : (
                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center text-neutral-600 font-bold text-sm">
                  [Archived Image Data Unavailable]
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Right Column - Scores and Review */}
        <div className="space-y-6">
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
            initialStatus={assessment.reviewStatus || 'needs_review'} 
            reviewer={assessment.reviewedBy?.name}
            reviewedAt={assessment.reviewedAt}
            assessmentId={assessment._id}
            onReviewComplete={(newAssessment) => setAssessment(newAssessment)}
          />
        </div>

      </div>
    </div>
  );
}
