// client/config.js
import { GOOGLE_MAPS_API_KEY } from "@env";

// Provide a fallback for development (you can use a restricted key here)
const fallbackKey = "";

export const googleMapsApiKey = GOOGLE_MAPS_API_KEY || fallbackKey;