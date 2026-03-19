const express = require('express');
const router = express.Router();
const { addMedicine, getUserMedicines } = require('../controllers/medicineController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Only Customer can add medicine
router.post('/add', protect, authorize('Customer'), addMedicine);

// Any authenticated user can get their medicines
router.get('/user', protect, getUserMedicines);

module.exports = router;
