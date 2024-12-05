import adminModel from "../../models/admin.model.js";
import generateSlug from "../../utils/generateSlug.js";

const addItem = async (request, response) => {
    try {
        console.log("admin id ", request.body.id)
        if (request.body._id) {
            const newItem = {
                itemName: request.body.itemName,
                consumptionUnit: request.body.consumptionUnit,
                alertQuantity: request.body.alertQuantity,
                itemType: request.body.itemType,
                purchaseUnit: request.body.purchaseUnit,
                unitConversion: request.body.unitConversion,
                
            }
            const item = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "item._id": request.body._id},
                { $set: { item: item } },
                { new: true, useFindAndModify: false }
            );
            if (!item) {
                response.json({
                    success: false,
                    message: "Something went wrrong when userAddd  add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Item add  successfully",
                        data: { ...item.item, }
                    })
            }
        }
        else {
            const newItem = {
                itemName: request.body.itemName,
                consumptionUnit: request.body.consumptionUnit,
                alertQuantity: request.body.alertQuantity,
                itemType: request.body.itemType,
                purchaseUnit: request.body.purchaseUnit,
                unitConversion: request.body.unitConversion,
                
            }
            const item = await adminModel.findByIdAndUpdate(
                request.body.id,
                { $push: { item: newItem } },
                { new: true, useFindAndModify: false }
            );
            if (!item) {
                response.json({
                    success: false,
                    message: "Something went wrrong when item add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Item add  successfully",
                        data: { ...item.item, password: '' }
                    })
            }
        }
        
    } catch (error) {
        console.log("Error : controller > admin > item.controller > addItem > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

const addSupplier = async (request, response) => {
    try {
        console.log("admin id ", request.body.id)
        if (request.body._id) {
            const newSupplier = {
                supplierName: request.body.supplierName,
                contactPerson: request.body.contactPerson,
                supplierPhone: request.body.supplierPhone,
                supplierAddress: request.body.supplierAddress,
                supplierEmail: request.body.supplierEmail,
            }
            const supplier = await adminModel.findOneAndUpdate(
                { _id: request.body.id, "supplier._id": request.body._id },
                { $set: { supplier: newSupplier } },
                { new: true, useFindAndModify: false }
            );
            if (!supplier) {
                response.json({
                    success: false,
                    message: "Something went wrrong when supplier add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Supplier add  successfully",
                        data: { ...supplier.supplier }
                    })
            }
        }
        else {
            const newSupplier = {
                supplierName: request.body.supplierName,
                contactPerson: request.body.contactPerson,
                supplierPhone: request.body.supplierPhone,
                supplierAddress: request.body.supplierAddress,
                supplierEmail: request.body.supplierEmail,
            }
            const supplier = await adminModel.findByIdAndUpdate(
                request.body.id,
                { $push: { supplier: newSupplier } },
                { new: true, useFindAndModify: false }
            );
            if (!supplier) {
                response.json({
                    success: false,
                    message: "Something went wrrong when supplier add",
                })
            }
            else {
                response.status(201)
                    .json({
                        success: true,
                        message: "Supplier add  successfully",
                        data: { ...supplier.supplier }
                    })
            }

        }

    } catch (error) {
        console.log("Error : controller > admin > supplier.controller > addSupplier > catch ", error)
        response.json({
            success: false,
            message: error.message,
        })
    }
}

export { addItem, addSupplier };