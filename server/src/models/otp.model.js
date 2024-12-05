import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema({
    otp: {
        type: String,
        required: [true, "OTP is required"]
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '5m' 
    }
});

const otpModel = mongoose.models.OTP || mongoose.model("OTP", otpSchema);
export default otpModel;