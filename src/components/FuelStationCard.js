import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

const FuelStationCard = ({ station }) => {
    return (
        <Card sx={{ marginBottom: 1 }}>
            <CardContent>
                <Typography variant="h6" component="div">
                    {station.name}
                </Typography>
                <Typography color="text.secondary" gutterBottom>
                    {station.address}
                </Typography>
                <Typography variant="body2">
                    {/* Display fuel prices here */}
                    {`Gas: $${station.gasPrice}, Diesel: $${station.dieselPrice}`}
                </Typography>
            </CardContent>
        </Card>
    );
};

export default FuelStationCard;
