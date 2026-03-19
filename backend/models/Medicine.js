const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Medicine name is required'],
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
  },
  expiryDate: {
    type: Date,
    required: [true, 'Expiry date is required'],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'UserId is required'],
    index: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Medicine', medicineSchema);
