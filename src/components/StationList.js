import React from 'react';
import FuelStationCard from './FuelStationCard';

const StationList = ({ location, radius, stations, setStations, onDirectionsClick, compareStations, setCompareStations }) => {
    return (
        <div>
            {stations.map((station, index) => (
                <FuelStationCard
                    key={station.id || index}
                    station={station}
                    onDirectionsClick={onDirectionsClick}
                    compareStations={compareStations}
                    setCompareStations={setCompareStations}
                />
            ))}
        </div>
    );
};

export default StationList;
