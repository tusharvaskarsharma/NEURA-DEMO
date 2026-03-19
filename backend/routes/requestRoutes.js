const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const { auth, checkRole } = require('../middleware/auth');

// POST /backend/request/create
// NGO selects a medicine and creates a request
router.post('/create', auth, checkRole('NGO'), async (req, res) => {
  try {
    const { medicineId } = req.body;
    const request = new Request({
      medicineId,
      ngoId: req.user._id, // Assumes JWT payload contains _id
      status: 'pending',
    });
    await request.save();
    res.status(201).json(request);
  } catch (err) {
    res.status(400).json({ error: 'Failed to create request' });
  }
});

// GET /backend/request/ngo
// Return all requests made by logged-in NGO
router.get('/ngo', auth, checkRole('NGO'), async (req, res) => {
  try {
    const requests = await Request.find({ ngoId: req.user._id })
      .populate('medicineId');
    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;
