const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: [true, 'Medicine ID is required'],
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'NGO ID is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'completed'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Request', requestSchema);
