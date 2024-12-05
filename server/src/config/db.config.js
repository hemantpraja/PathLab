import mongoose from "mongoose";
const connectDB = async () => {
    try {
       await mongoose.connect(`${process.env.DB_URL}`)
        console.log("Connected Mongodb");
    } catch (error) {
        console.log("Error : config > dbConfig > mongodb Connection    :", error)
    }
} 
export {connectDB}