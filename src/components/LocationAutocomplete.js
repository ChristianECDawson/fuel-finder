import React, { useState, useRef } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    OutlinedInput,
    Paper,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';

const LocationAutocomplete = ({ location, handleLocationChange, setLocationCoords }) => {
    const [predictions, setPredictions] = useState([]);
    const autoCompleteRef = useRef(null);

    const handleInputChange = (e) => {
        const input = e.target.value;
        handleLocationChange(input);

        if (!input || input.length < 3) {
            setPredictions([]);
            return;
        }

        const service = new window.google.maps.places.AutocompleteService();
        service.getPlacePredictions(
            {
                input: input,
                types: ['geocode'],
                // Optional: you can include a LatLngBounds object to restrict the search area
                // bounds: ...
            },
            (predictions, status) => {
                if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                    console.error('AutocompleteService status:', status);
                    setPredictions([]); // Clear the predictions if there's an error
                    return;
                }

                setPredictions(predictions);
            }
        );
    };

    const handlePlaceSelect = (place) => {
        if (place && place.formatted_address) {
            handleLocationChange(place.formatted_address);
        }

        if (place && place.geometry && place.geometry.location) {
            setLocationCoords({
                lat: place.geometry.location.lat(),
                lng: place.geometry.location.lng(),
            });
        }
    };

    const renderPredictions = () => {
        if (predictions.length === 0) return null;

        return (
            <Paper elevation={2} style={{ position: 'absolute', zIndex: 1000, width: '100%', marginTop: 8 }}>
                <List dense>
                    {predictions.map((prediction, index) => (
                        <ListItem
                            key={prediction.place_id}
                            button
                            onClick={() => {
                                const service = new window.google.maps.places.PlacesService(autoCompleteRef.current);
                                service.getDetails(
                                    {
                                        placeId: prediction.place_id,
                                        fields: ['formatted_address', 'geometry'],
                                    },
                                    (place, status) => {
                                        if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                                            console.error('PlacesService status:', status);
                                            return;
                                        }

                                        handlePlaceSelect(place);
                                        setPredictions([]);
                                    }
                                );
                            }}
                        >
                            <ListItemText primary={prediction.description} />
                        </ListItem>
                    ))}
                </List>
            </Paper>
        );
    };

    return (
        <Box position="relative">
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="location-input">Enter your location</InputLabel>
                <OutlinedInput
                    id="location-input"
                    label="Enter your location"
                    fullWidth
                    value={location || ''}
                    onChange={handleInputChange}
                />
            </FormControl>
            {renderPredictions()}
            <div ref={autoCompleteRef} style={{ display: 'none' }}></div>
        </Box>
    );
};

export default LocationAutocomplete;