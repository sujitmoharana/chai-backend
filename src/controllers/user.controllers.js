import { ApiError } from "../utils/Apierror.js";
import { asynchandler } from "../utils/asynchandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Apiresponse } from "../utils/Apiresponse.js";
import { user } from "../models/user.model.js";
import jwt from "jsonwebtoken"
const generateAccessAndRefreshToken = async(userid)=>{
try {
    
   const User =  await user.findById(userid)
 const accesstoken = User.generateAccessToken()
 const refreshtoken = User.generateRefreshToken()
  console.log("acess",accesstoken);
  console.log("refresh",refreshtoken);
  
  
 user.refreshToken = refreshtoken
await User.save({validateBeforeSave:false});

return {accesstoken,refreshtoken}
} catch (error) {
    throw new ApiError(500,"somethong went wrong")
}
}

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

export const loginuser = asynchandler(async(req,res)=>{
   //req body =body
   //username and email
   //find the user
   //passwod check
   //access and refresh token
   //send cookie

   const {email,username,password} = req.body

   if (!username && !email) {
    throw new  ApiError(400,"username and email is required")
   }

 const users =  await user.findOne({
    $or:[{username:username},{email:email}]
   })
    console.log(users);
    
   if (!users) {
    throw new ApiError(404,"user does not exists")
   }

   const isPasswordvalid =  await users.isPasswordCorrect(password);
   console.log(isPasswordvalid);
  if (!isPasswordvalid) {
    throw new ApiError(404,"password invalid")
  }

const {accesstoken,refreshtoken} =  await generateAccessAndRefreshToken(users._id);
console.log("access token",accesstoken);
console.log("refreshtoken",refreshtoken);
 const loggedInUser =  await user.findById(users._id).select("-password -refreshToken");
console.log(loggedInUser);

 const options = {
    httpOnly:true,
    secure:true
 }

 return res.status(200).cookie("accessToken",accesstoken,options).cookie("refreshtoken",refreshtoken,options).json(
    new Apiresponse(200,{user:loggedInUser,accesstoken,refreshtoken},"user logged in sucessfully")
 )
})
export const logoutuser = asynchandler(async(req,res)=>{
    console.log("user controller page",req.users);
    console.log("main refresh token",req.users.refreshToken);
    
 await user.findByIdAndUpdate(
    req.users._id,
    {
        $set:{
            refreshToken:undefined
        }
    },
    {
        new:true
    }
  )

  const options = {
    httpOnly:true,
    secure:true
  }

  return res.status(200).clearCookie("accessToken",options).clearCookie("refreshtoken",options).json(
    new Apiresponse(200,{},"user logout in sucessfully")
  )
})


export const refreshacessToken = asynchandler(async(req,res)=>{
  try {
      const incomingRefreshToken = req.cookies.refreshtoken || req.body.refreshToken
  
      if (!incomingRefreshToken) {
          throw new ApiError(401,"unauthoraized request")
      }
  
      const decodedToken = jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
      console.log(decodedToken);
  
     const USERS = await user.findById(decodedToken?._id)
  
     if (!USERS) {
      throw new ApiError(401,"invalid refreshtoken")
     }
  
     if (incomingRefreshToken !== USERS?.refreshToken) {
       throw new ApiError(401,"refreshtoken is expire and used")
     }
  
     const {accesstoken,refreshtoken} =  await generateAccessAndRefreshToken(USERS._id)
  
       const options = {
          httpOnly:true,
          secure:true
       }
  
   return res.status(200).cookie("accessTokens",accesstoken,options).cookie("refreshtokens",refreshtoken,options).json(
      new Apiresponse(200,{accesstoken,refreshtoken},"acess token refreshed sucessfully")
   )
  } catch (error) {
    throw new ApiError(404,"refresh token invalid")
    
  }
})