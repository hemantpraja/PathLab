import mongoose from "mongoose";

const manageUserSchema = mongoose.Schema({
    role: {
        reception: {
            isActive: {
                type: Boolean,
                default: false,
            },
            tabs: {
                newRegistration: {
                    type: Boolean,
                    default: false,
                },
                patientList: {
                    type: Boolean,
                    default: false,
                },
            },
            permissions: {
                editBill: {
                    type: Boolean,
                    default: false,

                },
                editPatient: {
                    type: Boolean,
                    default: false,
                },
                editTestPrice: {
                    type: Boolean,
                    default: false,

                },
                deleteBill: {
                    type: Boolean,
                    default: false,
                },
                clearDue: {
                    type: Boolean,
                    default: false,
                },
            }
        },
        technician: {
            isActive: {
                type: Boolean,
                default: false,
            },
            tabs: {
                reportsEntry: {
                    type: Boolean,
                    default: false,
                },
                testList: {
                    type: Boolean,
                    default: false,
                },
            },
        },
        doctor: {
            isActive: {
                type: Boolean,
                default: false,
            },
            tabs: {
                enterVerify: {
                    type: Boolean,
                    default: false,
                },
                patientList: {
                    type: Boolean,
                    default: false,
                },
            },
            permissions: {
                editTestPrice: {
                    type: Boolean,
                    default: false,
                },
                editTest: {
                    type: Boolean,
                    default: false,
                },
                addNewTest: {
                    type: Boolean,
                    default: false,
                },
                editPackage: {
                    type: Boolean,
                    default: false,
                },
                addNewPackage: {
                    type: Boolean,
                    default: false,
                },
                deletePackage: {
                    type: Boolean,
                    default: false,
                }
            }
        },
    },
    userName: {
        type: String,
        required: [true, "User Name is required"],
        trim: true,
        minLength: [3, "User Name is too sort"],
    },
    userPhone: {
        type: String,
        required: [true, "User Phone is required"],
        trim: true,
        minLength: [10, "User Phone is too sort"],
        match: [/^[9876][0-9]{9}$/, '{VALUE} is not a valid phonenumber!'],
    },
    userGender: {
        type: String,
        required: [true, "User Gender is required"],
        trim: true,
        enum: ['Male', 'Female', 'Other',],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        validate: {
            validator: function (v) {
                return new Promise((resolve, reject) => {
                    this.model('Admin').findOne({ 'manageUser.email': v }, function (err, admin) {
                        if (err) {
                            reject(err);
                        }
                        resolve(!admin);
                    });
                });
            },
            message: 'Email already exists!'
        },
        trim: true,
        lowercase: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, '{VALUE} is not a valid email address!'],
    },
    loginStatus: {
        type: Boolean,
        default: false,
    },
    otp: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OTP'
    },
    verify: {
        type: Boolean,
        default: false,
    },
    logoutStatus: {
        type: Boolean,
        default: false,
    },
    blockStatus: {
        type: Boolean,
        default: false,
    },
})

export default manageUserSchema;