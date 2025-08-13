const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => res.json(await Driver.find().lean()));

router.post('/', auth, async (req, res) => {
  const d = await Driver.create(req.body);
  res.status(201).json(d);
});

router.put('/:id', auth, async (req, res) => {
  const d = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!d) return res.status(404).json({ error: 'not found' });
  res.json(d);
});

router.delete('/:id', auth, async (req, res) => {
  await Driver.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;
