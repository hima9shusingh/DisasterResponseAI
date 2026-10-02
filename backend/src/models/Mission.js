import mongoose from 'mongoose';

const missionSchema = new mongoose.Schema(
  {
    missionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    incident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
      // Optional now because a mission can be tied to an SOS request instead
    },
    sosRequest: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SOSRequest',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'RescueTeam',
    },
    assignedResources: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
      },
    ],
    priority: {
      type: String,
      enum: ['normal', 'high', 'critical'],
      default: 'normal',
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
    instructions: {
      type: String,
    },
    status: {
      type: String,
      enum: [
        'assigned',
        'accepted',
        'en_route',
        'on_site',
        'rescue_in_progress',
        'completed',
      ],
      default: 'assigned',
    },
    peopleRescued: {
      type: Number,
      default: 0,
    },
    peopleRemaining: {
      type: Number,
      default: 0,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    notes: [
      {
        text: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        addedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    startedAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Mission', missionSchema);
