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

const normalizeOrigin = (value = '') => {
  const cleaned = String(value).trim().replace(/^['\"]|['\"]$/g, '').replace(/\/+$/, '');
  if (!cleaned) {
    return '';
  }

  try {
    return new URL(cleaned).origin;
  } catch {
    try {
      return new URL(`https://${cleaned}`).origin;
    } catch {
      return cleaned;
    }
  }
};

const allowedOrigins = (process.env.CLIENT_URL || '*')
  .split(',')
  .map((origin) => normalizeOrigin(origin))
  .filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients and same-origin requests without an Origin header.
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    console.warn(`CORS blocked origin: ${origin}. Allowed origins: ${allowedOrigins.join(', ')}`);

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
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

app.get("/", (req, res) => {
  res.send("Yatrii API is running 🚀");
});
//config  all routes
app.use('/api/v1/users',userRouter)
app.use('/api/v1/captains',captainRouter)
app.use('/api/v1/maps',Maprouter)
app.use('/api/v1/rides',rideRouter)

export default app;