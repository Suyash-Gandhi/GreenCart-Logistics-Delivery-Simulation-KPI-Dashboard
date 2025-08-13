const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

/**
 * Helper: convert "HH:MM" to minutes since midnight
 */
function hhmmToMinutes(str) {
  const [hh, mm] = str.split(':').map(Number);
  return hh * 60 + mm;
}

/**
 * Run simulation
 * inputs: { availableDrivers, startTime (HH:MM), maxHoursPerDay }
 * returns: { totalProfit, efficiency, onTimeCount, lateCount, totalFuelCost, orders: [...] }
 */
async function runSimulation({ availableDrivers, startTime, maxHoursPerDay }) {
  // Load DB data
  const driversAll = await Driver.find().lean();
  const routes = await Route.find().lean();
  const ordersAll = await Order.find().lean();

  // Map route_id -> route
  const routesById = {};
  routes.forEach(r => routesById[r.route_id] = r);

  // Build driver states: use DB drivers first, else create virtual drivers
  const driverStates = [];
  for (let i = 0; i < availableDrivers; i++) {
    const dbDriver = driversAll[i];
    if (dbDriver) {
      driverStates.push({
        id: dbDriver._id.toString(),
        name: dbDriver.name,
        shift_hours: dbDriver.shift_hours || 0,
        past_week_hours: dbDriver.past_week_hours || [],
        usedMinutes: 0, // minutes assigned in simulation
        fatigueMultiplier: (dbDriver.shift_hours > 8) ? 1.3 : 1.0 // driver fatigue rule applied if current shift_hours > 8
      });
    } else {
      driverStates.push({
        id: `virtual-${i}`,
        name: `TempDriver-${i+1}`,
        shift_hours: 0,
        past_week_hours: [],
        usedMinutes: 0,
        fatigueMultiplier: 1.0
      });
    }
  }

  // Sort orders by their delivery_time (earliest promised first)
  const ordersSorted = ordersAll.slice().sort((a,b) => {
    const ma = hhmmToMinutes(a.delivery_time);
    const mb = hhmmToMinutes(b.delivery_time);
    return ma - mb;
  });

  const startMinutes = hhmmToMinutes(startTime); // minutes since midnight
  const results = [];
  let totalProfit = 0;
  let totalFuelCost = 0;
  let onTimeCount = 0;
  let lateCount = 0;

  // We'll use a simple allocation: assign to driver with least usedMinutes (least loaded)
  for (const ord of ordersSorted) {
    const route = routesById[ord.route_id];
    if (!route) {
      // skip if route missing
      continue;
    }

    // compute base travel minutes = route.base_time_min
    let travelMinutes = route.base_time_min;

    // Adjust travel time by traffic level: High +30%, Medium +15%, Low 0%
    if (route.traffic_level === 'High') travelMinutes = Math.round(travelMinutes * 1.3);
    else if (route.traffic_level === 'Medium') travelMinutes = Math.round(travelMinutes * 1.15);

    // Choose driver with least usedMinutes
    driverStates.sort((a,b) => a.usedMinutes - b.usedMinutes);
    const driver = driverStates[0];

    // Apply driver fatigue speed decrease: if fatigueMultiplier >1, travel time increases accordingly
    travelMinutes = Math.round(travelMinutes * driver.fatigueMultiplier);

    // Compute driver's scheduled delivery start (minutes since midnight)
    const driverStart = startMinutes + driver.usedMinutes; // minutes
    const deliveredAt = driverStart + travelMinutes; // minutes since midnight

    // Determine lateness:
    // Company rule: Late if delivery time > (base route time + 10 minutes).
    // Interpretation: Compare deliveredAt - driverStart (which is travelMinutes) against (route.base_time_min + 10).
    // If travelMinutes > route.base_time_min + 10 => late.
    const isLate = travelMinutes > (route.base_time_min + 10);

    // Penalty
    const penalty = isLate ? 50 : 0;
    if (isLate) lateCount++; else onTimeCount++;

    // High-value bonus
    const bonus = (!isLate && ord.value_rs > 1000) ? 0.10 * ord.value_rs : 0;

    // Fuel cost: base ₹5/km + ₹2/km if traffic High
    const perKm = 5 + (route.traffic_level === 'High' ? 2 : 0);
    const fuelCost = perKm * route.distance_km;

    // Profit per order
    const profitForOrder = ord.value_rs + bonus - penalty - fuelCost;

    totalProfit += profitForOrder;
    totalFuelCost += fuelCost;

    // Update driver used minutes
    driver.usedMinutes += travelMinutes;

    // Record
    results.push({
      order_id: ord.order_id,
      assigned_driver: driver.name,
      route_id: ord.route_id,
      travelMinutes,
      deliveredAtHHMM: `${String(Math.floor(deliveredAt/60)).padStart(2,'0')}:${String(deliveredAt%60).padStart(2,'0')}`,
      isLate,
      penalty,
      bonus: Math.round(bonus*100)/100,
      fuelCost: Math.round(fuelCost*100)/100,
      profitForOrder: Math.round(profitForOrder*100)/100
    });
  }

  const totalDeliveries = results.length;
  const efficiency = totalDeliveries === 0 ? 0 : (onTimeCount / totalDeliveries) * 100;

  return {
    totalProfit: Math.round(totalProfit*100)/100,
    efficiency: Math.round(efficiency*100)/100,
    onTimeCount,
    lateCount,
    totalFuelCost: Math.round(totalFuelCost*100)/100,
    orders: results
  };
}

module.exports = { runSimulation };
