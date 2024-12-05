import jwt from "jsonwebtoken";
import adminModel from "../../models/admin.model.js";
import generateOtp from "../../utils/generateOtp.js"
import sendEmail from "../../services/mail.service.js"
import otpModel from "../../models/otp.model.js"

const adminSignup = async (request, response) => {
    try {

        const existAdmin = await adminModel.findOne({
            email: request.body.email,
        });
        if (existAdmin) {
            response.json({
                success: false,
                message: "email Id is already exist",
            })
        }
        else {
            const otp = generateOtp(6);
            const message = `Your PathLab verification code is ${otp}`
            console.log("OTP : ", otp, "Email :  ", request.body.email)
            const mailStatus = await sendEmail({ to: request.body.email, text: message })
            console.log("mailStatus : ", mailStatus);
            if (mailStatus) {
                const otpResponse = await otpModel.create({ otp: otp });
                if (!otpResponse) {
                    response.json({
                        success: false,
                        message: "Otp creation failed",
                    })
                }
                const admin = await adminModel.create({
                    name: request.body.name,
                    email: request.body.email,
                    labName: request.body.labName,
                    phone: request.body.phone,
                    otp: otpResponse?._id,
                })
                if (!admin) {
                    response.json({
                        success: false,
                        message: "Something went wrrong when Admin Singup",
                    })
                }
                response.json({
                    success: true,
                    message: "Otp send SuccessFully",
                    data: { id: admin._id, email: admin.email, labName: admin.labName }
                })
            }
            else {
                response.json({
                    success: false,
                    message: "Mail not send",
                })
            }
        }
    } catch (error) {
        console.log("Error : controller > authController > adminSignup > Catch : ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const resendOTP = async (request, response) => {
    try {

        const otp = generateOtp(6);
        const message = `Your PathLab verification code is ${otp}`
        console.log(message)
        const mailStatus = await sendEmail({ to: request.body.email.adminEmail, text: message })
        console.log("mailStatus : ", mailStatus)
        if (mailStatus) {

            if (request.body.email.userEmail && request.body.email.userId) {
                const user = await adminModel.findOneAndUpdate(
                    { email: request.body.email.adminEmail, "manageUser._id": request.body.email.userId },
                    { $set: { "manageUser.$.verify": false } },
                )
                if (!user) {
                    response.json({
                        success: false,
                        message: "user not exist",
                    })
                }
                else {

                    const otpResponse = await otpModel.create({ otp: otp });
                    if (otpResponse) {
                        const updateAdmin = await adminModel.findOneAndUpdate(
                            { email: request.body.email.adminEmail, "manageUser._id": request.body.email.userId },
                            { $set: { "manageUser.$.otp": otpResponse._id } },)

                        if (updateAdmin) {
                            response.json({
                                success: true,
                                message: "OTP resend successfully",
                                data: { otpId: otpResponse?._id, }
                            })
                        }
                        else {
                            response.json({
                                success: false,
                                message: "Something went wrong",
                            })
                        }
                    }
                    else {
                        response.json({
                            success: false,
                            message: "OTP creation failed",
                        })
                    }
                }
            }
            else {
                const admin = await adminModel.findOneAndUpdate(
                    { email: request.body.email.adminEmail },
                    { $set: { verify: false } },
                )
                if (!admin) {
                    response.json({
                        success: false,
                        message: "admin not exist",
                    })
                }
                else {
                    const otpResponse = await otpModel.create({ otp: otp });
                    if (otpResponse) {
                        const updateAdmin = await adminModel.findOneAndUpdate(
                            { email: request.body.email.adminEmail },
                            { $set: { otp: otpResponse._id } },)
                        response.json({
                            success: true,
                            message: "OTP resend successfully",
                            data: { id: updateAdmin._id, otpId: otpResponse?._id, email: updateAdmin.email }
                        })
                    }
                    else {
                        response.json({
                            success: false,
                            message: "OTP creation failed",
                        })
                    }

                }
            }
        }
        else {
            response.json({
                success: false,
                message: "Mail not send",
            })
        }

    } catch (error) {
        console.log("Error : controller > authController > resendOTP > Catch : ", error)
        response.json({
            success: false,
            message: error.message,
        })

    }
}

const verifyEmail = async (request, response) => {
    try {

        if (request.body.email && request.body.userEmail && request.body.userId) {

            const user = await adminModel.findOneAndUpdate(
                { email: request.body.email, "manageUser._id": request.body.userId },
                {
                    $set:
                    {
                        "manageUser.$.verify": true,
                        "manageUser.$.logoutStatus": false,
                    }
                },
            )

            if (user) {
                const currentManageUser = user.manageUser.find(manageUser => manageUser._id.toString()
                    === request.body.userId);

                const otpResponse = await otpModel.findOneAndUpdate(
                    { _id: currentManageUser.otp, otp: request.body.otp },
                    { $set: { otp: '' } }, { new: true }
                );

                if (otpResponse) {
                    const token = jwt.sign({ email: request.body.email, userEmail: currentManageUser.email, userId: currentManageUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" })

                    response
                        .json({
                            success: true,
                            message: "admin Signup successfully",
                            data: currentManageUser,
                            token: token,
                        })
                }

                else {
                    response.json({
                        success: false,
                        message: "Otp not match",
                    })
                }
            }

            else {
                response.json({
                    success: false,
                    message: "Email not verify",
                })
            }
        }

        else {
            const admin = await adminModel.findOneAndUpdate(
                { email: request.body.email }, { $set: { verify: true } },)

            if (admin) {
                const otpResponse = await otpModel.findOneAndUpdate(
                    { _id: admin.otp, otp: request.body.otp },
                    { $set: { otp: '' } }, { new: true }
                );
                if (otpResponse) {
                    const token = jwt.sign({ email: admin.email, }, process.env.JWT_SECRET_KEY, { expiresIn: "5d" })
                    response.json({
                        success: true,
                        message: "admin Signup successfully",
                        data: { _id: admin._id, email: admin.email },
                        token: token,
                    })
                }
                else {
                    response.json({
                        success: false,
                        message: "Otp not match",
                    })
                }
            }

            else {
                response.json({
                    success: false,
                    message: "Email not verify",
                })
            }
        }
    }
    catch (error) {
        console.log("Error : controller > authController > verifyEmail > catch >  ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const adminSignin = async (request, response) => {
    try {

        if (request.body.email && request.body.userEmail) {
            const user = await adminModel.findOne(
                { email: request.body.email, "manageUser.email": request.body.userEmail },
                { "manageUser.$": 1 } // Project only the matching manageUser element
            );

            if (!user) {
                response.json({
                    success: false,
                    message: "user not exist"
                })
            }

            else {

                if (user.manageUser[0].loginStatus === true
                    && user.manageUser[0].blockStatus === false) {
                    const otp = generateOtp(6);
                    const message = `Your PathLab verification code is ${otp}`
                    console.log("OTP : ", otp, "Email :  ", request.body.userEmail)
                    const mailStatus = await sendEmail({ to: request.body.userEmail, text: message })
                    console.log("mail status : ", mailStatus);

                    if (mailStatus) {

                        const otpResponse = await otpModel.create({ otp: otp });

                        const loginUser = await adminModel.findOneAndUpdate(
                            { email: request.body.email, "manageUser._id": user.manageUser[0]._id },
                            {
                                $set: {
                                    "manageUser.$.otp": otpResponse?._id,
                                    "manageUser.$.verify": false,
                                    "manageUser.$.logoutStatus": false
                                }
                            },
                            { new: true }
                        )

                        if (!loginUser) {

                            response.json({
                                success: false,
                                message: "Something went wrrong when Admin SingIn",
                            })
                        }
                        const currentManageUser = loginUser.manageUser.find(manageUser => manageUser._id.toString()
                            === user.manageUser[0]._id.toString());
                        response
                            .json({
                                success: true,
                                message: "Admin login successfully",
                                data: { email: request.body.email, userEmail: currentManageUser.email, userId: currentManageUser._id }
                            })
                    }

                    else {
                        response.json({
                            success: false,
                            message: "Mail not send",
                        })
                    }

                }

                else {
                    response.json({
                        success: false,
                        message: "User have not permission to login",
                    })
                }

            }
        }

        else {
            const admin = await adminModel.findOne({
                email: request.body.email,
            })
            if (!admin) {
                response.json({
                    success: false,
                    message: "admin not exist"
                })
            }

            else {

                const otp = generateOtp(6);
                const message = `Your PathLab verification code is ${otp}`
                console.log("OTP : ", otp, "Email :  ", request.body.email)
                const mailStatus = await sendEmail({ to: request.body.email, text: message })
                console.log("mail status : ", mailStatus);

                if (mailStatus) {

                    const otpResponse = await otpModel.create({ otp: otp });
                    if (otpResponse) {
                        const admin = await adminModel.findOneAndUpdate(
                            { email: request.body.email },
                            { $set: { otp: otpResponse?._id, verify: false } },
                            { new: true }
                        )
                        if (!admin) {
                            response.json({
                                success: false,
                                message: "Something went wrrong when Admin SingIn",
                            })
                        }
                        response
                            .json({
                                success: true,
                                message: "Admin login successfully",
                                data: { id: admin._id, otpId: otpResponse?._id, email: admin.email }
                            })
                    }

                    else {
                        response.json({
                            success: false,
                            message: "Otp creation failed",
                        })
                    }

                }

                else {
                    response.json({
                        success: false,
                        message: "Mail not send",
                    })
                }
            }
        }

    }
    catch (error) {
        console.log("Error : controller > authController > AdminSignin > catch >  ", error)
        response.json({
            success: false,
            message: error.message,

        })
    }
}

const getAdminDetails = async (request, response) => {
    try {
        const admin = await adminModel.findOne({
            email: request.body.email,
        })
        if (!admin) {
            response.json({
                success: false,
                message: "admin not exist"
            })
        }
        else {
            response
                .json({
                    success: true,
                    message: "Admin Details",
                    data: {
                        id: admin._id, name: admin.name, email: admin.email,
                        labName: admin.labName, phone: admin.phone, reportheader: admin?.reportheader,
                        address: admin?.address, website: admin?.website,
                        city: admin?.city,
                        reportfooter: admin?.reportfooter,
                        signature: admin?.signature,
                        billheading: admin?.billheading,
                        gstnumber: admin?.gstnumber,
                        isGstNumber: admin?.isGstNumber,
                        billSignatureName: admin?.billSignatureName,

                    }
                })
        }
    }
    catch (error) {
        console.log("Error : controller > authController > getAdminDetails > catch >  ", error)
        response.json({
            success: false,
            message: error.message,

        })
    }

}

const updateAdminProfile = async (request, response) => {
    try {
        const existingAdmin = await adminModel.findOne({
            email: request.body.email,
        })
        if (existingAdmin?.length > 0 && (existingAdmin[0]?.email !== request.body.email)) {

            response.json({
                success: false,
                message: "Admin already exist",
            })
        }
        else {
            const admin = await adminModel.findOneAndUpdate(
                { email: request.body.email },
                {
                    $set: {
                        name: request.body.name,
                        labName: request.body.labName,
                        phone: request.body.phone,
                        city: request.body.city,
                        website: request.body.website,
                        address: request.body.address,
                    }
                },
                { new: true }
            )
            if (!admin) {
                response.json({
                    success: false,
                    message: "Something went wrrong when Admin Update Profile",
                })
            }
            else {
                response
                    .json({
                        success: true,
                        message: "Admin Profile Update successfully",
                        data: { id: admin._id, name: admin.name, email: admin.email, labName: admin.labName }
                    })
            }

        }

    }
    catch (error) {
        console.log("Error : controller > authController > updateAdminProfile > catch >  ", error)
        response.json({
            success: false,
            message: error.message,
        })

    }
}


export { adminSignup, adminSignin, verifyEmail, resendOTP, getAdminDetails, updateAdminProfile }
