import mongoose from "mongoose";

const centerSchema = mongoose.Schema({
    centerName: {
        type: String,
        required: [true, "Center Name is required"],
        trim: true,
        minLength: [3, "Center Name is too sort"],
    },
    centerPhone: {
        type: String,
        required: [true, "Center Phone is required"],
        trim: true,
        minLength: [10, "Center Phone is too sort"],
        match: [/^[9876][0-9]{9}$/, '{VALUE} is not a valid phonenumber!'],

    },  
    centerAddress: {
        type: String,
        trim: true,
        minLength: [20, "Center Address is too sort"],

    }
})


export default centerSchema;