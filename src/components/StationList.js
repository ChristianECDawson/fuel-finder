import React, { useEffect, useState } from 'react';
import FuelStationCard from './FuelStationCard';

const mockStations = [
    {
        id: 1,
        name: 'Tesco Extra Filton',
        address: 'Filton Abbey Wood Retail Park, Filton, Bristol BS34 7JL',
        latitude: 51.516018,
        longitude: -2.549258,
        gasPrice: 1.39,
        dieselPrice: 1.43,
    },
    {
        id: 2,
        name: 'Sainsbury’s Filton',
        address: 'Fox Den Rd, Stoke Gifford, Bristol BS34 8SS',
        latitude: 51.507031,
        longitude: -2.548174,
        gasPrice: 1.41,
        dieselPrice: 1.45,
    },
    {
        id: 3,
        name: 'Shell Filton',
        address: 'Gloucester Rd N, Filton, Bristol BS34 7BP',
        latitude: 51.510515,
        longitude: -2.567243,
        gasPrice: 1.44,
        dieselPrice: 1.48,
    },
    {
        id: 4,
        name: 'BP Filton',
        address: 'Filton Service Station, Filton, Bristol BS34 7QS',
        latitude: 51.508392,
        longitude: -2.573283,
        gasPrice: 1.42,
        dieselPrice: 1.46,
    },
];

const StationList = ({ location }) => {
    const [stations, setStations] = useState([]);

    useEffect(() => {
        if (location) {
            // Replace this with a call to an API to fetch real data based on the user's location
            setStations(mockStations);
        }
    }, [location]);

    return (
        <div>
            {stations.map((station) => (
                <FuelStationCard key={station.id} station={station} />
            ))}
        </div>
    );
};

export { mockStations };
export default StationList;
