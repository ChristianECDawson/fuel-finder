import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, TextField, Divider } from '@mui/material';
import StationList from './StationList';
import styles from './NavigationPanel.css';

const NavigationPanel = () => {
    const [location, setLocation] = useState('');

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    return (
        <Box>
            <AppBar position="static" className={styles.appbar}>
                <Toolbar>
                    <Typography variant="h6">Fuel Station Finder</Typography>
                </Toolbar>
            </AppBar>
            <Box m={2}>
                <TextField
                    label="Enter your location"
                    fullWidth
                    value={location}
                    onChange={handleLocationChange}
                />
            </Box>
            <Divider />
            <StationList location={location} />
        </Box>
    );
};

export default NavigationPanel;
