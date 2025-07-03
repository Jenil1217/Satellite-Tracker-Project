// test.js
const mongoose = require('mongoose');
const Satellite = require('./models/Satellite');

mongoose.connect('mongodb://localhost:27017/satelliteDB')
  .then(async () => {
    console.log('Connected!');

    const sats = await Satellite.find().limit(5);
    console.log('Sample:', sats);

    mongoose.disconnect();
  })
  .catch(err => console.error(err));
