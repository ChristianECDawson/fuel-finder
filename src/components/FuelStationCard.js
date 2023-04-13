import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function FuelStationCard({ station, onDirectionsClick }) {
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
            <CardActions>
                <Button
                    size="small"
                    color="primary"
                    onClick={() => {
                        onDirectionsClick(station.geometry.location);
                    }}
                >
                    Get Directions
                </Button>
            </CardActions>
        </Card>
    );
}

export default FuelStationCard;
