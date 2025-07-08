import { asynchandler } from "../utils/asynchandler.js";

export const registerUser = asynchandler(async (req,res)=>{
    res.status(200).json({
        message:"chai or  code"
    })
})