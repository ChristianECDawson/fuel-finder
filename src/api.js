import axios from 'axios';

export function isLocationApproximatelyEqual(location1, location2, threshold = 0.0005) {
    const latDiff = Math.abs(location1.lat - location2.lat);
    const lngDiff = Math.abs(location1.lng - location2.lng);
    return latDiff <= threshold && lngDiff <= threshold;
}

export async function fetchNearbyFuelStations(latitude, longitude, radius) {
    try {
        console.log('fetchNearbyFuelStations params:', latitude, longitude, radius);
        const response = await axios.get(`/api/fuelstations?lat=${latitude}&lng=${longitude}&radius=${radius}`);

        if (response.status === 200) {
            const uniqueStations = [];
            response.data.results.forEach((station) => {
                const isDuplicate = uniqueStations.some((uniqueStation) => {
                    return isLocationApproximatelyEqual(uniqueStation.geometry.location, station.geometry.location);
                });

                if (!isDuplicate) {
                    uniqueStations.push(station);
                }
            });

            return { results: uniqueStations };
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

