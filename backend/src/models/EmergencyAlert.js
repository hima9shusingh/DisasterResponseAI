import mongoose from 'mongoose';

const emergencyAlertSchema = new mongoose.Schema(
  {
    alertId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        'flood',
        'cyclone',
        'fire',
        'earthquake',
        'landslide',
        'weather',
        'general_emergency',
      ],
      required: true,
    },
    severity: {
      type: String,
      enum: ['information', 'watch', 'warning', 'critical'],
      required: true,
    },
    targetRegion: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    instructions: {
      type: String,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['draft', 'scheduled', 'active', 'expired', 'resolved'],
      default: 'active',
      index: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('EmergencyAlert', emergencyAlertSchema);
