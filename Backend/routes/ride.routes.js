import express from "express"
import { body, query } from "express-validator"
import { authUser } from "../middleware/auth.middleware.js"
import { authCaptain } from "../middleware/auth.middleware.js"
import { createRides, Fare , ConfirmRide , StartRide , EndRide} from "../controllers/ride.controler.js"


const rideRouter = express.Router()


rideRouter.post('/create',authUser,
    body('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    body('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    body('vehicleType').isString().isIn([ 'auto', 'car', 'bike' ]).withMessage('Invalid vehicle type'),
    createRides
)


rideRouter.get('/get-fare',
    authUser,
    query('pickup').isString().isLength({ min: 3 }).withMessage('Invalid pickup address'),
    query('destination').isString().isLength({ min: 3 }).withMessage('Invalid destination address'),
    Fare
)

rideRouter.post('/confirm',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    ConfirmRide
)

rideRouter.get('/start-ride',
    query('rideId').isMongoId().withMessage('Invalid ride id'),
    query('otp').isString().isLength({ min: 6, max: 6 }).withMessage('Invalid OTP'),
    StartRide
)

rideRouter.post('/end-ride',
    authCaptain,
    body('rideId').isMongoId().withMessage('Invalid ride id'),
    EndRide
)


export default rideRouter