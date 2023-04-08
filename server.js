const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());

// Fetch nearby fuel stations
async function fetchNearbyFuelStations(req, res) {
    const { lat, lng } = req.query;
    const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=gas_station&key=${apiKey}`;

    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching fuel stations:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

// Route to fetch nearby fuel stations
app.get('/api/fuelstations', fetchNearbyFuelStations);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
