// require('dotenv').config({path:"./env"})

import dotenv from "dotenv"
import  mongoose from "mongoose";
import { DB_NAME } from "./content.js";
import connectDB from "./db/index.js";
dotenv.config({
    path:"./env"
})

connectDB();
   





/* import { DB_NAME } from "./content";
import express from "express";
const app = express();
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("error",error);
            throw error
        })
        app.listen(process.env.PORT,()=>{
            console.log("app is listing on port")
        })
    } catch (error) {
        console.log(error);
    }
})() */