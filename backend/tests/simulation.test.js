// tests/simulationEngine.test.js
const path = require('path');
const simulationEngine = require('../utils/simulationEngine');

// Ensure CSV paths are correctly set in simulationEngine or passed as args
const driversPath = path.join(__dirname, '../data/drivers.csv');
const ordersPath = path.join(__dirname, '../data/orders.csv');
const routesPath = path.join(__dirname, '../data/routes.csv');

describe('Simulation Engine (CSV Data)', () => {
  it('should process CSV data and return expected KPIs & allocations', async () => {
    const res = await simulationEngine.run({
      driversFile: driversPath,
      ordersFile: ordersPath,
      routesFile: routesPath,
      availableDrivers: 3,
      startTime: '09:00',
      maxHoursPerDay: 8
    });

    // Core KPIs
    expect(res).toHaveProperty('totalProfit');
    expect(typeof res.totalProfit).toBe('number');

    expect(res).toHaveProperty('efficiency');
    expect(typeof res.efficiency).toBe('number');

    expect(res).toHaveProperty('orders');
    expect(Array.isArray(res.orders)).toBe(true);
    expect(res.orders.length).toBeGreaterThan(0);

    // Ensure each order has been assigned a driver and completion time
    res.orders.forEach(order => {
      expect(order).toHaveProperty('order_id');
      expect(order).toHaveProperty('driver');
      expect(order).toHaveProperty('completed_at');
    });

    // Drivers allocation check
    expect(res).toHaveProperty('driverAllocations');
    expect(Array.isArray(res.driverAllocations)).toBe(true);
    expect(res.driverAllocations.length).toBeLessThanOrEqual(3);
  });
});
