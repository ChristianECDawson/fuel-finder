import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import { fetchNearbyFuelStations } from '../api';

function MapContainer({ userLocation, radius }) {
    const [stations, setStations] = useState([]);

    const mapContainerStyle = {
        width: '100%',
        height: 'calc(100vh - 64px)',
        position: 'relative',
    };

    useEffect(() => {
        if (userLocation) {
            fetchNearbyFuelStations(userLocation.lat, userLocation.lng, 5000)
                .then((results) => {
                    console.log('API response:', results);
                    setStations(results.results);
                })
                .catch((error) => {
                    console.error('Error fetching fuel stations:', error);
                });
        }
    }, [userLocation, radius]);

    const renderMarkers = () => {
        if (Array.isArray(stations)) {
            return stations.map((station) => (
                <Marker
                    key={station.place_id}
                    position={{
                        lat: station.geometry.location.lat,
                        lng: station.geometry.location.lng,
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
            return (
                <Circle
                    center={userLocation}
                    radius={radius * 1000} // Convert radius from kilometers to meters
                    options={{
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: '#FF0000',
                        fillOpacity: 0.2,
                        clickable: false,
                        draggable: false,
                        editable: false,
                        zIndex: 1,
                    }}
                />
            );
        } else {
            return null;
        }
    };

    return (
        <GoogleMap zoom={15} center={userLocation} mapContainerStyle={mapContainerStyle}>
            {renderMarkers()}
            {renderCircle()}
        </GoogleMap>
    );
}

export default MapContainer;
