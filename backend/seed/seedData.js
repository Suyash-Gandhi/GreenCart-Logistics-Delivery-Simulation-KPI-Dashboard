// scripts/seed.js
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
require('dotenv').config();
const mongoose = require('mongoose');

const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

const MONGO_URI = process.env.MONGODB_URI;

function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', row => rows.push(row))
      .on('end', () => resolve(rows))
      .on('error', err => reject(err));
  });
}

async function runSeed() {
  if (!MONGO_URI) {
    console.error('MONGODB_URI not set in .env');
    process.exit(1);
  }

  await mongoose.connect(MONGO_URI);
  console.log('Connected to DB — syncing CSV data...');

  const dataDir = path.join(__dirname, '..', 'data');
  const driversCsv = path.join(dataDir, 'drivers.csv');
  const routesCsv = path.join(dataDir, 'routes.csv');
  const ordersCsv = path.join(dataDir, 'orders.csv');

  const [driversRows, routesRows, ordersRows] = await Promise.all([
    loadCSV(driversCsv),
    loadCSV(routesCsv),
    loadCSV(ordersCsv)
  ]);

  // transform drivers.csv
  const drivers = driversRows.map(r => ({
    name: r.name,
    shift_hours: Number(r.shift_hours),
    past_week_hours: (r.past_week_hours || '').split('|').map(s => Number(s))
  }));

  // transform routes.csv
  const routes = routesRows.map(r => ({
    route_id: Number(r.route_id),
    distance_km: Number(r.distance_km),
    traffic_level: r.traffic_level,
    base_time_min: Number(r.base_time_min)
  }));

  // transform orders.csv
  const orders = ordersRows.map(o => ({
    order_id: Number(o.order_id),
    value_rs: Number(o.value_rs),
    route_id: Number(o.route_id),
    delivery_time: o.delivery_time
  }));

  // Upsert drivers
  for (const d of drivers) {
    await Driver.updateOne({ name: d.name }, { $set: d }, { upsert: true });
  }
  console.log(`Drivers synced: ${drivers.length}`);

  // Upsert routes
  for (const r of routes) {
    await Route.updateOne({ route_id: r.route_id }, { $set: r }, { upsert: true });
  }
  console.log(`Routes synced: ${routes.length}`);

  // Upsert orders
  for (const o of orders) {
    await Order.updateOne({ order_id: o.order_id }, { $set: o }, { upsert: true });
  }
  console.log(`Orders synced: ${orders.length}`);

  console.log('Seed complete — data from CSV is now in sync.');
}

// Allow running directly from CLI
if (require.main === module) {
  runSeed()
    .then(() => {
      console.log('Seeding finished.');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seeding failed', err);
      process.exit(1);
    });
}

module.exports = runSeed;
