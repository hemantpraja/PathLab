import mongoose from "mongoose";


const docterSchema = mongoose.Schema({
    docterName: {
        type: String,
        required: [true, "Docter Name is required"],
    },
    degree: {
        type: String,
        required: [true, "Degree is required"],
    },
    signature: {
        type: String,
    },
})


export default docterSchema;