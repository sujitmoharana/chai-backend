 export const asynchandler = (requsthandler)=>{
   return (req,res,next)=>{
     Promise.resolve(requsthandler(req,res,next)).catch((err)=>next(err))
    }
 }




// const asyncHandler = () => {}
// const asyncHandler =  (func) => () => {}
// const asyncHandler = (func) => async () => {}
// const asynchandler = ( fn)=>async (req,res,next)=>{
//     try {
//         await fn(req,res,next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success:true,
//             message:error.message
//         })
//     }
// }
