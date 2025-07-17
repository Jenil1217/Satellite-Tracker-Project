const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// 🔐 Signup Route
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hash });
    await user.save();
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    res.status(400).json({ error: 'Signup failed', details: err.message });
  }
});

// 🔑 Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

router.post('/favorite/:noradId', authenticate, async (req, res) => {
  const favId = parseInt(req.params.noradId);

  if (isNaN(favId)) {
    return res.status(400).json({ error: 'Invalid NORAD ID' });
  }

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  if (user.favorites.includes(favId)) {
    user.favorites = user.favorites.filter(id => id !== favId);
  } else {
    user.favorites.push(favId);
  }

  await user.save();
  res.json({ favorites: user.favorites });
});


// ✅ Get user’s favorites
const Satellite = require('../models/Satellite');

router.get('/favorites', authenticate, async (req, res) => {
  try {
    const ids = req.user.favorites; // [23561, 21819, 19650]
    
    // Fetch matching satellites from MongoDB
    const sats = await Satellite.find({ NORAD_CAT_ID: { $in: ids } });

    // Map to clean shape for frontend
    const response = ids.map(id => {
      const sat = sats.find(s => s.NORAD_CAT_ID === id);
      return sat ? { id, name: sat.OBJECT_NAME } : { id, name: 'Unknown' };
    });

    res.json(response);
  } catch (err) {
    console.error('Failed to fetch favorites:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
