import mongoose from "mongoose";
const { ObjectId } = mongoose.Types;
import adminModel from "../../models/admin.model.js";
// import csv from "csvtojson"
import { uploadOnCloudinary } from "../../services/cloudinary.service.js";
import xlsx from "xlsx";
import fs from 'fs';
import { request } from "http";

const addTestList = async (request, response) => {
    try {

        const { id, perentTestId, test, subtestId, subTest } = request.body;

        if (id && perentTestId && subtestId) {

            const newSubTest = {
                name: subTest.name,
                testMethod: subTest.testMethod,
                field: subTest.field,
                unit: subTest.unit,
                textrange: subTest.textrange,
                min: subTest.min,
                max: subTest.max,
                numericUnboundType: subTest.numericUnboundType,
                numericUnboundValue: subTest.numericUnboundValue,
                options: subTest?.options?.map(option => ({
                    value: option
                })),
                default: subTest.default,
                comment: subTest.comment,
                formula: subTest.formula,
                formulaType: subTest.formulaType
            };

            const updateResult = await adminModel.updateOne(
                { _id: id, "testList._id": perentTestId, "testList.test._id": subtestId },
                { $push: { "testList.$[outer].test.$[inner].subTest": newSubTest } },
                {
                    arrayFilters: [{ "outer._id": perentTestId }, { "inner._id": subtestId }],
                    useFindAndModify: false
                }
            );

            if (updateResult.Modified === 0) {
                response.json({
                    success: false,
                    message: "Something went wrong when adding the subTest",
                });
            }
            else {

                const updatedAdmin = await adminModel.findOne(
                    { _id: id, "testList._id": perentTestId },
                    { "testList.$": 1 }
                );

                const updatedTestList = updatedAdmin.testList[0];
                const updatedTest = updatedTestList.test.find(test => test._id.toString() === subtestId);
                const addedSubTest = updatedTest.subTest[updatedTest.subTest.length - 1];
                response.status(201).json({
                    success: true,
                    message: "SubTest added successfully",
                    data: addedSubTest,
                });
            }
        }

        else if (perentTestId && id) {

            if (test.testFieldType === "text") {

                const newTest = {
                    textTest: test.textTest,
                    testFieldType: test.testFieldType,
                }

                const testList = await adminModel.findOneAndUpdate(
                    { _id: id, "testList._id": perentTestId },
                    { $set: { "testList.$.test": newTest } },
                    {
                        new: true,
                        useFindAndModify: false,
                        projection: {
                            testList: { $elemMatch: { _id: perentTestId } }
                        }
                    }
                );

                if (!testList) {
                    response.json({
                        success: false,
                        message: "Something went wrrong when testList  add",
                    })
                }

                else {
                    const updatedTestList = testList.testList[0]; // This will have the specific testList item
                    const addedTest = updatedTestList.test[updatedTestList.test.length - 1];
                    response.status(201)
                        .json({
                            success: true,
                            message: "TestList  add  successfully",
                            data: addedTest,
                        })
                }
            }

            else {
                const newTest = {
                    testFieldType: test.testFieldType,
                    name: test.name,
                    testMethod: test.testMethod,
                    field: test.field,
                    unit: test.unit,
                    textrange: test.textrange,
                    min: test.min,
                    max: test.max,
                    numericUnboundType: test.numericUnboundType,
                    numericUnboundValue: test.numericUnboundValue,
                    options: test?.options?.map(option => ({
                        value: option
                    })),
                    default: test.default,
                    comment: test.comment,
                    formula: test.formula,
                    formulaType: test.formulaType,
                    textTest: test.textTest
                };

                const testList = await adminModel.findOneAndUpdate(
                    { _id: id, "testList._id": perentTestId },
                    { $push: { "testList.$.test": newTest } },
                    {
                        new: true,
                        useFindAndModify: false,
                        projection: {
                            testList: { $elemMatch: { _id: perentTestId } }
                        }
                    }
                );

                if (!testList) {
                    response.json({
                        success: false,
                        message: "Something went wrrong when testList  add",
                    })
                }

                else {
                    const updatedTestList = testList.testList[0]; // This will have the specific testList item
                    const addedTest = updatedTestList.test[updatedTestList.test.length - 1];
                    response.status(201)
                        .json({
                            success: true,
                            message: "TestList  add  successfully",
                            data: addedTest,
                        })
                }
            }

        }

        else {

            const newTestList = {
                department: request.body.department,
                testName: request.body.testName,
                testPrice: request.body.testPrice,
                testCode: request.body.testCode,
                gender: request.body.gender,
                sampleType: request.body.sampleType,
                test: request.body.test,
            }
            const testList = await adminModel.findByIdAndUpdate(
                { _id: request.body.id },
                { $push: { testList: newTestList } },
                { new: true, useFindAndModify: false }
            );

            if (!testList) {
                response.json({
                    success: false,
                    message: "Something went wrrong when testList add",
                })
            }

            else {
                const addedTest = testList.testList[testList.testList.length - 1];
                response.status(201)
                    .json({
                        success: true,
                        message: "TestList add  successfully",
                        data: addedTest,
                    })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > testList.controller > addTestList > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addDefaultTestList = async (request, response) => {
    try {

        const sampleData = [
            {
                department: "Hematology",
                testName: "Complete Blood Count",
                testPrice: 500,
                testCode: "CBC123",
                gender: "Male",
                sampleType: "Blood",
                test: [
                    {
                        testFieldType: "single field",
                        name: "WBC",
                        testMethod: "single field",
                        field: "numeric",
                        unit: "x10^9/L",
                        min: 4.0,
                        max: 11.0,
                        options: "",
                        default: "",
                        comment: ["White Blood Cells"],
                        formula: "",
                        formulaType: ""
                    },
                    {
                        testFieldType: "single field",
                        name: "RBC",
                        testMethod: "single field",
                        field: "numeric",
                        unit: "x10^12/L",
                        min: 4.5,
                        max: 6.0,
                        options: "",
                        default: "",
                        comment: ["Red Blood Cells"],
                        formula: "",
                        formulaType: ""
                    }
                ]
            },
            {
                department: "Biochemistry",
                testName: "Liver Function Test",
                testPrice: 700,
                testCode: "LFT456",
                gender: "Female",
                sampleType: "Blood",
                test: [
                    {
                        testFieldType: "multiple field",
                        name: "ALT",
                        testMethod: "Western Blotting",
                    },
                    {
                        testFieldType: "single field",
                        name: "AST",
                        testMethod: "Qualitative",
                        field: "numeric",
                        unit: "U/L",
                        min: 10,
                        max: 40,
                        options: "",
                        default: "",
                        comment: ["Aspartate Transaminase"],
                        formula: "",
                        formulaType: ""
                    }
                ]
            },
        ];
        const testList = await adminModel.findByIdAndUpdate(
            { _id: request.body.id },
            { $push: { testList: sampleData } },
            { new: true, useFindAndModify: false }
        );

        if (!testList) {
            response.json({
                success: false,
                message: "Something went wrrong when testList add",
            })
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "TestList add  successfully",
                    data: { id: testList._id, email: testList.email, labName: testList.labName }

                })
        }

    } catch (error) {
        console.log("Error : controller > admin > testList.controller > addDefaultTestList > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addTestListFile = async (request, response) => {
    try {
        const file = request.file;

        const workbook = xlsx.readFile(file.path);

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        const jsonData = xlsx.utils.sheet_to_json(sheet);


        const structuredData = jsonData.map(row => ({
            department: row.department,
            testName: row.testName,
            testPrice: row.testPrice,
            testCode: row.testCode,
            gender: row.gender,
            sampleType: row.sampleType,
            test: [{
                testFieldType: row.testFieldType,
                name: row?.name,
                testMethod: row?.testMethod,
                field: row?.field,
                unit: row?.unit,
                min: row?.min,
                max: row?.max,
                textrange: row?.textrange,
                numericUnboundType: row?.numericUnboundType,
                numericUnboundValue: row?.numericUnboundValue,
                subTest: row?.subTest ? row?.subTest.split('; ').map(sub => {
                    const parts = sub?.split(', ');
                    let result = {
                        name: parts[0]?.split(': ')[0],
                        testMethod: parts[0]?.split(': ')[1],
                        field: parts[1],
                        unit: parts[2]
                    };
                    if (parts[1] === "numeric") {
                        result.min = parseInt(parts[3]?.split('-')[0]);
                        result.max = parseInt(parts[3]?.split('-')[1]);
                    } else if (parts[1] === "text") {
                        result.textrange = parts[3];
                    } else if (parts[1] === "numeric unbound") {
                        result.numericUnboundType = parts[3]?.split('-')[0];
                        result.numericUnboundValue = parseInt(parts[3]?.split('-')[1]);
                    } else if (parts[1] === "multiple ranges") {
                        result.textrange = parts[3];
                    }
                    return result;
                }) : [],
            }],
        }));

        structuredData.map((data) => {
            if (data?.test[0]?.subTest) {
            }
        })
        const testList = await adminModel.findByIdAndUpdate(
            { _id: request.body.id },
            { $push: { testList: structuredData } },
            { new: true, useFindAndModify: false }
        );

        if (!testList) {
            response.json({
                success: false,
                message: "Something went wrrong when testList add",
            })
        }

        else {
            fs.unlinkSync(file.path);
            response.status(201)
                .json({
                    success: true,
                    message: "TestList add  successfully",
                })
        }

    } catch (error) {
        console.log("Error : controller > admin > testList.controller > addDefaultTestList > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addPackage = async (request, response) => {
    try {

        if (request.body._id) {

            const Package = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "package._id": request.body._id },
                {
                    $set: {
                        "package.$.packageName": request.body.packageName,
                        "package.$.totalAmount": request.body.packagePrice,
                        "package.$.test": request.body.test ? request.body.test.map(test => ({
                            testId: test._id,
                            testPrice: test.testPrice,
                        })) : [],
                    }
                },
                { new: true, useFindAndModify: false }
            );

            if (!Package) {
                response.json({
                    success: false,
                    message: "Something went wrrong when package  add",
                })
            }

            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Package  Update  successfully",
                    })
            }
        }

        else {
            const newPackage = {
                packageName: request.body.packageName,
                test: Array.isArray(request.body.test) ? request.body.test.map(test => ({
                    testId: test._id,
                    testPrice: test.testPrice,
                })) : [],
                totalAmount: request.body.packagePrice,
            }
            const Package = await adminModel.findByIdAndUpdate(
                { _id: request.body.id },
                { $push: { package: newPackage } },
                { new: true, useFindAndModify: false }

            );
            if (!Package) {
                response.json({
                    success: false,
                    message: "Something went wrrong when package add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Package add  successfully",
                    })
            }
        }

    }
    catch (error) {
        console.log("Error : controller > admin > package.controller > addPackage > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}


const manageUser = async (request, response) => {
    try {

        if (request.body.id) {
            console.log("ADMIN data", request.body)
            const userDetails = await adminModel.findOne(
                {
                    _id: request.body.adminId,
                    manageUser: {
                        $elemMatch: {
                            $or: [
                                { email: request.body.email },
                                { userPhone: request.body.userPhone }
                            ]
                        }
                    }
                },
                { "manageUser.$": 1 } // Projection to include only the matched element in the array
            );
            console.log("manageuserData", userDetails?.manageUser)
            if (userDetails?.manageUser.length > 0 && userDetails?.manageUser[0]?.email !== request.body.email
                && userDetails?.manageUser[0]?.userPhone !== request?.body?.userPhone) {
                response.json({
                    success: false,
                    message: "User already exist",
                })
            }

            else {
                const user = await adminModel.findOneAndUpdate(
                    { _id: request.body.adminId, "manageUser._id": request.body.id },
                    {
                        $set: {
                            "manageUser.$.userName": request?.body?.userName,
                            "manageUser.$.userPhone": request?.body?.userPhone,
                            "manageUser.$.userGender": request?.body.userGender,
                            "manageUser.$.email": request?.body.email,
                            "manageUser.$.role": request?.body.role,
                        }
                    },
                    { new: true, useFindAndModify: false }
                );

                if (!user) {
                    response.json({
                        success: false,
                        message: "Something went wrrong when userAddd  add",
                    })
                }
                else {
                    const currentManageUser = user.manageUser.find(user => user._id.toString()
                        === request.body.id);
                    response.status(201)
                        .json({
                            success: true,
                            message: "ManageUser update  successfully",
                            data: { manageUser: currentManageUser }
                        })
                }
            }
        }
        else {

            const userDetails = await adminModel.findOne(
                {
                    _id: request.body.adminId,
                    manageUser: {
                        $elemMatch: {
                            $or: [
                                { email: request.body.email },
                                { userPhone: request.body.userPhone }
                            ]
                        }
                    }
                },
                { "manageUser.$": 1 }
            );
            if (userDetails?.manageUser) {
                response.json({
                    success: false,
                    message: "User already exist",
                })
            }

            else {

                const newManageUser = {
                    userName: request.body.userName,
                    role: request.body.role,
                    userPhone: request.body.userPhone,
                    userGender: request.body.userGender,
                    email: request.body.email,
                }
                const manageUser = await adminModel.findByIdAndUpdate(
                    { _id: request.body.adminId },
                    { $push: { manageUser: newManageUser } },
                    { new: true, useFindAndModify: false }
                );

                if (!manageUser) {
                    response.json({
                        success: false,
                        message: "Something went wrrong when manageUser add",
                    })
                }

                else {
                    const lastAddManageUser = manageUser.manageUser[manageUser.manageUser.length - 1];
                    response.status(201)
                        .json({
                            success: true,
                            message: "ManageUser add successfully",
                            data: { manageUser: lastAddManageUser }
                        })
                }
            }

        }

    } catch (error) {
        console.log("Error : controller > admin > manageUser.controller > manageUser > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addCenter = async (request, response) => {
    try {

        const newCenter = {

            centerName: request.body.centerName,
            centerPhone: request.body.centerPhone,
            centerAddress: request.body.centerAddress,

        }
        const center = await adminModel.findOneAndUpdate(
            { _id: request.body.id },
            { $push: { "labName": newCenter } },
            { new: true, useFindAndModify: false }
        );

        if (!center) {
            response.json({
                success: false,
                message: "Something went wrrong when center add",
            })
        }

        else {

            response.status(201)
                .json({
                    success: true,
                    message: "Center add  successfully",
                    data: { ...center.center, }
                })
        }

    } catch (error) {
        console.log("Error : controller > admin > center.controller > addCenter > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const getTest = async (request, response) => {
    try {

        const tetsList = await adminModel.aggregate(
            [
                {
                    $match: {
                        _id: new ObjectId(request.body.id),
                    },
                },
                {
                    $unwind: "$testList",
                },
                {
                    $replaceRoot: { newRoot: "$testList" }
                }
            ]);

        if (!tetsList || tetsList.length === 0) {
            response.json({
                success: false,
                message: "Something went wrong when patient Get",
            });
        }

        else {

            response.status(201)
                .json({
                    success: true,
                    message: "TestList add  successfully",
                    data: { test: tetsList }
                })
        }

    }
    catch (error) {
        console.log("Error : controller > admin > testList.controller > getTestList > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }

}

const getOneTest = async (request, response) => {
    try {
        const test = await adminModel.aggregate(
            [
                {
                    $match: {
                        _id: new ObjectId(request.body.id), // Replace with the actual admin document _id
                    },
                },
                {
                    $unwind: "$testList",
                },
                {
                    "$match": {
                        'testList._id': new ObjectId(request.body._id)  // Replace with the actual testList entry _id
                    }
                },
                {
                    $project: {
                        testList: 1,
                    },
                },
            ]
        )

        if (!test || test.length === 0) {
            response.json({
                success: false,
                message: "Test not found",
            })
        }

        else {

            response.status(201)
                .json({
                    success: true,
                    message: "Test found",
                    data: test
                })
        }

    }
    catch (error) {
        console.log("Error : controller > admin > testList.controller > getOneTest > catch ", error)
    }
}

const updateOneTest = async (request, response) => {
    try {


        if (request.body.id && request.body.parentId && request.body.subtestId && request.body.subtestsubId) {
            const test = await adminModel.findOneAndUpdate(
                {
                    _id: request.body.id,
                    "testList._id": request.body.parentId,
                    "testList.test._id": request.body.subtestId,
                    "testList.test.subTest._id": request.body.subtestsubId
                },
                {
                    $set: {
                        "testList.$[outer].test.$[middle].subTest.$[inner].name": request?.body?.name || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].testFieldType": request?.body?.testFieldType || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].testMethod": request?.body?.testMethod || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].field": request?.body?.field || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].unit": request?.body?.unit || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].textrange": request?.body?.textrange || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].min": request?.body?.min || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].max": request?.body?.max || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].numericUnboundType": request?.body?.numericUnboundType || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].numericUnboundValue": request?.body?.numericUnboundValue || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].default": request?.body?.default || "",
                        "testList.$[outer].test.$[middle].subTest.$[inner].options": request?.body?.options?.map(option => ({
                            value: option
                        })),
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "outer._id": request.body.parentId },
                        { "middle._id": request.body.subtestId },
                        { "inner._id": request.body.subtestsubId }
                    ],
                    useFindAndModify: false
                }
            );
            if (!test) {
                response.json({
                    success: false,
                    message: "Something went wrrong when testList add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "TestList update  successfully",
                    })
            }

        }
        else if (request.body.id && request.body.parentId && request.body.subtestId) {


            const test = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body.parentId, "testList.test._id": request.body.subtestId },
                {
                    $set: {
                        "testList.$[outer].test.$[inner].name": request.body?.name || "",
                        "testList.$[outer].test.$[inner].testFieldType": request.body?.testFieldType || "",
                        "testList.$[outer].test.$[inner].testMethod": request.body?.testMethod || "",
                        "testList.$[outer].test.$[inner].field": request.body?.field || "",
                        "testList.$[outer].test.$[inner].unit": request.body?.unit || "",
                        "testList.$[outer].test.$[inner].textrange": request.body?.textrange || "",
                        "testList.$[outer].test.$[inner].min": request.body?.min || "",
                        "testList.$[outer].test.$[inner].max": request.body?.max || "",
                        "testList.$[outer].test.$[inner].numericUnboundType": request?.body?.numericUnboundType || "",
                        "testList.$[outer].test.$[inner].numericUnboundValue": request?.body?.numericUnboundValue || "",
                        "testList.$[outer].test.$[inner].numericUnboundValue": request?.body?.default || "",
                        "testList.$[outer].test.$[inner].options": request?.body?.options?.map(option => ({
                            value: option
                        })),
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "outer._id": request.body.parentId },
                        { "inner._id": request.body.subtestId }
                    ],
                    useFindAndModify: false
                }
            );
            if (!test) {
                response.json({
                    success: false,
                    message: "Something went wrrong when testList add",
                })
            }
            else {
                const updatedTest = test.testList.find(parent => parent._id.toString() === request.body.parentId)
                    ?.test.find(subtest => subtest._id.toString() === request.body.subtestId);
                response.status(201)
                    .json({
                        success: true,
                        message: "TestList update  successfully",
                        data: updatedTest,
                    })
            }
        }
        else {

            const test = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body._id },
                {
                    $set: {
                        "testList.$.department": request.body?.department || "",
                        "testList.$.testName": request.body?.testName || "",
                        "testList.$.testPrice": request.body?.testPrice || "",
                        "testList.$.testCode": request.body?.testCode || "",
                        "testList.$.gender": request.body?.gender || "",
                        "testList.$.sampleType": request.body?.sampleType || "",
                    }
                },
                { new: true, useFindAndModify: false }
            );
            if (!test) {
                response.json({
                    success: false,
                    message: "Something went wrrong when testList add",
                })
            }
            else {

                response.status(201)
                    .json({
                        success: true,
                        message: "TestList update  successfully",
                        // data: newtest,
                    })
            }
        }

    }
    catch (error) {
        console.log("Error : controller > admin > testList.controller > updateOneTest > catch ", error)
    }
}

