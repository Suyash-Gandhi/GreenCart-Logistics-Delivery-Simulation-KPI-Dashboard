// routes.js
const express = require('express');
const router = express.Router();
const RouteModel = require('../models/Route');
const auth = require('../middleware/auth');

// Removed "auth" from GET so CSV-seeded data is visible immediately
router.get('/', async (req, res) => res.json(await RouteModel.find().lean()));

router.post('/', auth, async (req, res) => {
  const r = await RouteModel.create(req.body);
  res.status(201).json(r);
});

router.put('/:id', auth, async (req, res) => {
  const r = await RouteModel.findOneAndUpdate({ route_id: Number(req.params.id) }, req.body, { new: true });
  if (!r) return res.status(404).json({ error: 'not found' });
  res.json(r);
});

router.delete('/:id', auth, async (req, res) => {
  await RouteModel.findOneAndDelete({ route_id: Number(req.params.id) });
  res.json({ message: 'deleted' });
});

module.exports = router;
