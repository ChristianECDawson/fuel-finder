import React, { useEffect, useState } from 'react';
import FuelStationCard from './FuelStationCard';
import { fetchNearbyFuelStations } from '../api'; // Import the function

const StationList = ({ location, radius, onSearchUpdate }) => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        if (location && radius) {
            // Call the fetchNearbyFuelStations function with the location's latitude and longitude
            fetchNearbyFuelStations(location.lat, location.lng, radius)
                .then((results) => {
                    // Transform the results into the format used by FuelStationCard
                    const transformedResults = results.map((result) => ({
                        id: result.place_id,
                        name: result.name,
                        address: result.vicinity,
                        latitude: result.geometry.location.lat,
                        longitude: result.geometry.location.lng,
                        // Mock gas and diesel prices since they're not provided by the API
                        gasPrice: parseFloat((Math.random() * (1.5 - 1.2) + 1.2).toFixed(2)),
                        dieselPrice: parseFloat((Math.random() * (1.7 - 1.4) + 1.4).toFixed(2)),
                    }));

                    setStations(transformedResults);
                    onSearchUpdate(transformedResults);
                })
                .catch((error) => {
                    console.error('Error fetching fuel stations:', error);
                });
        }
    }, [location, radius, onSearchUpdate]);

    return (
        <div>
            {stations.map((station) => (
                <FuelStationCard key={station.id} station={station} />
            ))}
        </div>
    );
};

export default StationList;
