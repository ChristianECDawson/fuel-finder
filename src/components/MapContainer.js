import React, { useState, useMemo, useEffect } from 'react';
import { GoogleMap, Marker, Circle } from '@react-google-maps/api';
import NavigationPanel from './NavigationPanel';
import { geocodeAddress, fetchNearbyFuelStations } from '../api';

function MapContainer() {
    const center = useMemo(() => ({ lat: 51.504171, lng: -2.549914 }), []);
    const [userLocation, setUserLocation] = useState(center);
    const [stations, setStations] = useState([]);
    const [radius, setRadius] = useState(5);

    const mapContainerStyle = {
        width: '100%',
        height: 'calc(100vh - 64px)',
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

    const handleSearchUpdate = (newStations) => {
        setStations(newStations);
    };

    useEffect(() => {
        if (userLocation) {
            fetchNearbyFuelStations(userLocation.lat, userLocation.lng)
                .then((results) => {
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
        <>
            <NavigationPanel
                onLocationChange={handleLocationChange}
                onRadiusChange={setRadius}
                onSearchUpdate={handleSearchUpdate}
            />
            <GoogleMap
                zoom={15}
                center={userLocation}
                mapContainerStyle={mapContainerStyle}
            >
                {renderMarkers()}
                {renderCircle()}
            </GoogleMap>

        </>
    );
}

export default MapContainer;
