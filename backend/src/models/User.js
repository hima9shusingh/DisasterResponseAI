import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['citizen', 'volunteer', 'ngo', 'government', 'admin'],
      default: 'citizen',
    },
    location: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
    },
    emergencyContacts: [
      {
        name: String,
        phone: String,
        relation: String,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    // Volunteer specific fields
    skills: [String],
    availability: {
      type: String,
      enum: ['available', 'unavailable'],
      default: 'available',
    },
    volunteerStats: {
      missionsCompleted: { type: Number, default: 0 },
      peopleAssisted: { type: Number, default: 0 },
    },
    // NGO specific fields
    organizationName: String,
    registrationId: String,
    operatingRegions: [String],
    missionStatement: String,
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('User', userSchema);
