const mongoose = require('mongoose');

const { Schema } = mongoose;

const alarmSchema = new Schema({
  region: String,
  latitude: Number,
  longitude: Number,
  connected: Boolean,
  powerON: Boolean,
  alarmON: Boolean
}, { timestamps: true });

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;