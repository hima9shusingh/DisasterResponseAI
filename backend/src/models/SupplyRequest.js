import mongoose from 'mongoose';

const supplyRequestSchema = new mongoose.Schema(
  {
    requestId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    camp: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ReliefCamp',
      required: true,
    },
    requestedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    item: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: [
        'food',
        'water',
        'medicine',
        'blankets',
        'clothing',
        'emergency_kits',
        'sanitary_supplies',
      ],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    reason: {
      type: String,
    },
    requiredBy: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'in_transit', 'delivered', 'rejected'],
      default: 'pending',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('SupplyRequest', supplyRequestSchema);
