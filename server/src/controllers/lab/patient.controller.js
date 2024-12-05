// import { request } from "express";
import mongoose, { set } from "mongoose";
const { ObjectId } = mongoose.Types;
import adminModel from "../../models/admin.model.js";
// import generateSlug from "../../utils/generateSlug.js";

const addPatient = async (request, response) => {
    try {

        if (request.body._id) {

            const updatePatient = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "patients._id": request.body._id },
                {
                    $set: {
                        "patients.$.namePrefix": request?.body?.namePrefix,
                        "patients.$.firstName": request.body.firstName,
                        "patients.$.lastName": request.body.lastName,
                        "patients.$.gender": request.body?.gender,
                        "patients.$.age": request.body?.age,
                        "patients.$.geType": request.body?.ageType,
                        "patients.$.prefixcontact": request.body.prefixcontact,
                        "patients.$.phone": request.body.phone,
                        "patients.$.email": request.body?.email,
                        "patients.$.address": request.body?.address,
                        "patients.$.sampleCollector": (request.body?.sampleCollector) ? request.body.sampleCollector : null,
                        "patients.$.referral": (request.body?.referral) ? request.body.referral : null,
                        "patients.$.collectedAt": (request.body?.collectedAt) ? request.body.collectedAt : null,


                    }
                },
                { new: true, useFindAndModify: false }
            );

            if (!updatePatient) {
                response.json({
                    success: false,
                    message: "Something went wrrong when patient update",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Patient update  successfully",
                    })
            }

        }
        else {
            const isValidObjectId = (id) => {
                return mongoose.Types.ObjectId.isValid(id);
            };

            const newPatient = {
                patientId: request.body.patientId,
                namePrefix: request.body.namePrefix,
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                gender: request.body.gender,
                age: request.body.age,
                ageType: request.body.ageType,
                prefixcontact: request.body.prefixcontact,
                phone: request.body.phone,
                email: request.body.email,
                address: request.body.address,
                report: [{
                    sampleCollector: isValidObjectId(request.body.sampleCollector) ? request.body.sampleCollector : null,
                    referral: isValidObjectId(request.body.referral) ? request.body.referral : null,
                    collectedAt: isValidObjectId(request.body.collectedAt) ? request.body.collectedAt : null,
                    packages: [], // Ensure packages is initialized as an array
                    test: [], // Ensure test is initialized as an array
                    totalPayment: request.body.totalPayment,
                    duePayment: request.body.duePayment,
                    paidPayment: request.body.paidPayment,
                    discountPercentage: request.body.discountPercentage,
                    discountAmount: request.body.discountAmount,
                    paymentMethod: request.body.paymentMethod,
                    paymentStatus: request.body.paymentStatus,
                    registrationDate: request.body.registrationDate,
                    note: request.body.note || "",
                    issue: request.body.issue || "",
                    approveStatus: request.body.approveStatus || false,
                    footerStatus: request.body.footerStatus || false,
                }],
            };

            // Ensure request.body.test is defined and is an array before processing
            if (Array.isArray(request.body.test)) {
                request.body.test.forEach(item => {
                    if (item.packageName) {
                        const existingPackage = newPatient.report[0].packages.find(pkg => pkg.packageName === item.packageName);
                        if (existingPackage) {
                            existingPackage.test = existingPackage.test.concat(item.test.map(test => ({
                                testId: test.testId,
                                testPrice: test?.testPrice || test?.totalAmount,
                            })));
                        } else {
                            newPatient.report[0].packages.push({
                                packageName: item.packageName,
                                packageId: item._id,
                                totalAmount: item.totalAmount,
                                test: item.test.map(test => ({
                                    testId: test.testId,
                                    testPrice: test?.testPrice || test?.totalAmount,
                                })),
                            });
                        }

                        item.test.forEach(test => {
                            newPatient.report[0].test.push({
                                testId: test.testId,
                                testPrice: test?.testPrice || test?.totalAmount,
                            });
                        });
                    } else if (item.testName) {
                        newPatient.report[0].test.push({
                            testId: item._id,
                            testPrice: item.testPrice,
                        });
                    }
                });
            }

            const patient = await adminModel.findByIdAndUpdate(
                { _id: request.body.id },
                { $push: { patients: newPatient } },
                { new: true, useFindAndModify: false }
            );
            if (!patient) {
                response.json({
                    success: false,
                    message: "Something went wrong when adding patient",
                });
            }
            else {
                const data = patient.patients[patient.patients.length - 1]
                response.status(201).json({
                    success: true,
                    message: "Patient added successfully",
                    data: data._id
                });
            }


        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addPatient > catch ", error);
        response.json({
            success: false,
            message: error.message,
        });
    }
};

