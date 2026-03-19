const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { addMedicine, getUserMedicines, getAllMedicines } = require('../controllers/medicineController');

router.post('/add', authMiddleware, addMedicine);
router.get('/user', authMiddleware, getUserMedicines);
router.get('/all', authMiddleware, roleMiddleware(['NGO']), getAllMedicines);

module.exports = router;
