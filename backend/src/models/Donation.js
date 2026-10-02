import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donationId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    donor: {
      type: String,
    },
    type: {
      type: String,
      enum: ['food', 'medical', 'financial', 'water', 'clothing', 'other'],
      required: true,
    },
    quantity: {
      type: Number,
    },
    unit: {
      type: String,
    },
    amount: {
      type: Number, // Applicable mainly for financial type
    },
    assignedCamp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReliefCamp',
    },
    distributionStatus: {
      type: String,
      enum: ['received', 'assigned', 'distributed'],
      default: 'received',
      index: true,
    },
    receivedAt: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Donation', donationSchema);
