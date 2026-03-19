const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate } = req.body;

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({ message: 'Valid medicine name is required' });
    }
    if (!quantity || isNaN(quantity) || Number(quantity) <= 0) {
      return res.status(400).json({ message: 'Valid quantity greater than 0 is required' });
    }
    if (!expiryDate || isNaN(Date.parse(expiryDate))) {
      return res.status(400).json({ message: 'Valid expiry date is required' });
    }

    const medicine = new Medicine({
      user: req.user.id,
      name: name.trim(),
      quantity: Number(quantity),
      expiryDate: new Date(expiryDate)
    });

    await medicine.save();
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find({ user: req.user.id });
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
