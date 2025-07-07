import mongoose from "mongoose";
import { DB_NAME } from "../content.js";

const connectDB = async()=>{
    try {
     const connectioninstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
     console.log(`\n mongodb connected !! DB-HOST ${connectioninstance.connection.host}`);
     
    } catch (error) {
    console.log("mongodb error",error);
    process.exit(1); 
    }
}

export default connectDB;