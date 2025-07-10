import { ApiError } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { user } from "../models/user.model.js";
export const registerUser = asynchandler(async (req,res)=>{
   //get user details from frontend
   //validation
   //check if user already exists : username and email
   //check for images and check for avtar
   //upload them cloudinary,avtar
   //create user object - create entry in db
   //remove password and refresh token field  from response
   //check for user creation 
   //return response 


   //get user details from frontend
   const {fullname,email,username,password} = req.body
   console.log("email:",email);
   console.log("fullname",fullname);
   console.log("username",username);
   console.log("password",password);
   
//    if (fullname === "") {
//     throw new ApiError(400,"fullname is required")
//    }
if ([fullname,email,username,password].some((field)=>{
    return field.trim()===""
})) {
    throw new ApiError(400,"all field are required")
}

const existedUser = await user.findOne({
    $or:[{username:username},{email:email}]
})
console.log(existedUser);

if (existedUser) {
    throw new ApiError(409,"user with username and email already exists")
}
const avtarLocalPath = req.files?.avtar[0].path
const coverimagelocalpath =req.files?.coverImage[0].path
console.log(req.files.avtar);
console.log(req.files.coverImage);
console.log(avtarLocalPath);
console.log(coverimagelocalpath);


if (!avtarLocalPath) {
    throw new ApiError(404,"avtar file is requred")
}

const avtar = await uploadOnCloudinary(avtarLocalPath)
const coverimage = await uploadOnCloudinary(coverimagelocalpath)

console.log(avtar);
console.log(coverimage);


if (!avtar) {
    throw new ApiError(404,"avtar file is requred")
}


const users = await user.create(
    {
        fullname,
        avtar:avtar.url,
        coverImage:coverimage?.url||"",
        email,
        password,
        username:username.toLowerCase()
    }
)

const createdUser = await user.findById(users._id).select(
    "-password -refreshToken"
)
console.log(createdUser);
if (!createdUser) {
    throw new ApiError(500,"something went wrong while registering the user");
}

return res.status(201).json(
    new Apiresponse(200,createdUser,"user registered sucessfully")
)
})