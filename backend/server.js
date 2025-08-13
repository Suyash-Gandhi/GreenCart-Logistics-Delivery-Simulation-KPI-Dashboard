require('dotenv').config();
const runSeed = require('./seed/seedData');
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const driversRoutes = require('./routes/drivers');
const routesRoutes = require('./routes/routes');
const ordersRoutes = require('./routes/orders');
const simulateRoute = require('./routes/simulate');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();
runSeed();
app.use('/api/auth', authRoutes);
app.use('/api/drivers', driversRoutes);
app.use('/api/routes', routesRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/simulate', simulateRoute);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend listening on ${PORT}`));
