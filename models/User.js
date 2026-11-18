import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    image:{
        type: String
    },
    role:{
        type: String,
        enum:["admin", "vendor", "user"],
        default: "user"
    },
    isBlocked:{
        type: Boolean,
        default: false
    },
    businessName:{
        type: String
    },
    subscriptionPlan:{
        type: String,
        enum:["basic", "premium"],
        default: "basic"
    },
    subscriptionExpiryDate:{
        type: Date
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

const User = mongoose.model('User', userSchema);
export default User;