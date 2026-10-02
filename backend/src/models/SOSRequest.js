import mongoose from 'mongoose';

const sosRequestSchema = new mongoose.Schema(
  {
    emergencyId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      // Optional for unauthenticated SOS
    },
    emergencyType: {
      type: String,
      default: 'general_emergency',
    },
    description: {
      type: String,
    },
    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACKNOWLEDGED', 'ASSIGNED', 'RESPONDING', 'ON_SCENE', 'RESOLVED', 'CANCELLED'],
      default: 'PENDING',
      index: true,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'critical',
    },
    assignedTeam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RescueTeam',
    },
    assignedMission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
    },
    resolvedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SOSRequest', sosRequestSchema);
