import axios from "axios";
import Captain from '../models/captain.model.js'
import apiError from "../utils/apiError.js";

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const OSRM_BASE_URL = 'https://router.project-osrm.org';
const OPEN_METEO_GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const DEFAULT_HEADERS = {
    // Nominatim usage policy requires identifying User-Agent/From style headers.
    'User-Agent': 'Yatri-Practice-App/1.0 (learning project)'
};

const formatDistance = (meters) => {
    if (!meters || Number.isNaN(meters)) {
        return '0 km';
    }

    if (meters < 1000) {
        return `${Math.round(meters)} m`;
    }

    const km = meters / 1000;
    return `${km.toFixed(1)} km`;
};

const formatDuration = (seconds) => {
    if (!seconds || Number.isNaN(seconds)) {
        return '0 mins';
    }

    const totalMinutes = Math.round(seconds / 60);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0 && minutes > 0) {
        return `${hours} hours ${minutes} mins`;
    }

    if (hours > 0) {
        return `${hours} hours`;
    }

    return `${minutes} mins`;
};

export const getAddressCoordinates = async (address) => {
    if (!address) {
        throw new apiError(400, "Address is required");
    }

    const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&limit=1&q=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url, { headers: DEFAULT_HEADERS });

        if (response.status === 200 && Array.isArray(response.data) && response.data.length > 0) {
            const location = response.data[0];
            const lat = Number(location.lat);
            const lng = Number(location.lon);

            return {
                ltd: lat,
                lng,
            };
        }

        throw new apiError(404, "Address not found");
    } catch (err) {
        // Fallback geocoding provider for Nominatim throttling or temporary failures.
        try {
            const fallbackResponse = await axios.get(
                `${OPEN_METEO_GEOCODE_URL}?name=${encodeURIComponent(address)}&count=1&language=en&format=json`,
                { timeout: 5000 }
            );

            const firstResult = fallbackResponse.data?.results?.[0];
            if (firstResult) {
                return {
                    ltd: Number(firstResult.latitude),
                    lng: Number(firstResult.longitude)
                };
            }
        } catch (_fallbackError) {
            // Intentionally ignore fallback failure and throw below.
        }

        if (err instanceof apiError) {
            throw err;
        }
        throw new apiError(500, "Internal server error while fetching coordinates");
    }
};


export const getDistanceTime = async (origin, destination) => {
    if (!origin || !destination) {
        throw new apiError(400, "Origin and destination are required");
    }

    try {
        const [originCoordinates, destinationCoordinates] = await Promise.all([
            getAddressCoordinates(origin),
            getAddressCoordinates(destination)
        ]);

        const routeUrl = `${OSRM_BASE_URL}/route/v1/driving/${originCoordinates.lng},${originCoordinates.ltd};${destinationCoordinates.lng},${destinationCoordinates.ltd}?overview=false`;
        const response = await axios.get(routeUrl);

        if (response.status !== 200 || response.data.code !== 'Ok' || !response.data.routes?.length) {
            throw new apiError(400, "No route found between origin and destination");
        }

        const route = response.data.routes[0];

        return {
            distance: formatDistance(route.distance),
            duration: formatDuration(route.duration)
        };

    } catch (error) {
        if (error instanceof apiError) {
            throw error;
        }
        throw new apiError(500, "Something went wrong while fetching distance");
    }
};


export const getAutoCompleteSuggestions = async (input) => {
    if (!input) {
        throw new apiError(400, "Address is required");
    }

    const url = `${NOMINATIM_BASE_URL}/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(input)}`;

    try {
        const response = await axios.get(url, {
            headers: {
                ...DEFAULT_HEADERS,
                'Accept-Language': 'en'
            },
            timeout: 5000
        });
        if (!Array.isArray(response.data)) {
            return [];
        }

        const suggestions = response.data
            .map((item) => item.display_name)
            .filter(Boolean)
            .slice(0, 5);

        return suggestions;
    } catch (error) {
        // Nominatim may throttle or intermittently reject requests; keep UX stable.
        return [];
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