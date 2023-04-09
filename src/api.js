import axios from 'axios';

export async function fetchNearbyFuelStations(latitude, longitude, radius) {
    try {
        const response = await axios.get(`/api/fuelstations?lat=${latitude}&lng=${longitude}&radius=${radius}`);

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Error fetching fuel stations: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching nearby fuel stations:', error);
        return [];
    }
}

export async function geocodeAddress(address) {
    try {
        const response = await axios.get(
            `/maps/api/geocode/json?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&address=${encodeURIComponent(address)}`
        );

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
