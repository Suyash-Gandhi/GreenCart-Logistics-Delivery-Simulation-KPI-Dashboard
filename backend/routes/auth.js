const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

// NOTE: For speed we store managers in-memory here.
// For production replace with a Mongoose User model.
let managers = [];

// register (for assessment usage)
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ error: 'username & password required' });
  if (managers.find(m => m.username === username)) return res.status(409).json({ error: 'user exists' });
  const hash = await bcrypt.hash(password, 10);
  const user = { id: Date.now(), username, passwordHash: hash };
  managers.push(user);
  return res.json({ message: 'registered' });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = managers.find(m => m.username === username);
  if (!user) return res.status(401).json({ error: 'invalid credentials' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ error: 'invalid credentials' });
  const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '8h' });
  res.json({ token });
});

module.exports = router;
