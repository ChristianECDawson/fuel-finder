import React, { useState } from 'react';
import { Paper, Typography, Grid, Card, CardContent, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import RemoveIcon from '@mui/icons-material/Remove';
import Draggable from 'react-draggable';

const useStyles = makeStyles({
    window: {
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300,
        padding: 16,
        cursor: 'move',
        maxWidth: 550,
    },
    card: {
        minWidth: 275,
    },
});

const CompareStationsWindow = ({ compareStations }) => {
    const classes = useStyles();
    const [fuelEconomy, setFuelEconomy] = useState(null);

    const getArrow = (value1, value2) => {
        if (value1 > value2) {
            return <ArrowDropDownIcon style={{ color: 'red' }} />;
        } else if (value1 < value2) {
            return <ArrowDropUpIcon style={{ color: 'green' }} />;
        } else {
            return <RemoveIcon style={{ color: 'grey' }} />;
        }
    };

    const calculateFuelEfficiency = (stationA, stationB, fuelType, fuelEconomy) => {
        if (!fuelEconomy) return null;

        const litersPerGallon = 4.54609;
        const kmPerMile = 1.60934;

        const fuelEconomyLitersPer100Km = (100 * litersPerGallon) / (fuelEconomy * kmPerMile);

        const fuelCostA = (stationA.distance * fuelEconomyLitersPer100Km * stationA[`${fuelType}Price`]) / 100;
        const fuelCostB = (stationB.distance * fuelEconomyLitersPer100Km * stationB[`${fuelType}Price`]) / 100;

        if (fuelCostA < fuelCostB) {
            return `For ${fuelType === 'gas' ? 'petrol' : 'diesel'}, ${stationA.name} is more fuel-efficient. You'll spend £${fuelCostA.toFixed(2)} on fuel.`;
        } else if (fuelCostA > fuelCostB) {
            return `For ${fuelType === 'gas' ? 'petrol' : 'diesel'}, ${stationB.name} is more fuel-efficient. You'll spend £${fuelCostB.toFixed(2)} on fuel.`;
        } else {
            return `Both stations have the same fuel efficiency. You'll spend £${fuelCostA.toFixed(2)} on fuel.`;
        }
    };

    return (
        <Draggable>
            <Paper className={classes.window}>
                <Typography variant="h6">Compare Stations</Typography>
                <Grid container spacing={2}>
                    {compareStations.map((station, index) => (
                        <Grid item xs={6} key={index}>
                            <Card className={classes.card}>
                                <CardContent>
                                    <Typography variant="h6">{station.name}</Typography>
                                    <Typography variant="body1">
                                        Unleaded: £{station.gasPrice.toFixed(2)} /L{' '}
                                        {index === 0
                                            ? getArrow(station.gasPrice, compareStations[1].gasPrice)
                                            : getArrow(station.gasPrice, compareStations[0].gasPrice)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Diesel: £{station.dieselPrice.toFixed(2)} /L{' '}
                                        {index === 0
                                            ? getArrow(station.dieselPrice, compareStations[1].dieselPrice)
                                            : getArrow(station.dieselPrice, compareStations[0].dieselPrice)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Distance: {station.distance} km{' '}
                                        {index === 0
                                            ? getArrow(station.distance, compareStations[1].distance)
                                            : getArrow(station.distance, compareStations[0].distance)}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                    <Grid item xs={12}>
                        <TextField
                            label="Fuel economy (mpg)"
                            variant="outlined"
                            size="small"
                            type="number"
                            onChange={(e) => setFuelEconomy(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {calculateFuelEfficiency(compareStations[0], compareStations[1], 'gas', fuelEconomy)}
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body1">
                            {calculateFuelEfficiency(compareStations[0], compareStations[1], 'diesel', fuelEconomy)}
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Draggable>
    );
};

export default CompareStationsWindow;


