import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Circle, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';
import Draggable from 'react-draggable';
import FuelStationCard from './FuelStationCard';
import CompareStationsWindow from './CompareStationsWindow';
import fuelStationIcon from '../images/fuelstation.png'
import userLocationIcon from '../images/userlocation.png'
import fuelStationSelectedIcon from '../images/fuelstationSelected.png';

function MapContainer({
    userLocation,
    radius,
    stations,
    setStations,
    destination,
    onDirectionsClick,
    isBlurred,
    compareStations,
    setCompareStations,
}) {
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
        filter: isBlurred ? 'blur(5px)' : 'none',
    };

    const renderMarkers = () => {
        const markers = [];

        if (Array.isArray(stations)) {
            stations.forEach((station) => {
                // Check if the station is in the compareStations array
                const isSelected = compareStations.some(
                    (compareStation) => compareStation.place_id === station.place_id
                );

                markers.push(
                    <Marker
                        key={station.place_id}
                        position={{
                            lat: station.geometry.location.lat,
                            lng: station.geometry.location.lng,
                        }}
                        icon={{
                            url: isSelected ? fuelStationSelectedIcon : fuelStationIcon,
                            scaledSize: new window.google.maps.Size(64, 64),
                        }}
                        animation={window.google.maps.Animation.DROP}
                        onClick={() => {
                            setSelectedStation(station);
                        }}
                    />
                );
            });
        } else {
            console.error("stations is not an array:", stations);
        }

        if (userLocation) {
            console.log("USERLOCATION", userLocation);
            markers.push(
                <Marker
                    key="user_location"
                    position={userLocation}
                    icon={{
                        url: userLocationIcon,
                        scaledSize: new window.google.maps.Size(64, 64),
                    }}
                />
            );
        }

        return markers;
    };


    const renderCircle = () => {
        if (userLocation) {
            console.log("Rendering circle with userLocation and radius:", userLocation, radius);
            const circleOptions = {
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0.35,
                zIndex: 1,
            };
            return <Circle center={userLocation} radius={radius} options={circleOptions} />;
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
                    options={{
                        pixelOffset: new window.google.maps.Size(0, -48), // This moves the InfoWindow up by 32 pixels.
                    }}
                    onCloseClick={() => {
                        setSelectedStation(null);
                    }}
                >
                    <div>
                        <FuelStationCard
                            station={selectedStation}
                            onDirectionsClick={onDirectionsClick}
                            compareStations={compareStations}
                            setCompareStations={setCompareStations}
                        />
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
        <GoogleMap zoom={13} center={userLocation} mapContainerStyle={mapContainerStyle}>
            {renderMarkers()}
            {renderCircle()}
            {renderInfoWindow()}
            {renderDirections()}
        </GoogleMap>
    );

}

export default MapContainer;