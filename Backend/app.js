import dotenv from 'dotenv'
dotenv.config({
  path:'./.env'
})
import express, { urlencoded } from "express";
import cors from 'cors'
import cookieParser from "cookie-parser";
import Razorpay from "razorpay";
import Order from './models/order.model.js';


const app = express()

app.use(cors({
    origin:process.env.CLIENT_URL,credentials: true // Allow cookies
  }));
app.use(express.json())
app.use(cookieParser())

app.use(express.urlencoded({extended:true}))

//payment gateway
app.post("/api/v1/order", async (req, res) => {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = req.body;
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).send("Error");
    }

    await Order.create({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receiptId: order.receipt,
      status: "created",
    });

    res.json(order);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

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