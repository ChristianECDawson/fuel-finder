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
    Select,
    MenuItem,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import StationList from './StationList';
import LocationAutocomplete from './LocationAutocomplete';
import CompareStationsWindow from './CompareStationsWindow';

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

const NavigationPanel = ({
    userLocation,
    defaultCenter,
    onSearchUpdate,
    stations,
    destination,
    onDirectionsClick,
    onClearDirectionsClick,
    isBlurred,
    compareStations,
    setCompareStations,
    showingDirections
}) => {
    const classes = useStyles();
    const [location, setLocation] = useState('');
    const [locationCoords, setLocationCoords] = useState(defaultCenter);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [radius, setRadius] = useState(5000);
    const autoCompleteRef = useRef(null);
    const [sortBy, setSortBy] = useState('distance');
    const [currentSearch, setCurrentSearch] = useState({ locationCoords: null, radius: null });

    const handleOpenInGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},
                    ${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
        window.open(url, '_blank');
    };

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

    const sortStations = (stations, location, sortBy) => {
        const sortedStations = [...stations];

        if (sortBy === 'distance') {
            sortedStations.sort((a, b) => {
                return a.distance - b.distance;
            });
        } else if (sortBy === 'gasPrice') {
            sortedStations.sort((a, b) => {
                return a.gasPrice - b.gasPrice;
            });
        } else if (sortBy === 'dieselPrice') {
            sortedStations.sort((a, b) => {
                return a.dieselPrice - b.dieselPrice;
            });
        }

        return sortedStations;
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
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)} data-testid="navigation-drawer">
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
                                        inputProps={{ min: 500, max: 5000, step: 500 }}
                                        value={radius}
                                        onChange={handleRadiusChange}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel>Sort by</InputLabel>
                                    <Select
                                        value={sortBy}
                                        onChange={(e) => {
                                            setSortBy(e.target.value);
                                        }}
                                        label="Sort by"
                                    >
                                        <MenuItem value="distance">Distance</MenuItem>
                                        <MenuItem value="gasPrice">Unleaded price</MenuItem>
                                        <MenuItem value="dieselPrice">Diesel price</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    style={{ marginBottom: '16px' }}
                                    onClick={() => {
                                        onSearchUpdate(locationCoords, radius);
                                        setCurrentSearch({ locationCoords, radius });
                                    }}
                                >
                                    Update Search
                                </Button>
                                {showingDirections && (
                                    <div style={{ display: 'flex' }}>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            style={{
                                                color: 'white',
                                                marginRight: '8px',
                                                whiteSpace: 'nowrap',
                                            }}
                                            color="secondary"
                                            onClick={handleOpenInGoogleMaps}
                                        >
                                            Google Maps
                                        </Button>

                                        <Button
                                            variant="contained"
                                            size="small"
                                            style={{
                                                color: 'white',
                                                whiteSpace: 'nowrap',
                                            }}
                                            color="primary"
                                            onClick={onClearDirectionsClick}
                                        >
                                            Clear Directions
                                        </Button>
                                    </div>
                                )}

                            </Grid>
                        </Grid>
                    </Box>
                    <Divider />
                    {!isBlurred && (
                        <StationList
                            stations={sortStations(stations, locationCoords, sortBy)}
                            onDirectionsClick={onDirectionsClick}
                            compareStations={compareStations}
                            setCompareStations={setCompareStations}
                        />
                    )}
                </Box>
            </Drawer>
            {compareStations.length === 2 && (
                <CompareStationsWindow compareStations={compareStations} />
            )}
        </>
    );
};

export default NavigationPanel;

