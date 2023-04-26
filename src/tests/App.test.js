import React from 'react';
import { useJsApiLoader } from '@react-google-maps/api';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import App from '../App';

jest.mock('../api', () => ({
    fetchNearbyFuelStations: () =>
        Promise.resolve({
            results: [
                {
                    geometry: {
                        location: {
                            lat: 51.504171,
                            lng: -2.549914,
                        },
                    },
                },
            ],
        }),
}));

function mockComponent() {
    return <div />;
}

jest.mock('@react-google-maps/api', () => {
    const googleMapsMock = {
        Size: function () { },
        Animation: {
            DROP: '',
        },
        DirectionsStatus: {
            OK: '',
        },
        TravelMode: {
            DRIVING: '',
        },
        DirectionsService: function () {
            return {
                route: (request, callback) => {
                    callback('DIRECTIONS_RESULT', 'OK');
                },
            };
        },
    };

    global.window.google = {
        maps: googleMapsMock,
    };

    return {
        GoogleMap: mockComponent,
        useJsApiLoader: jest.fn(),
    };
});


describe('App', () => {
    beforeEach(() => {
        useJsApiLoader.mockReturnValue({ isLoaded: true });
    })
    it('renders without crashing', () => {
        render(<App />);
    });

    it('displays loading indicator when not loaded', () => {
        useJsApiLoader.mockReturnValue({ isLoaded: false });
        render(<App />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders NavigationPanel and MapContainer when loaded', async () => {
        useJsApiLoader.mockReturnValue({ isLoaded: true });
        render(<App />);
        await waitFor(() => screen.getByText(/search/i));
        expect(screen.getByText(/search/i)).toBeInTheDocument();
    });

    it('renders LandingPage when location is not confirmed', () => {
        render(<App />);
        expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    });

    it('hides LandingPage and removes blur after confirming location', async () => {
        render(<App />);

        // Wait for and click the menu button to open the drawer
        const menuButton = await screen.findByLabelText(/menu/i);
        userEvent.click(menuButton);

        // Wait for and click the update search button
        const updateSearchButton = await screen.findByText(/update search/i);
        userEvent.click(updateSearchButton);

        expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument();
    });
});
