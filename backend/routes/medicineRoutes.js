const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/add', authMiddleware, medicineController.addMedicine);
router.get('/user', authMiddleware, medicineController.getUserMedicines);

module.exports = router;
