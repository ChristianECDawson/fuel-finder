import axios from 'axios';
import { fetchNearbyFuelStations, geocodeAddress, isLocationApproximatelyEqual } from '../api';

jest.mock('axios');

describe('API', () => {
    afterEach(() => {
        axios.get.mockReset();
    });

    describe('isLocationApproximatelyEqual', () => {
        it('returns true if locations are approximately equal within the threshold', () => {
            const location1 = { lat: 51.504171, lng: -2.549914 };
            const location2 = { lat: 51.504171, lng: -2.549914 };
            const threshold = 0.0005;

            expect(isLocationApproximatelyEqual(location1, location2, threshold)).toBeTruthy();
        });

        it('returns false if locations are not approximately equal within the threshold', () => {
            const location1 = { lat: 51.504171, lng: -2.549914 };
            const location2 = { lat: 51.505171, lng: -2.549914 };
            const threshold = 0.0005;

            expect(isLocationApproximatelyEqual(location1, location2, threshold)).toBeFalsy();
        });
    });

    describe('geocodeAddress', () => {
        it('geocodes address successfully', async () => {
            const mockResponse = {
                data: {
                    status: 'OK',
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
                },
            };

            axios.get.mockResolvedValue(mockResponse);

            const address = '123 Main St';
            const result = await geocodeAddress(address);

            expect(axios.get).toHaveBeenCalledWith(`/api/geocode?address=${encodeURIComponent(address)}`);
            expect(result).toEqual(mockResponse.data.results[0].geometry.location);
        });

        it('handles errors when geocoding address', async () => {
            axios.get.mockRejectedValue(new Error('Network error'));

            const address = '123 Main St';
            const result = await geocodeAddress(address);

            expect(axios.get).toHaveBeenCalledWith(`/api/geocode?address=${encodeURIComponent(address)}`);
            expect(result).toBeNull();
        });
    });

    it('fetches nearby fuel stations successfully', async () => {
        const mockResponse = {
            status: 200,
            data: {
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
            },
        };

        axios.get.mockResolvedValue(mockResponse);

        const result = await fetchNearbyFuelStations(51.504171, -2.549914, 5000);

        expect(axios.get).toHaveBeenCalledWith(
            '/api/fuelstations?lat=51.504171&lng=-2.549914&radius=5000'
        );
        expect(result).toEqual({ results: mockResponse.data.results });
    });

    it('handles errors when fetching nearby fuel stations', async () => {
        axios.get.mockRejectedValue(new Error('Network error'));

        const result = await fetchNearbyFuelStations(51.504171, -2.549914, 5000);

        expect(axios.get).toHaveBeenCalledWith(
            '/api/fuelstations?lat=51.504171&lng=-2.549914&radius=5000'
        );
        expect(result).toEqual([]);
    });
});
