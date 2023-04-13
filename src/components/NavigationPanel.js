import React, { useState, useRef } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    Divider,
    Drawer,
    IconButton,
    Grid,
    FormControl,
    InputLabel,
    OutlinedInput,
    Button,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import StationList from './StationList';
import LocationAutocomplete from './LocationAutocomplete';

const useStyles = makeStyles({
    appBar: {
        position: 'absolute',
        zIndex: 1201,
        backgroundColor: 'transparent',
        boxShadow: 'none',
    },
    toolbar: {
        minHeight: 'auto',
        padding: 0,
    },
    drawer: {
        width: 300,
    },
});

const NavigationPanel = ({ defaultCenter, onLocationChange, onRadiusChange, onSearchUpdate, stations, setStations, onDirectionsClick }) => {
    const classes = useStyles();
    const [location, setLocation] = useState('');
    const [locationCoords, setLocationCoords] = useState(defaultCenter);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [radius, setRadius] = useState(5000);
    const autoCompleteRef = useRef(null);

    // Add this piece of state to store the current search parameters
    const [currentSearch, setCurrentSearch] = useState({ locationCoords: null, radius: null });

    const handleLocationChange = (value) => {
        setLocation(value);
    };

    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
    };

    const handleRadiusChange = (event) => {
        setRadius(event.target.value);
    };

    const onPlaceChanged = () => {
        const place = autoCompleteRef.current.getPlace();

        if (place && place.formatted_address) {
            setLocation(place.formatted_address);
        }

        if (place && place.geometry && place.geometry.location) {
            setLocationCoords({
                lat: place.geometry.location.lat,
                lng: place.geometry.location.lng,
            });
        }
    };

    return (
        <>
            <AppBar position="static" className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">Fuel Station Finder</Typography>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <Box className={classes.drawer} role="presentation">
                    <Box m={2}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <LocationAutocomplete
                                    location={location}
                                    handleLocationChange={handleLocationChange}
                                    setLocationCoords={setLocationCoords}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel htmlFor="radius-input">Radius (meters)</InputLabel>
                                    <OutlinedInput
                                        id="radius-input"
                                        label="Radius (meters)"
                                        fullWidth
                                        type="number"
                                        inputProps={{ min: 1, max: 50000 }}
                                        value={radius}
                                        onChange={handleRadiusChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => {
                                        onSearchUpdate(locationCoords, radius);
                                        setCurrentSearch({ locationCoords, radius });
                                    }}
                                >
                                    Update Search
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    <StationList
                        location={locationCoords}
                        radius={radius}
                        stations={stations}
                        setStations={setStations}
                        onDirectionsClick={onDirectionsClick} // Add this line
                    />
                </Box>
            </Drawer>
        </>
    );
};

export default NavigationPanel;


