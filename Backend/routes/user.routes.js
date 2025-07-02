import express from 'express'
import {authUser} from '../middleware/auth.middleware.js'

import {getUserProfile, loginUser, logoutUser, regenerateToken, registerUser} from '../controllers/user.controller.js'



const userRouter = express.Router()


userRouter.post("/register", registerUser);
userRouter.post("/login",authUser,loginUser);
userRouter.get("/logout",authUser,logoutUser)
userRouter.get("/regeneratedToken",authUser,regenerateToken)
userRouter.get("/profile",authUser,getUserProfile)




export default userRouter

