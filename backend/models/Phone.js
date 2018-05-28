const mongoose = require('mongoose');

const { Schema } = mongoose;

const phoneSchema = new Schema({
  name: String,
  phonenumber: String,
  region: String
}, { timestamps: true });

const Phone = mongoose.model('Phone', phoneSchema);

module.exports = Phone;