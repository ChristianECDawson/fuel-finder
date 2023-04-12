import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';
import NavigationPanel from './components/NavigationPanel';

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
  const [radius, setRadius] = useState(5);

  const handleSearchUpdate = (locationCoords, radius) => {
    setUserLocation(locationCoords);
    setRadius(radius);
  };

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <NavigationPanel defaultCenter={defaultCenter} onSearchUpdate={handleSearchUpdate} />
      <MapContainer userLocation={userLocation} radius={radius} />
    </>
  );
}
