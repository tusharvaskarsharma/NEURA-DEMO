const Medicine = require('../models/Medicine');

exports.addMedicine = async (req, res) => {
  try {
    const { name, quantity, expiryDate } = req.body;
    
    // Validation
    if (!name || quantity === undefined || !expiryDate) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Create the medicine with logged-in user's ID
    const medicine = new Medicine({
      name,
      quantity,
      expiryDate,
      userId: req.user.id
    });

    await medicine.save();
    
    res.status(201).json({ message: 'Medicine added successfully', medicine });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getUserMedicines = async (req, res) => {
  try {
    // Fetch all medicines associated with the logged-in user
    const medicines = await Medicine.find({ userId: req.user.id });
    
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('userId', 'name email');
    res.status(200).json(medicines);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
