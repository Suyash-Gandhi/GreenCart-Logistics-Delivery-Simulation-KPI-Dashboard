const mongoose = require('mongoose');

const DriverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, default: 0 }, // current shift hours
  past_week_hours: { type: [Number], default: [] } // pipe-split values from CSV
}, { timestamps: true });

module.exports = mongoose.model('Driver', DriverSchema);
