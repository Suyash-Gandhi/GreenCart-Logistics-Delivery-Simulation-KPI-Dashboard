const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

async function loadCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

module.exports = async function runSimulationLogic() {
  // Load CSV data
  const drivers = await loadCSV(path.join(__dirname, '../data/drivers.csv'));
  const routes = await loadCSV(path.join(__dirname, '../data/routes.csv'));
  const orders = await loadCSV(path.join(__dirname, '../data/orders.csv'));

  // ---- Your real calculation logic goes here ----
  const totalProfit = Math.floor(Math.random() * 10000);
  const efficiency = (Math.random() * 100).toFixed(2);

  // Simulate on-time and late deliveries
  const onTimeCount = Math.floor(Math.random() * 100); // integer
  const lateCount = Math.floor(Math.random() * 50);    // integer

  const fuelCost = Math.floor(Math.random() * 5000);

  // Chart.js-friendly data
  const chartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Profit',
        data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 2000)),
        borderColor: 'blue',
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        fill: true
      }
    ]
  };

  return { totalProfit, efficiency, onTimeCount, lateCount, fuelCost, chartData };
};

