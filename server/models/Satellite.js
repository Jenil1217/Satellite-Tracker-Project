const mongoose = require('mongoose');

const SatelliteSchema = new mongoose.Schema({
  OBJECT_NAME: { type: String, required: true },
  OBJECT_ID: { type: String, required: true },
  NORAD_CAT_ID: { type: Number, required: true },
  EPOCH: { type: String },
  MEAN_MOTION: { type: Number },
  ECCENTRICITY: { type: Number },
  INCLINATION: { type: Number },
  RA_OF_ASC_NODE: { type: Number },
  ARG_OF_PERICENTER: { type: Number },
  MEAN_ANOMALY: { type: Number },
  EPHEMERIS_TYPE: { type: Number },
  CLASSIFICATION_TYPE: { type: String },
  ELEMENT_SET_NO: { type: Number },
  REV_AT_EPOCH: { type: Number },
  BSTAR: { type: Number },
  MEAN_MOTION_DOT: { type: Number },
  MEAN_MOTION_DDOT: { type: Number },
}, { collection: 'satellites' }); // Match your MongoDB collection name

module.exports = mongoose.model('Satellite', SatelliteSchema);
