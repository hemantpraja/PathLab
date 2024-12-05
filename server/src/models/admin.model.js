import mongoose from "mongoose";
import bcrypt from "bcrypt";
import centerSchema from "./schemas/center.schema.js";
import docterSchema from "./schemas/docterList.schema.js";
import itemSchema from "./schemas/item.schema.js";
import manageUserSchema from "./schemas/manageuser.schema.js";
import outsourceSchema from "./schemas/outsource.sxhema.js";
import packageListSchema from "./schemas/packageList.schema.js";
import patientSchema from "./schemas/patient.schema.js";
import organizationSchema from "./schemas/organization.schema.js";
import sampleCollectorSchema from "./schemas/sampleCollector.schema.js";
import supplierSchema from "./schemas/supplier.schema.js";
import testListSchema from "./schemas/testList.schema.js";
import addressSchema from "./schemas/address.schema.js";
import testMethodSchema from "./schemas/testMethod.schema.js";
import testOptionSchema from "./schemas/testOption.schema.js";
// import otpSchema from "./otp.model.js";
const adminSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "OwnerName is required"],
        trim: true,
        minLength: [3, "Name is too sort"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, '{VALUE} is not a valid email address!'],
    },
    labName: {
        type: String,
        required: [true, "Lab Name is required"],
        trim: true,
        minLength: [3, "Name is too sort"],
    },
    otp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OTP'
    },
    verify: {
        type: Boolean,
        default: false,
    },
    phone: {
        type: String,
        trim: true,
        minLength: [10, "Phone Number is too short"],
    },
    city: {
        type: String,
    },
    website: {
        type: String,
    },
    address: {
        type: String,
    },
    patients: [patientSchema],
    collectors: [sampleCollectorSchema],
    collectedAt: [addressSchema],
    testList: [testListSchema],
    package: [packageListSchema],
    outsource: [outsourceSchema],
    organisations: [organizationSchema],
    manageUser: [manageUserSchema],
    testMethod: [testMethodSchema],
    testOption: [testOptionSchema],
    item: [itemSchema],
    supplier: [supplierSchema],
    reportheader: {
        type: String,
    },
    reportfooter: {
        type: String,
    },
    billheading: {
        type: String,
    },
    gstnumber: {
        type: String,
    },
    isGstNumber: {
        type: Boolean,
        default: false
    },
    signature: {
        type: String,
    },
    billSignatureName: {
        type: String,
    },
    docterDetails: [docterSchema],
}

)
const adminModel = mongoose.model("Admin", adminSchema);
export default adminModel;