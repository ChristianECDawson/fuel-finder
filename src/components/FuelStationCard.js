import React from 'react';
import { Card, CardContent, Typography, CardActions, Button } from '@mui/material';

function FuelStationCard({
    station,
    onDirectionsClick,
    compareStations = [],
    setCompareStations = () => { },
}) {
    const handleCompareClick = () => {
        if (compareStations.length < 2 && !compareStations.includes(station)) {
            setCompareStations([...compareStations, station]);
        } else if (compareStations.includes(station)) {
            setCompareStations(compareStations.filter((s) => s !== station));
        }
    };

    const isSelected = compareStations.includes(station);

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
                    Unleaded: £{station.gasPrice.toFixed(2)} /L
                </Typography>
                <Typography>
                    Diesel: £{station.dieselPrice.toFixed(2)} /L
                </Typography>
                <Typography>
                    Distance: {station.distance} km | {(station.distance / 1.63).toFixed(2)} mile
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
                <Button
                    size="small"
                    color={isSelected ? 'primary' : 'secondary'}
                    variant={isSelected ? 'contained' : 'outlined'}
                    onClick={handleCompareClick}
                    disabled={compareStations.length >= 2 && !isSelected}
                >
                    {isSelected ? 'Selected' : 'Compare'}
                </Button>
            </CardActions>
        </Card>
    );
}

export default FuelStationCard;
