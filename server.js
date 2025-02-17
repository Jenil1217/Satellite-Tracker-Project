const express = require("express");
const path = require("path");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Your N2YO API key
const API_KEY = "xxxxx"; 
const BASE_URL = "https://api.n2yo.com/rest/v1/satellite/";

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/visible", (req, res) => res.sendFile(path.join(__dirname, "public", "visible.html")));
app.get("/info", (req, res) => res.sendFile(path.join(__dirname, "public", "info.html")));

// API Route: Get visible satellites for given location
app.get("/visible-satellites", async (req, res) => {
    const { lat, lon } = req.query;
    // Input validation
    if (!lat || !lon) {
        return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    try {
        const response = await axios.get(`${BASE_URL}above/${lat}/${lon}/0/90/46?apiKey=${API_KEY}`);
        return res.json(response.data);
    } catch (error) {
        console.error("Error fetching visible satellites:", error);
        return res.status(500).json({ error: "Failed to fetch visible satellites." });
    }
});

// API Route: Get TLE data or position of a satellite by ID 
// app.get("/satellite/:id", async (req, res) => {
//     const { id } = req.params;
//     try {
//         const response = await axios.get(`${BASE_URL}tle/${id}&apiKey=${API_KEY}`);
//         res.json(response.data);
//     } catch (error) {
//         console.error("Error fetching satellite data:", error);
//         res.status(500).json({ error: "Failed to fetch satellite data." });
//     }
// });

// Add new route for satellite positions
app.get("/positions/:id/:lat/:lng/:alt/:seconds", async (req, res) => {
    const { id, lat, lng, alt, seconds } = req.params;
    try {
        const response = await axios.get(
            `${BASE_URL}positions/${id}/${lat}/${lng}/${alt}/${seconds}?apiKey=${API_KEY}`
        );
        res.json(response.data);
    } catch (error) {
        console.error("Error fetching satellite positions:", error);
        res.status(500).json({ error: "Failed to fetch satellite positions." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});