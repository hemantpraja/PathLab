import mongoose from "mongoose";

const testMethodSchema = new mongoose.Schema({
    testName: {
        type: String,
        required: true
    }
})

export default testMethodSchema;