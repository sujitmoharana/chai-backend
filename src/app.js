import express from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
export const app = express();

app.use(cors({
    origin:process.env.CORS,
    credentials:true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({
    extended:true,limit:"16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

//routes import
import { router } from "./routes/user.routes.js";
app.use("/api/v1/users",router);
//route declaration
