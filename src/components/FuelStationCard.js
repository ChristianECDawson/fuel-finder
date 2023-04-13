import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';

function FuelStationCard({ station }) {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" component="h2">
                    {station.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                    {station.vicinity}
                </Typography>
                <Typography>
                    Petrol: £{station.gasPrice.toFixed(2)} /L
                </Typography>
                <Typography>
                    Diesel: £{station.dieselPrice.toFixed(2)} /L
                </Typography>
            </CardContent>
        </Card>
    );
}

export default FuelStationCard;
