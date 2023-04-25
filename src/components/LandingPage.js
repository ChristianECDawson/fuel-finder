import React from 'react';
import { Box, Typography } from '@mui/material';
import logo from '../images/logo.png'

const LandingPage = ({ onLocationConfirm }) => {
    const containerStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        background: 'rgba(255, 255, 255, 0.8)',
        zIndex: 10,
    };

    const logoStyle = {
        width: '1500px',
        marginTop: '-250px',
    };

    const titleStyle = {
        marginTop: '-250px',
    };

    return (
        <Box style={containerStyle}>
            <img src={logo} alt="Fuel Station Finder Logo" style={logoStyle} />
            <Typography variant="h4" gutterBottom style={titleStyle}>
                Welcome to Fuel Station Finder
            </Typography>
            <Typography variant="subtitle1">
                Use the search panel on the top left to find fuel stations near your location.
            </Typography>
        </Box>
    );
};

export default LandingPage;
