// routes/simulation.js
const express = require('express');
const router = express.Router();
const SimulationResult = require('../models/SimulationResult');
const runSimulationLogic = require('../utils/runSimulationLogic');

// POST /api/simulation/run
router.post('/run', async (req, res) => {
  try {
    const { availableDrivers, startTime, maxHoursPerDay } = req.body;

    // Run simulation using your CSV-loaded logic
    const results = await runSimulationLogic(availableDrivers, startTime, maxHoursPerDay);

    // Save in DB
    const savedResult = await SimulationResult.create({
      totalProfit: results.totalProfit,
      efficiency: results.efficiency,
      onTimeCount: results.onTimeCount,
      lateCount: results.lateCount,
      chartData: results.chartData,
      orders: results.orders
    });

    res.json(savedResult);
  } catch (err) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: 'Simulation failed' });
  }
});

// GET /api/simulation/latest
router.get('/latest', async (req, res) => {
  try {
    const latest = await SimulationResult.findOne().sort({ createdAt: -1 });
    res.json(latest);
  } catch (err) {
    console.error('Fetch latest simulation error:', err);
    res.status(500).json({ error: 'Could not fetch simulation data' });
  }
});

module.exports = router;

