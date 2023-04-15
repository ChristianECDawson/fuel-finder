import React from 'react';
import { Paper, Typography, Grid, Card, CardContent } from '@mui/material';
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
    },
    card: {
        minWidth: 275,
    },
});

const CompareStationsWindow = ({ compareStations }) => {
    const classes = useStyles();

    const getArrow = (value1, value2) => {
        if (value1 > value2) {
            return <ArrowDropDownIcon style={{ color: 'red' }} />;
        } else if (value1 < value2) {
            return <ArrowDropUpIcon style={{ color: 'green' }} />;
        } else {
            return <RemoveIcon style={{ color: 'grey' }} />; // Add this line
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
                                        Petrol: £{station.gasPrice.toFixed(2)} /L{' '}
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
                </Grid>
            </Paper>
        </Draggable>
    );
};

export default CompareStationsWindow;

