import BlacklistToken from "../models/blacklistToken.js";
import Captain from "../models/captain.model.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import asyncHandler from '../utils/asyncHandler.js'

//register a new captain
const registerCaptain = asyncHandler(async(req , res , next)=> {
    //get details
    const {captainName,email,password,vehicle,location} = req.body
    //check these fields are not empty
    if ([captainName,email,password,vehicle]
        .some((field)=>field?.trim === '')) {
        throw new apiError(401,'all fields are required')
    }
    //check captian allredy register or not
    const existedCaptain = await Captain.findOne({
        $or:[{captainName},{email}]
    })
    if (existedCaptain) {
        throw new apiError(401,'captain is allready registerd')
    }
    //hashed pass
    const hashedPass = await Captain.hashPassword(password);
    //store in db
    const captain = await Captain.create({
        captainName,
        email,
        password:hashedPass,
        vehicle:{
            color:vehicle.color,
            vehicleType:vehicle.vehicleType,
            plate:vehicle.plate,
            capacity:vehicle.capacity
        },
        // location:{
        //     latitude:location.latitude,
        //     longitude:location.longitude
        // }
    })
    //check captain data stored in db or not
    if (!captain) {
        throw new apiError(500,'captan not registerd due to internal error')
    }
    const createdCaptain = await Captain.findById(captain._id).select('-password -token')
    if (!createdCaptain) {
        throw new apiError(500,'captain data not save in db')
    } 
    //generate token
    const token = await captain.generateToken()
   
    return res
    .status(200)
    .json(
        new apiResponse(200,{token,captain},'captain registerd successfully')
    )
})

//login captain
const loginCaptain = asyncHandler(async(req,res,next)=>{
    //get details from body
    const {password,email} = req.body
    //check fields are not empty
    if (!( email || password)) {
        throw new apiError(401,'email or password is required')
    }
    //check captain is registred or not
    const captain = await Captain.findOne({email}).select("+password");
    if (!captain) {
        throw new apiError(401,'captain is not registerd')
    }
    if (!captain.password) {
        throw new apiError(500, "Password not found in database");
    }
    //check pass is corret
    const isCorrectPassword = await captain.isCorrectPassword(password)
    if (!isCorrectPassword) {
        throw new apiError(401,'password is incorrect')
    }
    //generate token
    const token = await captain.generateToken(captain._id)
    req.captain = captain

    // console.log(token)
    
    const options = {
        httpOnly: true, // Prevent access from JavaScript
        secure: process.env.NODE_ENV === "production", // Use secure cookies in production
        sameSite: "None", // Allow cookies across different origins
    };
     
    //send res
    return res 
    .status(200)
    .cookie('token',token,options)
    .json(
        new apiResponse(200,{token,captain},'captain login successfully')
    )

})

//logout captain
const logoutCaptain = asyncHandler(async(req,res,next)=>{
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1]
    if (!token) {
        throw new apiError(401,'token is required')
    }
    await BlacklistToken.create({token})
    res.clearCookie('token')


    //send res
    return res
    .status(200)
    .json(
        new apiResponse(200,{},'captain logout successfully')
    )

})

//get captain profile 
const getCaptainProfile = asyncHandler(async(req,res,next)=>{
 
    //send res
    return res
    .status(200)
    .json(
        new apiResponse(200,req.captain,'captain profile fetched successfully')
    )
})




export {
    registerCaptain,
    loginCaptain,
    logoutCaptain,
    getCaptainProfile

}