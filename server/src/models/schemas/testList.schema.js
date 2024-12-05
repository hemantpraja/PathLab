import mongoose from "mongoose";
const testListSchema = mongoose.Schema({
    department: {
        type: String,
        required: [true, "department is required"],
    },
    testName: {
        type: String,
        required: [true, "testName is required"],
    },
    testPrice: {
        type: Number,
        required: [true, "testPrice is required"],
    },
    testCode: {
        type: String,
        required: [true, "testCode is required"],
    },
    gender: {
        type: String,
        required: [true, "gender is required"],
        enum: ["Male", "Female", "other"],

    },
    sampleType: {
        type: String,
        required: [true, "sampleType is required"],
    },
    comments: [{
        comment: {
            type: String,
        }
    }],
    test: [{
        testFieldType: {
            type: String,
            required: [true, "testFieldType is required"],
            enum: ["single field", "multiple field", "text"]
        },
        name: {
            type: String,
            required: [true, "name is required"],
        },
        textTest: {
            type: String,
        },
        testMethod: {
            type: String,
            required: [true, "testMethod is required"],
        },
        field: {
            type: String,
            required: [true, "field is required"],
        },
        unit: {
            type: String,
            required: [true, "unit is required"],
        },
        textrange: {
            type: String,
        },
        min: {
            type: Number,
        },
        max: {
            type: Number,
        },
        numericUnboundType: {
            type: String,
        },
        numericUnboundValue: {
            type: Number,
        },
        options: [{
            value: {
                type: String,
            }
        }],
        default: {
            type: String,
        },

        formula: {
            type: String,
        },
        isFormula: {
            type: Boolean,
            default: false,
        },
        observedvalue: {
            type: Number,
        },
        subTest: [{
            name: {
                type: String,
                required: [true, "name is required"],
            },
            testMethod: {
                type: String,
                required: [true, "testMethod is required"],
            },
            field: {
                type: String,
                required: [true, "field is required"],
            },
            unit: {
                type: String,
                required: [true, "unit is required"],
            },
            textrange: {
                type: String,
            },
            min: {
                type: Number,
            },
            max: {
                type: Number,
            },
            numericUnboundType: {
                type: String,
            },
            numericUnboundValue: {
                type: Number,
            },
            options: [{
                value: {
                    type: String,
                }
            }],
            default: {
                type: String,
            },
            comment: {
                type: [String],
            },
            formula: {
                type: String,
            },
            isFormula: {
                type: Boolean,
                default: false,
            },
            formulaType: {
                type: String,
            },
            observedvalue: {
                type: Number,

            }
        }]
    }]
})

export default testListSchema;
