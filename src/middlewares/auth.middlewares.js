import { user } from "../models/user.model.js";
import { ApiError } from "../utils/Apierror.js";
import jwt from "jsonwebtoken";
export const varifyjwt = async(req,res,next)=>{
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
    
    console.log(token);
    
    if (!token) {
        throw new ApiError(404,"unauthorized request")
    }
    
    const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log(decodedtoken);
    
    const Users = await user.findById(decodedtoken?._id).select("-password -refreshToken")
    
    console.log(Users);
    
    if (!Users) {
        
        throw new ApiError(404,"invalid access token")
    }
    
    req.users = Users;
    next();
} catch (error) {
    throw new ApiError(401,error?.message||"invalid acess token")
}
}