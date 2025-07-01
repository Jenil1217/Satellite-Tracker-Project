const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.N2YO_API_KEY;
const BASE_URL = 'https://api.n2yo.com/rest/v1/satellite';

// Validate API key
if (!API_KEY) {
  throw new Error('🚨 Missing N2YO API Key in .env file');
}

// Route 1: Get visible satellites for given lat/lon
router.get('/visible-satellites', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ error: 'Latitude and longitude are required' });
  }

  try {
    const url = `${BASE_URL}/above/${lat}/${lon}/0/90/46?apiKey=${API_KEY}`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching visible satellites:', error.message);
    res.status(500).json({ error: 'Failed to fetch visible satellites.' });
  }
});

// Route 2: Get satellite position prediction
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

module.exports = router;
