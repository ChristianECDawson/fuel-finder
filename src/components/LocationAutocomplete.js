import React, { useRef } from 'react';
import { FormControl, InputLabel, OutlinedInput } from '@mui/material';
import { Autocomplete } from '@react-google-maps/api';

const LocationAutocomplete = ({ location, handleLocationChange, setLocationCoords }) => {
    const autoCompleteRef = useRef(null);

    const onPlaceChanged = () => {
        const place = autoCompleteRef.current.getPlace();

        if (place && place.formatted_address) {
            handleLocationChange(place.formatted_address);
        }

        if (place && place.geometry && place.geometry.location) {
            setLocationCoords({
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
            });
        }
    };

    return (
        <Autocomplete
            onLoad={(autoC) => {
                autoCompleteRef.current = autoC;
            }}
            onPlaceChanged={onPlaceChanged}
            types={['geocode']}
            fields={['formatted_address', 'geometry']}
        >
            <FormControl fullWidth variant="outlined">
                <InputLabel htmlFor="location-input">Enter your location</InputLabel>
                <OutlinedInput
                    id="location-input"
                    label="Enter your location"
                    fullWidth
                    value={location || ''}
                    onChange={(e) => handleLocationChange(e.target.value)}
                />
            </FormControl>
        </Autocomplete>
    );
};

export default LocationAutocomplete;
