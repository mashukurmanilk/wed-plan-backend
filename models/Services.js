import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    serviceName:{
        type: String,
        required: true
    },
    vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catagory:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    images:{
        type: [String]
        // required: true
    },
    status:{
        type: String,
        enum:["pending", "approved", "rejected"],
        default: "pending"
    },
    isActive:{
        type: Boolean,
        default: true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    }
})

export default mongoose.model('Service', serviceSchema);