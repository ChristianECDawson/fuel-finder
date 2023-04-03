import React, { useState, useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Box,
    TextField,
    Divider,
    Drawer,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { makeStyles } from '@mui/styles';
import StationList from './StationList';
import { geocodeAddress } from '../api'; // Import the geocodeAddress function

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

const NavigationPanel = () => {
    const [location, setLocation] = useState('');
    const [locationCoords, setLocationCoords] = useState(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const classes = useStyles();

    useEffect(() => {
        if (location) {
            geocodeAddress(location)
                .then((coords) => {
                    setLocationCoords(coords);
                })
                .catch((error) => {
                    console.error('Error geocoding address:', error);
                });
        }
    }, [location]);

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const toggleDrawer = (open) => (event) => {
        setDrawerOpen(open);
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
                        <TextField
                            label="Enter your location"
                            fullWidth
                            value={location}
                            onChange={handleLocationChange}
                        />
                    </Box>
                    <Divider />
                    <StationList location={locationCoords} />
                </Box>
            </Drawer>
        </>
    );
};

export default NavigationPanel;
