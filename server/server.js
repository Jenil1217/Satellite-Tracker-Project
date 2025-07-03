require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const satelliteRoutes = require('./routes/satellite'); // Make sure this file exists

const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/satelliteDB';

app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Mount routes
app.use('/', satelliteRoutes);
// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
