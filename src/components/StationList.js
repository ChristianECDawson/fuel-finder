import React, { useEffect, useState } from 'react';
import FuelStationCard from './FuelStationCard';

const StationList = ({ location, radius, onSearchUpdate, stations, setStations }) => {

    return (
        <div>
            {stations.map((station, index) => (
                <FuelStationCard key={station.id || index} station={station} />
            ))}
        </div>
    );
};

export default StationList;