const getPackage = async (request, response) => {
    try {
        const packageList = await adminModel.aggregate(
            [
                {
                    "$match": {
                        "_id": new ObjectId(request.body.id)
                    }
                },
                {
                    "$unwind": {
                        "path": "$package",
                        "preserveNullAndEmptyArrays": true
                    }
                },
                {
                    "$addFields": {
                        // Retrieve collector details

                        // Map test details
                        "package.testsDetails": {
                            "$map": {
                                "input": "$package.test",
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
                        "_id": "$package._id",
                        "package": { "$first": "$package" },

                    }
                },
                {
                    "$addFields": {
                        "package.testDetails": "$testsDetails"
                    }
                },
                {
                    "$replaceRoot": {
                        "newRoot": {
                            "package": "$package"
                        }
                    }
                }
            ]);

        if (!packageList || packageList.length === 0) {
            response.json({
                success: false,
                message: "Something went wrong when patient Get",
            });
        }
        else {
            response.status(201)
                .json({
                    success: true,
                    message: "Package get  successfully",
                    data: { package: packageList }
                })
        }

    } catch (error) {
        console.log("Error : controller > admin > package.controller > getPackage > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })

    }

}

const deletePackage = async (request, response) => {
    try {

        const Onepackage = await adminModel.findByIdAndUpdate(
            { _id: request.body.id, "labName._id": request.body.labId },
            { $pull: { package: { _id: request.body._id } } },
            { new: true, useFindAndModify: false }
        );

        if (!Onepackage) {
            response.json({
                success: false,
                message: "Something went wrong when package delete",
            });
        }

        else {
            response.status(201)
                .json({
                    success: true,
                    message: "Package delete  successfully",
                })
        }


    } catch (error) {
        console.log("Error : controller > admin > package.controller > deletePackage > catch ", error)
    }

}

const addFormula = async (request, response) => {
    try {


        if (request.body.subTestsubId) {

            const formula = await adminModel.findByIdAndUpdate({
                _id: request?.body?.id,
                "labName._id": request?.body?.labId,
                "testList._id": request?.body?.parentTestId,
                "testList.test._id": request?.body?.subTestId,
                "testList.test.subTest._id": request?.body?.subTestsubId
            },

                {
                    $set: {
                        "testList.$[outer].test.$[middle].subTest.$[inner].formula": request?.body?.formula,
                        "testList.$[outer].test.$[middle].subTest.$[inner].isFormula": true,
                        "testList.$[outer].test.$[middle].subTest.$[inner].formulaType": request?.body?.formulaType,
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "outer._id": request.body.parentTestId },
                        { "middle._id": request.body.subTestId },
                        { "inner._id": request.body.subTestsubId }
                    ],
                    useFindAndModify: false
                }

            )

            if (!formula) {
                response.json({
                    success: false,
                    message: "Something went wrong when formula add",
                })
            }
            else {
                response.status(201).json({
                    success: true,
                    message: "Formula add  successfully",
                })
            }
        }

        else {
            const formula = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body.parentTestId, "testList.test._id": request.body.subTestId },
                {
                    $set: {
                        "testList.$[outer].test.$[inner].formula": request.body?.formula || "",
                        "testList.$[outer].test.$[inner].isFormula": true,
                        "testList.$[outer].test.$[inner].formulaType": request.body?.formulaType || "",
                    }
                },
                {
                    new: true,
                    arrayFilters: [
                        { "outer._id": request.body.parentTestId },
                        { "inner._id": request.body.subTestId }
                    ],
                    useFindAndModify: false
                }
            );

            if (!formula) {
                response.json({
                    success: false,
                    message: "Something went wrong when formula add",
                })
            }
            else {
                response.status(201).json({
                    success: true,
                    message: "Formula add  successfully",
                })
            }
        }


    } catch (error) {

    }

}


