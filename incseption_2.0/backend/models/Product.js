const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  blockchainId: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  },
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentOwner: {
    type: String,
    required: true
  },
  state: {
    type: String,
    enum: ['Created', 'WithDistributor', 'WithRetailer', 'Sold'],
    default: 'Created'
  },
  imageUrl: String,
  category: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
