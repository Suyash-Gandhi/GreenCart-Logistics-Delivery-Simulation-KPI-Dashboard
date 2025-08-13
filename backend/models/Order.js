const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time: { type: String, required: true } // HH:MM expected
}, { timestamps: true });

module.exports = mongoose.model('Order', OrderSchema);
