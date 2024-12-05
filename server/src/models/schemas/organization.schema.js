import mongoose from "mongoose";

const referralSchema = mongoose.Schema({
    referralType: {
        type: String,
        required: [true, "referralType is required"],
        trim: true,
        enum: ['doctor', 'Hospital',],
    },
    referralName: {
        type: String,
        required: [true, "referral Name is required"],
        trim: true,
        minLength: [3, "referral Name is too sort"],
    },
    compliment: {
        type: Number,
        required: [true, "compliment is required"],
    },
    loginAccess: {
        type: Boolean,
        default: false,
    },
    clearDue: {
        type: Boolean,
        default: false,
    },
    financialAnalysis: {
        type: Boolean,
        default: false,
    },
    docterLogin: {
        username: {
            type: String,
            required: [true, "User Name is required"],
            trim: true,
            minLength: [3, "User Name is too sort"],

        },
        password: {
            type: String,
            required: [true, "Password is required"],
            trim: true,
            minLength: [8, "Password is too short"],
            match: [/^(?=.*[0-9])(?=.*[@])[A-Z][a-zA-Z0-9@]*$/, '{VALUE} is not a valid password!']
        },
        phone: {
            type: String,
            required: [true, "Phone is required"],
            trim: true,
            minLength: [10, "Phone is too sort"],
            match: [/^[9876][0-9]{9}$/, '{VALUE} is not a valid phonenumber!']
        },
        address: {
            type: String,
            trim: true,
        }
    }
},
    {
        timestamps: true
    }
)
export default referralSchema;