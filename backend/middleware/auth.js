const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const h = req.header('Authorization');
  if (!h) return res.status(401).json({ error: 'No token provided' });
  const token = h.replace('Bearer ', '');
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};
