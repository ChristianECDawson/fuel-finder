import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
//import styles from './MapContainer.css';

const containerStyle = {
    width: '100%',
    height: '100%',
};

const center = {
    lat: -34.397,
    lng: 150.644,
};

const MapContainer = () => {
    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10}></GoogleMap>
        </LoadScript>
    );
};

export default MapContainer;
