const mongoose = require('mongoose');

const sosSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  message: { type: String, default: 'EMERGENCY! I need help!' },
  notifiedContacts: [{ type: String }],
  status: { type: String, enum: ['active', 'resolved'], default: 'active' },
}, { timestamps: true });

module.exports = mongoose.model('SOS', sosSchema);
