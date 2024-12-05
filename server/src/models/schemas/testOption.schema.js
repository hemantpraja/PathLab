import mongoose from "mongoose";

const testOptionSchema= mongoose.Schema({
    option:{
        type:String,
        required:true
    }
})

export default testOptionSchema;