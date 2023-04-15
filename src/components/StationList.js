import React from 'react';
import FuelStationCard from './FuelStationCard';

const StationList = ({ location, radius, stations, setStations, onDirectionsClick, compareStations, setCompareStations }) => {

    const sortedStations = () => {
        return [...stations].sort((a, b) => {
            const aSelected = compareStations.includes(a);
            const bSelected = compareStations.includes(b);
            if (aSelected && !bSelected) {
                return -1;
            }
            if (!aSelected && bSelected) {
                return 1;
            }
            return 0;
        });
    };

    return (
        <div>
            {sortedStations().map((station, index) => (
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
