import React, { useState, useMemo, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import NavigationPanel from './NavigationPanel';
import { geocodeAddress, fetchNearbyFuelStations } from '../api';

function MapContainer() {
    const center = useMemo(() => ({ lat: 51.504171, lng: -2.549914 }), []);
    const [userLocation, setUserLocation] = useState(center);
    const [stations, setStations] = useState([]);

    const mapContainerStyle = {
        width: '100%',
        height: '98vh',
        position: 'relative',
    };

    const handleLocationChange = (newLocation) => {
        geocodeAddress(newLocation)
            .then((coords) => {
                setUserLocation(coords);
            })
            .catch((error) => {
                console.error('Error geocoding address:', error);
            });
    };

    useEffect(() => {
        if (userLocation) {
            fetchNearbyFuelStations(userLocation.lat, userLocation.lng)
                .then((results) => {
                    setStations(results);
                })
                .catch((error) => {
                    console.error('Error fetching fuel stations:', error);
                });
        }
    }, [userLocation]);

    const renderMarkers = () => {
        return stations.map((station) => (
            <Marker
                key={station.place_id}
                position={{
                    lat: station.geometry.location.lat(),
                    lng: station.geometry.location.lng(),
                }}
            />
        ));
    };

    return (
        <>
            <NavigationPanel onLocationChange={handleLocationChange} />
            <GoogleMap
                zoom={15}
                center={userLocation}
                mapContainerStyle={mapContainerStyle}
            >
                {renderMarkers()}
            </GoogleMap>
        </>
    );
}

export default MapContainer;
