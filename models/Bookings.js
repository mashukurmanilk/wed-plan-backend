import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => `bkg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      default: 'Wedding Service',
    },
    serviceImage: {
      type: String,
    },
    serviceCategory: {
      type: String,
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
    customerId: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      default: 'Client',
    },
    customerEmail: {
      type: String,
    },
    customerPhone: {
      type: String,
    },
    eventDate: {
      type: String,
      required: true,
    },
    eventLocation: {
      type: String,
      required: true,
    },
    estimatedPrice: {
      type: Number,
      default: 0,
    },
    guestCount: {
      type: Number,
      default: 100,
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'cancelled'],
      default: 'pending',
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

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
export default Booking;
