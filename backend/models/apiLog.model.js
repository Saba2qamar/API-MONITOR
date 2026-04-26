const mongoose = require('mongoose');

const apiLogSchema = new mongoose.Schema({
  userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  apiKey:       { type: String, required: true }, // added for multi-tenant filtering
  endpoint:     { type: String, required: true },
  method:       { type: String, default: 'GET' },
  statusCode:   { type: Number, required: true },
  responseTime: { type: Number, required: true },
  timestamp:    { type: Date, default: Date.now },
});

module.exports = mongoose.model('ApiLog', apiLogSchema);