const getPatient = async (request, response) => {

    try {
        const patient = await adminModel.aggregate(

            [
                {
                    "$match": {
                        "_id": new ObjectId(request.body.id)
                    }
                },
                {
                    "$unwind": {
                        "path": "$patients",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$addFields": {
                        // Retrieve collector details
                        "collector": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$collectors",
                                        "as": "collector",
                                        "cond": { "$eq": ["$$collector._id", "$patients.sampleCollector"] }
                                    }
                                },
                                0
                            ]
                        },
                        // Retrieve organisation details
                        "organisation": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$organisations",
                                        "as": "organisation",
                                        "cond": { "$eq": ["$$organisation._id", "$patients.referral"] }
                                    }
                                },
                                0
                            ]
                        },
                        // Retrieve collected details
                        "collected": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$collectedAt",
                                        "as": "collected",
                                        "cond": { "$eq": ["$$collected._id", "$patients.collectedAt"] }
                                    }
                                },
                                0
                            ]
                        },
                        // Map test details
                        "patient.testsDetails": {
                            "$map": {
                                "input": "$patients.test",
                                "as": "test",
                                "in": {
                                    "$mergeObjects": [
                                        "$$test",
                                        {
                                            "$arrayElemAt": [
                                                {
                                                    "$filter": {
                                                        "input": "$testList",
                                                        "as": "testdetail",
                                                        "cond": { "$eq": ["$$testdetail._id", "$$test.testId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$patients._id",
                        "patient": { "$first": "$patients" },
                        "collector": { "$first": "$collector" },
                        "organisation": { "$first": "$organisation" },
                        "collected": { "$first": "$collected" },
                        "testsDetails": { "$first": "$patient.testsDetails" }
                    }
                },
                {
                    "$addFields": {
                        "patient.testDetails": "$testsDetails"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": {
                            "patient": "$patient",
                            "collector": "$collector",
                            "organisation": "$organisation",
                            "collected": "$collected"
                        }
                    }
                }
            ]
        );

        if (!patient || patient.length === 0) {
            response.json({
                success: false,
                message: "Something went wrong when patient add",
            });
        } else {
            const newData = patient;
            response.status(201).json({
                success: true,
                message: "Patient add successfully",
                data: { patient: newData }
            });
        }
    }
    catch (error) {
        response.json({
            success: false,
            message: error.message,
        });

    }
}

const getOnePatient = async (request, response) => {
    try {

        const patient = await adminModel.aggregate(
            [
                {
                    "$match": {
                        "_id": new ObjectId(request.body.id)
                    }
                },
                {
                    "$unwind": {
                        "path": "$patients",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$match": {
                        "patients._id": new ObjectId(request.body._id)
                    }
                },
                {
                    "$addFields": {
                        "collector": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$collectors",
                                        "as": "collector",
                                        "cond": { "$eq": ["$$collector._id", "$patients.sampleCollector"] }
                                    }
                                },
                                0
                            ]
                        },
                        "organisation": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$organisations",
                                        "as": "organisation",
                                        "cond": { "$eq": ["$$organisation._id", "$patients.referral"] }
                                    }
                                },
                                0
                            ]
                        },
                        "collected": {
                            "$arrayElemAt": [
                                {
                                    "$filter": {
                                        "input": "$collectedAt",
                                        "as": "collected",
                                        "cond": { "$eq": ["$$collected._id", "$patients.collectedAt"] }
                                    }
                                },
                                0
                            ]
                        },
                        "patient.testsDetails": {
                            "$map": {
                                "input": "$patients.test",
                                "as": "test",
                                "in": {
                                    "$mergeObjects": [
                                        "$$test",
                                        {
                                            "$arrayElemAt": [
                                                {
                                                    "$filter": {
                                                        "input": "$testList",
                                                        "as": "testdetail",
                                                        "cond": { "$eq": ["$$testdetail._id", "$$test.testId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$addFields": {
                        "patient.packageData": {
                            "$map": {
                                "input": "$patients.packages",
                                "as": "package",
                                "in": {
                                    "$mergeObjects": [
                                        "$$package",
                                        {
                                            "$arrayElemAt": [
                                                {
                                                    "$filter": {
                                                        "input": "$package",
                                                        "as": "packageData",
                                                        "cond": { "$eq": ["$$packageData._id", "$$package.packageId"] }
                                                    }
                                                },
                                                0
                                            ]
                                        }
                                    ]
                                }
                            }
                        }
                    }
                },
                {
                    "$group": {
                        "_id": "$patients._id",
                        "patient": { "$first": "$patients" },
                        "collector": { "$first": "$collector" },
                        "organisation": { "$first": "$organisation" },
                        "collected": { "$first": "$collected" },
                        "testsDetails": { "$first": "$patient.testsDetails" },
                        "packageData": { "$first": "$patient.packageData" }
                    }
                },
                {
                    "$addFields": {
                        "patient.testDetails": "$testsDetails",
                        "patient.packageData": "$packageData"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": {
                            "patient": "$patient",
                            "collector": "$collector",
                            "organisation": "$organisation",
                            "collected": "$collected"
                        }
                    }
                }
            ]
        );

        if (!patient || patient.length === 0) {
            response.json({
                success: false,
                message: "Something went wrong when fetching patient data",
            });
        }
        else {
            const newData = patient[0];

            response.status(201).json({
                success: true,
                message: "Patient data fetched successfully",
                data: newData
            });
        }

    } catch (error) {
        response.json({
            success: false,
            message: error.message,
        });
    }
}

const deleteOnePatient = async (request, response) => {
    try {

        if (request.body._id) {

            const updatePatient = await adminModel.findOneAndUpdate(
                { _id: request.body.id, },
                { $pull: { patients: { _id: request.body._id } } },
                { new: true, useFindAndModify: false });

            if (!updatePatient) {
                response.json({
                    success: false,
                    message: "Something went wrrong when patient update",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Patient delete  successfully",
                    })
            }

        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > deleteOnePatient > catch ", error);
        response.json({
            success: false,
            message: error.message,
        });


    }
}

const preprocessData = (data) => {
    const groupedData = {};

    data.forEach(item => {
        if (!groupedData[item.patientTestId]) {
            groupedData[item.patientTestId] = {
                patientTestId: item.patientTestId,
                tests: []
            };
        }

        groupedData[item.patientTestId].tests.push({
            testObservedId: item.testId,
            testObservedValue: item.observedValue,
            subTestId: item.subTestId || null,
        });
    });

    return Object.values(groupedData);
};

const editReport = async (request, response) => {
    try {

        const groupedData = preprocessData(request.body.allvalue);

        for (const data of groupedData) {

            const { patientTestId, tests } = data;

            await adminModel.updateOne(
                {
                    _id: new ObjectId(request.body.adminId),
                    "patients._id": new ObjectId(request.body.patientId),
                    "patients.test.testId": new ObjectId(patientTestId)
                },
                {
                    $set: {
                        "patients.$[patient].test.$[test].testObserved": tests
                    }
                },
                {
                    arrayFilters: [
                        { "patient._id": new ObjectId(request.body.patientId) },
                        { "test.testId": new ObjectId(patientTestId) }
                    ]
                }
            );
        }

        response.json({
            success: true,
            message: "Report updated successfully",
        })

    } catch (error) {

        console.log("Error : controller > admin > patient.controller > editReport > catch ", error);
        response.json({
            success: false,
            message: error.message,

        });
    }
};

const addNote = async (request, response) => {
    try {
        const patient = await adminModel.findOneAndUpdate(
            { _id: request.body.adminId, "patients._id": request.body.patientId },
            {
                $set: {
                    "patients.$.footerStatus": request?.body?.footerStatus,
                    "patients.$.note": request?.body?.data?.note,
                }
            },
            { new: true, useFindAndModify: false }
        );
        if (!patient) {
            response.json({
                success: false,
                message: "Something went wrrong when patient add",
            })
        }

        else {
            response.json({
                success: true,
                message: "Patient add  successfully",
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addNote > catch ", error);
        response.json({
            success: false,
            message: error.message,
        });
    }
}

const addIssue = async (request, response) => {
    try {

        const patient = await adminModel.findOneAndUpdate(
            { _id: request.body.adminId, "patients._id": request.body.patientId },
            {
                $set: {
                    "patients.$.approveStatus": request?.body?.status,
                    "patients.$.issue": request?.body?.data?.issue
                }
            },
            { new: true, useFindAndModify: false }
        );

        if (!patient) {
            response.json({
                success: false,
                message: "Something went wrrong when issue adde ",
            })
        }

        else {
            response.json({
                success: true,
                message: "Issue added successfully",
            })
        }
    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addissue > catch ", error)

    }
}



const addSampleCollector = async (request, response) => {
    try {

        if (request.body._id) {

            const collector = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "collectors._id": request.body._id },
                {
                    $set: {
                        "collectors.$.name": request.body.name,
                        "collectors.$.phone": request.body.phone,
                        "collectors.$.gender": request.body.gender,
                        "collectors.$.email": request.body.email,
                    }
                },
                { new: true, useFindAndModify: false }
            );

            if (!collector) {
                response.json({
                    success: false,
                    message: "Something went wrrong when sampleCollector add",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Patient add  successfully",
                    })
            }
        }

        else {

            const newsampleCollector = {
                name: request.body.name,
                phone: request.body.phone,
                gender: request.body.gender,
                email: request.body.email,
            }

            const collector = await adminModel.findByIdAndUpdate(
                { _id: request.body.id },
                { $push: { collectors: newsampleCollector } },
                { new: true, useFindAndModify: false }
            );

            if (!collector) {
                response.json({
                    success: false,
                    message: "Something went wrrong when sampleCollector add",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Collector  add  successfully",
                        data: [...collector.collectors]
                    })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addSampleCollector > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addOrganisation = async (request, response) => {
    try {

        if (request.body._id) {

            const organization = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "organisations.organizationId": request.body.organizationId },
                {
                    $set: {
                        "organisations.$.organizationId": request.body.organizationId,
                        "organisations.$.referralType": request.body.referralType,
                        "organisations.$.referralName": request.body.referralName,
                        "organisations.$.compliment": request.body.compliment,
                        "organisations.$.loginAccess": request.body.loginAccess,
                        "organisations.$.clearDue": request.body.clearDue,
                        "organisations.$.financialAnalysis": request.body.financialAnalysis,
                        "organisations.$.docterLogin": request.body.docterLogin,
                    }
                },
                { new: true, useFindAndModify: false }
            );

            if (!organization) {
                response.json({
                    success: false,
                    message: "Something went wrrong when raferral  add",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Raferrral add  successfully",
                        data: [...organization.organisations]
                    })
            }
        }

        else {

            const newOrganization = {
                referralType: request.body.referralType,
                referralName: request.body.referralName,
                compliment: request.body.compliment,
            }
            const organization = await adminModel.findByIdAndUpdate(
                { _id: request.body.id, },
                { $push: { organisations: newOrganization } },
                { new: true, useFindAndModify: false }
            );

            if (!organization) {
                response.json({
                    success: false,
                    message: "Something went wrrong when raferral  add",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Raferrral add  successfully",
                        data: [...organization.organisations]
                    })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addSampleCollector > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addAddress = async (request, response) => {
    try {

        const newAddress = {
            address: request.body.address,
        }
        const address = await adminModel.findByIdAndUpdate(
            { _id: request.body.id, },
            { $push: { collectedAt: newAddress } },
            { new: true, useFindAndModify: false }
        );

        if (!address) {
            response.json({
                success: false,
                message: "Something went wrrong when raferral  add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "Address add  successfully",
                    data: [...address.collectedAt]
                })
        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > addAddress > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }

}

const getAddress = async (request, response) => {
    try {

        const address = await adminModel.findById({ _id: request.body.id });
        if (!address) {
            response.json({
                success: false,
                message: "Something went wrrong when patient add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "Address add  successfully",
                    data: [...address.collectedAt]
                })
        }

    }
    catch (error) {
        console.log("Error : controller > admin > patient.controller > getAddress > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const getAllData = async (request, response) => {
    try {

        const data = await adminModel.findById({ _id: request.body.id });

        if (!data) {
            response.json({
                success: false,
                message: "Something went wrrong when patient add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "Patient add  successfully",
                    data: { ...data }
                })
        }
    }

    catch (error) {
        console.log("Error : controller > admin > patient.controller > getAllData > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }

}

const getSampleCollector = async (request, response) => {
    try {
        const collector = await adminModel.findById({ _id: request.body.id });

        if (!collector) {
            response.json({
                success: false,
                message: "Something went wrrong when patient add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "collector get successfully",
                    data: [...collector.collectors]
                })
        }

    }
    catch (error) {
        console.log("Error : controller > admin > patient.controller > getSampleCollector > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const getOrganisation = async (request, response) => {
    try {

        const organisation = await adminModel.findById({ _id: request.body.id });

        if (!organisation) {
            response.json({
                success: false,
                message: "Something went wrrong when patient add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "organisation get successfully",
                    data: [...organisation.organisations]
                })
        }

    }
    catch (error) {
        console.log("Error : controller > admin > patient.controller > getOrganisation > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addPatientByUser = async (request, response) => {
    try {
        const isValidObjectId = (id) => {
            return mongoose.Types.ObjectId.isValid(id);
        };

        const newPatient = {
            namePrefix: request.body.namePrefix,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
            gender: request.body.gender,
            age: request.body.age,
            ageType: request.body.ageType,
            phone: `${request.body.prefixcontact}:${request.body.phone}`,
            email: request.body.email,
            address: request.body.address,
            sampleCollector: isValidObjectId(request.body.sampleCollector) ? request.body.sampleCollector : null,
            referral: isValidObjectId(request.body.referral) ? request.body.referral : null,
            collectedAt: isValidObjectId(request.body.collectedAt) ? request.body.collectedAt : null,
            user: isValidObjectId(request.body.userId) ? request.body.userId : null,
            test: (request.body.test) ? request.body.test.map(test => ({
                testId: test._id,
                testPrice: test.testPrice,
            })) : [],
            totalPayment: request.body.totalPayment,
            duePayment: request.body.duePayment,
            paidPayment: request.body.paidPayment,
            discountPercentage: request.body.discountPercentage,
            discountAmount: request.body.discountAmount,
            paymentMethod: request.body.paymentMethod,
            paymentStatus: request.body.paymentStatus,
            registrationDate: request.body.registrationDate,
        };

        const patient = await adminModel.findByIdAndUpdate(
            { _id: request.body.id },
            { $push: { patients: newPatient } },
            { new: true, useFindAndModify: false }
        );

        if (!patient) {
            response.json({
                success: false,
                message: "Something went wrong when adding patient",
            });
        }
        else {
            const data = patient.patients[patient.patients.length - 1]

            response.status(201).json({
                success: true,
                message: "Patient added successfully",
                data: data._id
            });
        }
    } catch (error) {

    }
}

const getSlugPatient = async (request, response) => {
    try {
        console.log("Request.body", request.body)
        const slugData = await adminModel.aggregate(
            [
                {
                    $match: {
                        _id: new ObjectId(request.body.id), // Replace with the actual admin document _id
                    },
                },
                {
                    $unwind: "$patients",
                },
                {
                    "$match": {
                        'patients.patientId': (request.body.patientId)  // Replace with the actual testList entry _id
                    }
                },
                {
                    $project: {
                        patients: 1,
                    },
                },
            ]
        )
        console.log("Slug Data", slugData)
        if (slugData) {
            response.status(201).json({
                success: true,
                message: "Patient slug found",
                data: slugData
            })
        }
        else {
            response.status(201).json({
                success: false,
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > patient.controller > getSlugPatient > catch ", error)
    }
}

export {
    addPatient, addSampleCollector, addOrganisation, addAddress, getPatient,
    getAllData, getSampleCollector, getOrganisation, getAddress,
    getOnePatient, deleteOnePatient, editReport, addPatientByUser, addIssue, addNote, getSlugPatient
}
