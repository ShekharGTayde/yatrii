import Captain from "../models/captain.model.js";
import { getAddressCoordinates, getAutoCompleteSuggestions, getDistanceTime } from "../services/maps.services.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";




export const getCoordinates = async (req, res, next) => {
    try {
        const address = req.query.address || req.body.address;

        if (!address) {
            return next(new apiError(400, "Address is required")); // Fix status code
        }

        const coordinates = await getAddressCoordinates(address);
        return res
            .status(200)
            .json(
                new apiResponse(200, coordinates, 'coordinates fetched successfully')
            );
    } catch (error) {
     throw  new apiError(500, "Internal server error occurred");
    }
};

export const getDistTime = async (req, res, next) => {
    try {
        const origin = req.query.origin || req.body.origin;
        const destination = req.query.destination || req.body.destination;
        if (!origin || !destination) {
            return res.status(400).json({
                success: false,
                message: "Origin and destination are required"
            });
        }
        const distanceTime = await getDistanceTime(origin, destination)
        return res
            .status(200)
            .json(
                new apiResponse(200, distanceTime, 'Distance and time fetched successfully')
            )



    } catch (error) {

        throw new apiError(400, 'internal error while finding distance and time')
    }
}

export const getSuggestions = async (req, res, next) => {

    try {

        const input = req.query.input || req.body.input;

        const suggestions = await getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        const statusCode = err.statusCode || 500;
        res.status(statusCode).json({ message: err.message || 'Internal server error' });
    }
}

