import mongoose from 'mongoose';

const rescueTeamSchema = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    department: {
      type: String,
    },
    leader: {
      type: String,
    },
    members: [String],
    memberCount: {
      type: Number,
      default: 0,
    },
    location: {
      type: String,
    },
    currentMission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
    },
    assignedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    status: {
      type: String,
      enum: [
        'available',
        'assigned',
        'en_route',
        'on_site',
        'on_mission',
        'returning',
        'offline',
      ],
      default: 'available',
      index: true,
    },
    contactNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('RescueTeam', rescueTeamSchema);
