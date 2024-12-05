import mongoose from "mongoose";

const itemSchema = mongoose.Schema({
    itemName: {
        type: String,
        required: [true, "Item Name is required"],
        trim: true,
        minLength: [3, "Item Name is too sort"],
    },
    consumptionUnit: {
        type: String,
        required: [true, "Consumption Unit is required"],
        trim: true,
    },
    alertQuantity: {
        type: Number,
        required: [true, "Alert Quantity is required"],
    },
    itemType: {
        type: String,
        required: [true, "Item Type is required"],
        trim: true,
    },
    purchaseUnit: {
        type: String,
        required: [true, "Purchase Unit is required"],
    },
    unitConversion: {
        type: Number,
        required: [true, "Unit Conversion is required"],
    }
}) 

export default itemSchema       ;