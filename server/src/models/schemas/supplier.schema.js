import mongoose from "mongoose";

const supplierSchema = mongoose.Schema({
    supplierName: {
        type: String,
        required: [true, "Supplier Name is required"],
        trim: true,
        minLength: [3, "Supplier Name is too sort"],
    },
    contactPerson: {
        type: String,
        required: [true, "Contact Person is required"],
        trim: true,
    },
    supplierPhone: {
        type: String,
        required: [true, "Supplier Phone is required"],
        trim: true,
    },
    supplierEmail: {
        type: String,
        required: [true, "Supplier Email is required"],
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, '{VALUE} is not a valid email address!'],

    },
    supplierAddress: {
        type: String,
        required: [true, "Address is required"],
        trim: true,

    }
})

export default supplierSchema;