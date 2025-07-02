const express = require('express');
const axios = require('axios');
const router = express.Router();
const Satellite = require('../models/Satellite'); // MongoDB model

const API_KEY = process.env.N2YO_API_KEY;
const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

if (!API_KEY) {
  throw new Error('🚨 Missing N2YO API Key in .env file');
}

// 1️⃣ Route: Get visible satellites
router.get('/visible-satellites', async (req, res) => {
  const { lat, lon, cat } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  const category = cat || 0;
  const altitude = 0;
  const radius = 70;

  try {
    const url = `${BASE_URL}/above/${lat}/${lon}/${altitude}/${radius}/${category}?apiKey=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching visible satellites:', error.message);
    res.status(500).json({ error: 'Failed to fetch visible satellites.' });
  }
});

// 2️⃣ Route: Get satellite position
router.get('/positions/:id/:lat/:lon/:alt/:seconds', async (req, res) => {
  const { id, lat, lon, alt, seconds } = req.params;

  try {
    const url = `${BASE_URL}/positions/${id}/${lat}/${lon}/${alt}/${seconds}?apiKey=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching satellite position:', error.message);
    res.status(500).json({ error: 'Failed to fetch satellite position.' });
  }
});

// 3️⃣ Route: Get all satellites for dropdown
router.get('/satellites', async (req, res) => {
  try {
    const sats = await Satellite.find({}, 'OBJECT_NAME NORAD_CAT_ID -_id');
    res.json(sats);
  } catch (err) {
    console.error('Error loading satellites:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
