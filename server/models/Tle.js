const mongoose = require('mongoose');

const TleSchema = new mongoose.Schema({
  name: String,
  noradId: Number,
  line1: String,
  line2: String,
  category: String,
  updatedAt: Date
});

module.exports = mongoose.model('Tle', TleSchema);
