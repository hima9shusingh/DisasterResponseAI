import mongoose from 'mongoose';

const aiAssessmentSchema = new mongoose.Schema(
  {
    assessmentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      required: true,
    },
    uploadedEvidence: [String],
    disasterType: {
      type: String,
    },
    classification: {
      type: String,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    damageCategories: [String],
    recommendations: [String],
    reviewStatus: {
      type: String,
      enum: ['analyzed', 'confirmed', 'needs_review', 'rejected', 'archived'],
      default: 'needs_review',
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('AIAssessment', aiAssessmentSchema);
