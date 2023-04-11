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
        const response = await axios.get(`/api/geocode?address=${encodeURIComponent(address)}`);

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

