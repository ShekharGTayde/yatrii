import User from "../models/user.model.js";
import asyncHandler from '../utils/asyncHandler.js'
import apiError from '../utils/apiError.js'
import apiResponse from '../utils/apiResponse.js'
import BlacklistToken from "../models/blacklistToken.js";
import jwt from 'jsonwebtoken'

//generate a auth token
const generateAuthToken = asyncHandler(async (req, res, next) => {
   const token = await req.user.generateAuthToken()
   if (!req.user) {
      throw new apiError(401, 'User not authenticated');
   }
   if (!token) {
      throw new apiError(500, 'token not generated')
   }
   return res
      .status(200)
      .json(
         new apiResponse(200, { token }, 'token generated successfully')
      )
})

//register a user
const registerUser = asyncHandler(async (req, res, next) => {

   //get  the details from body
   const { userName, email, password } = req.body



   //check details are not empty
   if ([userName, email, password].some((field) => field?.trim === '')) {
      throw new apiError(401, 'all fields are required')
   }

   //chec user is allready register or not
   const existedUser = await User.findOne(
      {
         $or: [{ userName }, { email }]
      }
   )
   if (existedUser) {
      throw new apiError(401, 'user is allready registerd')
   }

   //we need to hash pass
   const hashedPass = await User.hashPassword(password);


   //store user data in db
   const user = await User.create({

      userName: userName,
      email: email,
      password: hashedPass
   })

   //check user data store in db or not
   if (!user) {
      throw new apiError(400, 'user details are not store')
   }

   const createdUser = await User.findById(user._id).select('-password -token')
   if (!createdUser) {
      throw new apiError(500, 'something went wrong while registring user')
   }
   const token = await user.generateAuthToken()

   return res
      .status(200)
      .json(
         new apiResponse(200, { token,user }, 'user registred successfully')
      )
})

//login a user
const loginUser = asyncHandler(async (req, res, next) => {
   //get user details
   const {  email, password } = req.body

   //check is not empty
   if (!email) {
      throw new apiError(400, 'username and email are required')
   }

   //check user existed or not
   const user = await User.findOne({
      $or: [{ email }]
   }).select("+password");
   if (!user) {
      throw new apiError(401, 'user not found')
   }

   //check pass is correct or not
   const isMatch = await user.isPasswordCorrect(password)
   if (!isMatch) {
      throw new apiError(401, 'password is incorrect')
   }


   const loggedIn = await User.findById(user._id)
   if (!loggedIn) {
      throw new apiError(500, 'something went wrong while login')
   }
   const token = await user.generateAuthToken(user._id)
   res.cookie('token', token)
   req.user = user

   const options = {
      httpOnly: true, // Prevents JavaScript access (protects from XSS)
      secure: process.env.NODE_ENV, // Works only on HTTPS in production
      sameSite: "Strict", // Prevents CSRF attacks
      path: "/", // Ensures the cookie is accessible on all routes
   };


   //send res
   return res
      .status(200)
      .cookie('token', token, options)
      .json(
         new apiResponse(
            200,
            {
               token,
               user: loggedIn
            },
            'user logged in successfully'
         )
      )

})

//logout a user
const logoutUser = asyncHandler(async (req, res) => {
  try {
    res.clearCookie('token', { httpOnly: true, secure: true, sameSite: "None" })
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
       return res.status(400).json({ message: "Token is required for logout" });
    }
 
   //  const existingToken = await BlacklistToken.findOne({ token });

   //    if (existingToken) {
   //       console.log("Token is already blacklisted");
   //       return; // Exit early to prevent duplicate insertion
   //    }

      // If not, insert the token into the blacklist
      await BlacklistToken.create({ token });
      console.log("Token blacklisted successfully");
 
     
  } catch (error) {
   console.error("Error blacklisting token:", error);
  }

   res.status(200).json({ message: "Logged out successfully" });
});


//get user profile 
const getUserProfile = asyncHandler(async (req, res, next) => {
   const token = req.cookies.token

   if (!token) {
      throw new apiError(404, 'token not found')
   }
   // Find user
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
   const user = await User.findById(decodedToken._id).select('-password -token');
   if (!user) {
      throw new apiError(404, 'User not found');
   }

   return res
      .status(200)
      .json(
         new apiResponse(200, { user }, 'User profile fetched successfully')
      );

})

//regenerate token
const regenerateToken = asyncHandler(async (req, res, next) => {
   //get old token
   const token = req.cookies.token || req.body.token
   //check old token
   if (!token) {
      throw new apiError(401, 'token not found')
   }
   //check db token
   const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
   //compare user token with db token
   const user = await User.findById(decodedToken._id).select('-password -token')

   //generate new token
   const newToken = await user.generateAuthToken()
   //send new token
   const options = {
      httpOnly: true,
      secure: true
   }


   return res
      .status(200)
      .json(
         new apiResponse(200, { token: newToken }, 'new token generated successfully')
      )
})



export {
   generateAuthToken,
   registerUser,
   loginUser,
   logoutUser,
   regenerateToken,
   getUserProfile
}

