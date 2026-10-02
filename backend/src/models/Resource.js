import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    resourceId: {
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
      enum: [
        'ambulance',
        'fire_brigade',
        'police',
        'medical_team',
        'rescue_boat',
        'ndrf',
        'sdrf',
        'volunteer',
        'food',
        'water',
        'medicine',
      ],
      required: true,
    },
    department: {
      type: String,
    },
    location: {
      type: String,
    },
    totalUnits: {
      type: Number,
      required: true,
      min: 0,
    },
    availableUnits: {
      type: Number,
      required: true,
      min: 0,
    },
    deployedUnits: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: [
        'available',
        'partially_available',
        'deployed',
        'busy',
        'maintenance',
      ],
      default: 'available',
      index: true,
    },
    currentMission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Mission',
    },
    assignedIncident: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Incident',
    },
    contactPerson: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
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

export default mongoose.model('Resource', resourceSchema);
