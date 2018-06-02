const mongoose = require('mongoose');

const { Schema } = mongoose;

const alarmSchema = new Schema({
  idEsp: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  connected: { type: Boolean, default: false },
  powerOn: { type: Boolean, default: false },
  alarmOn: { type: Boolean, default: false }
}, { timestamps: true });

alarmSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;