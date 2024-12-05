import mongoose from "mongoose";

const sampleCollectorSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Sample collector Name is required"],
        trim: true,
        minLength: [3, "Sample collector Name is too sort"],
    },
    phone: {
        type: String,
        required: [true, "Sample collector Phone is required"],
        trim: true,
        minLength: [10, "Sample collector Phone is too sort"],
        match: [/^[9876][0-9]{9}$/, '{VALUE} is not a valid phonenumber!'],
    },
    gender: {
        type: String,
        required: true,
        enum: ["Male", "Female", "Other"]
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, '{VALUE} is not a valid email address!'],
    },

})
export default sampleCollectorSchema;  