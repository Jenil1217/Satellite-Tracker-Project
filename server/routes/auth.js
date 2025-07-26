const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authenticate = require('../middleware/auth');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

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

  const user = await User.findById(req.user._id);
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

// Route: GET /user/favorites
router.get("/favorites", authenticate, async (req, res) => {
  try {
    if (!req.user || !req.user.favorites || !Array.isArray(req.user.favorites)) {
      return res.status(200).json([]);
    }

    const ids = req.user.favorites;

    const satellites = await Satellite.find({ NORAD_CAT_ID: { $in: ids } });

    const favorites = ids.map(id => {
      const match = satellites.find(sat => sat.NORAD_CAT_ID === id);
      return {
        id,
        name: match ? match.OBJECT_NAME : "Unknown"
      };
    });

  res.json(favorites); // Return array directly
  } catch (err) {
    console.error("Error in /favorites:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
