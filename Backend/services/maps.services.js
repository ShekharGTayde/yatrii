import axios from "axios";
import Captain from '../models/captain.model.js'
import apiError from "../utils/apiError.js";

export const getAddressCoordinates = async (address) => {
    if (!address) {
        throw new apiError(400, "Address is required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.gomaps.pro/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);

        if (response.status === 200 && response.data.results.length > 0) {
            const location = response.data.results[0].geometry.location;
            return {
                ltd: location.lat, 
                lng: location.lng,
            };
        } else {
            throw new apiError(400, "Failed to retrieve location from Maps API");
        }
    } catch (err) {
        // console.error("Error fetching coordinates:", err);
        throw new apiError(500, "Internal server error while fetching coordinates");
    }
};


export const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new apiError(400, "Origin and destination are required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.gomaps.pro/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        
        if (response.data.status !== "OK") {
            throw new apiError(400, "Unable to fetch distance and time");
        }
        
        const result = response.data.rows[0].elements[0];

        if (result.status === "ZERO_RESULTS") {
            throw new apiError(400, "No route found between origin and destination");
        }

        return {
            distance: result.distance.text, // e.g., "120 km"
            duration: result.duration.text  // e.g., "2 hours 30 mins"
        };

    } catch (error) {
        // console.error("Error fetching distance:", error);
        throw new apiError(500, "Something went wrong while fetching distance");
    }
};


export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new apiError(400, "Address is required");
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    const url = `https://maps.gomaps.pro/maps/api/place/autocomplete/json?input=${encodeURIComponent(input)}&key=${apiKey}`;

    try {
        // console.log("Fetching suggestions from:", url);

        const response = await axios.get(url);

        // console.log("Google Maps API Response:", response.data); // Log full response

        if (response.data.status === "OK") {
            return response.data.predictions.map(prediction => prediction.description);
        } else {
            // console.error("Google Maps API Error Response:", response.data);
            throw new apiError(500, `Google Maps API Error: ${response.data.status}`);
        }
    } catch (error) {
        // console.error("Google Maps API Error:", error.response?.data || error.message);
        throw new apiError(500, "Failed to fetch autocomplete suggestions");
    }
};


export const  getCaptainsInTheRadius = async (ltd, lng, radius) => {

    // radius in km


    const captains = await Captain.find({
        location: {
            $geoWithin: {
                $centerSphere: [ [ ltd, lng ], radius / 6371 ]
            }
        }
    });

    return captains;


}