import React from 'react';
import { useLoadScript } from '@react-google-maps/api';
import MapContainer from './components/MapContainer';

export default function Home() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (!isLoaded) return <div>Loading...</div>;
  return <MapContainer />;
}