const deleteOneTest = async (request, response) => {
    try {

        if (request.body.subtestsubId) {

            const test = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body.parentId, "testList.test._id": request.body.subtestId },
                { $pull: { "testList.$.test.$[subTest].subTest": { _id: request.body.subtestsubId } } },
                {
                    new: true,
                    arrayFilters: [{ "subTest._id": request.body.subtestId }],
                    useFindAndModify: false
                }
            );

            if (!test) {
                response.json({
                    success: false,
                    message: "Something went wrong when test delete",
                });
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "Test delete  successfully",
                })
            }
        }

        else {

            const test = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body.parentId },
                { $pull: { "testList.$.test": { _id: request.body.subtestId } } },
                { new: true, useFindAndModify: false }
            );

            if (!test) {
                response.json({
                    success: false,
                    message: "Something went wrong when test delete",
                });
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "Test delete  successfully",
                })
            }
        }


    } catch (error) {
        console.log("Error : controller > admin > testList.controller > deletTest > catch ", error)
    }
}

const manageUserLogin = async (request, response) => {
    try {

        const manageUser = await adminModel.findOneAndUpdate(
            { _id: request.body.id, "manageUser._id": request.body?.manageUserId },
            {
                $set: {
                    "manageUser.$.loginStatus": request.body?.loginStatus,
                    "manageUser.$.logoutStatus": request.body?.logoutStatus,
                    "manageUser.$.blockStatus": request.body?.blockStatus
                }
            },
            { new: true, useFindAndModify: false }
        )

        if (!manageUser) {
            response.json({
                success: false,
                message: "Something went wrong when manageUser login",
            })
        }

        else {
            response.status(201).json({
                success: true,
                message: "User status update  successfully",
                // data: { manageUser: currentManageUser.loginStatus }
            })
        }


    } catch (error) {

    }
}

