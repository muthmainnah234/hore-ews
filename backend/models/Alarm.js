const mongoose = require('mongoose');

const { Schema } = mongoose;

const alarmSchema = new Schema({
  region: String,
  latitude: Number,
  longitude: Number,
  connected: { type: Boolean, default: false },
  powerOn: { type: Boolean, default: false },
  alarmOn: { type: Boolean, default: false }
}, { timestamps: true });

alarmSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;