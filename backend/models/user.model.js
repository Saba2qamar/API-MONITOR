const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  name:      { type: String, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true },
  apiKey:    { type: String, unique: true, default: () => 'nex_' + crypto.randomBytes(24).toString('hex') },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);