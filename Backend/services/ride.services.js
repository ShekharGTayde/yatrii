import Ride from "../models/ride.model.js";
import apiError from "../utils/apiError.js";
import { getDistanceTime } from "./maps.services.js";
import crypto from 'crypto'; // Import crypto module

export const getFare = async (pickup, destination) => {
    if (!pickup || !destination) {
        throw new apiError(404, "pickup and destination are required");
    }

    const distanceTime = await getDistanceTime(pickup, destination);
    console.log("Raw Distance & Duration:", distanceTime);

    if (!distanceTime || !distanceTime.distance || !distanceTime.duration) {
        throw new apiError(500, "Failed to get distance and duration");
    }

    // Extract numerical values from strings like '236 km' and '5 hours 10 mins'
    const distanceInMeters = parseFloat(distanceTime.distance.replace(/[^\d.]/g, "")) * 1000;
    const durationParts = distanceTime.duration.match(/(\d+)\s*hour[s]?|\b(\d+)\s*min[s]?/g);
    
    let durationInMinutes = 0;
    if (durationParts) {
        durationParts.forEach(part => {
            if (part.includes("hour")) {
                durationInMinutes += parseFloat(part) * 60;
            } else if (part.includes("min")) {
                durationInMinutes += parseFloat(part);
            }
        });
    }

    console.log(`Parsed Distance: ${distanceInMeters} meters`);
    console.log(`Parsed Duration: ${durationInMinutes} minutes`);

    const baseFare = { auto: 30, car: 50, bike: 20 };
    const perKmRate = { auto: 10, car: 15, bike: 8 };
    const perMinRate = { auto: 2, car: 3, bike: 1.5 };

    const fare = {
        auto: Math.round(baseFare.auto + (distanceInMeters / 1000) * perKmRate.auto + durationInMinutes * perMinRate.auto),
        car: Math.round(baseFare.car + (distanceInMeters / 1000) * perKmRate.car + durationInMinutes * perMinRate.car),
        bike: Math.round(baseFare.bike + (distanceInMeters / 1000) * perKmRate.bike + durationInMinutes * perMinRate.bike)
    };

    console.log("Calculated Fare:", fare);
    return fare;
};

const getOtp = (num) => {
    const generateOtp = (num) => {
        const otp = crypto.randomInt(Math.pow(10,num-1),Math.pow(10,num)).toString()
        return otp
    }
    return generateOtp(num)
}

export const createRide = async ({ user, pickup, destination, vehicleType }) => {
    if ([pickup, destination, vehicleType].some((field) => !field || field.trim() === '')) {
        throw new apiError(400, "All fields are required");
    }

    console.log("Received Vehicle Type:", vehicleType);
    
    const fare = await getFare(pickup,destination);

    if (!fare[vehicleType]) {
        throw new apiError(400, `Invalid vehicle type: ${vehicleType}`);
    }

    console.log("Fare for selected vehicle:", fare[vehicleType]);

    const ride = await Ride.create({
        user,
        pickup,
        destination,
        fare: fare[vehicleType],
        otp:getOtp(6)
    });

    return ride;
};
 
export const confirmRide = async ({
    rideId, captain
}) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'accepted',
        captain: captain._id
    })

    const ride = await Ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    return ride;

}

export const startRide = async ({ rideId, otp, captain }) => {
    if (!rideId || !otp) {
        throw new Error('Ride id and OTP are required');
    }

    const ride = await Ride.findOne({
        _id: rideId
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'accepted') {
        throw new Error('Ride not accepted');
    }

    if (ride.otp !== otp) {
        throw new Error('Invalid OTP');
    }

    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'ongoing'
    })

    return ride;
}

export const endRide = async ({ rideId, captain }) => {
    if (!rideId) {
        throw new Error('Ride id is required');
    }

    const ride = await Ride.findOne({
        _id: rideId,
        captain: captain._id
    }).populate('user').populate('captain').select('+otp');

    if (!ride) {
        throw new Error('Ride not found');
    }

    if (ride.status !== 'ongoing') {
        throw new Error('Ride not ongoing');
    }

    await Ride.findOneAndUpdate({
        _id: rideId
    }, {
        status: 'completed'
    })

    return ride;
}