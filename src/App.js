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
  const [compareStations, setCompareStations] = useState([]);

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
            const stationLatLng = new window.google.maps.LatLng(
              station.geometry.location.lat,
              station.geometry.location.lng
            );
            const userLatLng = new window.google.maps.LatLng(userLocation.lat, userLocation.lng);

            const distance = window.google.maps.geometry.spherical.computeDistanceBetween(
              userLatLng,
              stationLatLng
            );

            return {
              ...station,
              gasPrice: parseFloat((Math.random() * (1.52 - 1.42) + 1.42).toFixed(2)),
              dieselPrice: parseFloat((Math.random() * (1.73 - 1.63) + 1.63).toFixed(2)),
              distance: parseFloat((distance / 1000).toFixed(2)), // Distance in kilometers
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
        isBlurred={!locationConfirmed}
        compareStations={compareStations}
        setCompareStations={setCompareStations}
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
          compareStations={compareStations}
          setCompareStations={setCompareStations}
        />
        {!locationConfirmed && (
          <LandingPage onLocationConfirm={handleLocationConfirm} />
        )}
      </div>
    </>
  );
}
