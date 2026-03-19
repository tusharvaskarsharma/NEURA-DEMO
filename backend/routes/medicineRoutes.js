const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { auth, checkRole } = require('../middleware/auth');

// GET /backend/medicine/all
// Return all available medicines
// Accessible only to NGO users
router.get('/all', auth, checkRole('NGO'), async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('userId', 'name email');
    res.json(medicines);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch medicines' });
  }
});

module.exports = router;
