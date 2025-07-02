import express from "express";
import { getCaptainProfile, loginCaptain, logoutCaptain, registerCaptain } from "../controllers/captain.controller.js";
import { authCaptain } from "../middleware/auth.middleware.js";


const captainRouter = express.Router()


captainRouter.post('/register',registerCaptain)
captainRouter.post('/login',authCaptain,loginCaptain)
captainRouter.get('/logout',authCaptain,logoutCaptain)
captainRouter.get('/profile',authCaptain,getCaptainProfile)

export default captainRouter