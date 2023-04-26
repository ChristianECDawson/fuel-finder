import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { GoogleMapProvider } from '@react-google-maps/api';
import MapContainer from '../components/MapContainer';

// Mocking the Google Maps API
const googleMapsMock = {
    Size: jest.fn(),
    Animation: {
        DROP: 'DROP',
    },
    DirectionsService: jest.fn(() => ({
        route: jest.fn(),
    })),
    DirectionsStatus: {
        OK: 'OK',
    },
};

window.google = {
    maps: googleMapsMock,
};

jest.mock('@react-google-maps/api', () => ({
    GoogleMap: jest.fn(({ children }) => <div>{children}</div>),
    Marker: jest.fn((props) => (
        <div data-testid="fuelstation">{props.children}</div>
    )),
    Circle: jest.fn(),
    InfoWindow: jest.fn(),
    DirectionsRenderer: jest.fn(),
    GoogleMapProvider: ({ children }) => <div>{children}</div>,
}));

describe('MapContainer', () => {
    it('renders without crashing', () => {
        render(
            <GoogleMapProvider>
                <MapContainer />
            </GoogleMapProvider>
        );
    });

    it('renders station markers when stations prop is provided', async () => {
        const userLocation = { lat: 37.7749, lng: -122.4194 };
        const stations = [
            {
                place_id: '1',
                geometry: {
                    location: {
                        lat: 37.7859,
                        lng: -122.4094,
                    },
                },
            },
            {
                place_id: '2',
                geometry: {
                    location: {
                        lat: 37.7959,
                        lng: -122.3994,
                    },
                },
            },
        ];

        const { queryAllByTestId } = render(
            <GoogleMapProvider>
                <MapContainer userLocation={userLocation} stations={stations} />
            </GoogleMapProvider>
        );

        const fuelStations = await queryAllByTestId('fuelstation');
        expect(fuelStations.length).toBe(2);
    });

    // Write other tests following the same pattern
});
