import React, { useMemo } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import NavigationPanel from './NavigationPanel';

function MapContainer() {
    const center = useMemo(() => ({ lat: 51.504171, lng: -2.549914 }), []);

    const mapContainerStyle = {
        width: '100%',
        height: '98vh',
        position: 'relative',
    };

    return (
        <>
            <NavigationPanel />
            <GoogleMap zoom={15} center={center} mapContainerStyle={mapContainerStyle}>
                <Marker position={{ lat: 51.504171, lng: -2.549914 }} />
            </GoogleMap>
        </>
    );
}

export default MapContainer;
