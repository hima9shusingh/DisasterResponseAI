import mongoose from 'mongoose';

const evidenceSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  mimeType: String,
  size: Number,
  url: String,
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

const incidentSchema = new mongoose.Schema(
  {
    incidentId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reporterType: {
      type: String,
      enum: ['authenticated', 'guest'],
      default: 'guest',
    },
    disasterType: {
      type: String,
      enum: [
        'flood',
        'fire',
        'earthquake',
        'cyclone',
        'landslide',
        'road_accident',
        'building_collapse',
        'chemical_leak',
        'medical_emergency',
        'industrial_accident',
      ],
      required: true,
      index: true,
    },
    description: {
      type: String,
      required: true,
    },
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      required: true,
      index: true,
    },
    location: {
      address: String,
      city: String,
      district: String,
      state: String,
      pincode: String,
      latitude: Number,
      longitude: Number,
    },
    peopleAffected: {
      type: Number,
      default: 0,
    },
    contactNumber: {
      type: String,
    },
    evidence: {
      images: [evidenceSchema],
      videos: [evidenceSchema],
    },
    status: {
      type: String,
      enum: [
        'pending_verification',
        'verified',
        'resources_assigned',
        'rescue_in_progress',
        'resolved',
      ],
      default: 'pending_verification',
      index: true,
    },
    riskScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    },
    assessmentMode: {
      type: String,
      enum: ['automated', 'manual', 'overridden'],
      default: 'automated',
    },
    assignedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    assignedTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RescueTeam',
      },
    ],
    reportedAt: {
      type: Date,
      default: Date.now,
    },
    verifiedAt: {
      type: Date,
    },
    resolvedAt: {
      type: Date,
    },
    timeline: [
      {
        action: String,
        actor: String,
        time: {
          type: Date,
          default: Date.now,
        },
      }
    ],
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add location index for geospatial or text search if needed in future
incidentSchema.index({ 'location.city': 1, 'location.state': 1 });

export default mongoose.model('Incident', incidentSchema);
