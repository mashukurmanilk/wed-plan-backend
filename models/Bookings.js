import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema(
    {
        serviceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            required: true
        },
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        eventDate: {
            type: Date,
            required: true
        },
        eventLocation: {
            type: String,
            required: true
        },
        message: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'accepted', 'rejected', 'cancelled'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
