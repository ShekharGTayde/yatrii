import { createRide } from "../services/ride.services.js";
import apiResponse from "../utils/apiResponse.js";
import {getFare} from "../services/ride.services.js"
import {confirmRide} from "../services/ride.services.js"
import {startRide} from "../services/ride.services.js"
import {endRide} from "../services/ride.services.js"
import { sendMessageToSocketId } from "../socket.js";
import Ride from "../models/ride.model.js";
import { getAddressCoordinates, getCaptainsInTheRadius } from "../services/maps.services.js";
import User from "../models/user.model.js";


export const createRides = async(req,res,next) => {

    const {pickup,destination,vehicleType} = req.body
    if (!req.user || !req.user._id) {
        throw new apiError(401, "User authentication required");
    }
    try {
        const ride = await createRide({user:req.user._id,pickup,destination,vehicleType})
         res.json(
            new apiResponse(200,ride,'ride created successully')
        )
         const pickupCoordinates = await getAddressCoordinates(pickup);

        // console.log("Pickup Coordinates:", pickupCoordinates);
        

        const captainsInRadius = await getCaptainsInTheRadius(pickupCoordinates.ltd, pickupCoordinates.lng, 20);
    //    console.log("Captains in radius:", captainsInRadius);
       
        ride.otp = ""

        const rideWithUser = await Ride.findOne({ _id: ride._id }).populate('user');

        captainsInRadius.map(captain => {

            sendMessageToSocketId(captain.socketId, {
                event: 'new-ride',
                data: rideWithUser
            })


        })
        
    } catch (error) {
        console.error('internal server error while creating ride')
        next(error)
    }
}

export const Fare = async (req, res, next) => {
    const { pickup, destination } = req.query;
    
    try {
        if (!pickup || !destination) {
            return res.status(400).json({ success: false, message: "Pickup and destination are required!" });
        }

        const fare = await getFare(pickup, destination);
        
        return res.json(
            new apiResponse(200, fare, "Fare calculated successfully")
        );
    } catch (error) {
        // console.error("Error in Fare function:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

export const ConfirmRide = async (req, res) => {


    const { rideId } = req.body;

    try {
        const ride = await confirmRide({ rideId, captain: req.captain ,user:req.user});
        const user = await User.findById(ride.user._id); // Always fetch fresh
        
         

        sendMessageToSocketId(user.socketId,{
            event:"ride-confirmed",
            data:ride
        })
        
        return res.status(200).json(ride);
    } catch (err) {

        // console.log(err);
        return res.status(500).json({ message: err.message });
    }
}

export const StartRide = async (req, res) => {
   

    const { rideId, otp } = req.query;

    try {
        const ride = await startRide({ rideId, otp, captain: req.captain });

        // console.log(ride);

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-started',
            data: ride
        })

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
}

export const EndRide = async (req, res) => {
   

    const { rideId } = req.body;

    try {
        const ride = await endRide({ rideId, captain: req.captain });

        sendMessageToSocketId(ride.user.socketId, {
            event: 'ride-ended',
            data: ride
        })



        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    } s
}

