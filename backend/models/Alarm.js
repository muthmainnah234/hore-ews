const mongoose = require('mongoose');

const { Schema } = mongoose;

const alarmSchema = new Schema({
  idEsp: { type: String, required: true, unique: true },
  region: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  connection: { type: String, enum: [ 'ON', 'OFF' ], default: 'OFF' },
  power: { type: String, enum: [ 'ON', 'OFF' ], default: 'OFF' },
  alarmState: { type: Number, default: 0 }
}, { timestamps: true });

alarmSchema.index({ latitude: 1, longitude: 1 }, { unique: true });

const Alarm = mongoose.model('Alarm', alarmSchema);

module.exports = Alarm;