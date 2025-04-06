import { getAddressCoordinates, getAutoCompleteSuggestions, getDistanceTime } from "../services/maps.services.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";




export const getCoordinates = async (req, res, next) => {
    try {
        const { address } = req.body;

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
        next(new apiError(500, "Internal server error occurred"));
    }
};

export const getDistTime = async (req, res, next) => {
    try {
        const { origin, destination } = req.body
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

        const { input } = req.query;

        const suggestions = await getAutoCompleteSuggestions(input);

        res.status(200).json(suggestions);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
}
