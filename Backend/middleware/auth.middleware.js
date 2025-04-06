import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import apiError from "../utils/apiError.js";
import BlacklistToken from "../models/blacklistToken.js";
import Captain from "../models/captain.model.js";

export const authUser = asyncHandler(async (req, res, next) => {
    // Get the token from request headers, cookies, or body
    const token = req.cookies?.token || req.body.token || req.headers.authorization?.split(" ")[1] 

    if (!token) {
        throw new apiError(401, "Token not found in request");
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized - Token is allready blacklisted" });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach it to the request object
        const user = await User.findById(decodedToken._id).select("-password");
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        req.user = user;
        return next(); // Proceed to the next middleware

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});


export const authCaptain = asyncHandler(async (req, res, next) => {
    // Get the token from request headers, cookies, or body
    const token =  req.cookies?.token || req.body.token || req.headers.authorization?.split(" ")[1] 
     
    // console.log("Headers: ", req.headers);
    // console.log("Cookies: ", req.cookies);
    // console.log("Body: ", req.body);
  
    if (!token) {
        throw new apiError(401, "Token not found in request");
    }

    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistToken.findOne({ token });
    if (isBlacklisted) {
        return res.status(401).json({ message: "Unauthorized - Token is blacklisted" });
    }

    try {
        // Verify the token
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Find the user and attach it to the request object
        const captain = await Captain.findById(decodedToken._id).select("-password");
        if (!captain) {
            return res.status(401).json({ message: "User not found" });
        }

        req.captain = captain;
        next(); // Proceed to the next middleware

    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
});
