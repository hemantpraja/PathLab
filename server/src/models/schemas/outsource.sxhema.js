import mongoose from "mongoose";

const outsourceSchema = mongoose.Schema({
    testList: [{
        testName: {
            type: String,
        },
        tetsPrice: {
            type: Number,
            default: 0,
        },
    }],
    labName: {
        type: String,
    }
})


export default outsourceSchema; 