// orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const auth = require('../middleware/auth');

// Removed "auth" from GET so seeded data is visible without login
router.get('/', async (req, res) => res.json(await Order.find().lean()));

router.post('/', auth, async (req, res) => {
  const o = await Order.create(req.body);
  res.status(201).json(o);
});

router.put('/:id', auth, async (req, res) => {
  const o = await Order.findOneAndUpdate({ order_id: Number(req.params.id) }, req.body, { new: true });
  if (!o) return res.status(404).json({ error: 'not found' });
  res.json(o);
});

router.delete('/:id', auth, async (req, res) => {
  await Order.findOneAndDelete({ order_id: Number(req.params.id) });
  res.json({ message: 'deleted' });
});

module.exports = router;
