import mongoose from 'mongoose';

const reliefCampSchema = new mongoose.Schema(
  {
    campId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
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
    capacity: {
      type: Number,
      required: true,
    },
    occupied: {
      type: Number,
      default: 0,
    },
    availableBeds: {
      type: Number,
      default: 0,
    },
    inventory: {
      food: { type: Number, default: 0 },
      water: { type: Number, default: 0 },
      medicine: { type: Number, default: 0 },
      blankets: { type: Number, default: 0 },
      emergencyKits: { type: Number, default: 0 },
    },
    medicalSupport: {
      doctors: { type: Number, default: 0 },
      nurses: { type: Number, default: 0 },
      medicalVolunteers: { type: Number, default: 0 },
      ambulances: { type: Number, default: 0 },
      medicalBeds: { type: Number, default: 0 },
    },
    contactPerson: {
      type: String,
    },
    contactNumber: {
      type: String,
    },
    status: {
      type: String,
      enum: ['active', 'near_capacity', 'full', 'temporarily_closed'],
      default: 'active',
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    assignedVolunteers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    managedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('ReliefCamp', reliefCampSchema);
