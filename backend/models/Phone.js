const mongoose = require('mongoose');

const { Schema } = mongoose;

const phoneSchema = new Schema({
  name: String,
  phonenumber: { type: String, required: true, unique: true },
  region: { type: String, required: true }
}, { timestamps: true });

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;