import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import FuelStationCard from './FuelStationCard';

function MapContainer({ userLocation, radius, stations, setStations, destination, onDirectionsClick }) {
    const [selectedStation, setSelectedStation] = useState(null);
    const [directionsServiceRef, setDirectionsServiceRef] = useState(null);

    useEffect(() => {
        if (!destination) {
            setDirectionsServiceRef(null);
        } else if (destination && userLocation) {
            const directionsService = new window.google.maps.DirectionsService();

            directionsService.route(
                {
                    origin: userLocation,
                    destination: destination,
                    travelMode: window.google.maps.TravelMode.DRIVING,
                },
                (result, status) => {
                    if (status === window.google.maps.DirectionsStatus.OK) {
                        setDirectionsServiceRef(result);
                    } else {
                        console.error(`Directions request failed due to ${status}`);
                    }
                }
            );
        }
    }, [destination, userLocation]);

    const mapContainerStyle = {
        width: '100%',
        height: 'calc(100vh - 64px)',
        position: 'relative',
    };

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
                        <FuelStationCard station={selectedStation} onDirectionsClick={onDirectionsClick} />
                    </div>
                </InfoWindow>
            );
        } else {
            return null;
        }
    };

    const renderDirections = () => {
        if (directionsServiceRef) {
            return <DirectionsRenderer directions={directionsServiceRef} />;
        } else {
            return null;
        }
    };


    return (
        <GoogleMap zoom={14} center={userLocation} mapContainerStyle={mapContainerStyle}>
            {renderMarkers()}
            {renderCircle()}
            {renderInfoWindow()}
            {renderDirections()}
        </GoogleMap>
    );
}

export default MapContainer;

