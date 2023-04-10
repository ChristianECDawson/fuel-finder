import React, { useState } from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';
import NavigationPanel from './components/NavigationPanel';

export default function Home() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  });

  const [userLocation, setUserLocation] = useState({ lat: 51.504171, lng: -2.549914 });
  const [radius, setRadius] = useState(5);

  const handleSearchUpdate = (locationCoords, radius) => {
    setUserLocation(locationCoords);
    setRadius(radius);
  };

  if (!isLoaded) return <div>Loading...</div>;
  return (
    <>
      <NavigationPanel onSearchUpdate={handleSearchUpdate} />
      <MapContainer userLocation={userLocation} radius={radius} />
    </>
  );
}
