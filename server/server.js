// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const satelliteRoutes = require('./routes/satellite');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/', satelliteRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
