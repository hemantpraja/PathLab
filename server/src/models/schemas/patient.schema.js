import mongoose from "mongoose";

const patientSchema = new mongoose.Schema({
    patientId: {
        type: String,
        required: [true, "Patient id is required"],
        validate: {
            validator: function (v) {
                return new Promise((resolve, reject) => {
                    this.model('Admin').findOne({ 'patients.patientId': v }, function (err, admin) {
                        if (err) {
                            reject(err);
                        }
                        resolve(!admin);
                    });
                });
            },
            message: 'Patient id already exists!'
        },
    },
    namePrefix: {
        type: String,
        required: [true, "Name  Prefix is requried"]
    },
    firstName: {
        type: String,
        required: [true, "FirstName is required"],
    },
    lastName: String,
    gender: {
        type: String,
        required: [true, "Gender is required"],
    },
    age: {
        type: Number,
        required: [true, "Age is required"],
    },
    ageType: {
        type: String,
        required: [true, "AgeType is required"],

    },
    prefixcontact: {
        type: String,
        default: "+91"
    },

    phone: {
        type: String,
        required: [true, "Phone is required"],
        trim: true,
        minLength: [10, "Phone is too sort"],
        match: [/^[9876][0-9]{9}$/, '{VALUE} is not a valid phonenumber!']
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, '{VALUE} is not a valid email address!'],
    },
    address: String,

    report: [{
        sampleCollector: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "sampleCollectorSchema",
        },
        referral: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "referralSchema",
        },
        collectedAt: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "addressSchema",
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "manageUserSchema",
        },
        packages: [{
            packageId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "packageListSchema",
            },
            totalAmount: Number,
        }],
        test: [
            {
                testId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "testListSchema"
                },
                testPrice: Number,
                comment: {
                    type: String,
                    default: ""
                },
                testObserved: [{
                    testObservedId: {
                        type: mongoose.Schema.Types.ObjectId,
                    },
                    testObservedValue: {
                        type: String,
                    },
                    subTestId: {
                        type: mongoose.Schema.Types.ObjectId,
                    },

                }],
            },
        ],
        totalPayment: {
            type: Number,
            default: 0,
        },
        duePayment: {
            type: Number,
            default: 0,
        },
        paidPayment: {
            type: Number,
            default: 0,
        },
        discountPercentage: {
            type: Number,
            default: 0,
        },
        discountAmount: {
            type: Number,
            default: 0,
        },
        paymentMethod: {
            type: String,
            default: "Cash",

        },
        paymentStatus: {
            type: String,
            default: "Pending",
        },
        registrationDate: {
            type: String,
            require: true,
        },
        note: {
            type: String,
            default: "",
        },
        issue: {
            type: String,
            default: "",
        },
        approveStatus: {
            type: Boolean,
            default: false,
        },
        footerStatus: {
            type: Boolean,
            default: false,
        }
    }],


});

export default patientSchema;

