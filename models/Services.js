import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `srv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    },
    serviceName: {
      type: String,
      required: true,
    },
    vendorId: {
      type: String,
      required: true,
    },
    vendorName: {
      type: String,
      default: 'Wedding Vendor',
    },
    vendorBusinessName: {
      type: String,
    },
    vendorAvatar: {
      type: String,
    },
    vendorRating: {
      type: Number,
      default: 5.0,
    },
    vendorReviewCount: {
      type: Number,
      default: 1,
    },
    category: {
      type: String,
      required: true,
    },
    catagory: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    priceUnit: {
      type: String,
      default: 'Starting Package',
    },
    location: {
      type: String,
      required: true,
    },
    images: {
      type: [String],
      default: [],
    },
    features: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
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
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        if (!ret.category && ret.catagory) {
          ret.category = ret.catagory;
        }
        return ret;
      },
    },
    toObject: { virtuals: true },
  }
);

const Service = mongoose.models.Service || mongoose.model('Service', serviceSchema);
export default Service;
