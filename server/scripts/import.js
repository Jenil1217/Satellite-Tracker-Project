// backend/scripts/importSatellites.js
const fs = require('fs');
const mongoose = require('mongoose');
const Satellite = require('../models/Satellite');
const connectDB = require('../db');

const importData = async () => {
  await connectDB();

  const jsonData = JSON.parse(fs.readFileSync('./Data/Active.json', 'utf-8'));

  try {
    await Satellite.insertMany(jsonData);
    console.log('✅ Data Imported');
    process.exit();
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
};

importData();
