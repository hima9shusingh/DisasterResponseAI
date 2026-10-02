import AIAssessment from '../models/AIAssessment.js';
import Incident from '../models/Incident.js';
import { analyzeEvidence } from '../services/aiAssessmentService.js';
import generateIncidentId from '../utils/generateIncidentId.js'; // We will just use standard UUID or custom logic for ID

const generateAssessmentId = async () => {
  const year = new Date().getFullYear();
  const lastAssessment = await AIAssessment.findOne({ assessmentId: new RegExp(`^ADR-AI-\${year}-`) })
    .sort({ createdAt: -1 })
    .exec();

  let sequence = 1;
  if (lastAssessment) {
    const parts = lastAssessment.assessmentId.split('-');
    sequence = parseInt(parts[3], 10) + 1;
  }
  return `ADR-AI-\${year}-\${sequence.toString().padStart(5, '0')}`;
};

export const createAssessment = async (req, res, next) => {
  try {
    const { incidentId, evidenceIds } = req.body;

    if (!incidentId || !evidenceIds || !Array.isArray(evidenceIds)) {
      return res.status(400).json({ success: false, message: 'incidentId and evidenceIds array are required' });
    }

    // Usually incidentId here is the string ID or ObjectId. The req payload says "ADR-INC-2026-00001", so let's support both.
    let incident = await Incident.findOne({ incidentId, isArchived: { $ne: true } });
    if (!incident) {
       // fallback to Object ID if incidentId was passed as object id
       if (incidentId.length === 24) {
           incident = await Incident.findOne({ _id: incidentId, isArchived: { $ne: true } });
       }
    }

    if (!incident) {
      return res.status(404).json({ success: false, message: 'Incident not found' });
    }

    // Call simulated AI service
    const analysisResult = await analyzeEvidence(incident._id.toString(), evidenceIds);

    const assessmentId = await generateAssessmentId();

    const newAssessment = await AIAssessment.create({
      assessmentId,
      incident: incident._id,
      uploadedEvidence: evidenceIds,
      disasterType: analysisResult.classification, // Assuming classification maps to disasterType or similar
      classification: analysisResult.classification,
      severity: analysisResult.severity,
      confidence: analysisResult.confidence * 100, // DB expects 0-100
      riskScore: analysisResult.riskScore,
      damageCategories: analysisResult.damageCategories,
      recommendations: analysisResult.recommendations,
      reviewStatus: 'needs_review',
      // Storing the fact that this is a simulation so we don't mislead the users
      // Our schema might not have these specific fields, but we should return them at least
      // We'll append it to the response wrapper
    });

    res.status(201).json({
      success: true,
      message: 'AI assessment generated successfully',
      data: {
        assessment: {
          ...newAssessment.toObject(),
          modelVersion: analysisResult.modelVersion,
          analysisMode: analysisResult.analysisMode
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const reviewAssessment = async (req, res, next) => {
  try {
    const { reviewStatus, finalSeverity, notes } = req.body;
    
    const validStatuses = ['analyzed', 'confirmed', 'needs_review', 'rejected', 'archived'];
    if (!validStatuses.includes(reviewStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid review status' });
    }

    const assessment = await AIAssessment.findById(req.params.id);
    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    assessment.reviewStatus = reviewStatus;
    assessment.reviewedBy = req.user._id;
    assessment.reviewedAt = new Date();
    
    // Notes and finalSeverity could be added to schema if needed, we'll assign what we can.
    if (finalSeverity) {
        const validSeverities = ['low', 'medium', 'high', 'critical'];
        if (validSeverities.includes(finalSeverity)) {
            assessment.severity = finalSeverity; // Overriding the AI severity with human severity
        }
    }

    await assessment.save();

    res.status(200).json({
      success: true,
      data: { assessment }
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessments = async (req, res, next) => {
  try {
    const { incidentId, reviewStatus, classification, severity, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (incidentId) query.incident = incidentId;
    if (reviewStatus) query.reviewStatus = reviewStatus;
    if (classification) query.classification = classification;
    if (severity) query.severity = severity;

    const assessments = await AIAssessment.find(query)
      .populate('incident', 'incidentId status')
      .populate('reviewedBy', 'name role')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    const total = await AIAssessment.countDocuments(query);

    res.status(200).json({
      success: true,
      count: assessments.length,
      total,
      data: {
          assessments
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getAssessmentById = async (req, res, next) => {
  try {
    const assessment = await AIAssessment.findById(req.params.id)
      .populate('incident')
      .populate('reviewedBy', 'name role');

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    res.status(200).json({
      success: true,
      data: {
        assessment: {
          ...assessment.toObject(),
          modelVersion: "demo-v1",
          analysisMode: "simulation"
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAssessment = async (req, res, next) => {
  try {
    const assessment = await AIAssessment.findById(req.params.id);

    if (!assessment) {
      return res.status(404).json({ success: false, message: 'Assessment not found' });
    }

    // Soft delete via reviewStatus or hard delete. The schema has 'archived' as a reviewStatus.
    assessment.reviewStatus = 'archived';
    await assessment.save();

    res.status(200).json({
      success: true,
      message: 'Assessment deleted (archived) successfully'
    });
  } catch (error) {
    next(error);
  }
};
