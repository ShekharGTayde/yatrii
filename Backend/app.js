import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";

const app = express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true // Allow cookies
  }));
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({extended:true}))



//import all routes
import userRouter from "./routes/user.routes.js";
import captainRouter from "./routes/captain.routes.js";
import Maprouter from "./routes/maps.routes.js";
import rideRouter from "./routes/ride.routes.js";


//config  all routes
app.use('/api/v1/users',userRouter)
app.use('/api/v1/captains',captainRouter)
app.use('/api/v1/maps',Maprouter)
app.use('/api/v1/rides',rideRouter)

export default app;