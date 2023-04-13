import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow } from '@react-google-maps/api';
import { fetchNearbyFuelStations } from '../api';

function MapContainer({ userLocation, radius, stations, setStations }) {
    const [selectedStation, setSelectedStation] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: 'calc(100vh - 64px)',
        position: 'relative',
    };

    useEffect(() => {
        if (userLocation && radius) { // Add a condition to check if radius is also provided
            fetchNearbyFuelStations(userLocation.lat, userLocation.lng, radius)
                .then((results) => {
                    console.log('API response:', results);
                    setStations(results.results);
                })
                .catch((error) => {
                    console.error('Error fetching fuel stations:', error);
                });
        }
    }, [userLocation, radius]); // Add radius to the dependency array

    const renderMarkers = () => {
        if (Array.isArray(stations)) {
            return stations.map((station) => (
                <Marker
                    key={station.place_id}
                    position={{
                        lat: station.geometry.location.lat,
                        lng: station.geometry.location.lng,
                    }}
                    onClick={() => {
                        setSelectedStation(station);
                    }}
                />
            ));
        } else {
            console.error('stations is not an array:', stations);
            return null;
        }
    };

    const renderCircle = () => {
        if (userLocation) {
            console.log("Rendering circle with userLocation and radius:", userLocation, radius);
            return <Circle center={userLocation} radius={radius} />;
        } else {
            return null;
        }
    };


    const renderInfoWindow = () => {
        if (selectedStation) {
            return (
                <InfoWindow
                    position={{
                        lat: selectedStation.geometry.location.lat,
                        lng: selectedStation.geometry.location.lng,
                    }}
                    onCloseClick={() => {
                        setSelectedStation(null);
                    }}
                >
                    <div>
                        <h3>{selectedStation.name}</h3>
                        <p>Address: {selectedStation.vicinity}</p>
                        {/* Add additional information here */}
                    </div>
                </InfoWindow>
            );
        } else {
            return null;
        }
    };

    return (
        <GoogleMap zoom={14} center={userLocation} mapContainerStyle={mapContainerStyle}>
            {renderMarkers()}
            {renderCircle()}
            {renderInfoWindow()}
        </GoogleMap>
    );
}

export default MapContainer;

