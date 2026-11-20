import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    image: {
      type: String,
    },
    role: {
      type: String,
      enum: ['customer', 'vendor', 'admin', 'user'],
      default: 'customer',
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    businessName: {
      type: String,
    },
    phone: {
      type: String,
    },
    bio: {
      type: String,
    },
    location: {
      type: String,
    },
    subscriptionPlan: {
      type: String,
      enum: ['free', 'premium', 'basic'],
      default: 'free',
    },
    subscriptionExpiresAt: {
      type: String,
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

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
