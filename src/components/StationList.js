import React, { useEffect, useState } from 'react';
import FuelStationCard from './FuelStationCard';

const StationList = ({ location, radius, onSearchUpdate, stations, setStations, onDirectionsClick }) => {

    return (
        <div>
            {stations.map((station, index) => (
                <FuelStationCard
                    key={station.id || index}
                    station={station}
                    onDirectionsClick={onDirectionsClick} // Add this line
                />
            ))}
        </div>
    );
};

export default StationList;
