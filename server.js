const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

async function fetchNearbyFuelStations(req, res) {
    const { lat, lng, radius } = req.query;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=gas_station&key=${apiKey}`;
    console.log('Server received lat, lng, radius:', lat, lng, radius);
    console.log('Constructed URL:', url);

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching fuel stations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function geocodeAddress(req, res) {
    const { address } = req.query;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?key=${apiKey}&address=${encodeURIComponent(address)}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error geocoding address:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

app.get('/api/fuelstations', fetchNearbyFuelStations);

app.get('/api/geocode', geocodeAddress);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
