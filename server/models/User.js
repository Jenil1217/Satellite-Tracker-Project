// server/models/User.js
const mongoose = require('mongoose');

const userSchema  = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  favorites: [{ type: Number }] // array of NORAD IDs
});

module.exports = mongoose.model('User', userSchema);
