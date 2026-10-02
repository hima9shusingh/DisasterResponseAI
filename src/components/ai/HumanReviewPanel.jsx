import React, { useState } from 'react';
import { CheckCircle2, AlertCircle, XCircle, ShieldCheck, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { useToast } from '../../context/ToastContext';
import { aiAssessmentService } from '../../services/aiAssessmentService';

export default function HumanReviewPanel({ initialStatus, reviewer, reviewedAt, assessmentId, onReviewComplete }) {
  const [status, setStatus] = useState(initialStatus || 'needs_review');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToast();

  const handleReview = async (newStatus, finalSeverity = null) => {
    if (!assessmentId) return;
    
    setIsSubmitting(true);
    try {
      const data = {
        reviewStatus: newStatus,
        notes: `Human review marked as ${newStatus}`
      };
      if (finalSeverity) {
        data.finalSeverity = finalSeverity;
      }

      const response = await aiAssessmentService.reviewAssessment(assessmentId, data);
      if (response.success) {
        setStatus(response.data.assessment.reviewStatus);
        addToast('Review Submitted', `Assessment marked as ${newStatus}.`, newStatus === 'confirmed' ? 'success' : 'warning');
        if (onReviewComplete) {
          onReviewComplete(response.data.assessment);
        }
      }
    } catch (err) {
      if (err.response?.status === 403) {
        addToast('Permission Denied', 'You do not have permission to review this assessment.', 'error');
      } else {
        addToast('Error', 'Failed to submit review.', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusDisplay = (s) => {
    switch (s) {
      case 'confirmed': return 'Confirmed';
      case 'needs_review': return 'Needs Review';
      case 'rejected': return 'Rejected';
      case 'archived': return 'Archived';
      default: return s;
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-600" /> Human Verification
          </h3>
          <p className="text-xs font-semibold text-neutral-500 mt-1">AI provides decision support. Humans make the final call.</p>
        </div>
        
        {status !== 'needs_review' && (
          <div className="text-right">
            <span className={clsx(
              "px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mb-1 inline-block",
              status === 'confirmed' ? 'bg-green-100 text-green-700' : status === 'needs_review' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
            )}>
              {getStatusDisplay(status)}
            </span>
            <p className="text-[10px] font-semibold text-neutral-400">{reviewer || 'Current Officer'} • {reviewedAt ? new Date(reviewedAt).toLocaleDateString() : 'Just now'}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button 
          onClick={() => handleReview('confirmed', 'critical')}
          disabled={isSubmitting}
          className={clsx(
            "py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors",
            status === 'confirmed' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase tracking-wider text-center px-1">Confirm (Crit.)</span>
        </button>
        <button 
          onClick={() => handleReview('needs_review')}
          disabled={isSubmitting}
          className={clsx(
            "py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors",
            status === 'needs_review' ? 'bg-yellow-50 border-yellow-500 text-yellow-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <AlertCircle className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase tracking-wider text-center px-1">Needs Review</span>
        </button>
        <button 
          onClick={() => handleReview('rejected')}
          disabled={isSubmitting}
          className={clsx(
            "py-3 rounded-xl border flex flex-col items-center justify-center gap-2 transition-colors",
            status === 'rejected' ? 'bg-red-50 border-red-500 text-red-700' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50',
            isSubmitting && "opacity-50 cursor-not-allowed"
          )}
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
          <span className="text-xs font-bold uppercase tracking-wider">Reject</span>
        </button>
      </div>
    </div>
  );
}
