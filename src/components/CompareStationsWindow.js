import React from 'react';
import Draggable from 'react-draggable';
import { Paper, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
    window: {
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300,
        padding: 16,
        cursor: 'move',
    },
});

const CompareStationsWindow = ({ compareStations }) => {
    const classes = useStyles();

    return (
        <Draggable>
            <Paper className={classes.window}>
                <Typography variant="h6">Compare Stations</Typography>
                {compareStations.map((station, index) => (
                    <div key={index}>
                        <Typography variant="body1">{station.name}</Typography>
                        <Typography variant="body2">
                            Petrol: £{station.gasPrice.toFixed(2)} /L
                        </Typography>
                        <Typography variant="body2">
                            Diesel: £{station.dieselPrice.toFixed(2)} /L
                        </Typography>
                        <Typography variant="body2">
                            Distance: {station.distance} km
                        </Typography>
                    </div>
                ))}
            </Paper>
        </Draggable>
    );
};

export default CompareStationsWindow;
