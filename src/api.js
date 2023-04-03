import { Client } from '@googlemaps/google-maps-services-js';

const client = new Client({});

export async function fetchNearbyFuelStations(latitude, longitude) {
    try {
        const response = await client.placesNearby({
            params: {
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                location: `${latitude},${longitude}`,
                radius: 5000, // Search within a 5 km radius
                type: 'gas_station', // Search for gas stations
            },
        });

        if (response.data.status === 'OK') {
            return response.data.results;
        } else {
            throw new Error(`Error fetching fuel stations: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error fetching nearby fuel stations:', error);
        return [];
    }
}

export async function geocodeAddress(address) {
    try {
        const response = await client.geocode({
            params: {
                key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
                address: address,
            },
        });

        if (response.data.status === 'OK') {
            return response.data.results[0].geometry.location;
        } else {
            throw new Error(`Error geocoding address: ${response.data.status}`);
        }
    } catch (error) {
        console.error('Error geocoding address:', error);
        return null;
    }
}

