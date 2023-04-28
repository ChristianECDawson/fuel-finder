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
        minWidth: 250,
    },
});

const CompareStationsWindow = ({ compareStations }) => {
    const classes = useStyles();
    const [fuelEconomy, setFuelEconomy] = useState(40);

    const getArrow = (value1, value2) => {
        if (value1 > value2) {
            return <ArrowDropDownIcon style={{ color: 'red' }} />;
        } else if (value1 < value2) {
            return <ArrowDropUpIcon style={{ color: 'green' }} />;
        } else {
            return <RemoveIcon style={{ color: 'grey' }} />;
        }
    };

    const calculateFuelEfficiency = (stationA, stationB, fuelEconomy) => {
        if (!fuelEconomy) return { gas: null, diesel: null, journeyCost: null };

        const litersPerGallon = 4.54609;
        const kmPerMile = 1.60934;
        const fuelEconomyLitersPer100Km = (100 * litersPerGallon) / (fuelEconomy * kmPerMile);

        const fuelCost = (station, fuelType) => (station.distance * fuelEconomyLitersPer100Km * station[`${fuelType}Price`]) / 100;

        const journeyCost = (station, fuelType) => (station.distance * fuelEconomyLitersPer100Km * station[`${fuelType}Price`]) / 100;

        const gasEfficiency = fuelCost(stationA, 'gas') < fuelCost(stationB, 'gas') ? "0" : "1";
        const dieselEfficiency = fuelCost(stationA, 'diesel') < fuelCost(stationB, 'diesel') ? "0" : "1";

        return { gas: gasEfficiency, diesel: dieselEfficiency, journeyCost };
    };

    const efficiency = calculateFuelEfficiency(compareStations[0], compareStations[1], fuelEconomy);
    const { journeyCost } = efficiency;

    const renderEfficiencyDetails = (type, cost, index) => (
        <Typography variant="body1" style={{ color: efficiency[type] === index.toString() ? 'green' : 'red', fontWeight: 'bold' }}>
            {efficiency[type] === index.toString() ? 'More Efficient' : ''} ({type === 'gas' ? 'Petrol' : 'Diesel'} - £{cost.toFixed(2)})
        </Typography>
    );

    return (
        <Draggable>
            <Paper className={classes.window}>
                <Grid container spacing={2}>
                    {compareStations.map((station, index) => (
                        <Grid item xs={6} key={index}>
                            <Card
                                className={classes.card}
                                style={{
                                    border: [efficiency.gas, efficiency.diesel].includes(index.toString())
                                        ? '2px solid green'
                                        : '2px solid red',
                                }}
                            >
                                <CardContent>
                                    {renderEfficiencyDetails('gas', journeyCost(station, 'gas'), index)}
                                    {renderEfficiencyDetails('diesel', journeyCost(station, 'diesel'), index)}

                                    <Typography variant="h6">{station.name}</Typography>
                                    <Typography variant="body1">
                                        Unleaded: £{station.gasPrice.toFixed(2)} /L{' '}
                                        {getArrow(station.gasPrice, compareStations[1 - index].gasPrice)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Diesel: £{station.dieselPrice.toFixed(2)} /L{' '}
                                        {getArrow(station.dieselPrice, compareStations[1 - index].dieselPrice)}
                                    </Typography>
                                    <Typography variant="body1">
                                        Drive Distance: {station.distance} km{' '}
                                        {getArrow(station.distance, compareStations[1 - index].distance)}
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
                            value={fuelEconomy}
                            inputProps={{ min: 1, max: 200 }}
                            onChange={(e) => setFuelEconomy(e.target.value)}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Paper>
        </Draggable>
    );
};

export default CompareStationsWindow;