const analysisReportTest = async (request, response) => {
    try {

        const analysisReport = await adminModel.aggregate([
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
                "$unwind": {
                    "path": "$patients.test",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$group": {
                    "_id": {
                        "registrationDate": "$patients.registrationDate",
                        "testId": "$patients.test.testId"
                    },
                    "testCount": { "$sum": 1 },
                    "totalTestPrice": { "$sum": "$patients.test.testPrice" },
                    "testList": { "$first": "$testList" }
                }
            },
            {
                "$addFields": {
                    "testDetails": {
                        "$arrayElemAt": [
                            {
                                "$filter": {
                                    "input": "$testList",
                                    "as": "testdetail",
                                    "cond": { "$eq": ["$$testdetail._id", "$_id.testId"] }
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                "$group": {
                    "_id": "$_id.registrationDate",
                    "tests": {
                        "$push": {
                            "testId": "$_id.testId",
                            "testCount": "$testCount",
                            "totalTestPrice": "$totalTestPrice",
                            "testName": "$testDetails.testName"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "registrationDate": "$_id",
                    "tests": 1
                }
            }
        ]);
        if (!analysisReport) {
            response.json({
                success: false,
                message: "Something went wrong when analysisReport get",
            })
        }

        else {
            analysisReport.sort((a, b) => b.totalTestPrice - a.totalTestPrice);
            response.status(201).json({
                success: true,
                message: "AnalysisReport get  successfully",
                data: { analysisReport: analysisReport }
            })
        }


    } catch (error) {
        console.log("Error : controller > admin > analysisReportTest.controller > analysisReportTest > catch ", error)
    }
}

const analysisReportOrganisation = async (request, response) => {
    try {

        const analysisReport = await adminModel.aggregate([
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
                "$unwind": {
                    "path": "$patients.test",
                    "preserveNullAndEmptyArrays": true
                }
            },
            {
                "$group": {
                    "_id": {
                        "referral": "$patients.referral",
                        "registrationDate": "$patients.registrationDate"
                    },
                    "totalTests": { "$sum": 1 },
                    "totalTestPrice": { "$sum": "$patients.test.testPrice" },
                    "tests": { "$push": "$patients.test" },
                    "organisations": { "$first": "$organisations" } // Include organisations in the group stage
                }
            },
            {
                "$addFields": {
                    "organizationDetails": {
                        "$cond": {
                            "if": { "$eq": ["$_id.referral", null] },
                            "then": [{ "referralName": "Self" }],
                            "else": {
                                "$filter": {
                                    "input": "$organisations", // Use the organisations from the grouped result
                                    "as": "org",
                                    "cond": { "$eq": ["$$org._id", "$_id.referral"] }
                                }
                            }
                        }
                    }
                }
            },
            {
                "$group": {
                    "_id": "$_id.registrationDate",
                    "referralGroups": {
                        "$push": {
                            "organization": {
                                "$arrayElemAt": ["$organizationDetails.referralName", 0]
                            },
                            "totalTests": "$totalTests",
                            "totalTestPrice": "$totalTestPrice",
                            "tests": "$tests"
                        }
                    }
                }
            },
            {
                "$project": {
                    "_id": 0,
                    "registrationDate": "$_id",
                    "referralGroups": 1
                }
            }
        ]);



        if (!analysisReport) {
            response.json({
                success: false,
                message: "Something went wrong when analysisReport get",
            })
        }

        else {
            analysisReport.sort((a, b) => b.totalTestPrice - a.totalTestPrice);
            response.status(201).json({
                success: true,
                message: "AnalysisReport get  successfully",
                data: { analysisReport: analysisReport }
            })
        }


    } catch (error) {
        console.log("Error : controller > admin > analysisReportOrganisation.controller > analysisReportOrganisation > catch ", error)
    }

}

const addTestMethod = async (request, response) => {
    try {

        const newtestMethod = {
            testName: request.body.testMethod
        }

        const testMethod = await adminModel.findOneAndUpdate(
            { _id: request.body.id },
            { $push: { testMethod: newtestMethod } },
            { new: true, useFindAndModify: false }
        )

        if (!testMethod) {
            response.json({
                success: false,
                message: "Something went wrong when testMethod add",
            })
        }

        else {
            const newtestMethodData = testMethod.testMethod[testMethod.testMethod.length - 1]
            response.status(201).json({
                success: true,
                message: "TestMethod add  successfully",
                data: newtestMethodData
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > addTestMethod.controller > addTestMethod > catch ", error)
    }
}

const addDefaultTestMethod = async (request, response) => {
    try {
        const testMethods = [
            { testName: 'Serological Testing' },
            { testName: 'Hydrodynamic Focusing' },
            { testName: 'ELISA (Enzyme-Linked Immunosorbent Assay)' },
            { testName: 'Western Blotting' },
            { testName: 'Immunocytochemistry (ICC)' },
            { testName: 'Chromosomal Microarray Analysis (CMA)' },
            { testName: 'Flow Cytometry' },
            { testName: 'Polymerase Chain Reaction (PCR)' },
            { testName: 'Mass Spectrometry' },
            { testName: 'Next-Generation Sequencing (NGS)' },
            { testName: 'Microbial Culture' },
            { testName: 'Histopathology' },
            { testName: 'Electrophoresis' },
            { testName: 'Radiography' },
            { testName: 'Magnetic Resonance Imaging (MRI)' }
        ];

        const testMethod = await adminModel.findOneAndUpdate(
            { _id: request.body.id },
            { $push: { testMethod: testMethods } },
            { new: true, useFindAndModify: false }
        )

        if (!testMethod) {
            response.json({
                success: false,
                message: "Something went wrong when testMethod add",
            })
        }

        else {
            response.status(201).json({
                success: true,
                message: "TestMethod add  successfully",
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > addTestMethod.controller > addTestMethod > catch ", error)
    }

}

const addDefaultTestOption = async (request, response) => {
    try {
        const testOptions = [
            { option: 'Positive' },
            { option: 'Negative' },
            { option: 'Absent' },
            { option: 'Present' },
            { option: 'Reactive' },
            { option: 'Non-Reactive' },
        ];

        const testOption = await adminModel.findOneAndUpdate(
            { _id: request.body.id },
            { $push: { testOption: testOptions } },
            { new: true, useFindAndModify: false }
        )

        if (!testOption) {
            response.json({
                success: false,
                message: "Something went wrong when testMethod add",
            })
        }

        else {
            response.status(201).json({
                success: true,
                message: "TestMethod add  successfully",
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > addTestMethod.controller > addTestMethod > catch ", error)
    }

}

const getTestMethod = async (request, response) => {
    try {
        const testMethod = await adminModel.findById({ _id: request.body.id })
        response.status(201).json({
            success: true,
            message: "TestMethod get  successfully",
            data: testMethod.testMethod
        })
    } catch (error) {
        console.log("Error : controller > admin > getTestMethod.controller > getTestMethod > catch ", error)
    }
}

const getTestOption = async (request, response) => {
    try {
        const testMethod = await adminModel.findById({ _id: request.body.id })
        response.status(201).json({
            success: true,
            message: "TestMethod get  successfully",
            data: testMethod.testOption
        })
    } catch (error) {
        console.log("Error : controller > admin > getTestMethod.controller > getTestMethod > catch ", error)
    }
}


const addComment = async (request, response) => {
    try {

        if (request.body.patientId && request.body.parentTestId) {

            const comment = await adminModel.updateOne(
                {
                    _id: request.body.adminId,
                    "patients._id": request.body.patientId,
                    "patients.test.testId": request.body.parentTestId
                },
                {
                    $set: {
                        "patients.$[patient].test.$[test].comment": request.body.data.comment
                    }
                },
                {
                    arrayFilters: [
                        { "patient._id": request.body.patientId },
                        { "test.testId": request.body.parentTestId }
                    ]
                }
            );
            if (!comment) {
                response.json({
                    success: false,
                    message: "Something went wrong when comment add",
                })
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "Comment add  successfully",
                })
            }
        }

        else {

            const comment = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "testList._id": request.body.parentTestId },
                { $push: { "testList.$.comments": { comment: request.body.comment } } },
                { new: true, useFindAndModify: false }
            )
            if (!comment) {
                response.json({
                    success: false,
                    message: "Something went wrong when comment add",
                })
            }
            else {
                response.status(201).json({
                    success: true,
                    message: "Comment add  successfully",
                })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > addComment.controller > addComment > catch ", error)
    }
}

const getUserDetails = async (request, response) => {
    try {
        if (request.body.userId) {
            const userDetails = await adminModel.findOne({
                _id: request.body.id,
                "manageUser._id": request.body.userId
            }, { "manageUser.$": 1 })

            if (!userDetails) {
                response.json({
                    success: false,
                    message: "Something went wrong when userDetails get",
                })
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "UserDetails get  successfully",
                    data: userDetails.manageUser[0]
                })
            }
        }

        else {
            const userDetails = await adminModel.findOne({ _id: request.body.id })

            if (!userDetails) {

                response.json({
                    success: false,
                    message: "Something went wrong when userDetails get",
                })
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "UserDetails get  successfully",
                    data: userDetails.manageUser
                })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > getUserDetails.controller > getUserDetails > catch ", error)
    }
}

const labReportDetails = async (request, response) => {

    try {

        const reportHeaderPath = request.files?.reportheader?.[0]?.path;
        const reportFooterPath = request.files?.reportfooter?.[0]?.path;

        const updateFields = {};
        if (reportHeaderPath) {

            const hedaer = await uploadOnCloudinary(reportHeaderPath);
            updateFields.reportheader = hedaer.url;
        }
        if (reportFooterPath) {
            const footer1 = await uploadOnCloudinary(reportFooterPath);
            updateFields.reportfooter = footer1.url;
        }
        const reportDetails = await adminModel.findOneAndUpdate({
            _id: request.body.id
        },
            {
                $set: {
                    reportheader: updateFields?.reportheader,
                    reportfooter: updateFields?.reportfooter,
                }
            },
            { new: true }
        )
        if (!reportDetails) {
            response.json({
                success: false,
                message: "Something went wrong when reportDetails get",
            })
        }
        else {
            response.json({
                success: true,
                message: "reportDetails get  successfully",
                data: { reportheader: reportDetails.reportheader, reportfooter: reportDetails.reportfooter }
            })
        }
    }
    catch (error) {
        console.log("Error : controller > admin > labReportDetails.controller > labReportDetails > catch", error)

    }

}

const deleteLabReportDetails = async (request, response) => {

    try {
        console.log("req.body ", request.body)
        const updateFields = {};

        if (request.body.reportheader !== undefined) {
            updateFields.reportheader = request.body.reportheader || "";
        }
        if (request.body.reportfooter !== undefined) {

            updateFields.reportfooter = request.body.reportfooter || "";
        }
        if (request.body.signature !== undefined) {

            updateFields.signature = request.body.signature || "";
        }


        // Perform the update operation
        const reportDetails = await adminModel.findOneAndUpdate(
            { _id: request.body.id },
            {
                $set: {
                    reportheader: updateFields?.reportheader,
                    reportfooter: updateFields?.reportfooter,
                    signature: updateFields?.signature
                }
            },
            { new: true }
        );
        if (!reportDetails) {
            response.json({
                success: false,
                message: "Something went wrong when reportDetails get",
            })
        }
        else {
            response.json({
                success: true,
                message: "reportDetails update  successfully",
            })
        }
    }
    catch (error) {
        console.log("Error : controller > admin > labReportDetails.controller > labReportDetails > catch", error)

    }

}


const labBillDetails = async (request, response) => {
    try {

        console.log("reweust .bsoy herwe :", request.body)
        const signature = request.files?.signature?.[0]?.path;
        const updateFields = {};
        if (signature) {
            const sign = await uploadOnCloudinary(signature);
            updateFields.signature = sign.url;
        }
        const labBillDetails = await adminModel.findOneAndUpdate({
            _id: request.body.id
        }, {
            $set: {
                billheading: request?.body?.billheading,
                gstnumber: request?.body?.gstnumber,
                signature: updateFields?.signature,
                isGstNumber: request.body?.isGstNumber,
                billSignatureName: request.body?.billSignatureName,

            }
        }, { new: true })

        if (!labBillDetails) {
            response.json({
                success: false,
                message: "Something went wrong when reportDetails get",
            })
        }
        else {
            response.json({
                success: true,
                message: "reportDetails get  successfully",
            })
        }

    } catch (error) {
        console.log("Error : controller > admin > labBillDetails.controller > labBillDetails > catch ", error)
    }
}

const labDocterDetails = async (request, response) => {
    try {

        if (request?.body?.docterId) {

            const signature = request.files?.signature?.[0]?.path;
            const updateFields = {};
            if (signature) {
                const sign = await uploadOnCloudinary(signature);
                updateFields.signature = sign.url;
            }
            const adminId = request.body.id;
            const user = await adminModel.findOneAndUpdate(
                { _id: adminId, "docterDetails._id": request?.body?.docterId },
                {
                    $set: {
                        "docterDetails.$.docterName": request?.body?.docterName,
                        "docterDetails.$.degree": request?.body?.degree,
                        "docterDetails.$.signature": updateFields?.signature,

                    }
                },
                { new: true, useFindAndModify: false }
            );
            if (!user) {
                response.json({
                    success: false,
                    message: "Something went wrrong when userAddd  add",
                })
            }
            else {

                response.json({
                    success: true,
                    message: "ManageUser update  successfully",
                })
            }
        }
        else {
            const signature = request.files?.signature?.[0]?.path;
            const updateFields = {};
            if (signature) {
                const sign = await uploadOnCloudinary(signature);
                updateFields.signature = sign.url;
            }

            const newData = {
                docterName: request?.body?.docterName,
                degree: request?.body?.degree,
                signature: updateFields?.signature,
            };

            const adminId = request.body.id;

            const labBillDetails = await adminModel.findOneAndUpdate(
                { _id: adminId },
                {
                    $push: { docterDetails: newData }
                },
                { new: true, useFindAndModify: false }
            );
            if (!labBillDetails) {
                response.json({
                    success: false,
                    message: "Something went wrrong when userAddd  add",
                })
            }
            else {

                response.json({
                    success: true,
                    message: "ManageUser update  successfully",
                })
            }

        }


    } catch (error) {
        console.log("Error : controller > admin > labBillDetails.controller > labBillDetails > catch ", error)
    }
}

const getDocterDetails = async (request, response) => {
    try {
        if (request.body.userId) {
            const userDetails = await adminModel.findOne({
                _id: request.body.id,
                "manageUser._id": request.body.userId
            }, { "manageUser.$": 1 })

            if (!userDetails) {
                response.json({
                    success: false,
                    message: "Something went wrong when userDetails get",
                })
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "UserDetails get  successfully",
                    data: userDetails.manageUser[0]
                })
            }
        }

        else {
            const userDetails = await adminModel.findOne({ _id: request.body.id })

            if (!userDetails) {

                response.json({
                    success: false,
                    message: "Something went wrong when userDetails get",
                })
            }

            else {
                response.status(201).json({
                    success: true,
                    message: "UserDetails get  successfully",
                    data: userDetails.docterDetails
                })
            }
        }

    } catch (error) {
        console.log("Error : controller > admin > getUserDetails.controller > getUserDetails > catch ", error)
    }
}

const deleteDocterDetails = async (request, response) => {

    try {
        if (request.body.signature !== undefined) {

            const updateFields = {};
            if (request.body.signature !== undefined) {

                updateFields.signature = request.body.signature || "";
            }
            const adminId = request.body.id;
            const updateDocter = await adminModel.findOneAndUpdate(
                { _id: adminId, "docterDetails._id": request?.body?.docterId },
                {
                    $set: {
                        "docterDetails.$.signature": updateFields?.signature,

                    }
                },
                { new: true, useFindAndModify: false }
            );

            if (!updateDocter) {
                response.json({
                    success: false,
                    message: "Something went wrong when reportDetails get",
                })
            }
            else {
                response.json({
                    success: true,
                    message: "DocterDetails update  successfully",
                })
            }
        }
        else {
            const updateDocter = await adminModel.findOneAndUpdate(
                { _id: request.body.id, },
                { $pull: { docterDetails: { _id: request.body.docterId } } },
                { new: true, useFindAndModify: false });

            if (!updateDocter) {
                response.json({
                    success: false,
                    message: "Something went wrong when reportDetails get",
                })
            }
            else {
                response.json({
                    success: true,
                    message: "DocterDetails delete  successfully",
                })
            }
        }

    }
    catch (error) {
        console.log("Error : controller > admin > labReportDetails.controller > labReportDetails > catch", error)

    }

}


export {
    addTestList, addPackage, manageUser, addCenter,
    getTest, getPackage, getOneTest, updateOneTest, deletePackage,
    addFormula, deleteOneTest, manageUserLogin, analysisReportTest,
    analysisReportOrganisation, addDefaultTestList, getUserDetails, addTestMethod, getTestMethod,
    addComment, addTestListFile, labReportDetails, addDefaultTestMethod, addDefaultTestOption, getTestOption,
    labBillDetails, labDocterDetails, deleteLabReportDetails, getDocterDetails, deleteDocterDetails
};








// {

//     "testList": [
//       {
//         "department": "Hematology",
//         "testName": "Complete Blood Count",
//         "testPrice": 500,
//         "testCode": "CBC123",
//         "gender": "Male",
//         "sampleType": "Blood",
//         "test": [
//           {
//             "testFieldType": "single field",
//             "name": "WBC",
//             "testMethod": "single field",
//             "field": "numeric",
//             "unit": "x10^9/L",
//             "min": 4,
//             "max": 11,
//             "options": [
//               ""
//             ],
//             "default": "",
//             "formula": "",
//             "_id": {
//               "$oid": "6695a1186c71fdbda8387b30"
//             },
//             "subTest": []
//           },
//           {
//             "testFieldType": "single field",
//             "name": "RBC",
//             "testMethod": "single field",
//             "field": "numeric",
//             "unit": "x10^12/L",
//             "min": 4.5,
//             "max": 6,
//             "options": [
//               ""
//             ],
//             "default": "",
//             "formula": "",
//             "_id": {
//               "$oid": "6695a1186c71fdbda8387b31"
//             },
//             "subTest": []
//           }
//         ],
//         "_id": {
//           "$oid": "6695a1186c71fdbda8387b2f"
//         },
//         "comments": []
//       },
//       {
//         "department": "Biochemistry",
//         "testName": "Liver Function Test",
//         "testPrice": 700,
//         "testCode": "LFT456",
//         "gender": "Female",
//         "sampleType": "Blood",
//         "test": [
//           {
//             "testFieldType": "multiple field",
//             "name": "ALT",
//             "testMethod": "multiple field",
//             "field": "numeric",
//             "unit": "U/L",
//             "min": 7,
//             "max": 56,
//             "options": [
//               ""
//             ],
//             "default": "",
//             "formula": "",
//             "_id": {
//               "$oid": "6695a1186c71fdbda8387b33"
//             },
//             "subTest": []
//           },
//           {
//             "testFieldType": "multiple field",
//             "name": "AST",
//             "testMethod": "multiple field",
//             "field": "numeric",
//             "unit": "U/L",
//             "min": 10,
//             "max": 40,
//             "options": [
//               ""
//             ],
//             "default": "",
//             "formula": "",
//             "_id": {
//               "$oid": "6695a1186c71fdbda8387b34"
//             },
//             "subTest": []
//           }
//         ],
//         "_id": {
//           "$oid": "6695a1186c71fdbda8387b32"
//         },
//         "comments": []
//       },
//       {
//         "department": "Hematology",
//         "testName": "Dengue",
//         "testPrice": 2000,
//         "testCode": "DENG",
//         "gender": "Male",
//         "sampleType": "Blood",
//         "test": [],
//         "_id": {
//           "$oid": "669721d71c322278e8bbedd4"
//         },
//         "comments": []
//       },
//       {
//         "department": "Hematology",
//         "testName": "Dengue",
//         "testPrice": 2000,
//         "testCode": "DENG",
//         "gender": "Male",
//         "sampleType": "Blood",
//         "test": [
//           {
//             "testFieldType": "single field",
//             "name": "Nilesh Lachheta",
//             "testMethod": "HEAMOTOLOGY",
//             "field": "numeric",
//             "unit": "100",
//             "min": 20000,
//             "max": 90000,
//             "options": [],
//             "_id": {
//               "$oid": "669722231c322278e8bbeed7"
//             },
//             "subTest": [],
//             "numericUnboundType": "",
//             "numericUnboundValue": null,
//             "textrange": ""
//           },
//           {
//             "testFieldType": "multiple field",
//             "name": "DEnguePlatelets",
//             "testMethod": "HEAM",
//             "options": [],
//             "_id": {
//               "$oid": "669722571c322278e8bbef37"
//             },
//             "subTest": [
//               {
//                 "name": "Blood Test",
//                 "testMethod": "HEAM",
//                 "field": "numeric",
//                 "unit": "120",
//                 "min": 200,
//                 "max": 500,
//                 "comment": [],
//                 "_id": {
//                   "$oid": "669722701c322278e8bbef3d"
//                 }
//               }
//             ]
//           }
//         ],
//         "_id": {
//           "$oid": "669722081c322278e8bbee29"
//         },
//         "comments": []
//       },
//       {
//         "department": "Serology",
//         "testName": "MyTest",
//         "testPrice": 1000,
//         "testCode": "NEWTEST",
//         "gender": "Male",
//         "sampleType": "Swab",
//         "test": [],
//         "_id": {
//           "$oid": "669725161c322278e8bbf368"
//         },
//         "comments": []
//       },
//       {
//         "department": "Serology",
//         "testName": "MyTest",
//         "testPrice": 1000,
//         "testCode": "NEWTEST",
//         "gender": "Male",
//         "sampleType": "Swab",
//         "test": [],
//         "_id": {
//           "$oid": "669725301c322278e8bbf3a3"
//         },
//         "comments": []
//       }
//     ],
//     "package": [],
//     "outsource": [],
//     "organisations": [
//       {
//         "referralName": "Dr. Jorman",
//         "loginAccess": false,
//         "clearDue": false,
//         "financialAnalysis": false,
//         "_id": {
//           "$oid": "669a266f68932e395462cbf1"
//         },
//         "createdAt": {
//           "$date": "2024-07-19T08:40:15.084Z"
//         },
//         "updatedAt": {
//           "$date": "2024-07-19T08:40:15.084Z"
//         }
//       },
//       {
//         "referralName": "Dr, Harshita Molwa",
//         "loginAccess": false,
//         "clearDue": false,
//         "financialAnalysis": false,
//         "_id": {
//           "$oid": "669a269268932e395462cd5b"
//         },
//         "createdAt": {
//           "$date": "2024-07-19T08:40:50.767Z"
//         },
//         "updatedAt": {
//           "$date": "2024-07-19T08:40:50.767Z"
//         }
//       },
//       {
//         "referralName": "Dr. Dev",
//         "loginAccess": false,
//         "clearDue": false,
//         "financialAnalysis": false,
//         "_id": {
//           "$oid": "669a2bbf68932e39546304bc"
//         },
//         "createdAt": {
//           "$date": "2024-07-19T09:02:55.631Z"
//         },
//         "updatedAt": {
//           "$date": "2024-07-19T09:02:55.631Z"
//         }
//       }
//     ],
//     "manageUser": [
//       {
//         "role": {
//           "reception": {
//             "isActive": true,
//             "tabs": {
//               "newRegistration": true,
//               "patientList": true
//             },
//             "permissions": {
//               "editBill": false,
//               "editPatient": false,
//               "editTestPrice": false,
//               "deleteBill": false,
//               "clearDue": false
//             }
//           },
//           "technician": {
//             "isActive": true,
//             "tabs": {
//               "reportsEntry": false,
//               "testList": false
//             }
//           },
//           "doctor": {
//             "isActive": false,
//             "tabs": {
//               "enterVerify": false,
//               "patientList": false
//             },
//             "permissions": {
//               "editTestPrice": false,
//               "editTest": false,
//               "addNewTest": false,
//               "editPackage": false,
//               "addNewPackage": false,
//               "deletePackage": false
//             }
//           }
//         },
//         "userName": "ajay",
//         "userPhone": "8855886699",
//         "userGender": "Male",
//         "email": "ajay@gmail.com",
//         "loginStatus": false,
//         "verify": false,
//         "logoutStatus": false,
//         "blockStatus": false,
//         "_id": {
//           "$oid": "6696f4e321da39d75ecff74e"
//         }
//       },
//       {
//         "role": {
//           "reception": {
//             "isActive": false,
//             "tabs": {
//               "newRegistration": false,
//               "patientList": false
//             },
//             "permissions": {
//               "editBill": false,
//               "editTestPrice": false,
//               "deleteBill": false,
//               "editPatient": false,
//               "clearDue": false
//             }
//           },
//           "technician": {
//             "isActive": true,
//             "tabs": {
//               "reportsEntry": true,
//               "testList": false
//             }
//           },
//           "doctor": {
//             "isActive": false,
//             "tabs": {
//               "enterVerify": false,
//               "patientList": false
//             },
//             "permissions": {
//               "editTestPrice": false,
//               "editTest": false,
//               "addNewTest": false,
//               "editPackage": false,
//               "addNewPackage": false,
//               "deletePackage": false
//             }
//           }
//         },
//         "userName": "jatin molwa",
//         "userPhone": "8855886699",
//         "userGender": "Male",
//         "email": "demo12@gmail.com",
//         "loginStatus": false,
//         "verify": false,
//         "logoutStatus": false,
//         "blockStatus": false,
//         "_id": {
//           "$oid": "6696f5f321da39d75ecffeca"
//         }
//       }
//     ],
//     "testMethod": [
//       {
//         "testName": "HEAMOTOLOGY",
//         "_id": {
//           "$oid": "669721e81c322278e8bbedfe"
//         }
//       },
//       {
//         "testName": "HEAM",
//         "_id": {
//           "$oid": "669722521c322278e8bbef09"
//         }
//       }
//     ],
//     "item": [],
//     "supplier": [],
//     "__v": 0,
//     "address": "Near AirPort Road, Near Gandhi Nagar, super Coridor Indore. ",
//     "city": "Indore,India",
//     "website": "pseudosoftservices.com"
//   }