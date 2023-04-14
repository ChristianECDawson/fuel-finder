// App.js
import React, { useState, useEffect } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';
import NavigationPanel from './components/NavigationPanel';
import { fetchNearbyFuelStations, geocodeAddress } from './api';
import LandingPage from './components/LandingPage';

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const defaultCenter = {
    lat: 51.504171,
    lng: -2.549914,
  }; // You can change the coordinates to the desired default location

  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [radius, setRadius] = useState(5000);
  const [stations, setStations] = useState([]);
  const [destination, setDestination] = useState(null);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const mapAndLandingPageContainerStyle = {
    position: 'relative',
  };

  const handleLocationConfirm = (location) => {
    setUserLocation(location);
    setLocationConfirmed(true);
  };

  const onDirectionsClick = (location) => {
    setDestination(location);
  };

  const handleSearchUpdate = (locationCoords, radius) => {
    setUserLocation(locationCoords);
    setRadius(radius);
    setDestination(null);
    setLocationConfirmed(true);
  };

  useEffect(() => {
    if (userLocation && radius) {
      fetchNearbyFuelStations(userLocation.lat, userLocation.lng, radius)
        .then((results) => {
          console.log('API response:', results);

          const transformedStations = results.results.map((station) => {
            return {
              ...station,
              gasPrice: parseFloat((Math.random() * (1.5 - 1.2) + 1.2).toFixed(2)),
              dieselPrice: parseFloat((Math.random() * (1.7 - 1.4) + 1.4).toFixed(2)),
            };
          });

          setStations(transformedStations);
        })
        .catch((error) => {
          console.error('Error fetching fuel stations:', error);
        });
    }
  }, [userLocation, radius]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <NavigationPanel
        defaultCenter={defaultCenter}
        onSearchUpdate={handleSearchUpdate}
        stations={stations}
        setStations={setStations}
        onDirectionsClick={onDirectionsClick}
      />
      <div style={mapAndLandingPageContainerStyle}>
        <MapContainer
          userLocation={userLocation}
          radius={radius}
          stations={stations}
          setStations={setStations}
          destination={destination}
          onDirectionsClick={onDirectionsClick}
          isBlurred={!locationConfirmed}
        />
        {!locationConfirmed && (
          <LandingPage onLocationConfirm={handleLocationConfirm} />
        )}
      </div>
    </>
  );
}
