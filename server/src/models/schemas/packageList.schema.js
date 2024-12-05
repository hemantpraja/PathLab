import mongoose from "mongoose";

const packageListSchema = mongoose.Schema({
    packageName: {
        type: String,
        required: [true, "Package Name is required"]
    },
    test: [
        {
            testId: { type: mongoose.Schema.Types.ObjectId, ref: "testListSchema" },
            testPrice: Number,
        }
    ],
    totalAmount: {
        type: Number,
        default: 0,
    }
})

export default packageListSchema; 