import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
    {
        vendorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        plan: {
            type: String,
            default: 'premium'
        },
        amount: {
            type: Number,
            required: true
        },
        currency: {
            type: String,
            default: 'bdt'
        },
        stripeSessionId: {
            type: String,
            required: true,
            unique: true
        },
        stripeSubscriptionId: {
            type: String
        },
        status: {
            type: String,
            enum: ['pending', 'succeeded', 'failed'],
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

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;
