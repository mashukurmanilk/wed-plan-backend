import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `txn_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    },
    vendorId: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      default: 'Vendor',
    },
    vendorEmail: {
      type: String,
    },
    plan: {
      type: String,
      default: 'premium',
    },
    amount: {
      type: Number,
      required: true,
      default: 49.0,
    },
    currency: {
      type: String,
      default: 'usd',
    },
    stripeSessionId: {
      type: String,
      required: true,
      unique: true,
    },
    stripeSubscriptionId: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'succeeded', 'failed'],
      default: 'succeeded',
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Transaction = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);
export default Transaction;
