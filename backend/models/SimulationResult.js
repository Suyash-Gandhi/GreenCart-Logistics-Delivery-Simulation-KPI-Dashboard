const mongoose = require('mongoose');

const SimulationResultSchema = new mongoose.Schema({
  totalProfit: Number,
  efficiency: Number,
   onTimeCount: Number,
  lateCount: Number,
  fuelCost: Number,
  chartData: mongoose.Schema.Types.Mixed, // allows storing {labels, datasets}
  orders: Array
}, { timestamps: true });


module.exports = mongoose.model('SimulationResult', SimulationResultSchema);
